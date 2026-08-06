'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
}>({
  open: false,
  setOpen: () => {},
});

const Select: React.FC<SelectProps> = ({
  value: propValue,
  defaultValue,
  onValueChange: propOnValueChange,
  disabled,
  children,
}) => {
  const [selected, setSelected] = React.useState(propValue || defaultValue || '');
  const [open, setOpen] = React.useState(false);

  const value = propValue !== undefined ? propValue : selected;
  const onValueChange = propOnValueChange || setSelected;

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, disabled }}>
      <div className="relative w-full">{children}</div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { open, setOpen, disabled } = React.useContext(SelectContext);

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={() => setOpen(!open)}
      className={cn(
        'flex h-11 w-full items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
    </button>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

const SelectValue: React.FC<{ placeholder?: string; children?: React.ReactNode }> = ({ placeholder = 'Chọn...', children }) => {
  const { value } = React.useContext(SelectContext);
  return (
    <span className={cn('block truncate', !value && 'text-gray-400 dark:text-gray-500 font-normal')}>
      {children || value || placeholder}
    </span>
  );
};

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(SelectContext);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      <div
        ref={ref}
        className={cn(
          'absolute left-0 right-0 top-full z-50 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-1.5 shadow-xl animate-in fade-in-50 slide-in-from-top-2 duration-150',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
});
SelectContent.displayName = 'SelectContent';

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, value: itemValue, children, ...props }, ref) => {
    const { value, onValueChange, setOpen } = React.useContext(SelectContext);
    const isSelected = value === itemValue;

    return (
      <div
        ref={ref}
        onClick={() => {
          if (onValueChange) onValueChange(itemValue);
          setOpen(false);
        }}
        className={cn(
          'flex cursor-pointer select-none items-center justify-between rounded-lg px-3 py-2.5 text-xs sm:text-sm font-semibold transition-colors hover:bg-gray-100 dark:hover:bg-gray-800',
          isSelected ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold' : 'text-gray-800 dark:text-gray-200',
          className
        )}
        {...props}
      >
        <span>{children}</span>
        {isSelected && <Check className="h-4 w-4 text-emerald-700" />}
      </div>
    );
  }
);
SelectItem.displayName = 'SelectItem';

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
