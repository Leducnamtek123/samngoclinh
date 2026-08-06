'use client';

import * as React from 'react';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';
import { FormItem, FormDescription, FormMessage } from './Form';
import { Checkbox } from '../checkbox';

export interface FormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues, any>;
  name: TName;
  label?: React.ReactNode;
  description?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function FormCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  helperText,
  required,
  disabled,
  className,
  children,
}: FormCheckboxProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const isChecked = Boolean(field.value);

  return (
    <FormItem name={name} error={error} className={className}>
      <div className="flex items-start gap-3">
        <Checkbox
          name={field.name}
          checked={isChecked}
          disabled={disabled}
          onCheckedChange={(checked) => field.onChange(checked)}
        />

        <div className="space-y-1 leading-none">
          {(label || children) && (
            <label
              onClick={() => !disabled && field.onChange(!isChecked)}
              className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer select-none"
            >
              {label || children}
              {required && <span className="text-red-500 ml-1 font-extrabold">*</span>}
            </label>
          )}

          {(description || helperText) && (
            <FormDescription>{description || helperText}</FormDescription>
          )}
        </div>
      </div>

      <FormMessage error={error} />
    </FormItem>
  );
}
