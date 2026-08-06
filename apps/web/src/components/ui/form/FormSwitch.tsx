'use client';

import * as React from 'react';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';
import { FormItem, FormDescription, FormMessage } from './Form';

export interface FormSwitchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues, any>;
  name: TName;
  label?: React.ReactNode;
  description?: string;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function FormSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  helperText,
  disabled,
  fullWidth = true,
  className,
}: FormSwitchProps<TFieldValues, TName>) {
  const { field } = useController({
    name,
    control,
  });

  const isChecked = !!field.value;

  const handleToggle = () => {
    if (!disabled) {
      field.onChange(!isChecked);
    }
  };

  return (
    <FormItem fullWidth={fullWidth} className={className}>
      <div className="flex items-center justify-between gap-3">
        {label && (
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
            {label}
          </span>
        )}

        <button
          type="button"
          role="switch"
          aria-checked={isChecked}
          disabled={disabled}
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-700/20 disabled:cursor-not-allowed disabled:opacity-50 ${
            isChecked ? 'bg-emerald-700' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              isChecked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {(description || helperText) && (
        <FormDescription>{description || helperText}</FormDescription>
      )}

      <FormMessage />
    </FormItem>
  );
}
