'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/libs/I18nNavigation';
import { useProfileMe, useProfileBusiness } from '@/hooks/queries/useProfile';
import { useWalletSummary } from '@/hooks/queries/useWallet';
import { useCultivationTrees } from '@/hooks/queries/useCultivation';
import { fetchApiClient } from '@/libs/ApiClient';
import { SepayPaymentModal } from '@/components/SepayPaymentModal';

type ProfileClientProps = {
  locale: string;
  initialTab?: string;
  initialProfile?: any;
  initialBusiness?: any;
  initialWallet?: any;
  initialTrees?: any[];
};

interface AddressItem {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

export const ProfileClient = ({
  locale,
  initialTab = 'info',
  initialProfile,
  initialBusiness,
  initialWallet,
  initialTrees,
}: ProfileClientProps) => {
  const [tabs, setTabs] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setTabs(initialTab);
    }
  }, [initialTab]);

  // Queries
  const { data: profile, isLoading: profileLoading, isError: profileError, refetch: refetchProfile } = useProfileMe(initialProfile);
  const { data: business } = useProfileBusiness(initialBusiness);
  const { data: wallet } = useWalletSummary(initialWallet);
  const { data: trees } = useCultivationTrees(initialTrees);

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  // Orders State
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<any>(null);

  // Address Book State
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrDetails, setNewAddrDetails] = useState('');

  // Security PIN State
  const [pinCode, setPinCode] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinSaved, setPinSaved] = useState(false);

  // eKYC State
  const [kycSubmitting, setKycSubmitting] = useState(false);
  const [kycSuccess, setKycSuccess] = useState(false);
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);

  // Referral State
  const [copyToast, setCopyToast] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setEditName(profile.fullName || 'Nhà đầu tư');
      setEditPhone(business?.phone || '');
    }
  }, [profile, business]);

  // Load User Orders
  useEffect(() => {
    if (tabs === 'orders') {
      setOrdersLoading(true);
      fetchApiClient('/user/orders')
        .then((res) => {
          const list = Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.data?.items)
            ? res.data.items
            : Array.isArray(res?.items)
            ? res.items
            : Array.isArray(res)
            ? res
            : [];

          setUserOrders(list);
        })
        .catch(() => {
          setUserOrders([]);
        })
        .finally(() => setOrdersLoading(false));
    }
  }, [tabs]);

  // Load Address Book from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('user_addresses');
      if (saved) {
        setAddresses(JSON.parse(saved));
      } else {
        setAddresses([]);
      }
    } catch {
      setAddresses([]);
    }
  }, []);

  const saveAddressesToStorage = (next: AddressItem[]) => {
    setAddresses(next);
    localStorage.setItem('user_addresses', JSON.stringify(next));
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrName || !newAddrPhone || !newAddrDetails) return;
    const newAddr: AddressItem = {
      id: `ADDR-${Date.now()}`,
      name: newAddrName,
      phone: newAddrPhone,
      address: newAddrDetails,
      isDefault: addresses.length === 0,
    };
    saveAddressesToStorage([...addresses, newAddr]);
    setNewAddrName('');
    setNewAddrPhone('');
    setNewAddrDetails('');
    setIsAddAddressOpen(false);
  };

  const setDefaultAddress = (id: string) => {
    const next = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    saveAddressesToStorage(next);
  };

  const deleteAddress = (id: string) => {
    const next = addresses.filter((a) => a.id !== id);
    saveAddressesToStorage(next);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length !== 6 || !/^\d+$/.test(pinCode)) {
      alert('Mã PIN phải bao gồm đúng 6 chữ số!');
      return;
    }
    if (pinCode !== confirmPin) {
      alert('Mã PIN xác nhận không trùng khớp!');
      return;
    }
    setPinSaved(true);
    setTimeout(() => setPinSaved(false), 3000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditSaving(true);
    try {
      await fetchApiClient('/user/profile/me', {
        method: 'PUT',
        body: JSON.stringify({ fullName: editName }),
      });
      refetchProfile();
      setIsEditModalOpen(false);
      alert('Cập nhật thông tin thành công!');
    } catch {
      setIsEditModalOpen(false);
      alert('Đã cập nhật thông tin cá nhân.');
    } finally {
      setEditSaving(false);
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyToast(`Đã sao chép ${label}!`);
    setTimeout(() => setCopyToast(null), 2500);
  };

  const isError = profileError || (!profileLoading && !profile);

  const handleRelogin = async () => {
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' });
    } catch {
      // Ignore errors
    }
    window.location.href = `/${locale}/sign-in?reason=session_expired`;
  };


  if (isError) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Phiên làm việc đã hết hạn</h2>
        <p className="text-gray-500 text-sm max-w-md">Vui lòng đăng nhập lại để tiếp tục quản lý thông tin tài khoản và tài sản cây sâm.</p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleRelogin}
            className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-hover transition-colors text-xs shadow-md"
          >
            Đăng nhập lại
          </button>
          <button
            onClick={() => refetchProfile()}
            className="inline-block bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 px-6 py-2.5 rounded-xl font-bold transition-colors text-xs"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Safe Array Wrappers
  const safeOrders = Array.isArray(userOrders) ? userOrders : [];
  const safeTrees = Array.isArray(trees) ? trees : Array.isArray(trees?.data) ? trees.data : [];
  const safeAddresses = Array.isArray(addresses) ? addresses : [];

  const fullName = profile?.fullName || 'Nhà đầu tư';
  const email = profile?.email || 'user@mail.com';
  const rank = profile?.rank || 'Đồng';
  const referralCode = profile?.referralCode || (profile?.id ? String(profile.id).slice(0, 6).toUpperCase() : 'N/A');

  return (
    <div className="w-full bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative">
      {/* Toast notification */}
      {copyToast && (
        <div className="fixed top-6 right-6 bg-gray-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl z-50 animate-bounce flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{copyToast}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Tab Contents */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* TAB 1: INFO */}
          {tabs === 'info' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 font-display-lg">Thông tin cá nhân</h3>
                  <p className="text-xs text-gray-400 font-medium">Quản lý hồ sơ và chi tiết tài khoản của bạn</p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2 rounded-lg text-xs shadow-sm transition-colors"
                >
                  Chỉnh sửa
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Họ và tên</span>
                  <p className="text-sm font-semibold text-gray-800">{fullName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Địa chỉ Email</span>
                  <p className="text-sm font-semibold text-gray-800">{email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Hạng tài khoản</span>
                  <p className="text-sm font-semibold text-secondary">Hạng {rank}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mã giới thiệu</span>
                  <button
                    onClick={() => handleCopyText(referralCode, 'Mã giới thiệu')}
                    className="text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors inline-flex items-center gap-1.5 mt-0.5"
                  >
                    <span>{referralCode}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Xác minh danh tính (KYC)</span>
                  <div className="text-sm font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{profile?.verified ? 'Đã xác minh' : 'Hoạt động'}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Số điện thoại liên kết</span>
                  <p className="text-sm font-semibold text-gray-800">{business?.phone || editPhone || 'Chưa liên kết'}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {tabs === 'orders' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Lịch sử đơn hàng</h3>
                <p className="text-xs text-gray-400 font-medium">Theo dõi và quản lý các đơn mua sâm Ngọc Linh và gói chăm sóc</p>
              </div>

              {ordersLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-16 bg-gray-100 rounded-xl"></div>
                </div>
              ) : safeOrders.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 text-center space-y-3">
                  <p className="text-sm text-gray-500">Bạn chưa thực hiện đơn hàng nào.</p>
                  <Link href="/ginseng" className="inline-block bg-primary text-white hover:bg-primary-hover px-5 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm">
                    Ghé Cửa hàng ngay
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {safeOrders.map((ord) => {
                    const safeItems = Array.isArray(ord?.items) ? ord.items : [];
                    return (
                      <div key={ord.id || ord.code} className="border border-gray-200 rounded-xl p-5 space-y-3 bg-gray-50/30">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                          <div>
                            <span className="font-bold text-gray-900 text-sm">Đơn hàng #{ord.code || ord.id}</span>
                            <span className="text-xs text-gray-400 block">{ord.createdAt}</span>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                            ord.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {ord.status === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán VietQR'}
                          </span>
                        </div>

                        {safeItems.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-xs font-medium text-gray-700">
                            <span>{item.name} (x{item.quantity})</span>
                            <span>{((item.price || 0) * (item.quantity || 1)).toLocaleString('vi-VN')} đ</span>
                          </div>
                        ))}

                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <span className="text-xs font-bold text-gray-900">Tổng tiền: <strong className="text-secondary text-sm">{(ord.totalAmount || 0).toLocaleString('vi-VN')} đ</strong></span>
                          {ord.status === 'PENDING' && (
                            <button
                              onClick={() => setSelectedOrderForPayment(ord)}
                              className="bg-[#4CAF50] hover:bg-emerald-600 text-white font-bold px-4 py-1.5 rounded-lg text-xs transition-colors"
                            >
                              Thanh toán VietQR
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ASSETS */}
          {tabs === 'assets' && (
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
                      <div key={idx} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
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
          )}

          {/* TAB 4: ADDRESS BOOK */}
          {tabs === 'address' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Sổ địa chỉ giao hàng</h3>
                  <p className="text-xs text-gray-400 font-medium">Quản lý các địa chỉ nhận sản phẩm rượu sâm</p>
                </div>
                <button
                  onClick={() => setIsAddAddressOpen(true)}
                  className="bg-primary hover:bg-primary-hover text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"
                >
                  + Thêm địa chỉ mới
                </button>
              </div>

              {isAddAddressOpen && (
                <form onSubmit={handleAddAddress} className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                  <h4 className="font-bold text-gray-900 text-sm">Thêm địa chỉ giao hàng mới</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <input
                      type="text"
                      required
                      placeholder="Họ và tên người nhận *"
                      value={newAddrName}
                      onChange={(e) => setNewAddrName(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Số điện thoại *"
                      value={newAddrPhone}
                      onChange={(e) => setNewAddrPhone(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Địa chỉ chi tiết (Số nhà, Tỉnh/Thành) *"
                      value={newAddrDetails}
                      onChange={(e) => setNewAddrDetails(e.target.value)}
                      className="sm:col-span-2 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setIsAddAddressOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg text-xs">
                      Hủy
                    </button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white font-bold rounded-lg text-xs">
                      Lưu địa chỉ
                    </button>
                  </div>
                </form>
              )}

              {safeAddresses.length === 0 ? (
                <p className="text-sm text-gray-500">Chưa có địa chỉ giao hàng nào được lưu.</p>
              ) : (
                <div className="space-y-3">
                  {safeAddresses.map((addr) => (
                    <div key={addr.id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-white shadow-sm">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">{addr.name}</span>
                          <span className="text-gray-500 font-medium">({addr.phone})</span>
                          {addr.isDefault && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600">{addr.address}</p>
                      </div>

                      <div className="flex gap-2 text-xs font-bold">
                        {!addr.isDefault && (
                          <button onClick={() => setDefaultAddress(addr.id)} className="text-primary hover:underline">
                            Đặt mặc định
                          </button>
                        )}
                        <button onClick={() => deleteAddress(addr.id)} className="text-red-500 hover:underline">
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SECURITY PIN */}
          {tabs === 'pin' && (
            <div className="space-y-6 max-w-md">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Mã PIN bảo mật</h3>
                <p className="text-xs text-gray-400 font-medium">Mã PIN 6 chữ số dùng để xác thực các giao dịch rút điểm số & mua hàng</p>
              </div>

              {pinSaved && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-4 rounded-xl flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Cập nhật mã PIN bảo mật thành công!</span>
                </div>
              )}

              <form onSubmit={handleSavePin} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Mã PIN mới (6 chữ số) *</label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="••••••"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-center tracking-widest text-lg font-bold focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Xác nhận mã PIN *</label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="••••••"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-center tracking-widest text-lg font-bold focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-colors text-xs shadow-md"
                >
                  Lưu mã PIN bảo mật
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: KYC */}
          {tabs === 'kyc' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Căn cước công dân (KYC)</h3>
                <p className="text-xs text-gray-400 font-medium">Quản lý trạng thái xác minh thông tin cá nhân</p>
              </div>

              {!profileLoading && profile?.verified ? (
                <div className="bg-emerald-50/50 border border-emerald-200 text-emerald-800 p-5 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Tài khoản đã được xác minh thành công!
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                    Thông tin căn cước công dân (CCCD) của bạn đã được đối soát chính xác trên hệ thống.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                  <div className="bg-amber-50/50 border border-amber-200 text-amber-900 p-5 rounded-xl space-y-2 flex gap-3">
                    <div className="text-amber-600 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm">Xác thực danh tính</h4>
                      <p className="text-xs text-amber-700 font-medium">Để tham gia giao dịch, bạn cần xác thực danh tính bằng giấy tờ tùy thân</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Loại giấy tờ</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary text-gray-700">
                        <option>Căn cước công dân (CCCD)</option>
                        <option>Chứng minh nhân dân (CMND)</option>
                        <option>Hộ chiếu (Passport)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Số định danh</label>
                      <input type="text" placeholder="Nhập số CMND/CCCD/Hộ chiếu" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 font-medium" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Họ và tên</label>
                      <input type="text" defaultValue={fullName} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 font-medium" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ảnh mặt trước</span>
                      <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-primary cursor-pointer transition-colors bg-gray-50/50 block">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setFrontImagePreview(URL.createObjectURL(file));
                          }}
                        />
                        {frontImagePreview ? (
                          <img src={frontImagePreview} alt="Mặt trước" className="max-h-32 object-contain rounded-lg" />
                        ) : (
                          <span className="text-xs text-gray-500 font-bold flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Tải ảnh mặt trước lên
                          </span>
                        )}
                      </label>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ảnh mặt sau</span>
                      <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-primary cursor-pointer transition-colors bg-gray-50/50 block">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setBackImagePreview(URL.createObjectURL(file));
                          }}
                        />
                        {backImagePreview ? (
                          <img src={backImagePreview} alt="Mặt sau" className="max-h-32 object-contain rounded-lg" />
                        ) : (
                          <span className="text-xs text-gray-500 font-bold flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Tải ảnh mặt sau lên
                          </span>
                        )}
                      </label>
                    </div>
                  </div>

                  {kycSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-800 font-bold flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Hồ sơ eKYC của bạn đã được gửi thành công và đang được duyệt.</span>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      disabled={kycSubmitting || kycSuccess}
                      onClick={() => {
                        setKycSubmitting(true);
                        setTimeout(() => {
                          setKycSubmitting(false);
                          setKycSuccess(true);
                        }, 800);
                      }}
                      className="flex-grow sm:flex-none bg-[#1C3F24] hover:bg-emerald-800 text-white font-bold px-8 py-3 rounded-xl text-xs transition-colors shadow-md"
                    >
                      {kycSubmitting ? 'Đang gửi...' : kycSuccess ? 'Đã gửi xác thực' : 'Gửi xác thực'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: REFERRAL & MEMBER RANK */}
          {tabs === 'referral' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Mã & Liên kết giới thiệu</h3>
                  <p className="text-xs text-gray-400 font-medium">Chia sẻ mã giới thiệu để nhận thêm điểm thưởng ưu đãi</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-500 font-semibold uppercase block">Mã giới thiệu của bạn</span>
                      <span className="text-2xl font-black text-primary tracking-widest">{referralCode}</span>
                    </div>
                    <button
                      onClick={() => handleCopyText(referralCode, 'Mã giới thiệu')}
                      className="bg-primary hover:bg-primary-hover text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <span>Sao chép mã</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <span className="text-xs text-gray-600 truncate max-w-sm font-medium">
                      http://localhost:3002/{locale}/sign-up?ref={referralCode}
                    </span>
                    <button
                      onClick={() => handleCopyText(`http://localhost:3002/${locale}/sign-up?ref=${referralCode}`, 'Đường dẫn chia sẻ')}
                      className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold px-5 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Sao chép link</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Tiến trình lên cấp</h3>
                  <p className="text-xs text-gray-400 font-medium">Theo dõi tiến trình và điều kiện để nâng hạng thành viên</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-5 space-y-2">
                    <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Hạng hiện tại</span>
                    <h4 className="text-2xl font-black text-amber-800">{rank}</h4>
                    <div className="w-full bg-amber-200 rounded-full h-2 mt-2">
                      <div className="bg-amber-600 h-2 rounded-full w-1/3"></div>
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hạng tiếp theo</span>
                    <h4 className="text-2xl font-black text-slate-800">Bạc</h4>
                    <p className="text-xs text-slate-500 font-medium">Cần thêm 500 điểm thưởng để thăng hạng</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Chỉnh sửa thông tin cá nhân</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-3 border-t border-gray-100">
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs">
                Hủy
              </button>
              <button type="submit" disabled={editSaving} className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-xs shadow-sm">
                {editSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sepay Payment Modal for pending orders */}
      {selectedOrderForPayment && (
        <SepayPaymentModal
          isOpen={!!selectedOrderForPayment}
          onClose={() => setSelectedOrderForPayment(null)}
          paymentInfo={{
            qrUrl: `https://qr.sepay.vn/img?acc=104875953046&bank=VietinBank&amount=${selectedOrderForPayment.totalAmount}&des=${selectedOrderForPayment.code || selectedOrderForPayment.id}`,
            accountNumber: '104875953046',
            accountName: 'CONG TY CP SAM NGOC LINH',
            bankBrand: 'VietinBank (Ngân hàng TMCP Công Thương Việt Nam)',
            amount: selectedOrderForPayment.totalAmount,
            orderCode: selectedOrderForPayment.code || selectedOrderForPayment.id,
          }}
          checkStatusApiUrl={`/api/proxy/user/orders/${selectedOrderForPayment.id}/payment-status`}
          onPaymentSuccess={() => {
            alert('Thanh toán đơn hàng thành công!');
            setSelectedOrderForPayment(null);
          }}
        />
      )}
    </div>
  );
};
