import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-[#1C3F24] text-white hover:bg-[#15301B] shadow-md hover:shadow-lg',
        emerald:
          'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 shadow-md',
        outline:
          'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200',
        secondary:
          'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700',
        ghost:
          'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
        link:
          'text-emerald-700 underline-offset-4 hover:underline p-0 h-auto font-bold',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 px-3.5 text-xs',
        lg: 'h-13 px-8 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export interface ButtonLoadingProps extends ButtonProps {
  isLoading?: boolean;
}

const ButtonLoading = React.forwardRef<HTMLButtonElement, ButtonLoadingProps>(
  ({ isLoading, disabled, children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={isLoading || disabled}
        className={className}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />}
        {children}
      </Button>
    );
  }
);
ButtonLoading.displayName = 'ButtonLoading';

export { Button, ButtonLoading, buttonVariants };
