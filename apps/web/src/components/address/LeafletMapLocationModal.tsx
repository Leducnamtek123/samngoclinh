'use client';

import { MapPin, Locate, Search, Check, X, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { LoadingState } from '@/components/common/LoadingState';
import { Button } from '@/components/ui/button';
import { useMapLocationPicker } from './useMapLocationPicker';

const MapContainer = dynamic(
  async () => await import('react-leaflet').then((mod) => mod.MapContainer),
  {
    ssr: false,
  },
);
const TileLayer = dynamic(async () => await import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false,
});
const Marker = dynamic(async () => await import('react-leaflet').then((mod) => mod.Marker), {
  ssr: false,
});

type LeafletMapLocationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (address: string, lat?: number, lng?: number) => void;
  initialAddress?: string;
};

export function LeafletMapLocationModal({
  isOpen,
  onClose,
  onSelectLocation,
  initialAddress = '',
}: LeafletMapLocationModalProps) {
  const t = useTranslations('addAddressModal');
  const tActions = useTranslations('actions');

  const mapPicker = useMapLocationPicker({
    initialAddress,
    onSelectLocation,
    onClose,
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div className="animate-in fade-in fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-md transition-opacity duration-200">
      <div className="flex max-h-[92vh] w-full max-w-4xl shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card bg-white text-card-foreground shadow-xl dark:bg-slate-900">
        {/* Sleek Header */}
        <div className="flex items-center justify-between border-b border-border bg-card bg-white px-6 py-4 dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl border border-emerald-200/60 bg-emerald-50 p-2 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-gray-100">
                <span>{t('shippingAddressLabel')}</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-emerald-800 uppercase dark:bg-emerald-900/50 dark:text-emerald-300">
                  OpenStreetMap
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('shippingAddressPlaceholder')}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-slate-800 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Map Container Body with Floating Search Bar Overlay */}
        <div className="relative min-h-[420px] flex-1 bg-slate-100 dark:bg-slate-950">
          {/* Floating Search & GPS Controls Card */}
          <div className="pointer-events-auto absolute top-4 right-4 left-4 z-20 flex flex-wrap gap-2 sm:flex-nowrap">
            <form
              onSubmit={mapPicker.handleSearchAddress}
              className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200/80 bg-white/95 p-1.5 pl-3 shadow-lg backdrop-blur-md dark:border-gray-800/80 dark:bg-slate-900/95"
            >
              <label htmlFor="map-address-search-input" className="sr-only">
                {t('shippingAddressPlaceholder')}
              </label>
              <Search className="h-4 w-4 shrink-0 text-emerald-600" />
              <input
                id="map-address-search-input"
                type="text"
                aria-label={t('shippingAddressPlaceholder')}
                placeholder={t('shippingAddressPlaceholder')}
                value={mapPicker.searchQuery}
                onChange={(e) => {
                  mapPicker.setSearchQuery(e.target.value);
                }}
                className="w-full bg-transparent text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100"
              />
              <Button
                type="submit"
                disabled={mapPicker.isLoading}
                isLoading={mapPicker.isLoading}
                size="sm"
                className="h-auto shrink-0 bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-800"
              >
                Search
              </Button>
            </form>

            <Button
              type="button"
              variant="outline"
              onClick={mapPicker.handleGetCurrentLocation}
              disabled={mapPicker.isLocating}
              isLoading={mapPicker.isLocating}
              className="flex h-auto shrink-0 items-center gap-1.5 border border-gray-200/80 bg-white/95 px-4 py-2 text-xs font-bold text-emerald-700 shadow-lg backdrop-blur-md hover:bg-emerald-50 dark:border-gray-800/80 dark:bg-slate-900/95 dark:text-emerald-400 dark:hover:bg-emerald-950/60"
            >
              {!mapPicker.isLocating && <Locate className="h-4 w-4 text-emerald-600" />}
              <span>GPS</span>
            </Button>
          </div>

          {/* Leaflet React Map Canvas */}
          {mapPicker.isMounted && mapPicker.customIcon ? (
            <MapContainer
              center={[mapPicker.position.lat, mapPicker.position.lng]}
              zoom={16}
              scrollWheelZoom={true}
              className="z-0 h-full min-h-[420px] w-full"
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
            <div className="flex h-full min-h-[420px] w-full items-center justify-center">
              <LoadingState message="Loading OpenStreetMap..." />
            </div>
          )}
        </div>

        {/* Selected Address Display & Bottom Actions */}
        <div className="flex flex-col gap-4 border-t border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-slate-900">
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200/70 bg-emerald-50/60 p-3.5 text-sm text-gray-800 dark:border-emerald-800/70 dark:bg-emerald-950/30 dark:text-gray-200">
            <div className="mt-0.5 shrink-0 rounded-lg bg-emerald-600 p-1.5 text-white shadow-2xs">
              <Navigation className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="mb-0.5 block text-[11px] font-extrabold tracking-wider text-emerald-800 uppercase dark:text-emerald-400">
                {t('shippingAddressLabel')}:
              </span>
              <p className="line-clamp-2 text-xs leading-relaxed font-bold text-gray-900 dark:text-gray-100">
                {mapPicker.isLoading ? (
                  <span className="inline-flex items-center gap-1.5 font-normal text-gray-400">
                    <LoadingState message="Loading..." />
                  </span>
                ) : (
                  mapPicker.address || '—'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-auto rounded-xl px-5 py-2.5 text-xs font-bold"
            >
              {tActions('cancel')}
            </Button>
            <Button
              type="button"
              onClick={mapPicker.handleConfirm}
              className="flex h-auto items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-800"
            >
              <Check className="h-4 w-4" />
              <span>{tActions('save')}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
