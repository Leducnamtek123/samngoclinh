'use client';

import React, { useState } from 'react';
import { FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import { MapPin, Locate } from 'lucide-react';
import { FormInput, FormInputProps } from './FormInput';
import { LeafletMapLocationModal } from './LeafletMapLocationModal';
import { toast } from 'sonner';

export interface FormAddressPickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<FormInputProps<TFieldValues, TName>, 'prefixIcon'> {
  showIcon?: boolean;
  enableMapPicker?: boolean;
}

export function FormAddressPicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  showIcon = true,
  enableMapPicker = true,
  placeholder = 'Nhập hoặc chọn địa chỉ nhận hàng...',
  clearButton = true,
  ...props
}: FormAddressPickerProps<TFieldValues, TName>) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const formContext = useFormContext();

  const handleSelectLocation = (address: string) => {
    if (formContext) {
      formContext.setValue(name as any, address, {
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
      toast.error('Trình duyệt không hỗ trợ định vị GPS.');
      return;
    }

    toast.info('Đang xác định vị trí của bạn...');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&accept-language=vi`
          );
          const data = await res.json();
          if (data?.display_name && formContext) {
            formContext.setValue(name as any, data.display_name, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
            toast.success('Đã tự động cập nhật vị trí hiện tại!');
          }
        } catch (err) {
          toast.error('Không thể tự động giải mã tên địa chỉ.');
        }
      },
      () => {
        toast.error('Vui lòng bật quyền truy cập GPS trên thiết bị.');
      }
    );
  };

  const currentAddressValue = formContext?.watch(name as any) || '';

  const actionButtons = enableMapPicker ? (
    <div className="flex items-center gap-1.5 shrink-0 ml-1">
      <button
        type="button"
        onClick={handleQuickGps}
        title="Tự động định vị GPS"
        className="h-7 px-2 text-[11px] font-extrabold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-300 rounded-lg transition-all duration-200 flex items-center gap-1 border border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Locate className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
        <span className="hidden sm:inline">GPS</span>
      </button>

      <button
        type="button"
        onClick={() => setIsMapOpen(true)}
        title="Chọn vị trí trên bản đồ OpenStreetMap"
        className="h-7 px-2.5 text-[11px] font-extrabold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-all duration-200 flex items-center gap-1 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
      >
        <MapPin className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Bản đồ</span>
      </button>
    </div>
  ) : undefined;

  return (
    <>
      <FormInput
        control={control}
        name={name}
        type="text"
        placeholder={placeholder}
        clearButton={clearButton}
        prefixIcon={showIcon ? <MapPin className="w-4 h-4 text-emerald-700" /> : undefined}
        suffixIcon={actionButtons}
        style={{ paddingRight: enableMapPicker ? '175px' : '40px' }}
        {...props}
      />

      {enableMapPicker && (
        <LeafletMapLocationModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          initialAddress={currentAddressValue}
          onSelectLocation={handleSelectLocation}
        />
      )}
    </>
  );
}
