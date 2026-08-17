'use client';

import * as React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { Checkbox } from '../checkbox';
import { FormItem, FormDescription, FormMessage } from './Form';

export type FormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  label?: React.ReactNode;
  description?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function FormCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
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
          onCheckedChange={(checked) => {
            field.onChange(checked);
          }}
          className="shrink-0"
        />

        <div className="space-y-0.5">
          {(label || children) && (
            <label
              htmlFor={checkboxId}
              className="cursor-pointer text-xs leading-none font-semibold text-foreground select-none sm:text-sm"
            >
              {label || children}
              {required && <span className="ml-1 font-extrabold text-destructive">*</span>}
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
