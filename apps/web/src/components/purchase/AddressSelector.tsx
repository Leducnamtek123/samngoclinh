import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

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
        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider block">
          Địa chỉ nhận hàng sản phẩm *
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsAddAddressOpen(!isAddAddressOpen)}
          className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline"
        >
          {isAddAddressOpen ? '✕ Hủy thêm' : '+ Thêm địa chỉ mới'}
        </Button>
      </div>

      {isAddAddressOpen ? (
        <form onSubmit={onAddAddressSubmit} className="bg-gray-50/70 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-3">
          <h4 className="font-bold text-xs text-gray-800 dark:text-gray-200">Thêm địa chỉ giao hàng</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label htmlFor="quickAddrNameInput" className="text-xs font-medium text-gray-600 dark:text-gray-400">Họ tên người nhận</label>
              <Input
                id="quickAddrNameInput"
                type="text"
                value={newAddrName}
                onChange={(e) => setNewAddrName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="quickAddrPhoneInput" className="text-xs font-medium text-gray-600 dark:text-gray-400">Số điện thoại</label>
              <Input
                id="quickAddrPhoneInput"
                type="tel"
                value={newAddrPhone}
                onChange={(e) => setNewAddrPhone(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label htmlFor="quickAddrDetailsInput" className="text-xs font-medium text-gray-600 dark:text-gray-400">Địa chỉ chi tiết</label>
              <Input
                id="quickAddrDetailsInput"
                type="text"
                value={newAddrDetails}
                onChange={(e) => setNewAddrDetails(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <Button
              type="submit"
              variant="default"
              size="sm"
            >
              Lưu địa chỉ
            </Button>
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
                    : 'border-gray-200 hover:border-gray-300 bg-white dark:bg-gray-900'
                }`}
              >
                <div className="space-y-0.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-gray-100">{addr.name}</span>
                    <span className="text-gray-500">({addr.phone})</span>
                    {addr.isDefault && (
                      <Badge variant="secondary">Mặc định</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-[11px] line-clamp-1">{addr.address}</p>
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
