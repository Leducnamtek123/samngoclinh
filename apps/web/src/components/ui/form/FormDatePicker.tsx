'use client';

import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { DatePicker } from '../date-picker';
import { FormItem, FormDescription, FormMessage } from './Form';

export interface FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  required,
  disabled,
  description,
  className,
  minDate,
  maxDate,
}: FormDatePickerProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <FormItem className="space-y-1.5">
      {label && (
        <label htmlFor={String(name)} className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <DatePicker
        id={String(name)}
        value={field.value}
        onChange={field.onChange}
        placeholder={placeholder}
        disabled={disabled}
        error={!!error}
        minDate={minDate}
        maxDate={maxDate}
        className={className}
      />
      {description && !error && <FormDescription>{description}</FormDescription>}
      <FormMessage error={error} />
    </FormItem>
  );
}
