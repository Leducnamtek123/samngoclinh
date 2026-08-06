'use client';

import { FieldPath, FieldValues } from 'react-hook-form';
import { MapPin } from 'lucide-react';
import { FormInput, FormInputProps } from './FormInput';

export interface FormAddressPickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<FormInputProps<TFieldValues, TName>, 'prefixIcon'> {
  showIcon?: boolean;
}

export function FormAddressPicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  showIcon = true,
  placeholder = '',
  clearButton = true,
  ...props
}: FormAddressPickerProps<TFieldValues, TName>) {
  return (
    <FormInput
      control={control}
      name={name}
      type="text"
      placeholder={placeholder}
      clearButton={clearButton}
      prefixIcon={showIcon ? <MapPin className="w-4 h-4 text-emerald-700" /> : undefined}
      {...props}
    />
  );
}
