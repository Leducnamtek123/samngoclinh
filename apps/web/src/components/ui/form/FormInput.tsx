'use client';

import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import * as React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { FloatingInput } from '../floating-input';
import { Input } from '../input';
import { FormItem, FormDescription, FormMessage } from './Form';

export type FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
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
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'>;

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
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
    <div className="flex shrink-0 items-center gap-1.5">
      {loading && (
        <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
      )}

      {!loading && clearButton && valueStr.length > 0 && !disabled && (
        <button
          type="button"
          tabIndex={-1}
          onClick={handleClear}
          className="cursor-pointer rounded-full p-0.5 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
          title="Clear"
          aria-label="Clear"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      {!loading && hasError && <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />}

      {!loading && !hasError && success && (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
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
            if (onChange) {
              onChange(e);
            }
          }}
        />
      </FloatingInput>

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
