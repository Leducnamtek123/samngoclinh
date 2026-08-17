import type React from 'react';
import { ProductImageCollage } from '@/components/products/ProductImageCollage';
import { Button } from '@/components/ui';
import type { GinsengPlantItem, ProductItem } from '@/types';
import { formatVNDPrice } from '@/utils/formatters';

type GinsengProductCardProps = {
  item: GinsengPlantItem | ProductItem;
  onOpenDetail: (item: GinsengPlantItem | ProductItem) => void;
  onAddToCart?: (e: React.MouseEvent, item: GinsengPlantItem | ProductItem) => void;
  onQuickPurchase: (item: GinsengPlantItem | ProductItem) => void;
};

export const GinsengProductCard = ({
  item,
  onOpenDetail,
  onQuickPurchase,
}: GinsengProductCardProps) => {
  const hasMultiImages = item?.images && Array.isArray(item.images) && item.images.length > 1;

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-lg">
      {/* Product Image Panel */}
      <button
        type="button"
        onClick={() => {
          onOpenDetail(item);
        }}
        className="relative flex h-64 w-full cursor-pointer items-center justify-center border-0 bg-muted p-4 text-left"
      >
        <span className="absolute top-3 left-3 z-10 rounded-full bg-primary/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-xs">
          Trồng tại Kon Tum
        </span>

        {hasMultiImages && item.images && (
          <span className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{item.images.length} ảnh</span>
          </span>
        )}

        <ProductImageCollage item={item} />
      </button>

      {/* Details Panel */}
      <div className="space-y-4 p-5">
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => {
              onOpenDetail(item);
            }}
            className="line-clamp-2 block min-h-[40px] w-full cursor-pointer border-0 text-left text-sm leading-snug font-extrabold text-foreground uppercase transition-colors group-hover:text-primary"
          >
            {item.name}
          </button>
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/60 px-2 py-1.5 text-[10px] font-bold text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Tuổi: {item.ageYear || 1} năm
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Còn: {item.stock || 0} cây
            </span>
          </div>
        </div>

        <div className="pt-1 text-base font-black text-primary">{formatVNDPrice(item.price)}</div>

        {/* Actions - Ginseng Planting only has Buy Now */}
        <div className="pt-2">
          <Button
            type="button"
            variant="default"
            onClick={() => {
              onQuickPurchase(item);
            }}
            className="w-full font-bold"
          >
            Mua ngay
          </Button>
        </div>
      </div>
    </div>
  );
};
