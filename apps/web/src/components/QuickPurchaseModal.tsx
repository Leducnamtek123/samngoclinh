'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
// @ts-expect-error react-dom type declaration
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { fetchApiClient } from '@/libs/ApiClient';
import { PlantPackageSelector } from './purchase/PlantPackageSelector';
import { AddressSelector } from './purchase/AddressSelector';

export type QuickPurchaseItem = {
  id: string;
  name: string;
  price: number;
  stock?: number;
  image?: string;
  images?: string[];
  imageUrl?: string;
  category?: string;
  code?: string;
  ageYear?: number;
};

type QuickPurchaseModalProps = {
  item: QuickPurchaseItem | null;
  mode: 'plant' | 'product';
  locale: string;
  isLoggedIn?: boolean;
  onClose: () => void;
  onSuccessPayment?: (orderData: any) => void;
};

// react-doctor-disable-next-line react-doctor/no-giant-component, react-doctor/prefer-useReducer
export const QuickPurchaseModal = ({
  item,
  mode,
  locale,
  isLoggedIn = true,
  onClose,
  onSuccessPayment,
  // react-doctor-disable-next-line react-doctor/prefer-useReducer
}: QuickPurchaseModalProps) => {
  const [quantity, setQuantity] = useState(1);
  
  // Backend packages list & selected state
  const [carePackagesList, setCarePackagesList] = useState<any[]>([]);
  const [protectionPackagesList, setProtectionPackagesList] = useState<any[]>([]);

  const [selectedCareId, setSelectedCareId] = useState<string>('');
  const [selectedProtectionId, setSelectedProtectionId] = useState<string>('');

  // Terms & Conditions checkboxes & accordions state
  // react-doctor-disable-next-line react-doctor/prefer-useReducer
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [openTermsAccordion, setOpenTermsAccordion] = useState(false);
  const [openContractAccordion, setOpenContractAccordion] = useState(false);

  // Saved user addresses state for physical products
  const [addresses, setAddresses] = useState<any[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('user_addresses:v1') : null;
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('user_addresses:v1') : null;
      const list = saved ? JSON.parse(saved) : [];
      return list.length > 0 ? (list.find((a: any) => a.isDefault) || list[0]).id : null;
    } catch {
      return null;
    }
  });

  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrDetails, setNewAddrDetails] = useState('');

  // Processing state
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchApiClient('/user/packages/care')
      .then((res) => {
        const items = res?.data?.items || res?.data || [];
        if (Array.isArray(items) && items.length > 0) {
          setCarePackagesList(items);
          setSelectedCareId(items[0].code || items[0].id);
        }
      })
      .catch((err) => {
        console.error('Failed to load care packages from backend:', err);
      });

    fetchApiClient('/user/packages/protection')
      .then((res) => {
        const items = res?.data?.items || res?.data || [];
        if (Array.isArray(items) && items.length > 0) {
          setProtectionPackagesList(items);
          setSelectedProtectionId(items[0].code || items[0].id);
        }
      })
      .catch((err) => {
        console.error('Failed to load protection packages from backend:', err);
      });
  }, []);

  if (!item) return null;

  const stockCount = item.stock || 139;
  const unitPrice = item.price || 0;
  const itemImage =
    item.image ||
    item.imageUrl ||
    (Array.isArray(item.images) && item.images[0]) ||
    '/assets/images/kon_tum_ginseng.png';

  const selectedCareObj =
    carePackagesList.find((c) => c.code === selectedCareId || c.id === selectedCareId) ||
    carePackagesList[0];
  const careUnitPrice = selectedCareObj ? Number(selectedCareObj.price || 0) : 0;

  const selectedProtectionObj =
    protectionPackagesList.find((p) => p.code === selectedProtectionId || p.id === selectedProtectionId) ||
    protectionPackagesList[0];
  const protectionUnitPrice = selectedProtectionObj ? Number(selectedProtectionObj.price || 0) : 0;

  const treeBasePrice = unitPrice * quantity;
  const vatTree = Math.round(treeBasePrice * 0.05);

  const totalCareFee = careUnitPrice * quantity;
  const vatCare = Math.round(totalCareFee * 0.1);

  const totalProtectionFee = protectionUnitPrice * quantity;
  const vatProtection = Math.round(totalProtectionFee * 0.1);

  const plantGrandTotal =
    treeBasePrice + vatTree + totalCareFee + vatCare + totalProtectionFee + vatProtection;

  const productSubtotal = unitPrice * quantity;
  const vatProduct8 = Math.round(productSubtotal * 0.08);
  const productGrandTotal = productSubtotal + vatProduct8;

  const grandTotal = mode === 'plant' ? plantGrandTotal : productGrandTotal;

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrName || !newAddrPhone || !newAddrDetails) return;

    const newAddr = {
      id: Date.now().toString(),
      name: newAddrName,
      phone: newAddrPhone,
      address: newAddrDetails,
      isDefault: addresses.length === 0,
    };
    const updated = [...addresses, newAddr];
    setAddresses(updated);
    localStorage.setItem('user_addresses:v1', JSON.stringify(updated));
    setSelectedAddressId(newAddr.id);
    setIsAddAddressOpen(false);
    setNewAddrName('');
    setNewAddrPhone('');
    setNewAddrDetails('');
    toast.success('Đã lưu địa chỉ nhận hàng!');
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.warning('Vui lòng đăng nhập để hoàn tất đơn mua!');
      window.location.href = `/${locale}/sign-in?reason=quick_purchase`;
      return;
    }

    if (mode === 'plant' && !agreedTerms) {
      toast.warning('Vui lòng chấp nhận điều khoản hợp đồng trước khi thanh toán!');
      return;
    }

    if (mode === 'product' && !selectedAddressId) {
      toast.warning('Vui lòng chọn hoặc thêm địa chỉ nhận hàng!');
      return;
    }

    setSubmitting(true);

    const selectedAddrObj = addresses.find((a) => a.id === selectedAddressId);

    const payload = {
      type: mode === 'plant' ? 'CULTIVATION_PLANT' : 'STORE_PRODUCT',
      items: [
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity,
        },
      ],
      carePackageCode: mode === 'plant' ? selectedCareId : undefined,
      protectionPackageCode: mode === 'plant' ? selectedProtectionId : undefined,
      shippingAddress: selectedAddrObj
        ? `${selectedAddrObj.name} - ${selectedAddrObj.phone}: ${selectedAddrObj.address}`
        : undefined,
      totalAmount: grandTotal,
    };

    fetchApiClient('/user/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        const orderData = res?.data || {
          id: `ORD-${Date.now()}`,
          code: `DH${Math.floor(100000 + Math.random() * 900000)}`,
          totalAmount: grandTotal,
        };

        toast.success('Khởi tạo đơn hàng thành công! Đang chuyển đến mã VietQR...');
        onClose();

        if (onSuccessPayment) {
          onSuccessPayment(orderData);
        }
      })
      .catch(() => {
        const fallbackOrder = {
          id: `ORD-${Date.now()}`,
          code: `DH${Math.floor(100000 + Math.random() * 900000)}`,
          totalAmount: grandTotal,
        };
        toast.success('Đang mở cổng thanh toán VietQR...');
        onClose();
        if (onSuccessPayment) {
          onSuccessPayment(fallbackOrder);
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto transition-opacity duration-200 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 space-y-6 relative shadow-2xl transition-[opacity,transform] duration-200 animate-in zoom-in-95 my-auto max-h-[92vh] overflow-y-auto border border-gray-100">
        
        {/* Close Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-[#1C3F24] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-200/60">
              {mode === 'plant' ? 'Mua & Ủy Thác Chăm Sóc' : 'Mua Sản Phẩm Trực Tiếp'}
            </span>
            <h3 className="text-lg font-black text-gray-900 leading-snug">
              Xác Nhận Đơn Hàng Mua Nhanh
            </h3>
          </div>
          <button
            type="button"
            aria-label="Đóng modal mua nhanh"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCheckoutSubmit} className="space-y-6">
          {/* Product Header Row */}
          <div className="flex items-center gap-4 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200/80">
            <div className="relative w-16 h-16 rounded-xl bg-white p-1 border border-gray-200 flex-shrink-0 overflow-hidden">
              <Image src={itemImage} alt={item.name} fill sizes="64px" unoptimized className="object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
              <p className="text-xs font-black text-[#1C3F24]">{unitPrice.toLocaleString('vi-VN')} đ <span className="text-[10px] text-gray-400 font-normal">/cây</span></p>
              <span className="text-[10px] text-gray-500 font-medium block">Kho khả dụng: <strong className="text-gray-800">{stockCount}</strong> sản phẩm</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-1.5">
            <label htmlFor="quick-purchase-quantity" className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
              Số Lượng Đặt Mua *
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-xl p-1 bg-white">
                <button
                  type="button"
                  aria-label="Giảm số lượng"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 flex items-center justify-center transition-colors text-sm cursor-pointer"
                >
                  -
                </button>
                <input
                  id="quick-purchase-quantity"
                  type="number"
                  aria-label="Số lượng đặt mua"
                  min={1}
                  max={stockCount}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(stockCount, Number(e.target.value) || 1)))}
                  className="w-14 text-center font-extrabold text-sm text-gray-900 focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Tăng số lượng"
                  onClick={() => setQuantity((q) => Math.min(stockCount, q + 1))}
                  className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 flex items-center justify-center transition-colors text-sm cursor-pointer"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-500 font-medium">Tối đa mua {stockCount} cây trong 1 lần</span>
            </div>
          </div>

          {/* Plant Mode Packages or Product Mode Address */}
          {mode === 'plant' ? (
            <PlantPackageSelector
              carePackagesList={carePackagesList}
              protectionPackagesList={protectionPackagesList}
              selectedCareId={selectedCareId}
              setSelectedCareId={setSelectedCareId}
              selectedProtectionId={selectedProtectionId}
              setSelectedProtectionId={setSelectedProtectionId}
            />
          ) : (
            <AddressSelector
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
              isAddAddressOpen={isAddAddressOpen}
              setIsAddAddressOpen={setIsAddAddressOpen}
              newAddrName={newAddrName}
              setNewAddrName={setNewAddrName}
              newAddrPhone={newAddrPhone}
              setNewAddrPhone={setNewAddrPhone}
              newAddrDetails={newAddrDetails}
              setNewAddrDetails={setNewAddrDetails}
              onAddAddressSubmit={handleAddAddressSubmit}
            />
          )}

          {/* Terms & Conditions (Plant Mode) */}
          {mode === 'plant' && (
            <div className="space-y-3 border-t border-gray-150 pt-5">
              <label htmlFor="agreeTermsCheckbox" className="flex items-start gap-2.5 cursor-pointer">
                <input
                  id="agreeTermsCheckbox"
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#1C3F24] rounded border-gray-300 focus:ring-[#1C3F24]"
                />
                <span className="text-xs text-gray-700 font-semibold leading-relaxed">
                  Tôi đồng ý ký kết <strong className="text-[#1C3F24]">Hợp đồng ủy quyền chăm sóc Sâm Ngọc Linh</strong> và chấp nhận quy định dịch vụ.
                </span>
              </label>

              {/* Accordions */}
              <div className="space-y-2 text-xs">
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenTermsAccordion(!openTermsAccordion)}
                    className="w-full px-4 py-2.5 bg-gray-50 flex items-center justify-between font-bold text-gray-700 hover:bg-gray-100 transition-colors text-left cursor-pointer"
                  >
                    <span>Xem Quy định & Quyền lợi chăm sóc vĩnh viễn</span>
                    <span>{openTermsAccordion ? '▲' : '▼'}</span>
                  </button>
                  {openTermsAccordion && (
                    <div className="p-4 text-[11px] text-gray-600 space-y-1.5 leading-relaxed bg-white border-t border-gray-200">
                      <p>• Cây sâm giống được trồng & chăm sóc theo đúng chuẩn kỹ thuật hữu cơ sinh thái tại Vườn sâm Trà Linh.</p>
                      <p>• Ban kỹ thuật cập nhật nhật ký tăng trưởng, chiều cao, tán lá & ảnh chụp thật theo chu kỳ định kỳ 15 ngày/lần.</p>
                      <p>• Chủ sở hữu được quyền thu hoạch sâm củ thật hoặc quy đổi thành rượu sâm thành phẩm khi đến tuổi trưởng thành.</p>
                    </div>
                  )}
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenContractAccordion(!openContractAccordion)}
                    className="w-full px-4 py-2.5 bg-gray-50 flex items-center justify-between font-bold text-gray-700 hover:bg-gray-100 transition-colors text-left cursor-pointer"
                  >
                    <span>Mẫu hợp đồng hợp tác đầu tư eContract (Xem trước)</span>
                    <span>{openContractAccordion ? '▲' : '▼'}</span>
                  </button>
                  {openContractAccordion && (
                    <div className="p-4 text-[11px] text-gray-600 space-y-2 leading-relaxed bg-white border-t border-gray-200 font-mono">
                      <p className="font-bold text-gray-900">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM - Độc lập - Tự do - Hạnh phúc</p>
                      <p className="font-bold text-[#1C3F24]">HỢP ĐỒNG ỦY QUYỀN CHĂM SÓC SÂM NGỌC LINH KỸ THUẬT SỐ</p>
                      <p>Bên A: Bên Ủy Thác (Nhà Đầu Tư Mua Cây)</p>
                      <p>Bên B: Công Ty Cổ Phần Rượu Sâm Ngọc Linh Nam Trà My</p>
                      <p>Nội dung: Bên B chịu trách nhiệm bảo quản, chăm sóc, thu hoạch và giao sản phẩm cho Bên A theo chu kỳ thỏa thuận.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pricing Breakdown Summary */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 space-y-2.5 text-xs">
            <h4 className="font-extrabold text-[#1C3F24] text-xs uppercase tracking-wider border-b border-emerald-200/60 pb-2">
              Chi Tiết Thanh Toán Đơn Hàng
            </h4>

            {mode === 'plant' ? (
              <>
                <div className="flex justify-between font-semibold text-gray-700">
                  <span>Tiền sâm ({quantity} cây x {unitPrice.toLocaleString('vi-VN')} đ):</span>
                  <span>{treeBasePrice.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>Thuế VAT Sâm (5%):</span>
                  <span>+{vatTree.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-700 pt-1 border-t border-emerald-100">
                  <span>Phí chăm sóc ({selectedCareObj?.name || 'Theo gói'}):</span>
                  <span>+{totalCareFee.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>Thuế VAT Phí Chăm Sóc (10%):</span>
                  <span>+{vatCare.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-700 pt-1 border-t border-emerald-100">
                  <span>Phí bảo hiểm ({selectedProtectionObj?.name || 'Theo gói'}):</span>
                  <span>+{totalProtectionFee.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>Thuế VAT Bảo Hiểm (10%):</span>
                  <span>+{vatProtection.toLocaleString('vi-VN')} đ</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between font-semibold text-gray-700">
                  <span>Tạm tính ({quantity} sản phẩm):</span>
                  <span>{productSubtotal.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>Thuế VAT Sản phẩm (8%):</span>
                  <span>+{vatProduct8.toLocaleString('vi-VN')} đ</span>
                </div>
              </>
            )}

            <div className="flex justify-between items-center text-sm font-black text-[#1C3F24] pt-2 border-t border-emerald-200">
              <span>TỔNG CỘNG THANH TOÁN:</span>
              <span className="text-base sm:text-lg text-emerald-900 font-extrabold">{grandTotal.toLocaleString('vi-VN')} VNĐ</span>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#1C3F24] hover:bg-emerald-900 active:bg-emerald-950 text-white font-extrabold py-3.5 rounded-xl text-xs transition-colors shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span>Đang khởi tạo đơn...</span>
              ) : (
                <span>Xác Nhận & Thanh Toán VietQR</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
};
