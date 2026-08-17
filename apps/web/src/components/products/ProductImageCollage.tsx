'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export type ProductImageCollageProps = {
  item: {
    name?: string;
    image?: string;
    imageUrl?: string;
    images?: string[];
  };
  sizes?: string;
};

export const ProductImageCollage = ({
  item,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw',
}: ProductImageCollageProps) => {
  const t = useTranslations('common');
  const images: string[] =
    Array.isArray(item?.images) && item.images.length > 0
      ? item.images.filter(Boolean)
      : item?.image
        ? [item.image]
        : item?.imageUrl
          ? [item.imageUrl]
          : [];

  const count = images.length;
  const name = item?.name ?? '—';

  if (count === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-1 text-xs font-medium text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 opacity-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>{t('noImage')}</span>
      </div>
    );
  }

  if (count === 1) {
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <Image
          src={images[0]!}
          alt={name}
          fill
          sizes={sizes}
          unoptimized
          className="rounded-xl object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="grid h-full w-full grid-cols-2 gap-1 overflow-hidden rounded-xl bg-gray-100 p-0.5">
        <div className="relative h-full w-full overflow-hidden rounded-l-lg">
          <Image
            src={images[0]!}
            alt={name}
            fill
            sizes={sizes}
            unoptimized
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="relative h-full w-full overflow-hidden rounded-r-lg">
          <Image
            src={images[1]!}
            alt={`${name} 2`}
            fill
            sizes={sizes}
            unoptimized
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="grid h-full w-full grid-cols-2 gap-1 overflow-hidden rounded-xl bg-gray-100 p-0.5">
        <div className="relative h-full w-full overflow-hidden rounded-l-lg">
          <Image
            src={images[0]!}
            alt={name}
            fill
            sizes={sizes}
            unoptimized
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="grid h-full w-full grid-rows-2 gap-1">
          <div className="relative h-full w-full overflow-hidden rounded-tr-lg">
            <Image
              src={images[1]!}
              alt={`${name} 2`}
              fill
              sizes={sizes}
              unoptimized
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="relative h-full w-full overflow-hidden rounded-br-lg">
            <Image
              src={images[2]!}
              alt={`${name} 3`}
              fill
              sizes={sizes}
              unoptimized
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    );
  }

  if (count === 4) {
    return (
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-xl bg-gray-100 p-0.5">
        <div className="relative h-full w-full overflow-hidden rounded-tl-lg">
          <Image
            src={images[0]!}
            alt={name}
            fill
            sizes={sizes}
            unoptimized
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="relative h-full w-full overflow-hidden rounded-tr-lg">
          <Image
            src={images[1]!}
            alt={`${name} 2`}
            fill
            sizes={sizes}
            unoptimized
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="relative h-full w-full overflow-hidden rounded-bl-lg">
          <Image
            src={images[2]!}
            alt={`${name} 3`}
            fill
            sizes={sizes}
            unoptimized
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="relative h-full w-full overflow-hidden rounded-br-lg">
          <Image
            src={images[3]!}
            alt={`${name} 4`}
            fill
            sizes={sizes}
            unoptimized
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>
    );
  }

  const extraCount = count - 4;
  return (
    <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-xl bg-gray-100 p-0.5">
      <div className="relative h-full w-full overflow-hidden rounded-tl-lg">
        <Image
          src={images[0]!}
          alt={name}
          fill
          sizes={sizes}
          unoptimized
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="relative h-full w-full overflow-hidden rounded-tr-lg">
        <Image
          src={images[1]!}
          alt={`${name} 2`}
          fill
          sizes={sizes}
          unoptimized
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="relative h-full w-full overflow-hidden rounded-bl-lg">
        <Image
          src={images[2]!}
          alt={`${name} 3`}
          fill
          sizes={sizes}
          unoptimized
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="relative h-full w-full overflow-hidden rounded-br-lg">
        <Image
          src={images[3]!}
          alt={`${name} 4`}
          fill
          sizes={sizes}
          unoptimized
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-black tracking-wider text-white backdrop-blur-xs">
          +{extraCount}
        </div>
      </div>
    </div>
  );
};
