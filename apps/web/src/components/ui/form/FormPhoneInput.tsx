'use client';

import { Phone } from 'lucide-react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import type { FormInputProps } from './FormInput';
import { FormInput } from './FormInput';

export type FormPhoneInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  showIcon?: boolean;
} & Omit<FormInputProps<TFieldValues, TName>, 'type' | 'prefixIcon'>;

export function FormPhoneInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  showIcon = true,
  placeholder = '',
  ...props
}: FormPhoneInputProps<TFieldValues, TName>) {
  return (
    <FormInput
      control={control}
      name={name}
      type="tel"
      placeholder={placeholder}
      prefixIcon={showIcon ? <Phone className="h-4 w-4" /> : undefined}
      {...props}
    />
  );
}
