'use client';

import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button, ButtonLoading } from '@/components/ui/button';

const emptySubscribe = () => () => {};

export type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText,
  cancelText,
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const t = useTranslations('confirmModal');
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) return null;

  const finalConfirmText = confirmText || t('confirm');
  const finalCancelText = cancelText || t('cancel');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md">
        <div className="flex items-start gap-4 pt-2">
          <div className={`p-3 rounded-full shrink-0 ${isDestructive ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'}`}>
            {isDestructive ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
          </div>
          <div className="flex-1 space-y-1">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="secondary"
            disabled={isLoading}
            onClick={onCancel}
          >
            {finalCancelText}
          </Button>
          <ButtonLoading
            variant={isDestructive ? 'destructive' : 'emerald'}
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {finalConfirmText}
          </ButtonLoading>
        </div>
      </DialogContent>
    </Dialog>
  );
}
