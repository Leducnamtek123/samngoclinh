'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionProps {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const AccordionContext = React.createContext<{
  openValues: string[];
  toggleValue: (value: string) => void;
}>({
  openValues: [],
  toggleValue: () => {},
});

const Accordion: React.FC<AccordionProps> = ({
  type = 'single',
  collapsible = true,
  className,
  children,
}) => {
  const [openValues, setOpenValues] = React.useState<string[]>([]);

  const toggleValue = (value: string) => {
    setOpenValues((prev) => {
      const isOpen = prev.includes(value);
      if (type === 'single') {
        if (isOpen) {
          return collapsible ? [] : prev;
        }
        return [value];
      }
      if (isOpen) {
        return prev.filter((v) => v !== value);
      }
      return [...prev, value];
    });
  };

  return (
    <AccordionContext.Provider value={{ openValues, toggleValue }}>
      <div className={cn('space-y-2', className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900',
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { itemValue: value });
          }
          return child;
        })}
      </div>
    );
  }
);
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { itemValue?: string }
>(({ className, children, itemValue = '', ...props }, ref) => {
  const { openValues, toggleValue } = React.useContext(AccordionContext);
  const isOpen = openValues.includes(itemValue);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => toggleValue(itemValue)}
      className={cn(
        'w-full px-5 py-3 text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer',
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          'w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0',
          isOpen && 'rotate-180 text-emerald-700'
        )}
      />
    </button>
  );
});
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { itemValue?: string }
>(({ className, children, itemValue = '', ...props }, ref) => {
  const { openValues } = React.useContext(AccordionContext);
  const isOpen = openValues.includes(itemValue);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'px-5 pb-4 pt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800 leading-relaxed animate-in fade-in-50 duration-150',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
