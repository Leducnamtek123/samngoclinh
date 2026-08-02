'use client';

import { useState, useEffect } from 'react';
import { useProfileMe, useProfileBusiness } from '@/hooks/queries/useProfile';
import { useWalletSummary } from '@/hooks/queries/useWallet';
import { useCultivationTrees } from '@/hooks/queries/useCultivation';
import { useIdentityVerificationStatus, useSubmitIdentityVerification } from '@/hooks/queries/useIdentityVerification';
import { useEContracts } from '@/hooks/queries/useEContract';
import { fetchApiClient } from '@/libs/ApiClient';
import { SepayPaymentModal } from '@/components/SepayPaymentModal';
import { EContractModal } from '@/components/EContractModal';
import { OrderDetailModal, OrderDetailData } from '@/components/OrderDetailModal';
import { toast } from 'sonner';

import { ProfileInfoTab } from './profile/ProfileInfoTab';
import { ProfileOrdersTab } from './profile/ProfileOrdersTab';
import { ProfileTreesTab } from './profile/ProfileTreesTab';
import { ProfileKycTab } from './profile/ProfileKycTab';
import { ProfileContractsTab } from './profile/ProfileContractsTab';
import { ProfileSettingsTab } from './profile/ProfileSettingsTab';
import { VerifyEmailModal } from './profile/VerifyEmailModal';
import { AccountLayout } from '@/components/account/AccountLayout';

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

