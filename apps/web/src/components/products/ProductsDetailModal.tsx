import Image from 'next/image';
import { getProductImage } from '@/utils/productUtils';

type ProductsDetailModalProps = {
  selectedDetailProduct: any;
  activeImageIdx: number;
  setActiveImageIdx: (idx: number) => void;
  onClose: () => void;
  onBuyItem: (e: React.MouseEvent, item: any, redirect?: boolean) => void;
};

export const ProductsDetailModal = ({
  selectedDetailProduct,
  activeImageIdx,
  setActiveImageIdx,
  onClose,
  onBuyItem,
}: ProductsDetailModalProps) => {
  if (!selectedDetailProduct) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity duration-200 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl transition-[opacity,transform] duration-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          aria-label="Đóng modal sản phẩm"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors font-bold cursor-pointer"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Gallery Viewer */}
          <div className="space-y-3">
            <div className="h-64 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
              {getProductImage(selectedDetailProduct, activeImageIdx) ? (
                <Image
                  src={getProductImage(selectedDetailProduct, activeImageIdx)!}
                  alt={selectedDetailProduct.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                  className="max-h-full max-w-full object-contain rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 text-xs font-medium space-y-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

          {/* Info & CTA */}
          <div className="space-y-4">
            {selectedDetailProduct.category && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-emerald-50 px-2.5 py-1 rounded-full">
                {selectedDetailProduct.category}
              </span>
            )}
            <h3 className="text-xl font-extrabold text-gray-900 leading-snug">
              {selectedDetailProduct.name}
            </h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              {selectedDetailProduct.description || 'Chưa có mô tả sản phẩm.'}
            </p>

            <div className="text-xl font-black text-secondary">
              {selectedDetailProduct.price.toLocaleString('vi-VN')} đ
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  onBuyItem(e, selectedDetailProduct, true);
                  onClose();
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-md cursor-pointer"
              >
                Mua Ngay
              </button>
              <button
                type="button"
                onClick={(e) => {
                  onBuyItem(e, selectedDetailProduct, false);
                  onClose();
                }}
                className="px-4 py-3 border border-gray-300 hover:border-emerald-600 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Thêm Giỏ Hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
