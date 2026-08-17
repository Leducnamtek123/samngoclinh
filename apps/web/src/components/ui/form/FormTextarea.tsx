'use client';

import * as React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { Textarea } from '../textarea';
import { FormItem, FormLabel, FormDescription, FormMessage } from './Form';

export type FormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  helperText?: string;
  required?: boolean;
  characterCounter?: boolean;
  fullWidth?: boolean;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'>;

export function FormTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  helperText,
  required,
  characterCounter = false,
  fullWidth = true,
  disabled,
  maxLength,
  className,
  rows = 4,
  placeholder = '',
  onChange,
  ...props
}: FormTextareaProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const valueStr = String(field.value ?? '');
  const hasError = !!error;

  return (
    <FormItem name={name} error={error} fullWidth={fullWidth} className={className}>
      {label && <FormLabel required={required}>{label}</FormLabel>}

      <Textarea
        {...field}
        rows={rows}
        disabled={disabled}
        maxLength={maxLength}
        value={valueStr}
        placeholder={placeholder}
        onChange={(e) => {
          field.onChange(e);
          if (onChange) {
            onChange(e);
          }
        }}
        className={
          hasError
            ? 'border-red-500 text-red-900 focus-visible:border-red-500 focus-visible:ring-red-500/20'
            : ''
        }
        {...props}
      />

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div>
          {(description || helperText) && (
            <FormDescription>{description || helperText}</FormDescription>
          )}
        </div>
        {characterCounter && maxLength && (
          <span className="font-mono text-[11px] font-medium text-gray-400">
            {valueStr.length}/{maxLength}
          </span>
        )}
      </div>

      <FormMessage error={error} />
    </FormItem>
  );
}
