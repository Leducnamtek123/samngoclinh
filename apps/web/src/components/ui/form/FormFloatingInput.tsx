'use client';

import * as React from 'react';
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { FormItem, FormDescription, FormMessage } from './Form';
import { FloatingInput } from '../floating-input';
import { Input, type InputProps } from '../input';

export interface FormFloatingInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<InputProps, 'name' | 'control'> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export function FormFloatingInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  type = 'text',
  required,
  disabled,
  description,
  prefixIcon,
  suffixIcon,
  className,
  ...props
}: FormFloatingInputProps<TFieldValues, TName>) {
  const [showPassword, setShowPassword] = React.useState(false);
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const isPasswordType = type === 'password';
  const effectiveType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  const defaultPasswordSuffix = isPasswordType ? (
    <button
      type="button"
      tabIndex={-1}
      onClick={() => setShowPassword((prev) => !prev)}
      disabled={disabled}
      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-md transition-colors cursor-pointer"
      title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
    >
      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  ) : null;

  const effectiveSuffix = suffixIcon ?? defaultPasswordSuffix;

  return (
    <FormItem className="space-y-1">
      <FloatingInput
        label={label}
        required={required}
        error={!!error}
        prefixIcon={prefixIcon}
        suffixIcon={effectiveSuffix}
        className={className}
      >
        <Input
          {...field}
          {...props}
          id={name}
          type={effectiveType}
          disabled={disabled}
          value={field.value ?? ''}
        />
      </FloatingInput>
      {description && !error && <FormDescription>{description}</FormDescription>}
      <FormMessage error={error} />
    </FormItem>
  );
}
