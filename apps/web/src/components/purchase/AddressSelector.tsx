type AddressSelectorProps = {
  addresses: any[];
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string) => void;
  isAddAddressOpen: boolean;
  setIsAddAddressOpen: (open: boolean) => void;
  newAddrName: string;
  setNewAddrName: (name: string) => void;
  newAddrPhone: string;
  setNewAddrPhone: (phone: string) => void;
  newAddrDetails: string;
  setNewAddrDetails: (details: string) => void;
  onAddAddressSubmit: (e: React.FormEvent) => void;
};

export const AddressSelector = ({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  isAddAddressOpen,
  setIsAddAddressOpen,
  newAddrName,
  setNewAddrName,
  newAddrPhone,
  setNewAddrPhone,
  newAddrDetails,
  setNewAddrDetails,
  onAddAddressSubmit,
}: AddressSelectorProps) => {
  return (
    <div className="space-y-3 border-t border-gray-150 pt-5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
          Địa chỉ nhận hàng sản phẩm *
        </span>
        <button
          type="button"
          onClick={() => setIsAddAddressOpen(!isAddAddressOpen)}
          className="text-xs font-bold text-[#1C3F24] hover:underline cursor-pointer"
        >
          {isAddAddressOpen ? '✕ Hủy thêm' : '+ Thêm địa chỉ mới'}
        </button>
      </div>

      {isAddAddressOpen ? (
        <form onSubmit={onAddAddressSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <h4 className="font-bold text-xs text-gray-800">Thêm địa chỉ giao hàng</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label htmlFor="quickAddrNameInput" className="sr-only">Họ tên người nhận</label>
              <input
                id="quickAddrNameInput"
                type="text"
                required
                placeholder="Họ tên người nhận *"
                value={newAddrName}
                onChange={(e) => setNewAddrName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
              />
            </div>
            <div>
              <label htmlFor="quickAddrPhoneInput" className="sr-only">Số điện thoại</label>
              <input
                id="quickAddrPhoneInput"
                type="tel"
                required
                placeholder="Số điện thoại *"
                value={newAddrPhone}
                onChange={(e) => setNewAddrPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="quickAddrDetailsInput" className="sr-only">Địa chỉ chi tiết</label>
              <input
                id="quickAddrDetailsInput"
                type="text"
                required
                placeholder="Địa chỉ chi tiết (Số nhà, đường, Phường/Xã, Quận/Huyện) *"
                value={newAddrDetails}
                onChange={(e) => setNewAddrDetails(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="submit"
              className="bg-[#1C3F24] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              Lưu địa chỉ
            </button>
          </div>
        </form>
      ) : addresses.length === 0 ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
          Bạn chưa có địa chỉ giao hàng nào. Vui lòng bấm &ldquo;+ Thêm địa chỉ mới&rdquo; ở trên.
        </div>
      ) : (
        <div className="space-y-2">
          {addresses.map((addr) => {
            const isSelected = selectedAddressId === addr.id;

            return (
              <div
                key={addr.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedAddressId(addr.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedAddressId(addr.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-[#1C3F24] bg-emerald-50/50 ring-2 ring-[#1C3F24]/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="space-y-0.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{addr.name}</span>
                    <span className="text-gray-500">({addr.phone})</span>
                    {addr.isDefault && (
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-[11px] line-clamp-1">{addr.address}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#1C3F24] bg-[#1C3F24]' : 'border-gray-300'}`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
