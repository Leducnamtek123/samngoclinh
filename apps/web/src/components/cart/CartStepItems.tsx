'use client';

import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/I18nNavigation';
import type { CartItem } from '@/utils/cart';
import { formatVNDPrice } from '@/utils/formatters';

type CartStepItemsProps = {
  items: CartItem[];
  totalAmount?: number;
  t: (key: string) => string;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onNextStep: (selectedItems?: CartItem[]) => void;
};

export const CartStepItems = ({
  items,
  totalAmount: _totalAmount,
  t: _propT,
  onUpdateQuantity,
  onRemoveItem,
  onNextStep,
}: CartStepItemsProps) => {
  const tCart = useTranslations('cart');
  const tActions = useTranslations('actions');
  const tConfirm = useTranslations('confirmModal');

  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [unselectedIds, setUnselectedIds] = useState<string[]>([]);
  const unselectedSet = new Set(unselectedIds);
  const selectedItems = items.filter((item) => !unselectedSet.has(item.id));
  const selectedIdSet = new Set(selectedItems.map((i) => i.id));

  const allSelected = items.length > 0 && selectedItems.length === items.length;

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setUnselectedIds(items.map((i) => i.id));
    } else {
      setUnselectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setUnselectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const selectedTotalAmount = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleProceedNext = () => {
    if (selectedItems.length === 0) {
      toast.error(tCart('itemCount'));
      return;
    }
    onNextStep(selectedItems);
  };

  const handleConfirmRemove = () => {
    if (removingItemId) {
      onRemoveItem(removingItemId);
      setUnselectedIds((prev) => prev.filter((id) => id !== removingItemId));
      setRemovingItemId(null);
      toast.success(tCart('removedFromCart'));
    }
  };

  const getItemUrl = (item: CartItem) => {
    if (item.id.startsWith('GINSENG-') || item.category === 'Cây giống') {
      return `/ginseng/${item.id}`;
    }
    return `/products/${item.id}`;
  };

  if (items.length === 0) {
    return (
      <EmptyState
        title={tCart('emptyCart')}
        description={tCart('emptyCart')}
        icon={ShoppingBag}
        actionLabel={tCart('continueShopping')}
        onAction={() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/products';
          }
        }}
        actionVariant="default"
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Column: Cart Items List */}
        <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs lg:col-span-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                aria-label={tCart('selectAll')}
                checked={allSelected}
                onChange={handleToggleSelectAll}
                className="h-4 w-4 cursor-pointer rounded text-emerald-600 accent-emerald-600 focus:ring-emerald-500"
              />
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-gray-900">
                <ShoppingBag className="h-5 w-5 text-emerald-700" />
                <span>
                  {tCart('itemsInCart', { count: selectedItems.length })} ({selectedItems.length}/
                  {items.length})
                </span>
              </h2>
            </div>
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="cursor-pointer text-xs font-bold text-emerald-700 hover:underline"
            >
              {allSelected ? tCart('deselectAll') : tCart('selectAll')}
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {items.map((item) => {
              const isSelected = selectedIdSet.has(item.id);
              const detailUrl = getItemUrl(item);

              return (
                <div key={item.id} className="group flex items-center gap-4 py-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    aria-label={`${tCart('selectAll')}: ${item.name}`}
                    checked={isSelected}
                    onChange={() => {
                      handleToggleSelect(item.id);
                    }}
                    className="h-4 w-4 shrink-0 cursor-pointer rounded text-emerald-600 accent-emerald-600 focus:ring-emerald-500"
                  />

                  {/* Thumbnail Image Link */}
                  <Link
                    href={detailUrl}
                    className="border-gray-150 relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-gray-50 p-2 transition-colors group-hover:border-emerald-300"
                  >
                    <Image
                      src={item.image || '/assets/images/logo_ruou_sam.png'}
                      alt={item.name}
                      fill
                      sizes="80px"
                      unoptimized
                      className="object-contain transition-transform group-hover:scale-105"
                    />
                  </Link>

                  {/* Product Title Link & Price */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <Link
                      href={detailUrl}
                      className="line-clamp-2 block text-sm leading-snug font-bold text-gray-900 transition-colors hover:text-emerald-700"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs font-black text-emerald-700">
                      {formatVNDPrice(item.price)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (item.quantity <= 1) {
                          setRemovingItemId(item.id);
                        } else {
                          onUpdateQuantity(item.id, -1);
                        }
                      }}
                      className="h-7 w-7 cursor-pointer rounded-lg border border-gray-200 bg-white p-0 text-xs font-bold text-gray-700 hover:bg-gray-100"
                    >
                      -
                    </Button>
                    <span className="px-2 text-xs font-bold text-gray-900">{item.quantity}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        onUpdateQuantity(item.id, 1);
                      }}
                      className="h-7 w-7 cursor-pointer rounded-lg border border-gray-200 bg-white p-0 text-xs font-bold text-gray-700 hover:bg-gray-100"
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => {
                      setRemovingItemId(item.id);
                    }}
                    className="cursor-pointer rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs lg:col-span-4">
          <h3 className="border-b border-gray-100 pb-3 text-base font-extrabold text-gray-900">
            {tCart('subtotal')} ({selectedItems.length})
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-semibold text-gray-600">
              <span>{tCart('subtotal')}</span>
              <span>{formatVNDPrice(selectedTotalAmount)}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-gray-600">
              <span>{tCart('shippingFee')}</span>
              <span className="font-bold text-emerald-700">{tCart('freeShipping')}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-extrabold text-gray-900">
              <span>{tCart('total')}</span>
              <span className="font-black text-emerald-800">
                {formatVNDPrice(selectedTotalAmount)}
              </span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleProceedNext}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-xs font-bold text-white shadow-md shadow-emerald-700/20 transition-colors hover:bg-emerald-800"
          >
            <span>
              {tCart('checkout')} ({selectedItems.length})
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ConfirmModal for removing cart item */}
      <ConfirmModal
        isOpen={!!removingItemId}
        title={tConfirm('title')}
        description={tConfirm('description')}
        cancelText={tActions('cancel')}
        confirmText={tActions('delete')}
        isDestructive={true}
        onConfirm={handleConfirmRemove}
        onCancel={() => {
          setRemovingItemId(null);
        }}
      />
    </>
  );
};
