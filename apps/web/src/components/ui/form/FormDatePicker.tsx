'use client';

import { FieldPath, FieldValues } from 'react-hook-form';
import { Calendar } from 'lucide-react';
import { FormInput, FormInputProps } from './FormInput';

export interface FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<FormInputProps<TFieldValues, TName>, 'type' | 'prefixIcon'> {
  showIcon?: boolean;
}

export function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  showIcon = true,
  placeholder,
  ...props
}: FormDatePickerProps<TFieldValues, TName>) {
  return (
    <FormInput
      control={control}
      name={name}
      type="date"
      placeholder={placeholder}
      prefixIcon={showIcon ? <Calendar className="w-4 h-4 text-emerald-700" /> : undefined}
      {...props}
    />
  );
}
