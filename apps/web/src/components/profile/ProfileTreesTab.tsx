import { Link } from '@/libs/I18nNavigation';

type ProfileTreesTabProps = {
  wallet: any;
  safeTrees: any[];
};

export const ProfileTreesTab = ({ wallet, safeTrees }: ProfileTreesTabProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Tài sản của tôi</h3>
        <p className="text-xs text-gray-400 font-medium">Quản lý số dư Điểm Sâm và chi tiết cây sâm sở hữu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-secondary/5 border border-secondary/15 rounded-xl p-5 flex flex-col justify-between">
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Ví Điểm Số</span>
          <h4 className="text-3xl font-black text-secondary mt-2">
            {wallet?.balancePoint?.toLocaleString('vi-VN') || 0}
          </h4>
          <p className="text-[10px] text-gray-500 mt-1">Điểm khả dụng (Điểm Sâm)</p>
        </div>
        <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 flex flex-col justify-between">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Cây giống sở hữu</span>
          <h4 className="text-3xl font-black text-primary mt-2">
            {wallet?.treesOwned || safeTrees.length} Cây
          </h4>
          <p className="text-[10px] text-gray-500 mt-1">Cây giống kỹ thuật số trên hệ thống</p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-gray-900 text-sm">Danh sách cây giống chi tiết</h4>
        {safeTrees.length === 0 ? (
          <p className="text-sm text-gray-500">Bạn chưa sở hữu cây sâm Ngọc Linh nào.</p>
        ) : (
          <div className="border border-gray-150 rounded-xl divide-y divide-gray-100 overflow-hidden bg-gray-50/30">
            {safeTrees.map((tree: any, idx: number) => (
              <div key={tree.id || tree.code || tree.ageYear || tree.name} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V9m0 0a4 4 0 10-8 0m8 0a4 4 0 118 0M7 21h10" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Cây Sâm Ngọc Linh {tree.ageYear || 4} Năm Tuổi</p>
                    <p className="text-[10px] text-gray-400">Mã cây: {tree.code || `SAM-0${idx + 1}`}</p>
                  </div>
                </div>
                <Link
                  href={`/trace/${tree.code || `SAM-0${idx + 1}`}`}
                  className="bg-white border border-primary text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <span>Truy xuất QR</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
