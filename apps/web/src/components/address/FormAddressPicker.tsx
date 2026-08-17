'use client';

import { MapPin, Locate } from 'lucide-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import type { FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import type { FormInputProps } from '@/components/ui/form/FormInput';
import { FormInput } from '@/components/ui/form/FormInput';

const LeafletMapLocationModal = dynamic(
  () => import('@/components/address/LeafletMapLocationModal').then((mod) => mod.LeafletMapLocationModal),
  { ssr: false },
);

export type FormAddressPickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  showIcon?: boolean;
  enableMapPicker?: boolean;
} & Omit<FormInputProps<TFieldValues, TName>, 'prefixIcon'>;

async function fetchReverseGeocodeAddress(lat: number, lon: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=vi`,
    );
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data?.display_name || null;
  } catch {
    return null;
  }
}

export function FormAddressPicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  showIcon = true,
  enableMapPicker = true,
  placeholder,
  clearButton = true,
  ...props
}: FormAddressPickerProps<TFieldValues, TName>) {
  const t = useTranslations('addAddressModal');
  const tMap = useTranslations('mapPicker');
  const formContext = useFormContext<TFieldValues>();
  const [isMapOpen, setIsMapOpen] = useState(false);

  const resolvedPlaceholder = placeholder || t('shippingAddressPlaceholder');

  const handleSelectLocation = (address: string) => {
    if (formContext) {
      formContext.setValue(name, address as unknown as PathValue<TFieldValues, TName>, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const handleQuickGps = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!navigator.geolocation) {
      toast.error(tMap('gpsNotSupported'));
      return;
    }

    toast.info(tMap('locating'));
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const address = await fetchReverseGeocodeAddress(pos.coords.latitude, pos.coords.longitude);
        if (address && formContext) {
          formContext.setValue(name, address as unknown as PathValue<TFieldValues, TName>, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
          toast.success(t('savedSuccess'));
        } else if (!address) {
          toast.error(tMap('addressNotFound'));
        }
      },
      () => {
        toast.error(tMap('gpsPermissionDenied'));
      },
    );
  };

  const currentAddressValue = (formContext?.watch(name) as unknown as string) || '';

  const actionButtons = enableMapPicker ? (
    <div className="ml-1 flex shrink-0 items-center gap-1.5">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleQuickGps}
        title="GPS"
        className="flex h-7 cursor-pointer items-center gap-1 rounded-lg border border-emerald-200/80 bg-emerald-50 px-2 text-[11px] font-extrabold text-emerald-800 shadow-2xs hover:bg-emerald-100 dark:border-emerald-800/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
      >
        <Locate className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
        <span className="hidden sm:inline">GPS</span>
      </Button>

      <Button
        type="button"
        size="sm"
        onClick={() => {
          setIsMapOpen(true);
        }}
        title="Map"
        className="flex h-7 cursor-pointer items-center gap-1 rounded-lg bg-emerald-700 px-2.5 text-[11px] font-extrabold text-white shadow-2xs hover:bg-emerald-800"
      >
        <MapPin className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Map</span>
      </Button>
    </div>
  ) : undefined;

  return (
    <>
      <FormInput
        control={control}
        name={name}
        type="text"
        placeholder={resolvedPlaceholder}
        clearButton={clearButton}
        prefixIcon={showIcon ? <MapPin className="h-4 w-4 text-emerald-700" /> : undefined}
        suffixIcon={actionButtons}
        style={{ paddingRight: enableMapPicker ? '175px' : '40px' }}
        {...props}
      />

      {enableMapPicker && (
        <LeafletMapLocationModal
          isOpen={isMapOpen}
          onClose={() => {
            setIsMapOpen(false);
          }}
          initialAddress={currentAddressValue}
          onSelectLocation={handleSelectLocation}
        />
      )}
    </>
  );
}
