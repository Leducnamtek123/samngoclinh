'use client';

import { Eye, EyeOff, Lock } from 'lucide-react';
import * as React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { FloatingInput } from '../floating-input';
import { Input } from '../input';
import type { InputProps } from '../input';
import { FormItem, FormDescription, FormMessage } from './Form';

export type FormPasswordProps<
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
  fullWidth?: boolean;
  showLockIcon?: boolean;
} & Omit<InputProps, 'name' | 'type'>;

export function FormPassword<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label = 'Mật khẩu',
  description,
  helperText,
  required,
  loading,
  fullWidth = true,
  showLockIcon = true,
  disabled,
  className,
  ...props
}: FormPasswordProps<TFieldValues, TName>) {
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const valueStr = String(field.value ?? '');
  const hasError = !!error;

  const toggleButton = (
    <button
      type="button"
      tabIndex={-1}
      onClick={() => {
        setShowPassword((prev) => !prev);
      }}
      disabled={disabled || loading}
      className="cursor-pointer rounded-md p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
      title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
    >
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <FormItem name={name} error={error} fullWidth={fullWidth} className={className}>
      <FloatingInput
        label={label}
        error={hasError}
        prefixIcon={showLockIcon ? <Lock className="h-4 w-4" /> : undefined}
        suffixIcon={toggleButton}
      >
        <Input
          {...field}
          {...props}
          id={name}
          type={showPassword ? 'text' : 'password'}
          disabled={disabled || loading}
          value={valueStr}
        />
      </FloatingInput>

      {(description || helperText) && (
        <FormDescription>{description || helperText}</FormDescription>
      )}

      <FormMessage error={error} />
    </FormItem>
  );
}
