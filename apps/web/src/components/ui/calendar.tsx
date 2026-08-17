'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface CalendarProps {
  selected?: Date | null;
  onSelect?: (date: Date | null) => void;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

const STATIC_YEARS: number[] = Array.from({ length: 96 }, (_, i) => 2035 - i);

export function Calendar({
  selected,
  onSelect,
  className,
  minDate,
  maxDate,
  disabled,
}: CalendarProps) {
  const locale = useLocale();
  const tActions = useTranslations('actions');

  const monthNames = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(2026, i, 1);
      return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'vi-VN', { month: 'long' });
    });
  }, [locale]);

  const weekDays = React.useMemo(() => {
    if (locale === 'en') {
      return ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    }
    return ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  }, [locale]);

  const initialDate = selected || new Date();
  const [viewYear, setViewYear] = React.useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = React.useState<number>(initialDate.getMonth());

  const [prevSelected, setPrevSelected] = React.useState(selected);
  if (selected && selected !== prevSelected) {
    setPrevSelected(selected);
    setViewYear(selected.getFullYear());
    setViewMonth(selected.getMonth());
  }

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const years = STATIC_YEARS;

  // Compute days in month
  const calendarDays = (() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);

    let startDay = firstDayOfMonth.getDay() - 1;
    if (startDay === -1) startDay = 6;

    const daysCount = lastDayOfMonth.getDate();
    const days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      isSelected: boolean;
      isToday: boolean;
      isDisabled: boolean;
    }> = [];

    // Previous month padding
    const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(viewYear, viewMonth - 1, prevMonthLastDay - i);
      days.push({
        date: d,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
        isDisabled: true,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Current month days
    for (let day = 1; day <= daysCount; day++) {
      const d = new Date(viewYear, viewMonth, day);
      d.setHours(0, 0, 0, 0);

      const isSelected = selected
        ? selected.getFullYear() === d.getFullYear() &&
          selected.getMonth() === d.getMonth() &&
          selected.getDate() === d.getDate()
        : false;

      const isToday =
        today.getFullYear() === d.getFullYear() &&
        today.getMonth() === d.getMonth() &&
        today.getDate() === d.getDate();

      let isDateDisabled = !!disabled;
      if (minDate && d < minDate) isDateDisabled = true;
      if (maxDate && d > maxDate) isDateDisabled = true;

      days.push({
        date: d,
        isCurrentMonth: true,
        isSelected,
        isToday,
        isDisabled: isDateDisabled,
      });
    }

    // Next month padding to fill grid to multiple of 7
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(viewYear, viewMonth + 1, i);
      days.push({
        date: d,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
        isDisabled: true,
      });
    }

    return days;
  })();

  const handleSelectToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    if (onSelect) onSelect(today);
  };

  const handleClear = () => {
    if (onSelect) onSelect(null);
  };

  return (
    <div className={cn('p-1 w-[290px] select-none space-y-3 font-sans', className)}>
      {/* Header Month / Year Navigation */}
      <div className="flex items-center justify-between gap-1 pb-1">
        <div className="flex items-center gap-1.5">
          <select
            value={viewMonth}
            aria-label="Select month"
            onChange={(e) => setViewMonth(Number(e.target.value))}
            className="text-xs font-bold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-slate-800 rounded-lg px-2 py-1 border-0 focus:ring-1 focus:ring-emerald-500 cursor-pointer outline-none capitalize"
          >
            {monthNames.map((name, idx) => (
              <option key={name} value={idx}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={viewYear}
            aria-label="Select year"
            onChange={(e) => setViewYear(Number(e.target.value))}
            className="text-xs font-bold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-slate-800 rounded-lg px-2 py-1 border-0 focus:ring-1 focus:ring-emerald-500 cursor-pointer outline-none"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map((w, idx) => (
          <div
            key={w}
            className={cn(
              'text-[11px] font-bold py-1 text-gray-400 dark:text-gray-500',
              idx >= 5 && 'text-amber-600/80 dark:text-amber-500/80'
            )}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((item) => {
          return (
            <button
              key={item.date.toISOString()}
              type="button"
              disabled={item.isDisabled}
              onClick={() => {
                if (item.isCurrentMonth && onSelect && !item.isDisabled) {
                  onSelect(item.date);
                }
              }}
              className={cn(
                'size-8 text-xs font-semibold rounded-xl flex items-center justify-center transition-colors cursor-pointer relative',
                !item.isCurrentMonth && 'text-gray-300 dark:text-gray-700 pointer-events-none opacity-40',
                item.isCurrentMonth && !item.isSelected && !item.isDisabled && 'text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700',
                item.isToday && !item.isSelected && 'border border-emerald-500 font-bold text-emerald-700 dark:text-emerald-400',
                item.isSelected && 'bg-emerald-800 text-white font-bold shadow-md shadow-emerald-900/20 hover:bg-emerald-900',
                item.isDisabled && 'opacity-30 cursor-not-allowed pointer-events-none'
              )}
            >
              {item.date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Footer shortcut buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="h-7 text-[11px] font-semibold text-gray-500 hover:text-red-600 px-2 cursor-pointer"
        >
          {tActions('delete')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleSelectToday}
          className="h-7 text-[11px] font-bold text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50 px-2 cursor-pointer"
        >
          {locale === 'en' ? 'Today' : 'Hôm nay'}
        </Button>
      </div>
    </div>
  );
}
