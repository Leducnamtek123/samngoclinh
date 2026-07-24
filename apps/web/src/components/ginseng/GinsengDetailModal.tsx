import Image from 'next/image';

type GinsengDetailModalProps = {
  selectedDetailProduct: any;
  activeImageIdx: number;
  setActiveImageIdx: (idx: number) => void;
  onClose: () => void;
  onBuyItem: (e: React.MouseEvent, item: any, redirect?: boolean) => void;
};

export const GinsengDetailModal = ({
  selectedDetailProduct,
  activeImageIdx,
  setActiveImageIdx,
  onClose,
  onBuyItem,
}: GinsengDetailModalProps) => {
  if (!selectedDetailProduct) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity duration-200 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl transition-[opacity,transform] duration-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          aria-label="Đóng chi tiết sản phẩm"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors font-bold cursor-pointer"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Gallery Viewer */}
          <div className="space-y-3">
            <div className="h-64 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
              <Image
                src={
                  (selectedDetailProduct.images && selectedDetailProduct.images[activeImageIdx]) ||
                  selectedDetailProduct.image ||
                  '/assets/images/logo_ruou_sam.png'
                }
                alt={selectedDetailProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
                className="max-h-full max-w-full object-contain rounded-xl"
              />
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
                      activeImageIdx === idx ? 'border-[#1C3F24] ring-2 ring-[#1C3F24]/20' : 'border-gray-200 opacity-70 hover:opacity-100'
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
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1C3F24] bg-emerald-50 px-2.5 py-1 rounded-full">
              Trồng tại Kon Tum • Chính Hãng
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 leading-snug">
              {selectedDetailProduct.name}
            </h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              {selectedDetailProduct.description || 'Sản phẩm sâm Ngọc Linh chuẩn nguồn gốc được kiểm định chất lượng nghiêm ngặt.'}
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
                className="flex-1 bg-[#1C3F24] hover:bg-[#1C3F24]/90 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-md cursor-pointer"
              >
                Mua Ngay
              </button>
              <button
                type="button"
                onClick={(e) => {
                  onBuyItem(e, selectedDetailProduct, false);
                  onClose();
                }}
                className="px-4 py-3 border border-gray-300 hover:border-[#1C3F24] text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
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
