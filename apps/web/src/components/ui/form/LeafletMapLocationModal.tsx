'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Locate, Search, Loader2, Check, X, Navigation } from 'lucide-react';
import { toast } from 'sonner';

// Dynamically import Leaflet components to avoid Next.js SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

interface LeafletMapLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (address: string, lat?: number, lng?: number) => void;
  initialAddress?: string;
}

const DEFAULT_CENTER = { lat: 10.776889, lng: 106.700806 }; // TP. Hồ Chí Minh

export function LeafletMapLocationModal({
  isOpen,
  onClose,
  onSelectLocation,
  initialAddress = '',
}: LeafletMapLocationModalProps) {
  const [position, setPosition] = useState(DEFAULT_CENTER);
  const [address, setAddress] = useState(initialAddress);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [customIcon, setCustomIcon] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Initialize Leaflet custom DivIcon with Emerald pin & pulsing animation
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      import('leaflet/dist/leaflet.css');

      const icon = L.divIcon({
        className: 'custom-leaflet-pin-emerald',
        html: `<div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
                 <div style="position: absolute; width: 36px; height: 36px; background-color: rgba(5, 150, 105, 0.3); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                 <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); width: 32px; height: 32px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 8px 16px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 10;">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                     <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                     <circle cx="12" cy="10" r="3"/>
                   </svg>
                 </div>
               </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });
      setCustomIcon(icon);
    }
  }, []);

  // Reverse Geocoding via free OpenStreetMap Nominatim API
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      const resOsm = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi`
      );
      const dataOsm = await resOsm.json();
      if (dataOsm?.display_name) {
        setAddress(dataOsm.display_name);
      }
    } catch (e) {
      console.error('Reverse geocoding error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle position change from map drag
  const handlePositionChange = (lat: number, lng: number) => {
    const newPos = { lat, lng };
    setPosition(newPos);
    reverseGeocode(lat, lng);
  };

  // Handle GPS location request
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Trình duyệt của bạn không hỗ trợ định vị GPS.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPosition(newPos);
        reverseGeocode(newPos.lat, newPos.lng);
        setIsLocating(false);
        toast.success('Đã xác định vị trí của bạn!');
      },
      () => {
        setIsLocating(false);
        toast.error('Không thể lấy vị trí hiện tại. Vui lòng bật quyền GPS.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Address search helper via OpenStreetMap Search API
  const handleSearchAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const resOsm = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&accept-language=vi&limit=1`
      );
      const dataOsm = await resOsm.json();
      if (dataOsm && dataOsm[0]) {
        const newPos = { lat: parseFloat(dataOsm[0].lat), lng: parseFloat(dataOsm[0].lon) };
        setPosition(newPos);
        setAddress(dataOsm[0].display_name);
      } else {
        toast.error('Không tìm thấy địa chỉ phù hợp.');
      }
    } catch (err) {
      toast.error('Lỗi khi tìm kiếm địa chỉ.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!address) {
      toast.error('Vui lòng chọn địa chỉ hợp lệ.');
      return;
    }
    onSelectLocation(address, position.lat, position.lng);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all">
        {/* Sleek Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span>Chọn địa chỉ trên Bản đồ</span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                  OpenStreetMap Miễn phí
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Nhấp vào bản đồ hoặc kéo thả ghim để chọn chính xác địa chỉ nhận hàng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Container Body with Floating Search Bar Overlay */}
        <div className="relative flex-1 min-h-[420px] bg-slate-100 dark:bg-slate-950">
          {/* Floating Search & GPS Controls Card */}
          <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap sm:flex-nowrap gap-2 pointer-events-auto">
            <form
              onSubmit={handleSearchAddress}
              className="flex-1 flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 pl-3 rounded-xl border border-gray-200/80 dark:border-gray-800/80 shadow-lg"
            >
              <Search className="w-4 h-4 text-emerald-600 shrink-0" />
              <input
                type="text"
                placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold bg-transparent focus:outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 shrink-0 shadow-2xs cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Tìm địa chỉ'}
              </button>
            </form>

            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-xl text-xs font-bold transition-all border border-gray-200/80 dark:border-gray-800/80 shadow-lg shrink-0 cursor-pointer"
            >
              {isLocating ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              ) : (
                <Locate className="w-4 h-4 text-emerald-600" />
              )}
              <span>Định vị GPS</span>
            </button>
          </div>

          {/* Leaflet React Map Canvas */}
          {isMounted && customIcon ? (
            <MapContainer
              center={[position.lat, position.lng]}
              zoom={16}
              scrollWheelZoom={true}
              className="w-full h-full min-h-[420px] z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[position.lat, position.lng]}
                icon={customIcon}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const marker = e.target;
                    const pos = marker.getLatLng();
                    handlePositionChange(pos.lat, pos.lng);
                  },
                }}
              />
            </MapContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
              <span className="text-xs font-semibold">Đang tải bản đồ OpenStreetMap...</span>
            </div>
          )}
        </div>

        {/* Selected Address Display & Bottom Actions */}
        <div className="p-5 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4">
          <div className="flex items-start gap-3 text-sm text-gray-800 dark:text-gray-200 bg-emerald-50/60 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200/70 dark:border-emerald-800/70">
            <div className="p-1.5 bg-emerald-600 text-white rounded-lg shrink-0 mt-0.5 shadow-2xs">
              <Navigation className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-extrabold text-[11px] text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block mb-0.5">
                Vị trí được ghim trên bản đồ:
              </span>
              <p className="text-xs font-bold leading-relaxed text-gray-900 dark:text-gray-100 line-clamp-2">
                {isLoading ? (
                  <span className="inline-flex items-center gap-1.5 text-gray-400 font-normal">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang cập nhật địa chỉ...
                  </span>
                ) : (
                  address || 'Vui lòng chọn vị trí trên bản đồ...'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Xác nhận địa chỉ này</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
