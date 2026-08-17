'use client';

import { X } from 'lucide-react';
import * as React from 'react';
// @ts-expect-error react-dom type declaration
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

export type DialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

const DialogContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => {},
});

const Dialog: React.FC<DialogProps> = ({ open = false, onOpenChange = () => {}, children }) => (
  <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>
);

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
        if (onClick) {
          onClick(e);
        }
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
  React.useSyncExternalStore(
    emptyDialogSubscribe,
    () => true,
    () => false,
  );

const DialogPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { open } = React.useContext(DialogContext);
  const isMounted = useDialogMounted();

  if (!open || !isMounted) {
    return null;
  }

  return createPortal(
    <div
      data-lenis-prevent
      className="animate-in fade-in fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm transition-opacity duration-200 sm:p-6"
    >
      {children}
    </div>,
    document.body,
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
      aria-label="Close"
      onClick={() => {
        onOpenChange(false);
      }}
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
          className,
        )}
        {...props}
      >
        {children}
        <button
          type="button"
          onClick={() => {
            onOpenChange(false);
          }}
          className="absolute top-4 right-4 cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </dialog>
    </DialogPortal>
  );
});
DialogContent.displayName = 'DialogContent';

const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left pb-4 border-b border-border',
      className,
    )}
    {...props}
  />
);

const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-4 border-t border-border',
      className,
    )}
    {...props}
  />
);

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-lg sm:text-xl font-bold tracking-tight text-foreground', className)}
      {...props}
    />
  ),
);
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed',
      className,
    )}
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
