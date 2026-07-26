import Image from 'next/image';

export const ProductImageCollage = ({ item }: { item: any }) => {
  const images: string[] = Array.isArray(item?.images) && item.images.length > 0 
    ? item.images.filter(Boolean)
    : item?.image 
      ? [item.image] 
      : item?.imageUrl 
        ? [item.imageUrl] 
        : [];

  const count = images.length;

  if (count === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-400 text-xs font-medium space-y-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Không có hình ảnh</span>
      </div>
    );
  }

  if (count === 1) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src={images[0]!}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          unoptimized
          className="object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="w-full h-full grid grid-cols-2 gap-1 rounded-xl overflow-hidden bg-gray-100 p-0.5">
        <div className="h-full w-full relative overflow-hidden rounded-l-lg">
          <Image src={images[0]!} alt={item.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" unoptimized className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="h-full w-full relative overflow-hidden rounded-r-lg">
          <Image src={images[1]!} alt={`${item.name} 2`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" unoptimized className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="w-full h-full grid grid-cols-2 gap-1 rounded-xl overflow-hidden bg-gray-100 p-0.5">
        <div className="h-full w-full relative overflow-hidden rounded-l-lg">
          <Image src={images[0]!} alt={item.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" unoptimized className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="grid grid-rows-2 gap-1 h-full w-full">
          <div className="h-full w-full relative overflow-hidden rounded-tr-lg">
            <Image src={images[1]!} alt={`${item.name} 2`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" unoptimized className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="h-full w-full relative overflow-hidden rounded-br-lg">
            <Image src={images[2]!} alt={`${item.name} 3`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" unoptimized className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        </div>
      </div>
    );
  }

  if (count === 4) {
    return (
      <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1 rounded-xl overflow-hidden bg-gray-100 p-0.5">
        <div className="h-full w-full relative overflow-hidden rounded-tl-lg">
          <Image src={images[0]!} alt={item.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" unoptimized className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="h-full w-full relative overflow-hidden rounded-tr-lg">
          <Image src={images[1]!} alt={`${item.name} 2`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" unoptimized className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="h-full w-full relative overflow-hidden rounded-bl-lg">
          <Image src={images[2]!} alt={`${item.name} 3`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" unoptimized className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="h-full w-full relative overflow-hidden rounded-br-lg">
          <Image src={images[3]!} alt={`${item.name} 4`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" unoptimized className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      </div>
    );
  }

  const extraCount = count - 4;
  return (
    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1 rounded-xl overflow-hidden bg-gray-100 p-0.5">
      <div className="h-full w-full relative overflow-hidden rounded-tl-lg">
        <Image src={images[0]!} alt={item.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" unoptimized className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="h-full w-full relative overflow-hidden rounded-tr-lg">
        <Image src={images[1]!} alt={`${item.name} 2`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" unoptimized className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="h-full w-full relative overflow-hidden rounded-bl-lg">
        <Image src={images[2]!} alt={`${item.name} 3`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" unoptimized className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="h-full w-full relative overflow-hidden rounded-br-lg">
        <Image src={images[3]!} alt={`${item.name} 4`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" unoptimized className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white font-black text-sm tracking-wider">
          +{extraCount}
        </div>
      </div>
    </div>
  );
};
