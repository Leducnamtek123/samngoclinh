'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import type { InputProps } from './input';

export type FloatingInputProps = {
  label: string;
  id?: string;
  required?: boolean;
  error?: boolean;
  success?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  className?: string;
  children: React.ReactElement<InputProps>;
};

export function FloatingInput({
  label,
  id,
  error,
  success,
  prefixIcon,
  suffixIcon,
  className,
  children,
}: FloatingInputProps) {
  const generatedId = React.useId();
  const inputId = id || children.props.id || generatedId;

  const childValue = children.props.value ?? children.props.defaultValue ?? '';
  const [isFocused, setIsFocused] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(childValue);

  const isControlled = children.props.value !== undefined;
  const activeValue = isControlled ? children.props.value : internalValue;
  const hasValue = String(activeValue ?? '').length > 0;

  const isFloating = isFocused || hasValue;

  const clonedInput = React.cloneElement(children, {
    id: inputId,
    placeholder: ' ',
    'aria-invalid': error ? true : undefined,
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      children.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      children.props.onBlur?.(e);
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      children.props.onChange?.(e);
    },
    className: cn(
      'peer text-sm font-semibold h-12 pt-3 pb-1',
      suffixIcon && 'pr-10',
      error && 'border-red-500 focus-visible:ring-red-500/30 focus-visible:border-red-500',
      success &&
        'border-emerald-600 focus-visible:ring-emerald-600/30 focus-visible:border-emerald-600',
      children.props.className,
    ),
  });

  return (
    <div className={cn('relative w-full', className)}>
      {clonedInput}

      {/* Combined Floating Label + Prefix Icon */}
      <label
        htmlFor={inputId}
        className={cn(
          'absolute left-3 z-10 transition-[top,transform,font-size,color] duration-200 pointer-events-none select-none px-1.5 rounded bg-white dark:bg-gray-900 flex items-center gap-1.5',
          isFloating
            ? 'top-0 -translate-y-1/2 text-xs font-bold text-gray-700 dark:text-gray-300'
            : 'top-1/2 -translate-y-1/2 text-[13px] font-medium text-gray-400 dark:text-gray-500',
          isFocused && !error && 'text-emerald-800 dark:text-emerald-400 font-bold',
          error && 'text-red-500 font-bold',
        )}
      >
        {prefixIcon && (
          <span
            className={cn(
              'transition-[width,height,color] duration-200 flex items-center justify-center shrink-0',
              isFloating ? 'w-3.5 h-3.5' : 'w-4 h-4 text-gray-400 dark:text-gray-500',
            )}
          >
            {prefixIcon}
          </span>
        )}
        <span>{label}</span>
      </label>

      {suffixIcon && (
        <div className="absolute top-1/2 right-3.5 z-20 flex -translate-y-1/2 items-center justify-center text-gray-400 dark:text-gray-500">
          {suffixIcon}
        </div>
      )}
    </div>
  );
}

export type FloatingLabelInputProps = {
  label: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  error?: boolean;
  success?: boolean;
} & Omit<InputProps, 'placeholder'>;

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, prefixIcon, suffixIcon, error, success, className, ...props }, ref) => (
    <FloatingInput
      label={label}
      error={error}
      success={success}
      prefixIcon={prefixIcon}
      suffixIcon={suffixIcon}
      className={className}
    >
      <Input ref={ref} {...props} />
    </FloatingInput>
  ),
);
FloatingLabelInput.displayName = 'FloatingLabelInput';
