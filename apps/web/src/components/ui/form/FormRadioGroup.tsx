'use client';

import * as React from 'react';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';
import { FormItem, FormLabel, FormDescription, FormMessage } from './Form';

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface FormRadioGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues, any>;
  name: TName;
  options: RadioOption[];
  label?: string;
  description?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  direction?: 'horizontal' | 'vertical';
  fullWidth?: boolean;
  className?: string;
}

export function FormRadioGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  options,
  label,
  description,
  helperText,
  required,
  disabled,
  direction = 'horizontal',
  fullWidth = true,
  className,
}: FormRadioGroupProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const currentValue = field.value;
  const hasError = !!error;

  return (
    <FormItem fullWidth={fullWidth} className={className}>
      {label && <FormLabel required={required}>{label}</FormLabel>}

      <div
        className={`flex ${
          direction === 'vertical' ? 'flex-col gap-3' : 'flex-row flex-wrap gap-4'
        } pt-1`}
      >
        {options.map((option) => {
          const isSelected = currentValue === option.value;
          const isDisabled = disabled || option.disabled;

          return (
            <label
              key={option.value}
              className={`inline-flex items-center gap-2 cursor-pointer select-none text-xs font-semibold ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => field.onChange(option.value)}
                className={`w-4 h-4 text-emerald-800 focus:ring-emerald-700/20 cursor-pointer ${
                  hasError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <span className="text-gray-800 dark:text-gray-200">{option.label}</span>
              {option.description && (
                <span className="text-[11px] text-gray-400 font-normal">
                  ({option.description})
                </span>
              )}
            </label>
          );
        })}
      </div>

      {(description || helperText) && (
        <FormDescription>{description || helperText}</FormDescription>
      )}

      <FormMessage error={error} />
    </FormItem>
  );
}
