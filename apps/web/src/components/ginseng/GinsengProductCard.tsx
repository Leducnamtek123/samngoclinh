import { ProductImageCollage } from '@/components/products/ProductImageCollage';
import { Button } from '@/components/ui';
import { formatVNDPrice } from '@/utils/formatters';

type GinsengProductCardProps = {
  item: any;
  onOpenDetail: (item: any) => void;
  onAddToCart?: (e: React.MouseEvent, item: any) => void;
  onQuickPurchase: (item: any) => void;
};

export const GinsengProductCard = ({
  item,
  onOpenDetail,
  onQuickPurchase,
}: GinsengProductCardProps) => {
  const hasMultiImages = item?.images && Array.isArray(item.images) && item.images.length > 1;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between group">
      {/* Product Image Panel */}
      <button 
        type="button"
        onClick={() => onOpenDetail(item)}
        className="relative w-full h-64 bg-muted flex items-center justify-center p-4 cursor-pointer text-left border-0"
      >
        <span className="absolute top-3 left-3 bg-primary/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">
          Trồng tại Kon Tum
        </span>

        {hasMultiImages && (
          <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{item.images.length} ảnh</span>
          </span>
        )}

        <ProductImageCollage item={item} />
      </button>

      {/* Details Panel */}
      <div className="p-5 space-y-4">
        <div className="space-y-2.5">
          <button 
            type="button"
            onClick={() => onOpenDetail(item)}
            className="font-extrabold text-foreground text-sm leading-snug line-clamp-2 min-h-[40px] uppercase group-hover:text-primary transition-colors cursor-pointer text-left block w-full border-0"
          >
            {item.name}
          </button>
          <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold bg-muted/60 px-2 py-1.5 rounded-lg border border-border">
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Tuổi: {item.ageYear || 1} năm
            </span>
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Còn: {item.stock || 0} cây
            </span>
          </div>
        </div>

        <div className="text-primary font-black text-base pt-1">
          {formatVNDPrice(item.price)}
        </div>

        {/* Actions - Ginseng Planting only has Buy Now */}
        <div className="pt-2">
          <Button
            type="button"
            variant="default"
            onClick={() => onQuickPurchase(item)}
            className="w-full font-bold"
          >
            Mua ngay
          </Button>
        </div>
      </div>
    </div>
  );
};
