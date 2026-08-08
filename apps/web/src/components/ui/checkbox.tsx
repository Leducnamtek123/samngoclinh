import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked = false, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          disabled={disabled}
          onChange={(e) => {
            if (onCheckedChange) {
              onCheckedChange(e.target.checked);
            }
          }}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            'flex items-center justify-center h-5 w-5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-600/30 peer-checked:bg-emerald-700 peer-checked:border-emerald-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            className
          )}
        >
          {checked && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
        </div>
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
