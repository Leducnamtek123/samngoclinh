'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/lib/I18nNavigation';
import { Sprout, CheckCircle2, Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClaimPlantModal } from './ClaimPlantModal';

export interface FreeTreeSlot {
  id: string;
  plantCatalog?: {
    name?: string;
    description?: string;
    ageYear?: number;
  };
  [key: string]: unknown;
}

type FreeTreeOfferGridProps = {
  slots: FreeTreeSlot[];
  token?: string;
};

export function FreeTreeOfferGrid({ slots, token }: FreeTreeOfferGridProps) {
  const [selectedItem, setSelectedItem] = useState<FreeTreeSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8";

  const handleClaimClick = (slot: FreeTreeSlot) => {
    setSelectedItem(slot);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="group bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-2xl hover:-translate-y-1 transition-[box-shadow,transform] duration-300 flex flex-col justify-between"
          >
            {/* Plant Image Container */}
            <div className="relative h-64 bg-slate-100 overflow-hidden">
              <Image
                src={imageUrl}
                alt={slot.plantCatalog?.name || "Sâm Ngọc Linh"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                unoptimized
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              {/* Top Overlay Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-primary/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                <span>{slot.plantCatalog?.ageYear || 1} Năm Tuổi</span>
              </div>

              {/* Bottom Image Tag */}
              <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold drop-shadow-sm flex items-center justify-between">
                <span className="bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg">Mã số: SNG-{slot.id.slice(0, 4).toUpperCase()}</span>
                <span className="bg-emerald-600/90 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider">Hợp lệ</span>
              </div>
            </div>

            {/* Plant Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-emerald-800 transition-colors line-clamp-1">
                  {slot.plantCatalog?.name || "Sâm Ngọc Linh 2026"}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed font-normal">
                  {slot.plantCatalog?.description || "Gói sở hữu cây sâm thật được chăm sóc trực tiếp tại vườn sâm chuẩn nguồn gốc Kon Tum."}
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Chăm sóc chuẩn sinh học tại vườn</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Cập nhật nhật ký tăng trưởng định kỳ</span>
                </div>
              </div>

              {/* Pricing Block */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <Gift className="w-4 h-4 text-amber-600" />
                  <span>Gói chăm sóc</span>
                </div>
                <div className="text-right">
                  <span className="text-[#D97706] font-black text-base uppercase tracking-tight block">Miễn phí</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">Ưu đãi 100%</span>
                </div>
              </div>

              {/* Action CTA Button */}
              <div className="pt-1">
                {token ? (
                  <Button
                    type="button"
                    onClick={() => handleClaimClick(slot)}
                    className="group/btn flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-primary-hover active:bg-emerald-950 text-white rounded-2xl font-bold text-xs transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <span>Nhận cây ngay</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Link
                    href="/sign-in?reason=campaign"
                    className="group/btn flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-primary-hover active:bg-emerald-950 text-white rounded-2xl font-bold text-xs transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    <span>Đăng nhập để nhận</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Claim Plant Modal */}
      <ClaimPlantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
      />
    </>
  );
}
