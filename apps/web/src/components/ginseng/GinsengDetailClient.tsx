'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/lib/I18nNavigation';
import { toast } from 'sonner';
import { useCatalogPlant, useCatalogPlants } from '@/hooks/queries/useCatalog';
import { addToCart } from '@/utils/cart';

type GinsengDetailClientProps = {
  id: string;
  locale: string;
  isLoggedIn?: boolean;
  initialData?: any;
};

export const GinsengDetailClient = ({ id, locale, isLoggedIn, initialData }: GinsengDetailClientProps) => {
  const { data: plant, isLoading, isError } = useCatalogPlant(id, initialData);
  const { data: allPlants } = useCatalogPlants();
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const relatedPlants = Array.isArray(allPlants)
    ? allPlants.filter((item: any) => item.id !== id).slice(0, 6)
    : [];

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 animate-pulse space-y-8">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-96 bg-gray-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-12 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !plant) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Không tìm thấy thông tin sâm giống</h2>
        <p className="text-gray-500 text-sm">Cây giống này có thể đã hết suất hoặc đường dẫn không chính xác.</p>
        <Link
          href={`/${locale}/ginseng`}
          className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors shadow-md"
        >
          Quay lại danh sách cây sâm
        </Link>
      </div>
    );
  }

  const images = Array.isArray(plant.images) && plant.images.length > 0
    ? plant.images
    : [plant.image || plant.imageUrl || '/assets/images/logo_ruou_sam.png'];
  const currentImage = images[activeImageIdx] || images[0];

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      window.location.href = `/${locale}/sign-in?reason=ginseng`;
      return;
    }
    addToCart(
      {
        id: plant.id || `GINSENG-${plant.name}`,
        name: plant.name,
        price: plant.price,
        image: currentImage,
        category: 'Cây giống',
      },
      quantity
    );
    toast.success(`Đã thêm ${quantity} cây "${plant.name}" vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      window.location.href = `/${locale}/sign-in?reason=ginseng`;
      return;
    }
    addToCart(
      {
        id: plant.id || `GINSENG-${plant.name}`,
        name: plant.name,
        price: plant.price,
        image: currentImage,
        category: 'Cây giống',
      },
      quantity
    );
    window.location.href = `/${locale}/cart`;
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href={`/${locale}`} className="hover:text-gray-900 transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href={`/${locale}/ginseng`} className="hover:text-gray-900 transition-colors">Vườn Sâm Giống</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold truncate max-w-xs">{plant.name}</span>
        </nav>

        {/* Details Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Gallery View */}
          <div className="space-y-4">
            <div className="h-80 sm:h-96 bg-emerald-50/40 rounded-2xl border border-emerald-100 relative overflow-hidden flex items-center justify-center p-4">
              <Image
                src={currentImage || '/assets/images/logo_ruou_sam.png'}
                alt={plant.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
                className="max-h-full max-w-full object-contain rounded-xl"
              />
            </div>

            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-1">
                {images.map((imgUrl: string, idx: number) => (
                  <button
                    type="button"
                    key={imgUrl}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all cursor-pointer relative ${
                      activeImageIdx === idx ? 'border-primary ring-2 ring-emerald-100' : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={imgUrl} alt={`Góc ${idx + 1}`} fill sizes="64px" unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Plant Info & Care Specs */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  {plant.ageYears ? `Sâm ${plant.ageYears} Tuổi` : 'Cây giống Sâm Ngọc Linh'}
                </span>
                {plant.origin && (
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    📍 {plant.origin}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug">
                {plant.name}
              </h1>

              {plant.code && (
                <p className="text-xs text-gray-400 font-mono">
                  Mã số luống/cây: <span className="text-gray-700 font-semibold">{plant.code}</span>
                </p>
              )}

              <div className="text-3xl font-black text-emerald-800">
                {(plant.price || 0).toLocaleString('vi-VN')} đ
              </div>

              {/* Plant Specs */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 font-medium block">Số năm tuổi:</span>
                  <span className="font-bold text-gray-800">{plant.ageYears ? `${plant.ageYears} năm` : 'Tiêu chuẩn'}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Vườn canh tác:</span>
                  <span className="font-bold text-gray-800">{plant.gardenLocation || 'Vườn Nam Trà My, Kon Tum'}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Quy trình chăm sóc:</span>
                  <span className="font-bold text-emerald-700">Hữu cơ 100%</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Bảo hiểm / Bảo vệ:</span>
                  <span className="font-bold text-emerald-700">Có cam kết bảo vệ</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Thông tin cây trồng</h4>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  {plant.description || 'Chưa có thông tin mô tả chi tiết cho sản phẩm này.'}
                </p>
              </div>

              {/* Quantity selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase text-gray-400 tracking-wider block">Số lượng cây đăng ký</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 text-gray-600 hover:bg-gray-200 font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-bold text-gray-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-2 text-gray-600 hover:bg-gray-200 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 border-2 border-primary text-primary hover:bg-emerald-50 font-bold py-3.5 px-6 rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                Thêm Vào Giỏ Hàng
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-6 rounded-xl text-xs transition-colors shadow-lg cursor-pointer text-center"
              >
                Đăng Ký Trồng Ngay
              </button>
            </div>
          </div>
        </div>

        {/* Related Plants Section */}
        {relatedPlants.length > 0 && (
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-extrabold text-gray-900 text-center">
              Các sản phẩm & Cây giống khác
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedPlants.map((relPlant: any) => {
                const relImg = relPlant.image || relPlant.imageUrl || '/assets/images/logo_ruou_sam.png';
                return (
                  <div
                    key={relPlant.id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <Link
                      href={`/${locale}/ginseng/${relPlant.id}`}
                      className="block relative w-full h-48 bg-gray-50 p-4"
                    >
                      <img
                        src={relImg}
                        alt={relPlant.name}
                        className="w-full h-full object-contain"
                      />
                    </Link>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <Link
                          href={`/${locale}/ginseng/${relPlant.id}`}
                          className="font-bold text-xs text-gray-900 uppercase line-clamp-2 hover:text-emerald-700 transition-colors"
                        >
                          {relPlant.name}
                        </Link>
                        <p className="text-emerald-700 font-extrabold text-sm">
                          {(relPlant.price || 0).toLocaleString('vi-VN')} đ
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        <Link
                          href={`/${locale}/ginseng/${relPlant.id}`}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold transition-colors text-center"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
