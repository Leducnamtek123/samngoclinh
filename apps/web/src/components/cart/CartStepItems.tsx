import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/lib/I18nNavigation';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import type { CartItem } from '@/utils/cart';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  t,
  onUpdateQuantity,
  onRemoveItem,
  onNextStep,
}: CartStepItemsProps) => {
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
    setUnselectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedTotalAmount = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleProceedNext = () => {
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 sản phẩm để tiến hành thanh toán!');
      return;
    }
    onNextStep(selectedItems);
  };

  const handleConfirmRemove = () => {
    if (removingItemId) {
      onRemoveItem(removingItemId);
      setUnselectedIds((prev) => prev.filter((id) => id !== removingItemId));
      setRemovingItemId(null);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng!');
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
        title="Giỏ hàng của bạn đang trống"
        description="Hãy chọn các sản phẩm Rượu Sâm Ngọc Linh cao cấp để thêm vào giỏ hàng."
        icon={ShoppingBag}
        actionLabel="Khám phá cửa hàng sâm"
        onAction={() => {
          if (typeof window !== 'undefined') window.location.href = '/products';
        }}
        actionVariant="default"
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                aria-label="Chọn tất cả sản phẩm"
                checked={allSelected}
                onChange={handleToggleSelectAll}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
              />
              <h2 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                <span>Sản phẩm trong giỏ ({selectedItems.length}/{items.length})</span>
              </h2>
            </div>
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {items.map((item) => {
              const isSelected = selectedIdSet.has(item.id);
              const detailUrl = getItemUrl(item);

              return (
                <div key={item.id} className="py-4 flex items-center gap-4 group">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    aria-label={`Chọn sản phẩm ${item.name}`}
                    checked={isSelected}
                    onChange={() => handleToggleSelect(item.id)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer shrink-0"
                  />

                  {/* Thumbnail Image Link */}
                  <Link
                    href={detailUrl}
                    className="relative w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center p-2 border border-gray-150 flex-shrink-0 overflow-hidden group-hover:border-emerald-300 transition-colors"
                  >
                    <Image
                      src={item.image || '/assets/images/logo_ruou_sam.png'}
                      alt={item.name}
                      fill
                      sizes="80px"
                      unoptimized
                      className="object-contain group-hover:scale-105 transition-transform"
                    />
                  </Link>

                  {/* Product Title Link & Price */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      href={detailUrl}
                      className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug block hover:text-emerald-700 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs font-black text-emerald-700">
                      {item.price.toLocaleString('vi-VN')} đ
                    </p>
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
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
          <h3 className="font-extrabold text-gray-900 text-base border-b border-gray-100 pb-3">Tạm tính ({selectedItems.length} sản phẩm)</h3>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-semibold text-gray-600">
              <span>{t('subtotal')}</span>
              <span>{selectedTotalAmount.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-gray-600">
              <span>{t('shipping')}</span>
              <span className="text-emerald-700 font-bold">{t('free')}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-gray-900 pt-3 border-t border-gray-100">
              <span>{t('total')}</span>
              <span className="text-emerald-800 font-black">{selectedTotalAmount.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleProceedNext}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Xác nhận ({selectedItems.length})</span>
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
