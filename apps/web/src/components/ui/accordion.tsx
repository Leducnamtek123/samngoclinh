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
          'border border-border rounded-xl overflow-hidden bg-card text-card-foreground',
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
        'w-full px-4 py-3 text-xs sm:text-sm font-bold text-foreground flex items-center justify-between hover:bg-muted/80 transition-colors cursor-pointer',
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          'w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0',
          isOpen && 'rotate-180 text-primary'
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
        'px-4 pb-4 pt-2 text-xs text-muted-foreground border-t border-border leading-relaxed animate-in fade-in-50 duration-150 bg-card',
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
