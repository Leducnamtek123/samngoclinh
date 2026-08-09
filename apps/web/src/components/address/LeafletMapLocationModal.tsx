'use client';


import dynamic from 'next/dynamic';
import { MapPin, Locate, Search, Check, X, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/common/LoadingState';
import { useMapLocationPicker } from './useMapLocationPicker';

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

export function LeafletMapLocationModal({
  isOpen,
  onClose,
  onSelectLocation,
  initialAddress = '',
}: LeafletMapLocationModalProps) {
  const mapPicker = useMapLocationPicker({
    initialAddress,
    onSelectLocation,
    onClose,
  });

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
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Map Container Body with Floating Search Bar Overlay */}
        <div className="relative flex-1 min-h-[420px] bg-slate-100 dark:bg-slate-950">
          {/* Floating Search & GPS Controls Card */}
          <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap sm:flex-nowrap gap-2 pointer-events-auto">
            <form
              onSubmit={mapPicker.handleSearchAddress}
              className="flex-1 flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 pl-3 rounded-xl border border-gray-200/80 dark:border-gray-800/80 shadow-lg"
            >
              <Search className="w-4 h-4 text-emerald-600 shrink-0" />
              <input
                type="text"
                placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện..."
                value={mapPicker.searchQuery}
                onChange={(e) => mapPicker.setSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold bg-transparent focus:outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
              />
              <Button
                type="submit"
                disabled={mapPicker.isLoading}
                isLoading={mapPicker.isLoading}
                size="sm"
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shrink-0 h-auto py-1.5 px-3.5"
              >
                Tìm địa chỉ
              </Button>
            </form>

            <Button
              type="button"
              variant="outline"
              onClick={mapPicker.handleGetCurrentLocation}
              disabled={mapPicker.isLocating}
              isLoading={mapPicker.isLocating}
              className="flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-xs font-bold border border-gray-200/80 dark:border-gray-800/80 shadow-lg shrink-0 h-auto py-2 px-4"
            >
              {!mapPicker.isLocating && <Locate className="w-4 h-4 text-emerald-600" />}
              <span>Định vị GPS</span>
            </Button>
          </div>

          {/* Leaflet React Map Canvas */}
          {mapPicker.isMounted && mapPicker.customIcon ? (
            <MapContainer
              center={[mapPicker.position.lat, mapPicker.position.lng]}
              zoom={16}
              scrollWheelZoom={true}
              className="w-full h-full min-h-[420px] z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[mapPicker.position.lat, mapPicker.position.lng]}
                icon={mapPicker.customIcon}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const marker = e.target;
                    const pos = marker.getLatLng();
                    mapPicker.handlePositionChange(pos.lat, pos.lng);
                  },
                }}
              />
            </MapContainer>
          ) : (
            <div className="w-full h-full min-h-[420px] flex items-center justify-center">
              <LoadingState message="Đang tải bản đồ OpenStreetMap..." />
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
                {mapPicker.isLoading ? (
                  <span className="inline-flex items-center gap-1.5 text-gray-400 font-normal">
                    <LoadingState message="Đang cập nhật địa chỉ..." />
                  </span>
                ) : (
                  mapPicker.address || 'Vui lòng chọn vị trí trên bản đồ...'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold rounded-xl h-auto"
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={mapPicker.handleConfirm}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md h-auto"
            >
              <Check className="w-4 h-4" />
              <span>Xác nhận địa chỉ này</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
