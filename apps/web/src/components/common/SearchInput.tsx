'use client';

import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type SearchInputProps = {
  /** Callback fired when search term changes (debounced if debounceMs is set) */
  onSearch?: (value: string) => void;
  /** Optional debounce delay in milliseconds (default: 300ms) */
  debounceMs?: number;
  /** Custom wrapper container className */
  containerClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function SearchInput({
  value: valueProp,
  defaultValue = '',
  onChange,
  onSearch,
  debounceMs = 300,
  placeholder,
  className,
  containerClassName,
  ...props
}: SearchInputProps) {
  const t = useTranslations('common');
  const resolvedPlaceholder = placeholder ?? t('searchPlaceholder');
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string>((defaultValue || '') as string);
  const value = isControlled ? (valueProp as string) : internalValue;

  useEffect(() => {
    if (!onSearch) {
      return;
    }

    const timer = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, debounceMs, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className={cn('relative flex items-center w-full max-w-sm', containerClassName)}>
      <Search className="pointer-events-none absolute left-3 h-4 w-4 shrink-0 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={resolvedPlaceholder}
        className={cn('pl-9 pr-9', className)}
        {...props}
      />

      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-2 h-6 w-6 cursor-pointer rounded-full p-0 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={t('clear') || 'Clear search'}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
