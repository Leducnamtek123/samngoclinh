'use client';

import * as React from 'react';
// @ts-expect-error react-dom type declaration
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const DialogContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => {},
});

const Dialog: React.FC<DialogProps> = ({ open = false, onOpenChange = () => {}, children }) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, children, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext);
  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        if (onClick) onClick(e);
        onOpenChange(true);
      }}
      {...props}
    >
      {children}
    </button>
  );
});
DialogTrigger.displayName = 'DialogTrigger';

const emptyDialogSubscribe = () => () => {};
const useDialogMounted = () =>
  React.useSyncExternalStore(emptyDialogSubscribe, () => true, () => false);

const DialogPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { open } = React.useContext(DialogContext);
  const isMounted = useDialogMounted();

  if (!open || !isMounted) return null;

  return createPortal(
    <div data-lenis-prevent className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in overflow-y-auto">
      {children}
    </div>,
    document.body
  );
};

const DialogOverlay = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext);
  return (
    <button
      ref={ref}
      type="button"
      aria-label="Đóng hộp thoại"
      onClick={() => onOpenChange(false)}
      className={cn('fixed inset-0 z-[-1] bg-transparent border-0 cursor-default', className)}
      {...props}
    />
  );
});
DialogOverlay.displayName = 'DialogOverlay';

const DialogContent = React.forwardRef<
  HTMLDialogElement,
  React.DialogHTMLAttributes<HTMLDialogElement>
>(({ className, children, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext);
  return (
    <DialogPortal>
      <DialogOverlay />
      <dialog
        ref={ref}
        open
        aria-modal="true"
        data-lenis-prevent
        className={cn(
          'relative w-full max-w-2xl bg-white dark:bg-slate-900 bg-card text-card-foreground rounded-2xl p-6 shadow-xl border border-border transform transition-transform duration-200 animate-in zoom-in-95 my-auto max-h-[88vh] overflow-y-auto overscroll-contain block m-auto',
          className
        )}
        {...props}
      >
        {children}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </button>
      </dialog>
    </DialogPortal>
  );
});
DialogContent.displayName = 'DialogContent';

const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left pb-4 border-b border-border',
      className
    )}
    {...props}
  />
);

const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-4 border-t border-border',
      className
    )}
    {...props}
  />
);

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      'text-lg sm:text-xl font-bold tracking-tight text-foreground',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed', className)}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
