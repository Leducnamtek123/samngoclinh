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
  const checkboxId = `form-checkbox-${name}`;

  return (
    <FormItem name={name} error={error} className={className}>
      <div className="flex items-center gap-3 py-1">
        <Checkbox
          id={checkboxId}
          name={field.name}
          checked={isChecked}
          disabled={disabled}
          onCheckedChange={(checked) => field.onChange(checked)}
          className="shrink-0"
        />

        <div className="space-y-0.5">
          {(label || children) && (
            <label
              htmlFor={checkboxId}
              className="text-xs sm:text-sm font-semibold text-foreground cursor-pointer select-none leading-none"
            >
              {label || children}
              {required && <span className="text-destructive ml-1 font-extrabold">*</span>}
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
