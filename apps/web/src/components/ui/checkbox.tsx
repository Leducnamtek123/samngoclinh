import { Check } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

export type CheckboxProps = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked = false, onCheckedChange, disabled, ...props }, ref) => (
    <label className="relative inline-flex cursor-pointer items-center select-none">
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
        className="peer sr-only"
        {...props}
      />
      <div
        className={cn(
          'flex items-center justify-center h-5 w-5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-600/30 peer-checked:bg-emerald-700 peer-checked:border-emerald-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
          className,
        )}
      >
        {checked && <Check className="h-3.5 w-3.5 stroke-[3] text-white" />}
      </div>
    </label>
  ),
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
