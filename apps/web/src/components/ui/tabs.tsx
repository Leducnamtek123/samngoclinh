'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
}

const TabsContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({});

const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value: propValue,
  onValueChange: propOnValueChange,
  className,
  children,
}) => {
  const [selectedTab, setSelectedTab] = React.useState(propValue || defaultValue || '');

  const value = propValue !== undefined ? propValue : selectedTab;
  const onValueChange = propOnValueChange || setSelectedTab;

  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex h-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 p-1 text-gray-500 dark:text-gray-400 w-full',
      className
    )}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: activeValue, onValueChange } = React.useContext(TabsContext);
    const isSelected = activeValue === value;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isSelected}
        onClick={() => onValueChange && onValueChange(value)}
        className={cn(
          'inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl px-4 py-2.5 text-xs sm:text-sm font-extrabold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 cursor-pointer',
          isSelected
            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
            : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: activeValue } = React.useContext(TabsContext);
    if (activeValue !== value) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn(
          'mt-4 focus-visible:outline-none animate-in fade-in-50 duration-150',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
