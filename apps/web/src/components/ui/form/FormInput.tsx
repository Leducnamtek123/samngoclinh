'use client';

import * as React from 'react';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { FormItem, FormDescription, FormMessage } from './Form';
import { FloatingInput } from '../floating-input';
import { Input } from '../input';

export interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  control: Control<TFieldValues, any>;
  name: TName;
  label?: string;
  description?: string;
  helperText?: string;
  required?: boolean;
  loading?: boolean;
  success?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  clearButton?: boolean;
  characterCounter?: boolean;
  fullWidth?: boolean;
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label = '',
  description,
  helperText,
  required,
  loading,
  success,
  prefixIcon,
  suffixIcon,
  clearButton = false,
  characterCounter = false,
  fullWidth = true,
  disabled,
  maxLength,
  className,
  type = 'text',
  onChange,
  ...props
}: FormInputProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const valueStr = String(field.value ?? '');
  const hasError = !!error;

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    field.onChange('');
  };

  const renderedSuffix = (
    <div className="flex items-center gap-1.5 shrink-0">
      {loading && (
        <span className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin shrink-0" />
      )}

      {!loading && clearButton && valueStr.length > 0 && !disabled && (
          <button
            type="button"
            tabIndex={-1}
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 rounded-full transition-colors cursor-pointer"
            title="Clear"
            aria-label="Clear"
          >
            <X className="w-3.5 h-3.5" />
          </button>
      )}

      {!loading && hasError && (
        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
      )}

      {!loading && !hasError && success && (
        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
      )}

      {!loading && !hasError && !success && suffixIcon && (
        <div className="text-gray-400 dark:text-gray-500">{suffixIcon}</div>
      )}
    </div>
  );

  return (
    <FormItem name={name} error={error} fullWidth={fullWidth} className={className}>
      <FloatingInput
        label={label}
        error={hasError}
        success={success}
        prefixIcon={prefixIcon}
        suffixIcon={renderedSuffix}
      >
        <Input
          {...field}
          {...props}
          id={name}
          type={type}
          disabled={disabled || loading}
          maxLength={maxLength}
          value={valueStr}
          onChange={(e) => {
            field.onChange(e);
            if (onChange) onChange(e);
          }}
        />
      </FloatingInput>

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
