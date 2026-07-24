type TradingSellFormProps = {
  isLoggedIn?: boolean;
  isVerified: boolean;
  userTrees: any[];
  treesLoading: boolean;
  selectedTreeId: string;
  setSelectedTreeId: (id: string) => void;
  price: string;
  setPrice: (val: string) => void;
  durationMinutes: string;
  setDurationMinutes: (val: string) => void;
  payPoints: boolean;
  setPayPoints: (val: boolean) => void;
  payBank: boolean;
  setPayBank: (val: boolean) => void;
  note: string;
  setNote: (val: string) => void;
  formError: string;
  formSuccess: string;
  createListingMutation: any;
  onSubmit: (e: React.FormEvent) => void;
};

export const TradingSellForm = ({
  isLoggedIn = true,
  isVerified,
  userTrees,
  treesLoading,
  selectedTreeId,
  setSelectedTreeId,
  price,
  setPrice,
  durationMinutes,
  setDurationMinutes,
  payPoints,
  setPayPoints,
  payBank,
  setPayBank,
  note,
  setNote,
  formError,
  formSuccess,
  createListingMutation,
  onSubmit,
}: TradingSellFormProps) => {
  return (
    <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#1C3F24]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Khởi Tạo Lệnh Đăng Bán Cây Sâm (P2P)</span>
        </h3>
        <p className="text-xs text-gray-500 font-medium">Đăng bán cây sâm trong vườn của bạn trực tiếp cho các nhà đầu tư khác.</p>
      </div>

      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl font-bold">
          {formError}
        </div>
      )}

      {formSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-xl font-bold">
          {formSuccess}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Tree Selection */}
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="tree-select" className="font-bold text-gray-700 block">Chọn cây sâm để bán *</label>
          {treesLoading ? (
            <div className="h-10 bg-gray-100 rounded-xl animate-pulse"></div>
          ) : !isLoggedIn ? (
            <p className="text-gray-500 font-medium">Vui lòng đăng nhập để xem danh sách cây sâm của bạn.</p>
          ) : userTrees.length === 0 ? (
            <p className="text-amber-600 font-medium">Bạn chưa sở hữu cây sâm nào trong vườn. Vui lòng mua cây trước khi đăng bán.</p>
          ) : (
            <select
              id="tree-select"
              value={selectedTreeId}
              onChange={(e) => setSelectedTreeId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white font-semibold text-gray-800 focus:ring-2 focus:ring-[#1C3F24]/20 focus:border-[#1C3F24]"
            >
              <option value="">-- Chọn cây sâm từ vườn --</option>
              {userTrees.map((t: any) => (
                <option key={t.id} value={t.id}>
                  {t.treeCode || t.id.slice(0, 8)} - Sâm {t.age || 1} năm ({t.gardenName || 'Vườn Trà Linh'})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Selling Price */}
        <div className="space-y-1.5">
          <label htmlFor="selling-price-input" className="font-bold text-gray-700 block">Giá bán mong muốn (VNĐ) *</label>
          <input
            id="selling-price-input"
            type="number"
            min="100000"
            step="50000"
            required
            placeholder="Ví dụ: 1500000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-[#1C3F24]/20 focus:border-[#1C3F24]"
          />
        </div>

        {/* Listing Duration */}
        <div className="space-y-1.5">
          <label htmlFor="duration-minutes-select" className="font-bold text-gray-700 block">Thời hạn lệnh bán *</label>
          <select
            id="duration-minutes-select"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white font-semibold text-gray-800 focus:ring-2 focus:ring-[#1C3F24]/20 focus:border-[#1C3F24]"
          >
            <option value="15">15 Phút</option>
            <option value="60">1 Giờ</option>
            <option value="1440">24 Giờ</option>
            <option value="10080">7 Ngày</option>
          </select>
        </div>

        {/* Payment Methods Checkboxes */}
        <div className="space-y-2 md:col-span-2">
          <span className="font-bold text-gray-700 block">Phương thức chấp nhận thanh toán *</span>
          <div className="flex gap-6">
            <label htmlFor="pay-points-checkbox" className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
              <input
                id="pay-points-checkbox"
                type="checkbox"
                checked={payPoints}
                onChange={(e) => setPayPoints(e.target.checked)}
                className="w-4 h-4 text-[#1C3F24] rounded border-gray-300 focus:ring-[#1C3F24]"
              />
              <span>Thanh toán bằng Điểm Sâm</span>
            </label>
            <label htmlFor="pay-bank-checkbox" className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
              <input
                id="pay-bank-checkbox"
                type="checkbox"
                checked={payBank}
                onChange={(e) => setPayBank(e.target.checked)}
                className="w-4 h-4 text-[#1C3F24] rounded border-gray-300 focus:ring-[#1C3F24]"
              />
              <span>Thanh toán Chuyển khoản VietQR</span>
            </label>
          </div>
        </div>

        {/* Note */}
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="note-textarea" className="font-bold text-gray-700 block">Ghi chú cho người mua</label>
          <textarea
            id="note-textarea"
            rows={2}
            placeholder="Mô tả thêm về tình trạng cây sâm, nguồn gốc, cam kết..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-800 focus:ring-2 focus:ring-[#1C3F24]/20 focus:border-[#1C3F24] resize-none"
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={createListingMutation.isPending || !isVerified}
          className="bg-[#1C3F24] hover:bg-emerald-900 text-white font-extrabold px-8 py-3.5 rounded-xl text-xs transition-colors shadow-md disabled:opacity-50 cursor-pointer"
        >
          {createListingMutation.isPending ? 'Đang tạo lệnh bán...' : 'Xác Nhận Đăng Bán Cây'}
        </button>
      </div>
    </form>
  );
};
