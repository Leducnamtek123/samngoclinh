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
      <DialogContent className="max-w-md p-6 sm:p-6">
        <div className="flex items-start gap-4 pt-1">
          <div className={`p-3 rounded-2xl shrink-0 ${isDestructive ? 'bg-destructive/10 text-destructive' : 'bg-amber-500/10 text-amber-600'}`}>
            {isDestructive ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
          </div>
          <div className="flex-1 space-y-1.5 pr-8">
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">{title}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">{description}</DialogDescription>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={onCancel}
            className="px-5 py-2 text-xs font-semibold rounded-xl"
          >
            {finalCancelText}
          </Button>
          <ButtonLoading
            variant={isDestructive ? 'destructive' : 'default'}
            isLoading={isLoading}
            onClick={onConfirm}
            className="px-5 py-2 text-xs font-semibold rounded-xl"
          >
            {finalConfirmText}
          </ButtonLoading>
        </div>
      </DialogContent>
    </Dialog>
  );
}
