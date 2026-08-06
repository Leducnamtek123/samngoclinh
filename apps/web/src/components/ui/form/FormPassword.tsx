'use client';

import * as React from 'react';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { FormItem, FormDescription, FormMessage } from './Form';
import { FloatingInput } from '../floating-input';
import { Input, type InputProps } from '../input';

export interface FormPasswordProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<InputProps, 'name' | 'type'> {
  control: Control<TFieldValues, any>;
  name: TName;
  label?: string;
  description?: string;
  helperText?: string;
  required?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  showLockIcon?: boolean;
}

export function FormPassword<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
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
      onClick={() => setShowPassword((prev) => !prev)}
      disabled={disabled || loading}
      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-md transition-colors cursor-pointer"
      title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
    >
      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  return (
    <FormItem name={name} error={error} fullWidth={fullWidth} className={className}>
      <FloatingInput
        label={label}
        error={hasError}
        prefixIcon={showLockIcon ? <Lock className="w-4 h-4" /> : undefined}
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
