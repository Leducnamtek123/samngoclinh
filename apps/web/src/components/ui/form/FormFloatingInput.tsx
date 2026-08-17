'use client';

import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';
import { useController } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FloatingInput } from '../floating-input';
import { Input } from '../input';
import type { InputProps } from '../input';
import { FormItem, FormDescription, FormMessage } from './Form';

export type FormFloatingInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
} & Omit<InputProps, 'name' | 'control'>;

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
      onClick={() => {
        setShowPassword((prev) => !prev);
      }}
      disabled={disabled}
      className="cursor-pointer rounded-md p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
      title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
    >
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