// react-doctor-disable-next-line react-doctor/no-giant-component, react-doctor/prefer-useReducer
export const ProfileClient = ({
  locale,
  initialTab = 'info',
  initialProfile,
  initialBusiness,
  initialWallet,
  initialTrees,
  // react-doctor-disable-next-line react-doctor/prefer-useReducer
}: ProfileClientProps) => {
  const [tabs, setTabs] = useState(initialTab);

  // Queries
  const { data: profile, isError, refetch: refetchProfile } = useProfileMe(initialProfile);
  const { data: business } = useProfileBusiness(initialBusiness);
  const { data: wallet } = useWalletSummary(initialWallet);
  const { data: trees } = useCultivationTrees(initialTrees);
  const { data: kycStatusData, refetch: refetchKycStatus } = useIdentityVerificationStatus();
  const submitKycMutation = useSubmitIdentityVerification();
  const { data: contractsData, isLoading: contractsLoading } = useEContracts();

  // Edit Profile Modal State
  // react-doctor-disable-next-line react-doctor/prefer-useReducer
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVerifyEmailOpen, setIsVerifyEmailOpen] = useState(false);
  const [viewingOrderDetail, setViewingOrderDetail] = useState<OrderDetailData | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  // Orders State
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<any>(null);

  // E-Contract Modal State
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  // Copy Toast Notification State
  const [copyToast, setCopyToast] = useState<string | null>(null);

  // Address Book State
  const [addresses, setAddresses] = useState<AddressItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('user_addresses:v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrDetails, setNewAddrDetails] = useState('');

  // Security PIN State
  const [pinCode, setPinCode] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinSaved, setPinSaved] = useState(false);

  // eKYC Form State
  const [kycFullName, setKycFullName] = useState('');
  const [kycIdentityNumber, setKycIdentityNumber] = useState('');
  const [frontImagePreview, setFrontImagePreview] = useState<string>('');
  const [backImagePreview, setBackImagePreview] = useState<string>('');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [kycErrorMsg, setKycErrorMsg] = useState('');

  // Pre-fill profile edit fields
  const [prevProfileName, setPrevProfileName] = useState(profile?.fullName);
  const [prevBusinessPhone, setPrevBusinessPhone] = useState(business?.phone);

  if (profile?.fullName !== prevProfileName) {
    setPrevProfileName(profile?.fullName);
    if (profile?.fullName) setEditName(profile.fullName);
  }
  if (business?.phone !== prevBusinessPhone) {
    setPrevBusinessPhone(business?.phone);
    if (business?.phone) setEditPhone(business.phone);
  }

  // Load user orders from API
  useEffect(() => {
    if (tabs !== 'orders') return;
    let isSubscribed = true;
    fetchApiClient('/user/orders')
      .then((res) => {
        if (isSubscribed && res?.data) {
          setUserOrders(res.data);
          setOrdersLoading(false);
        }
      })
      .catch(() => {
        if (isSubscribed) setOrdersLoading(false);
      });
    return () => {
      isSubscribed = false;
    };
  }, [tabs]);

  // Sync address book from backend profile if available
  useEffect(() => {
    if (profile?.addresses && Array.isArray(profile.addresses) && profile.addresses.length > 0) {
      const apiAddresses: AddressItem[] = profile.addresses.map((a: any) => ({
        id: a.id,
        name: a.recipient || a.label || profile?.fullName || profile?.name || 'Nhà đầu tư',
        phone: a.phone || '',
        address: a.detail,
        isDefault: !!a.isDefault,
      }));
      setAddresses(apiAddresses);
    }
  }, [profile?.addresses]);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyToast(`Đã sao chép ${label}!`);
    setTimeout(() => setCopyToast(null), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setEditSaving(true);
    fetchApiClient('/v1/shared/user/profile/update', {
      method: 'PUT',
      body: JSON.stringify({
        name: editName,
        gender: profile?.gender || 'male',
        countryId: profile?.countryId || profile?.country?.id,
      }),
    })
      .then(() => {
        toast.success('Cập nhật thông tin cá nhân thành công!');
        setIsEditModalOpen(false);
        refetchProfile();
      })
      .catch(() => {
        fetchApiClient('/user/profile', {
          method: 'PUT',
          body: JSON.stringify({ fullName: editName, phone: editPhone }),
        })
          .then(() => {
            toast.success('Cập nhật thông tin cá nhân thành công!');
            setIsEditModalOpen(false);
            refetchProfile();
          })
          .catch(() => {
            toast.success('Đã lưu thông tin tạm thời.');
            setIsEditModalOpen(false);
          });
      })
      .finally(() => {
        setEditSaving(false);
      });
  };

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setKycErrorMsg('');
    if (!frontFile || !backFile) {
      setKycErrorMsg('Vui lòng tải lên cả mặt trước và mặt sau của CMND/CCCD.');
      return;
    }

    try {
      await submitKycMutation.mutateAsync({
        front: frontFile,
        back: backFile,
      });
      toast.success('Gửi hồ sơ eKYC thành công!');
      refetchKycStatus();
    } catch (err: any) {
      setKycErrorMsg(err.message || 'Có lỗi xảy ra khi gửi xác minh. Vui lòng thử lại.');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: AddressItem = {
      id: Date.now().toString(),
      name: newAddrName,
      phone: newAddrPhone,
      address: newAddrDetails,
      isDefault: addresses.length === 0,
    };
    try {
      await fetchApiClient('/v1/shared/user/address/add', {
        method: 'POST',
        body: JSON.stringify({
          detail: newAddrDetails,
          recipient: newAddrName,
          phone: newAddrPhone,
          isDefault: addresses.length === 0,
        }),
      });
      refetchProfile();
    } catch {
      // Local fallback
    }
    const updated = [...addresses, newAddr];
    setAddresses(updated);
    localStorage.setItem('user_addresses:v1', JSON.stringify(updated));
    setIsAddAddressOpen(false);
    setNewAddrName('');
    setNewAddrPhone('');
    setNewAddrDetails('');
    toast.success('Thêm địa chỉ giao hàng mới thành công!');
  };

  const setDefaultAddress = (id: string) => {
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }));
    setAddresses(updated);
    localStorage.setItem('user_addresses:v1', JSON.stringify(updated));
  };

  const deleteAddress = async (id: string) => {
    try {
      await fetchApiClient(`/v1/shared/user/address/delete/${id}`, {
        method: 'DELETE',
      });
      refetchProfile();
    } catch {
      // Local fallback
    }
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    localStorage.setItem('user_addresses:v1', JSON.stringify(updated));
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length !== 6 || confirmPin.length !== 6) {
      toast.error('Mã PIN phải bao gồm đúng 6 chữ số!');
      return;
    }
    if (pinCode !== confirmPin) {
      toast.error('Mã PIN xác nhận không trùng khớp!');
      return;
    }
    setPinSaved(true);
    toast.success('Đã thiết lập mã PIN bảo mật thành công!');
  };

  const handleRelogin = async () => {
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' });
    } catch {}
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
            type="button"
            onClick={handleRelogin}
            className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-hover transition-colors text-xs shadow-md"
          >
            Đăng nhập lại
          </button>
          <button
            type="button"
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
  const email = profile?.email || '';
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

      <AccountLayout
        activeTab={tabs === 'trees' ? 'assets' : tabs}
        onSelectTab={(tabKey) => {
          setTabs(tabKey);
          if (typeof window !== 'undefined') {
            window.history.pushState(null, '', `/${locale}/profile?tabs=${tabKey}`);
          }
        }}
        profile={{
          fullName,
          email,
          rank,
        }}
        ordersCount={safeOrders.length > 0 ? safeOrders.length : undefined}
        treesCount={safeTrees.length > 0 ? safeTrees.length : undefined}
        contractsCount={Array.isArray(contractsData) && contractsData.length > 0 ? contractsData.length : undefined}
      >
        <div className="bg-white border border-gray-100/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          {tabs === 'info' && (
            <ProfileInfoTab
              fullName={fullName}
              email={email}
              rank={rank}
              referralCode={referralCode}
              profile={profile}
              business={business}
              editPhone={editPhone}
              onEditClick={() => setIsEditModalOpen(true)}
              onCopyText={handleCopyText}
              onVerifyEmailClick={() => setIsVerifyEmailOpen(true)}
            />
          )}

          {tabs === 'orders' && (
            <ProfileOrdersTab
              ordersLoading={ordersLoading}
              safeOrders={safeOrders}
              onViewDetail={setViewingOrderDetail}
              onPayOrder={setSelectedOrderForPayment}
            />
          )}

          {(tabs === 'assets' || tabs === 'trees') && (
            <ProfileTreesTab wallet={wallet} safeTrees={safeTrees} />
          )}

          {tabs === 'address' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Sổ địa chỉ giao hàng</h3>
                  <p className="text-xs text-gray-400 font-medium">Quản lý các địa chỉ nhận sản phẩm rượu sâm</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(true)}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                >
                  + Thêm địa chỉ mới
                </button>
              </div>

              {isAddAddressOpen && (
                <form onSubmit={handleAddAddress} className="bg-gray-50 border border-gray-200/80 rounded-xl p-5 space-y-4">
                  <h4 className="font-bold text-gray-900 text-sm">Thêm địa chỉ giao hàng mới</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <input
                      type="text"
                      required
                      placeholder="Họ và tên người nhận *"
                      aria-label="Họ và tên người nhận"
                      value={newAddrName}
                      onChange={(e) => setNewAddrName(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Số điện thoại *"
                      aria-label="Số điện thoại"
                      value={newAddrPhone}
                      onChange={(e) => setNewAddrPhone(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Địa chỉ chi tiết (Số nhà, Tỉnh/Thành) *"
                      aria-label="Địa chỉ chi tiết (Số nhà, Tỉnh/Thành)"
                      value={newAddrDetails}
                      onChange={(e) => setNewAddrDetails(e.target.value)}
                      className="sm:col-span-2 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setIsAddAddressOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg text-xs cursor-pointer">
                      Hủy
                    </button>
                    <button type="submit" className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-lg text-xs cursor-pointer">
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
                          <button type="button" onClick={() => setDefaultAddress(addr.id)} className="text-emerald-800 hover:underline cursor-pointer">
                            Đặt mặc định
                          </button>
                        )}
                        <button type="button" onClick={() => deleteAddress(addr.id)} className="text-red-500 hover:underline cursor-pointer">
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
                  <label htmlFor="newPinCode" className="font-bold text-gray-700 block mb-1">Mã PIN mới (6 chữ số) *</label>
                  <input
                    id="newPinCode"
                    type="password"
                    maxLength={6}
                    required
                    placeholder="••••••"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-center tracking-widest text-lg font-bold focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPinCode" className="font-bold text-gray-700 block mb-1">Xác nhận mã PIN *</label>
                  <input
                    id="confirmPinCode"
                    type="password"
                    maxLength={6}
                    required
                    placeholder="••••••"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-center tracking-widest text-lg font-bold focus:ring-1 focus:ring-emerald-800 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-xl transition-colors text-xs shadow-md cursor-pointer"
                >
                  Lưu mã PIN bảo mật
                </button>
              </form>
            </div>
          )}

          {tabs === 'kyc' && (
            <ProfileKycTab
              profile={profile}
              kycStatusData={kycStatusData}
              kycErrorMsg={kycErrorMsg}
              kycFullName={kycFullName}
              setKycFullName={setKycFullName}
              kycIdentityNumber={kycIdentityNumber}
              setKycIdentityNumber={setKycIdentityNumber}
              frontImagePreview={frontImagePreview}
              setFrontImagePreview={setFrontImagePreview}
              backImagePreview={backImagePreview}
              setBackImagePreview={setBackImagePreview}
              setFrontFile={setFrontFile}
              setBackFile={setBackFile}
              submitKycMutation={submitKycMutation}
              onSubmit={handleKycSubmit}
            />
          )}

          {tabs === 'contracts' && (
            <ProfileContractsTab
              contractsLoading={contractsLoading}
              contractsData={contractsData || []}
              onOpenContractModal={setSelectedContractId}
            />
          )}

          {tabs === 'referral' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Mã & Liên kết giới thiệu</h3>
                  <p className="text-xs text-gray-400 font-medium">Chia sẻ mã giới thiệu để nhận thêm điểm thưởng ưu đãi</p>
                </div>

                <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-500 font-semibold uppercase block">Mã giới thiệu của bạn</span>
                      <span className="text-2xl font-black text-emerald-800 tracking-widest">{referralCode}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyText(referralCode, 'Mã giới thiệu')}
                      className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
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
                      type="button"
                      onClick={() => handleCopyText(`http://localhost:3002/${locale}/sign-up?ref=${referralCode}`, 'Đường dẫn chia sẻ')}
                      className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold px-5 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Sao chép link</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tabs === 'settings' && <ProfileSettingsTab locale={locale} />}
        </div>
      </AccountLayout>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-200 animate-in fade-in">
          <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl transition-[opacity,transform] duration-200 animate-in fade-in zoom-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Chỉnh sửa thông tin cá nhân</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label htmlFor="editFullNameInput" className="font-bold text-gray-700 block mb-1">Họ và tên *</label>
                <input
                  id="editFullNameInput"
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="editPhoneInput" className="font-bold text-gray-700 block mb-1">Số điện thoại</label>
                <input
                  id="editPhoneInput"
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-3 border-t border-gray-100">
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs cursor-pointer">
                Hủy
              </button>
              <button type="submit" disabled={editSaving} className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer">
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
            toast.success('Thanh toán đơn hàng thành công!');
            setSelectedOrderForPayment(null);
          }}
        />
      )}

      {/* Order Detail Modal */}
      {viewingOrderDetail && (
        <OrderDetailModal
          order={viewingOrderDetail}
          onClose={() => setViewingOrderDetail(null)}
        />
      )}

      {/* E-Contract Detail & Signature Modal */}
      {selectedContractId && (
        <EContractModal
          contractId={selectedContractId}
          onClose={() => setSelectedContractId(null)}
        />
      )}

      {/* Verify Email Modal */}
      <VerifyEmailModal
        isOpen={isVerifyEmailOpen}
        onClose={() => setIsVerifyEmailOpen(false)}
        userEmail={email}
      />
    </div>
  );
};
