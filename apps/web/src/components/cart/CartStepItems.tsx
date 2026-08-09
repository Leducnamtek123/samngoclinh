'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import type { CartItem } from '@/utils/cart';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type CartStepItemsProps = {
  items: CartItem[];
  totalAmount: number;
  t: (key: string) => string;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onNextStep: () => void;
};

export const CartStepItems = ({
  items,
  totalAmount,
  t,
  onUpdateQuantity,
  onRemoveItem,
  onNextStep,
}: CartStepItemsProps) => {
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  const handleConfirmRemove = () => {
    if (removingItemId) {
      onRemoveItem(removingItemId);
      setRemovingItemId(null);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng!');
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState
        title="Giỏ hàng của bạn đang trống"
        description="Hãy chọn các sản phẩm Rượu Sâm Ngọc Linh cao cấp để thêm vào giỏ hàng."
        icon={ShoppingBag}
        actionLabel="Khám phá cửa hàng sâm"
        onAction={() => {
          if (typeof window !== 'undefined') window.location.href = '/ginseng';
        }}
        actionVariant="default"
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <span>Sản phẩm trong giỏ</span>
            </h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              {items.length} mặt hàng
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="py-4 flex items-center gap-4 group">
                <div className="relative w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center p-2 border border-gray-150 flex-shrink-0 overflow-hidden">
                  <Image 
                    src={item.image || '/assets/images/logo_ruou_sam.png'} 
                    alt={item.name} 
                    fill
                    sizes="80px"
                    unoptimized
                    className="object-contain group-hover:scale-105 transition-transform" 
                  />
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                  <p className="text-xs font-black text-emerald-700">{item.price.toLocaleString('vi-VN')} đ</p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl p-1 bg-gray-50">
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
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-100 p-0 text-xs cursor-pointer"
                  >
                    -
                  </Button>
                  <span className="text-xs font-bold px-2 text-gray-900">{item.quantity}</span>
                  <Button 
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onUpdateQuantity(item.id, 1)} 
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-100 p-0 text-xs cursor-pointer"
                  >
                    +
                  </Button>
                </div>

                <Button 
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
                  onClick={() => setRemovingItemId(item.id)} 
                  className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="font-extrabold text-gray-900 text-base border-b border-gray-100 pb-3">{t('subtotal')}</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-semibold text-gray-600">
              <span>{t('subtotal')}</span>
              <span>{totalAmount.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-gray-600">
              <span>{t('shipping')}</span>
              <span className="text-emerald-700 font-bold">{t('free')}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-gray-900 pt-3 border-t border-gray-100">
              <span>{t('total')}</span>
              <span className="text-emerald-800 font-black">{totalAmount.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={onNextStep}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t('step2')}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ConfirmModal for removing cart item */}
      <ConfirmModal
        isOpen={!!removingItemId}
        title="Xóa sản phẩm khỏi giỏ hàng?"
        description="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
        cancelText="Hủy"
        confirmText="Xóa sản phẩm"
        isDestructive={true}
        onConfirm={handleConfirmRemove}
        onCancel={() => setRemovingItemId(null)}
      />
    </>
  );
};
