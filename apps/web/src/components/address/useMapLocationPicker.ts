import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { toast } from 'sonner';

const DEFAULT_CENTER = { lat: 10.776889, lng: 106.700806 }; // TP. Hồ Chí Minh
const emptySubscribe = () => () => {};

type UseMapLocationPickerProps = {
  initialAddress?: string;
  onSelectLocation: (address: string, lat?: number, lng?: number) => void;
  onClose: () => void;
};

export function useMapLocationPicker({
  initialAddress = '',
  onSelectLocation,
  onClose,
}: UseMapLocationPickerProps) {
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [position, setPosition] = useState(DEFAULT_CENTER);
  const [address, setAddress] = useState(initialAddress);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [customIcon, setCustomIcon] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet');

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
      // react-doctor-disable-next-line react-hooks-js/set-state-in-effect
      setCustomIcon(icon);
    }
  }, []);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      const resOsm = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi`
      );
      if (resOsm.ok) {
        const dataOsm = await resOsm.json();
        if (dataOsm?.display_name) {
          setAddress(dataOsm.display_name);
        }
      }
    } catch (e) {
      console.error('Reverse geocoding error:', e);
    }
    setIsLoading(false);
  }, []);

  const handlePositionChange = (lat: number, lng: number) => {
    const newPos = { lat, lng };
    setPosition(newPos);
    reverseGeocode(lat, lng);
  };

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

  const handleSearchAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const resOsm = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&accept-language=vi&limit=1`
      );
      if (!resOsm.ok) {
        toast.error('Không tìm thấy địa chỉ phù hợp.');
      } else {
        const dataOsm = await resOsm.json();
        if (dataOsm && dataOsm[0]) {
          const newPos = { lat: parseFloat(dataOsm[0].lat), lng: parseFloat(dataOsm[0].lon) };
          setPosition(newPos);
          setAddress(dataOsm[0].display_name);
        } else {
          toast.error('Không tìm thấy địa chỉ phù hợp.');
        }
      }
    } catch {
      toast.error('Lỗi khi tìm kiếm địa chỉ.');
    }
    setIsLoading(false);
  };

  const handleConfirm = () => {
    if (!address) {
      toast.error('Vui lòng chọn địa chỉ hợp lệ.');
      return;
    }
    onSelectLocation(address, position.lat, position.lng);
    onClose();
  };

  return {
    position,
    address,
    searchQuery,
    setSearchQuery,
    isLoading,
    isLocating,
    customIcon,
    isMounted,
    handlePositionChange,
    handleGetCurrentLocation,
    handleSearchAddress,
    handleConfirm,
  };
}
