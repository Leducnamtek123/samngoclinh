'use client';

// @ts-expect-error react-dom type declaration
import { createPortal } from 'react-dom';
import { AlertTriangle, Info, Loader2 } from 'lucide-react';
import { useSyncExternalStore } from 'react';

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
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in">
      <dialog 
        open
        className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 transform transition-[opacity,transform] animate-in zoom-in-95 duration-200 block"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full shrink-0 ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
            {isDestructive ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <h3 id="confirm-modal-title" className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 ${
              isDestructive 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500/20' 
                : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500/20'
            }`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </dialog>
    </div>,
    document.body
  );
}
