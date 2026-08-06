'use client';

import * as React from 'react';
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { FormItem, FormDescription, FormMessage } from './Form';
import { FloatingInput } from '../floating-input';
import { Input, type InputProps } from '../input';

export interface FormFloatingInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<InputProps, 'name' | 'control'> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export function FormFloatingInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  type = 'text',
  required,
  disabled,
  description,
  prefixIcon,
  suffixIcon,
  className,
  ...props
}: FormFloatingInputProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <FormItem className="space-y-1">
      <FloatingInput
        label={label}
        required={required}
        error={!!error}
        prefixIcon={prefixIcon}
        suffixIcon={suffixIcon}
        className={className}
      >
        <Input
          {...field}
          {...props}
          id={name}
          type={type}
          disabled={disabled}
          value={field.value ?? ''}
        />
      </FloatingInput>
      {description && !error && <FormDescription>{description}</FormDescription>}
      <FormMessage error={error} />
    </FormItem>
  );
}
