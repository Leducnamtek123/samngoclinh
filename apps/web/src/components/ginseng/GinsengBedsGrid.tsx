import React from 'react';
import { EmptyState } from '@/components/common';
import { Badge } from '@/components/ui';
import { Sprout, MapPin, Calendar } from 'lucide-react';

export interface GinsengBedsGridProps {
  beds: any[];
}

export const GinsengBedsGrid: React.FC<GinsengBedsGridProps> = ({ beds }) => {
  if (!beds || beds.length === 0) {
    return (
      <EmptyState
        title="Chưa có luống sâm"
        description="Chưa tìm thấy luống sâm nào phù hợp với lựa chọn của bạn."
        icon={Sprout}
      />
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-extrabold text-gray-900">
        Danh sách Luống Canh Tác Sâm Công Khai tại Nông Trại
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {beds.map((bed: any) => (
          <div
            key={bed.code || bed.id}
            className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 shadow-xs hover:border-primary transition-colors"
          >
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-sm text-primary">Luống #{bed.code}</span>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-none">
                {bed.ageYear} tuổi
              </Badge>
            </div>
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{bed.gardenName || bed.gardenLocation || 'Vườn Nam Trà My, Kon Tum'}</span>
            </p>
            <div className="text-xs text-gray-600 space-y-1.5">
              <p className="flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Số cây sâm: <strong className="font-bold text-gray-800">{bed.treeCount || 50} cây</strong></span>
              </p>
              <p className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  Ngày trồng:{' '}
                  <strong className="font-bold text-gray-800">
                    {bed.plantedAt ? new Date(bed.plantedAt).toLocaleDateString('vi-VN') : 'Mới trồng'}
                  </strong>
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
