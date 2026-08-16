import { Link } from '@/lib/I18nNavigation';
import { Sprout, QrCode, Video, Heart, Droplets, MapPin, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';

type ProfileTreesTabProps = {
  wallet: any;
  safeTrees: any[];
};

export const ProfileTreesTab = ({ wallet, safeTrees }: ProfileTreesTabProps) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-600" />
            <span>Sổ Tay Vườn Sâm & Tài Sản Canh Tác</span>
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Quản lý số dư Điểm Sâm và chi tiết cây sâm sở hữu trên hệ thống
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <MapPin className="w-3.5 h-3.5" />
          <span>Nông trường Măng Ri (Độ cao 2.100m)</span>
        </div>
      </div>

      {/* Asset Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/10 border border-amber-200/80 dark:border-amber-800/40 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
          <span className="text-[11px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Ví Điểm Thưởng & Tích Lũy
          </span>
          <div className="my-2">
            <h4 className="text-3xl font-black text-amber-900 dark:text-amber-200">
              {(wallet?.balancePoint || 0).toLocaleString('vi-VN')}
            </h4>
            <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">Điểm Sâm khả dụng</span>
          </div>
          <p className="text-[10px] text-gray-500">Dùng để đổi quà, voucher giảm giá và dịch vụ.</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/10 border border-emerald-200/80 dark:border-emerald-800/40 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
          <span className="text-[11px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5" />
            Cây Sâm Sở Hữu
          </span>
          <div className="my-2">
            <h4 className="text-3xl font-black text-emerald-900 dark:text-emerald-200">
              {wallet?.treesOwned || safeTrees.length} <span className="text-lg font-bold">Cây</span>
            </h4>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">Cây giống kỹ thuật số</span>
          </div>
          <p className="text-[10px] text-gray-500">Chăm sóc tự nhiên dưới tán rừng nguyên sinh Kon Tum.</p>
        </div>
      </div>

      {/* Tree List Grid */}
      <div className="space-y-4">
        <h4 className="font-extrabold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-2">
          <span>Danh Sách Cây Sâm Chi Tiết</span>
          {safeTrees.length > 0 && (
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 text-[10px] font-black px-2 py-0.5">
              {safeTrees.length} cây
            </Badge>
          )}
        </h4>

        {safeTrees.length === 0 ? (
          <EmptyState
            title="Bạn chưa sở hữu cây sâm Ngọc Linh nào"
            description="Hãy tham gia chương trình sở hữu cây giống để đồng hành chăm sóc và theo dõi quá trình sinh trưởng tại nông trường."
            icon={Sprout}
            actionLabel="Khám phá gói trồng sâm"
            onAction={() => {
              if (typeof window !== 'undefined') window.location.assign('/ginseng');
            }}
            actionVariant="default"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safeTrees.map((tree: any, idx: number) => {
              const code = tree.code || `SAM-0${idx + 1}`;
              const age = tree.ageYear || 4;

              return (
                <div
                  key={tree.id || tree.treeId || tree.code || tree.name}
                  className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-[box-shadow,border-color] space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="size-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-black text-sm border border-emerald-200 shrink-0">
                          {age}T
                        </div>
                        <div>
                          <h5 className="font-extrabold text-gray-900 dark:text-gray-100 text-sm leading-snug">
                            {tree.name || `Cây Sâm Ngọc Linh (${age} Năm Tuổi)`}
                          </h5>
                          <p className="text-[11px] text-gray-400 font-mono font-medium">Mã cây: {code}</p>
                        </div>
                      </div>

                      <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 text-[10px] font-bold py-0.5 flex items-center gap-1">
                        <Heart className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                        {tree.healthStatus || tree.health || 'Khỏe mạnh'}
                      </Badge>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-800/60 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Vị trí luống</span>
                        <span className="font-bold text-gray-700 dark:text-gray-300">{tree.bedName || tree.bedCode || 'Luống vườn'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Nông trường</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <Droplets className="w-3 h-3" />
                          {tree.gardenName || 'Nông trường Măng Ri'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <Link
                      href={`/trace/${code}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-emerald-200/60"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Truy xuất QR</span>
                    </Link>
                    <Link
                      href="/ginseng"
                      className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-gray-300 transition-colors"
                      title="Xem bản đồ luống"
                    >
                      <Video className="w-4 h-4 text-emerald-600" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
