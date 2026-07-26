'use client';

import { useState } from 'react';
import { useProfileMe } from '@/hooks/queries/useProfile';
import { useMarketplaceListings } from '@/hooks/queries/useMarketplace';
import {
  useCreateListing,
  useDeleteListing,
  useBuyListing,
  useMyListings,
} from '@/hooks/queries/useMarketplaceMutations';
import { useCultivationTrees } from '@/hooks/queries/useCultivation';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { TradingSellForm } from './trading/TradingSellForm';

type TradingFloorClientProps = {
  locale: string;
  initialListings?: any[];
  isLoggedIn?: boolean;
};

// react-doctor-disable-next-line react-doctor/no-giant-component, react-doctor/prefer-useReducer
export const TradingFloorClient = ({ locale, initialListings, isLoggedIn }: TradingFloorClientProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'me'>('all');
  const [formMode, setFormMode] = useState<'sell' | 'buy'>('sell');

  // Queries
  const { data: listings, isLoading: listingsLoading, isError: listingsError } = useMarketplaceListings(initialListings);
  const { data: myListings, isLoading: myListingsLoading } = useMyListings(!!isLoggedIn);
  const { data: profile } = useProfileMe();
  const { data: userTrees, isLoading: treesLoading } = useCultivationTrees(undefined, !!isLoggedIn);

  // Mutations
  const createListingMutation = useCreateListing();
  const deleteListingMutation = useDeleteListing();
  const buyListingMutation = useBuyListing();

  // Sell Form States
  const [selectedTreeId, setSelectedTreeId] = useState('');
  const [price, setPrice] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('15');
  const [payPoints, setPayPoints] = useState(true);
  const [payBank, setPayBank] = useState(true);
  const [note, setNote] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Modals
  const [selectedBuyListing, setSelectedBuyListing] = useState<any | null>(null);
  const [buyError, setBuyError] = useState('');
  const [buySuccess, setBuySuccess] = useState('');
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);

  const isVerified = profile?.verified || false;

  const handleRequireAuth = (_actionName?: string) => {
    if (!isLoggedIn) {
      window.location.href = `/${locale}/sign-in?reason=trading-floor`;
      return false;
    }
    return true;
  };

  const handleRequireKyc = () => {
    if (!isVerified) {
      setFormError('Bạn cần xác thực danh tính (eKYC) trước khi tham gia giao dịch trên sàn.');
      return false;
    }
    return true;
  };

  // Submit create sell order
  const handleCreateSellListing = async (e: React.FormEvent) => {
    if (createListingMutation.isPending) return;
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!handleRequireAuth('đăng bán cây')) return;
    if (!handleRequireKyc()) return;

    if (!selectedTreeId) {
      setFormError('Vui lòng chọn một cây sâm từ vườn của bạn để đăng bán.');
      return;
    }

    const priceNum = Number(price);
    if (!priceNum || priceNum <= 0) {
      setFormError('Vui lòng nhập giá bán hợp lệ lớn hơn 0 VNĐ.');
      return;
    }

    const selectedTree = (userTrees || []).find((t: any) => t.id === selectedTreeId);
    const title = selectedTree
      ? `Sâm Ngọc Linh ${selectedTree.age || 1} năm (Mã: ${selectedTree.treeCode || selectedTree.id.slice(0, 6)})`
      : 'Cây Sâm Ngọc Linh';

    const payments: string[] = [];
    if (payPoints) payments.push('Điểm');
    if (payBank) payments.push('Chuyển khoản');

    try {
      await createListingMutation.mutateAsync({
        treeId: selectedTreeId,
        title,
        price: priceNum,
        payments,
        note: note || `Sâm ${selectedTree?.age || 1} năm • Vườn ${selectedTree?.gardenName || 'Kon Tum'}`,
      });

      setFormSuccess('Đăng bán cây thành công! Lệnh bán của bạn đã được khởi tạo.');
      setSelectedTreeId('');
      setPrice('');
      setNote('');
      setActiveTab('me');
    } catch (err: any) {
      setFormError(err.message || 'Có lỗi xảy ra khi tạo lệnh đăng bán.');
    }
  };

  // Buy confirmation submit
  const handleConfirmBuyListing = async () => {
    if (buyListingMutation.isPending) return;
    if (!selectedBuyListing) return;
    setBuyError('');
    setBuySuccess('');

    if (!handleRequireAuth('mua cây')) return;

    try {
      await buyListingMutation.mutateAsync(selectedBuyListing.id);
      setBuySuccess('Đặt mua thành công! Đơn hàng P2P đã được tạo.');
      setTimeout(() => {
        setSelectedBuyListing(null);
        setBuySuccess('');
        window.location.href = `/${locale}/profile?tabs=orders`;
      }, 1500);
    } catch (err: any) {
      setBuyError(err.message || 'Không thể hoàn tất giao dịch mua cây.');
    }
  };

  const handleDeleteListing = (id: string) => {
    setCancelConfirmId(id);
  };

  const handleConfirmCancelListing = async () => {
    if (!cancelConfirmId) return;
    const id = cancelConfirmId;
    setCancelConfirmId(null);

    try {
      await deleteListingMutation.mutateAsync(id);
      toast.success('Hủy lệnh bán cây thành công!');
    } catch {
      toast.error('Không thể hủy lệnh bán. Vui lòng thử lại.');
    }
  };

  const currentListings = activeTab === 'all' ? (listings || []) : (myListings || []);
  const isCurrentLoading = activeTab === 'all' ? listingsLoading : myListingsLoading;

  return (
    <div className="w-full bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-[#1C3F24] text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-3 max-w-2xl">
            <span className="bg-emerald-800 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block">
              Sàn Giao Dịch P2P Sâm Ngọc Linh
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Giao Dịch Sâm Giống Trực Tiếp Giữa Các Nhà Đầu Tư
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Mua bán, sang nhượng cây sâm giống chính chủ từ các vườn Sâm Trà Linh với hợp đồng điện tử pháp lý minh bạch & truy xuất nguồn gốc QR.
            </p>
          </div>
        </div>

        {/* Tab switcher: Form mode vs Marketplace */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex bg-white p-1 rounded-2xl border border-gray-200 shadow-xs">
            <button
              type="button"
              onClick={() => setFormMode('sell')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                formMode === 'sell' ? 'bg-[#1C3F24] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              + Đăng Bán Cây
            </button>
            <button
              type="button"
              onClick={() => setFormMode('buy')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                formMode === 'buy' ? 'bg-[#1C3F24] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Xem Sàn Giao Dịch ({listings?.length || 0})
            </button>
          </div>

          {formMode === 'buy' && (
            <div className="flex bg-gray-200/60 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'all' ? 'bg-white text-[#1C3F24] font-bold shadow-xs' : 'text-gray-600'
                }`}
              >
                Tất cả lệnh bán
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('me')}
                className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'me' ? 'bg-white text-[#1C3F24] font-bold shadow-xs' : 'text-gray-600'
                }`}
              >
                Lệnh bán của tôi
              </button>
            </div>
          )}
        </div>

        {/* Form Mode: Sell Listing Form */}
        {formMode === 'sell' && (
          <TradingSellForm
            isLoggedIn={isLoggedIn}
            isVerified={isVerified}
            userTrees={userTrees || []}
            treesLoading={treesLoading}
            selectedTreeId={selectedTreeId}
            setSelectedTreeId={setSelectedTreeId}
            price={price}
            setPrice={setPrice}
            durationMinutes={durationMinutes}
            setDurationMinutes={setDurationMinutes}
            payPoints={payPoints}
            setPayPoints={setPayPoints}
            payBank={payBank}
            setPayBank={setPayBank}
            note={note}
            setNote={setNote}
            formError={formError}
            formSuccess={formSuccess}
            createListingMutation={createListingMutation}
            onSubmit={handleCreateSellListing}
          />
        )}

        {/* Marketplace Mode: Listings Table / Grid */}
        {formMode === 'buy' && (
          <div className="space-y-6">
            {isCurrentLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : listingsError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl text-center font-medium">
                Không thể tải danh sách lệnh giao dịch P2P. Vui lòng thử lại sau.
              </div>
            ) : currentListings.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500 font-medium space-y-3">
                <p className="text-base font-bold text-gray-800">Hiện chưa có lệnh bán cây sâm nào</p>
                <p className="text-xs">Hãy là người đầu tiên đăng bán cây sâm từ vườn của bạn!</p>
                <button
                  type="button"
                  onClick={() => setFormMode('sell')}
                  className="inline-block bg-[#1C3F24] text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Đăng bán ngay
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentListings.map((listing: any) => {
                  const isMine = listing.sellerId === profile?.id;
                  return (
                    <div
                      key={listing.id}
                      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="bg-emerald-50 text-[#1C3F24] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            Mã #{listing.id.slice(0, 6)}
                          </span>
                          {isMine && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              Lệnh của tôi
                            </span>
                          )}
                        </div>

                        <h3 className="font-extrabold text-gray-900 text-base leading-snug line-clamp-2">
                          {listing.title || 'Cây Sâm Ngọc Linh'}
                        </h3>

                        <p className="text-xs text-gray-500 line-clamp-2 font-medium">
                          {listing.note || 'Sâm Ngọc Linh chuẩn vườn Trà Linh - Nam Trà My.'}
                        </p>

                        <div className="bg-gray-50 p-3 rounded-xl space-y-1">
                          <span className="text-[10px] text-gray-400 font-bold uppercase block">Giá niêm yết</span>
                          <span className="text-lg font-black text-[#1C3F24]">{Number(listing.price || 0).toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        {isMine ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteListing(listing.id)}
                            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                          >
                            Hủy lệnh bán
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedBuyListing(listing)}
                            className="w-full bg-[#1C3F24] hover:bg-emerald-900 text-white font-extrabold py-2.5 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                          >
                            Đặt Mua Ngay (P2P)
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

      </div>

      {/* Buy Confirmation Modal */}
      {selectedBuyListing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity duration-200 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl transition-[opacity,transform] duration-200 animate-in zoom-in-95">
            <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3">Xác Nhận Đặt Mua Cây Sâm P2P</h3>

            {buyError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-bold">
                {buyError}
              </div>
            )}

            {buySuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl font-bold">
                {buySuccess}
              </div>
            )}

            <div className="space-y-2 text-xs">
              <p className="font-semibold text-gray-700">Tên sản phẩm: <strong className="text-gray-900">{selectedBuyListing.title}</strong></p>
              <p className="font-semibold text-gray-700">Giá bán: <strong className="text-[#1C3F24] text-sm">{Number(selectedBuyListing.price || 0).toLocaleString('vi-VN')} VNĐ</strong></p>
              <p className="text-gray-500 leading-relaxed pt-1">
                Sau khi xác nhận, đơn hàng mua P2P sẽ được khởi tạo và mã VietQR thanh toán sẽ xuất hiện để bạn chuyển tiền trực tiếp.
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedBuyListing(null)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmBuyListing}
                disabled={buyListingMutation.isPending}
                className="px-6 py-2.5 bg-[#1C3F24] hover:bg-emerald-900 text-white font-extrabold rounded-xl text-xs shadow-md disabled:opacity-50 cursor-pointer"
              >
                {buyListingMutation.isPending ? 'Đang tạo đơn...' : 'Xác Nhận Mua'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!cancelConfirmId}
        title="Xác nhận hủy lệnh bán"
        description="Bạn có chắc chắn muốn hủy lệnh đăng bán cây sâm này không?"
        confirmText="Hủy lệnh bán"
        cancelText="Quay lại"
        onConfirm={handleConfirmCancelListing}
        onCancel={() => setCancelConfirmId(null)}
      />
    </div>
  );
};
