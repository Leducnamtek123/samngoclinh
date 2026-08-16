'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from '@/lib/I18nNavigation';
import { cartStore } from '@/lib/stores/useCartStore';
import type { CartItem } from '@/types';

export const MiniCartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(cartStore.getSnapshot());
    const unsubscribe = cartStore.subscribe(() => {
      setItems(cartStore.getSnapshot());
    });

    const handleOpenDrawer = () => setIsOpen(true);
    const handleCloseDrawer = () => setIsOpen(false);

    window.addEventListener('open_mini_cart', handleOpenDrawer);
    window.addEventListener('close_mini_cart', handleCloseDrawer);

    return () => {
      unsubscribe();
      window.removeEventListener('open_mini_cart', handleOpenDrawer);
      window.removeEventListener('close_mini_cart', handleCloseDrawer);
    };
  }, []);

  const totalAmount = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const totalCount = items.reduce(
    (count, item) => count + (Number(item.quantity) || 1),
    0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-emerald-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-emerald-800/80 flex items-center justify-center text-emerald-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white">Giỏ Hàng Của Bạn</h3>
              <p className="text-xs text-emerald-300/80 font-medium">
                {totalCount > 0 ? `${totalCount} sản phẩm đã chọn` : 'Chưa có sản phẩm'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="size-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-gray-400">
                <ShoppingBag className="w-8 h-8 opacity-40" />
              </div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Giỏ hàng của bạn đang trống</p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Khám phá ngay các dòng Rượu Sâm Ngọc Linh thượng hạng và củ sâm tươi nguyên khối.
              </p>
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-colors mt-2"
              >
                Khám phá cửa hàng
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5 items-start">
                <div className="size-20 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-gray-700 flex-shrink-0 relative overflow-hidden p-1">
                  <Image
                    src={item.image || '/assets/images/logo_ruou_sam.png'}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">
                    {item.name}
                  </h4>
                  <div className="text-xs font-black text-emerald-800 dark:text-emerald-400 mt-1">
                    {(Number(item.price) || 0).toLocaleString('vi-VN')} đ
                  </div>

                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-800">
                      <button
                        type="button"
                        onClick={() => cartStore.updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-gray-900 dark:text-gray-100">
                        {item.quantity || 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => cartStore.updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => cartStore.removeItem(item.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Tạm tính:</span>
              <span className="text-lg font-black text-emerald-800 dark:text-emerald-400">
                {totalAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="py-3 px-4 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 text-center font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Xem Giỏ Hàng</span>
              </Link>
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-center font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Thanh Toán</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Thanh toán an toàn • Bảo mật thông tin 100%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
