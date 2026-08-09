import { useEffect } from 'react';
import Image from 'next/image';
import { getProductImage } from '@/utils/productUtils';
import type { ProductItem } from '@/types';

export type ProductDetailModalProps = {
  selectedDetailProduct: ProductItem | any;
  activeImageIdx: number;
  setActiveImageIdx: (idx: number) => void;
  onClose: () => void;
  onBuyItem: (e: React.MouseEvent, item: any, redirect?: boolean) => void;
};

export const ProductDetailModal = ({
  selectedDetailProduct,
  activeImageIdx,
  setActiveImageIdx,
  onClose,
  onBuyItem,
}: ProductDetailModalProps) => {
  useEffect(() => {
    if (!selectedDetailProduct) return;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, [selectedDetailProduct]);

  if (!selectedDetailProduct) return null;

  const mainImageSrc = getProductImage(selectedDetailProduct, activeImageIdx);

  return (
    <div data-lenis-prevent className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 transition-opacity duration-200 animate-in fade-in">
      <div data-lenis-prevent className="bg-white rounded-[20px] max-w-2xl w-full max-h-[min(88vh,820px)] flex flex-col overflow-hidden relative shadow-2xl transition-[opacity,transform] duration-200 animate-in zoom-in-95 border border-gray-100">
        {/* Sticky Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10 rounded-t-[20px] shadow-2xs">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            {selectedDetailProduct.category && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 shrink-0">
                {selectedDetailProduct.category}
              </span>
            )}
            <h3 className="text-base sm:text-lg font-extrabold text-gray-900 leading-snug truncate">
              {selectedDetailProduct.name}
            </h3>
          </div>
          <button
            type="button"
            aria-label="Đóng modal sản phẩm"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors font-bold cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Inner Scroll Area */}
        <div data-lenis-prevent className="flex-1 modal-content p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Gallery Viewer */}
            <div className="space-y-3">
              <div className="h-64 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
                {mainImageSrc ? (
                  <Image
                    src={mainImageSrc}
                    alt={selectedDetailProduct.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                    className="max-h-full max-w-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 text-xs font-medium space-y-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Không có hình ảnh</span>
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails Slider */}
              {selectedDetailProduct?.images && Array.isArray(selectedDetailProduct.images) && selectedDetailProduct.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto py-1">
                  {selectedDetailProduct.images.map((imgUrl: string, idx: number) => (
                    <button
                      type="button"
                      key={imgUrl}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-14 h-14 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-[border-color,opacity] duration-200 cursor-pointer relative ${
                        activeImageIdx === idx ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={imgUrl} alt={`Góc ${idx + 1}`} fill sizes="56px" unoptimized className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 inline-block">
                Chính Hãng • Kiểm Định Nghiêm Ngặt
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 leading-snug">
                {selectedDetailProduct.name}
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                {selectedDetailProduct.description || 'Sản phẩm sâm Ngọc Linh chuẩn nguồn gốc được kiểm định chất lượng nghiêm ngặt.'}
              </p>

              <div className="text-xl font-black text-secondary">
                {(selectedDetailProduct.price || 0).toLocaleString('vi-VN')} đ
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-white flex gap-3 z-10 rounded-b-[20px] shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <button
            type="button"
            onClick={(e) => {
              onBuyItem(e, selectedDetailProduct, true);
              onClose();
            }}
            className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-md cursor-pointer"
          >
            Mua Ngay
          </button>
          <button
            type="button"
            onClick={(e) => {
              onBuyItem(e, selectedDetailProduct, false);
              onClose();
            }}
            className="px-5 py-3 border border-gray-300 hover:border-primary text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Thêm Giỏ Hàng
          </button>
        </div>
      </div>
    </div>
  );
};
