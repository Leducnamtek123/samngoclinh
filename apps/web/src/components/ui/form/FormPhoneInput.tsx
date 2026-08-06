'use client';

import { FieldPath, FieldValues } from 'react-hook-form';
import { Phone } from 'lucide-react';
import { FormInput, FormInputProps } from './FormInput';

export interface FormPhoneInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<FormInputProps<TFieldValues, TName>, 'type' | 'prefixIcon'> {
  showIcon?: boolean;
}

export function FormPhoneInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
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
      prefixIcon={showIcon ? <Phone className="w-4 h-4" /> : undefined}
      {...props}
    />
  );
}
