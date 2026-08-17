'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type SwitchProps = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
};

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ checked = false, onCheckedChange, disabled, className, id, ...props }, ref) => (
    <label
      htmlFor={id}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-emerald-700' : 'bg-gray-200 dark:bg-gray-700',
        className,
      )}
    >
      <input
        type="checkbox"
        id={id}
        ref={ref}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
        className="sr-only"
        {...props}
      />
      <span
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </label>
  ),
);
Switch.displayName = 'Switch';

export { Switch };
