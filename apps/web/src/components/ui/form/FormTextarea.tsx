'use client';

import * as React from 'react';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';
import { FormItem, FormLabel, FormDescription, FormMessage } from './Form';
import { Textarea } from '../textarea';

export interface FormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {
  control: Control<TFieldValues, any>;
  name: TName;
  label?: string;
  description?: string;
  helperText?: string;
  required?: boolean;
  characterCounter?: boolean;
  fullWidth?: boolean;
}

export function FormTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
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
          if (onChange) onChange(e);
        }}
        className={`${
          hasError
            ? 'border-red-500 text-red-900 focus-visible:ring-red-500/20 focus-visible:border-red-500'
            : ''
        }`}
        {...props}
      />

      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <div>
          {(description || helperText) && (
            <FormDescription>{description || helperText}</FormDescription>
          )}
        </div>
        {characterCounter && maxLength && (
          <span className="font-mono text-[11px] text-gray-400 font-medium">
            {valueStr.length}/{maxLength}
          </span>
        )}
      </div>

      <FormMessage error={error} />
    </FormItem>
  );
}
