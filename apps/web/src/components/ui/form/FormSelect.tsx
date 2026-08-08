'use client';

import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { FormItem, FormLabel, FormDescription, FormMessage } from './Form';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../select';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues, any>;
  name: TName;
  options: SelectOption[];
  label?: string;
  description?: string;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  options,
  label,
  description,
  helperText,
  placeholder = 'Chọn...',
  required,
  disabled,
  fullWidth = true,
  className,
}: FormSelectProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const valueStr = String(field.value ?? '');
  const selectedOption = options.find((opt) => opt.value === valueStr);

  return (
    <FormItem name={name} error={error} fullWidth={fullWidth} className={className}>
      {label && <FormLabel required={required}>{label}</FormLabel>}

      <Select
        value={valueStr}
        disabled={disabled}
        onValueChange={(val) => field.onChange(val)}
      >
        <SelectTrigger
          className={
            error
              ? 'border-red-500 text-red-900 focus:ring-red-500/20 focus:border-red-500'
              : ''
          }
        >
          <SelectValue placeholder={placeholder}>
            {selectedOption ? selectedOption.label : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {(description || helperText) && (
        <FormDescription>{description || helperText}</FormDescription>
      )}

      <FormMessage error={error} />
    </FormItem>
  );
}
