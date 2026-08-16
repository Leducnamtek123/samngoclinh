'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Callback fired when search term changes (debounced if debounceMs is set) */
  onSearch?: (value: string) => void;
  /** Optional debounce delay in milliseconds (default: 300ms) */
  debounceMs?: number;
  /** Custom wrapper container className */
  containerClassName?: string;
}

export function SearchInput({
  value: valueProp,
  defaultValue = '',
  onChange,
  onSearch,
  debounceMs = 300,
  placeholder = 'Tìm kiếm...',
  className,
  containerClassName,
  ...props
}: SearchInputProps) {
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string>((defaultValue || '') as string);
  const value = isControlled ? (valueProp as string) : internalValue;

  useEffect(() => {
    if (!onSearch) return;

    const timer = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => clearTimeout(timer);
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
    if (onSearch) onSearch('');
  };

  return (
    <div className={cn('relative flex items-center w-full max-w-sm', containerClassName)}>
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none shrink-0" />
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn('pl-9 pr-9', className)}
        {...props}
      />

      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-2 h-6 w-6 p-0 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
