'use client';

import * as React from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar } from './calendar';

export interface DatePickerProps {
  id?: string;
  value?: string | Date | null;
  onChange?: (val: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  error?: boolean;
}

/**
 * Formats a Date object or ISO string to `dd/MM/yyyy` for display.
 */
function formatDateDisplay(value?: string | Date | null): string {
  if (!value) return '';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formats a Date to `YYYY-MM-DD` for form state / backend.
 */
function formatDateValue(date: Date | null): string {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = 'Chọn ngày (dd/mm/yyyy)...',
  className,
  disabled,
  minDate,
  maxDate,
  error,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const selectedDate = (() => {
    if (!value) return null;
    const d = typeof value === 'string' ? new Date(value) : value;
    return isNaN(d.getTime()) ? null : d;
  })();

  const handleSelect = (date: Date | null) => {
    if (onChange) {
      onChange(formatDateValue(date));
    }
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange('');
    }
  };

  const displayString = formatDateDisplay(selectedDate);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative w-full">
        <PopoverTrigger asChild disabled={disabled}>
          <button
            id={id}
            type="button"
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-colors outline-none text-left cursor-pointer bg-white dark:bg-slate-800',
              error
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-gray-300 dark:border-gray-700 hover:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600',
              disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
              className
            )}
          >
            <div className="flex items-center gap-2.5 overflow-hidden pr-6">
              <CalendarIcon className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              {displayString ? (
                <span className="text-gray-900 dark:text-gray-100 font-bold truncate">
                  {displayString}
                </span>
              ) : (
                <span className="text-gray-400 dark:text-gray-500 font-normal truncate">
                  {placeholder}
                </span>
              )}
            </div>
          </button>
        </PopoverTrigger>

        {displayString && !disabled && (
          <button
            type="button"
            aria-label="Clear date"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-600 transition-colors z-10 cursor-pointer"
            title="Clear date"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <PopoverContent align="start" className="p-3 w-auto">
        <Calendar
          selected={selectedDate}
          onSelect={handleSelect}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
