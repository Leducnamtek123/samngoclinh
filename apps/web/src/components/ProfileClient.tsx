'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useProfileMe, useProfileBusiness } from '@/hooks/queries/useProfile';
import { useWalletSummary } from '@/hooks/queries/useWallet';
import { useCultivationTrees } from '@/hooks/queries/useCultivation';
import { useIdentityVerificationStatus, useSubmitIdentityVerification } from '@/hooks/queries/useIdentityVerification';
import { useEContracts } from '@/hooks/queries/useEContract';
import { SepayPaymentModal } from '@/components/payment/SepayPaymentModal';
import { EContractModal } from '@/components/contract/EContractModal';
import { OrderDetailModal } from '@/components/orders/OrderDetailModal';
import { toast } from 'sonner';

import { ProfileInfoTab } from './profile/ProfileInfoTab';
import { ProfileOrdersTab } from './profile/ProfileOrdersTab';
import { ProfileTreesTab } from './profile/ProfileTreesTab';
import { ProfileKycTab } from './profile/ProfileKycTab';
import { ProfileContractsTab } from './profile/ProfileContractsTab';
import { ProfileSettingsTab } from './profile/ProfileSettingsTab';
import { ProfileChangePasswordTab } from './profile/ProfileChangePasswordTab';
import { ProfileAddressTab } from './profile/ProfileAddressTab';
import { ProfileReferralTab } from './profile/ProfileReferralTab';
import { VerifyEmailModal } from './profile/VerifyEmailModal';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { ErrorState } from '@/components/common/ErrorState';
import { AccountLayout } from './profile/AccountLayout';

import { useAddressBook } from '@/hooks/useAddressBook';
import { useProfileUpdate } from '@/hooks/useProfileUpdate';
import { useProfileOrders } from '@/hooks/useProfileOrders';
import { useRouter } from 'next/navigation';
import { apiSignOut } from '@/services/auth.service';

import type { UserProfile, UserBusiness, WalletSummary, CultivationTree } from '@/types';

type ProfileClientProps = {
  locale: string;
  initialTab?: string;
  initialProfile?: UserProfile;
  initialBusiness?: UserBusiness;
  initialWallet?: WalletSummary;
  initialTrees?: CultivationTree[];
};

export const ProfileClient = ({
  locale,
  initialTab = 'info',
  initialProfile,
  initialBusiness,
  initialWallet,
  initialTrees,
}: ProfileClientProps) => {
  const router = useRouter();
  const t = useTranslations('profile');
  const tActions = useTranslations('actions');
  const tConfirm = useTranslations('confirmModal');
  const tCart = useTranslations('cart');
  const [tabs, setTabs] = useState(initialTab);

  // Queries
  const { data: profile, isError, refetch: refetchProfile } = useProfileMe(initialProfile);
  const { data: business } = useProfileBusiness(initialBusiness);
  const { data: wallet } = useWalletSummary(initialWallet);
  const { data: trees } = useCultivationTrees(initialTrees);
  const { data: kycStatusData, refetch: refetchKycStatus } = useIdentityVerificationStatus();
  const submitKycMutation = useSubmitIdentityVerification();
  const { data: contractsData, isLoading: contractsLoading } = useEContracts();

  // Custom Hooks
  const { saveInlineProfile } = useProfileUpdate(profile, refetchProfile);
  const {
    userOrders,
    ordersLoading,
    ordersError,
    statusFilter,
    setStatusFilter,
    hasMore,
    loadMore,
    statusCounts,
    pagination,
    viewingOrderDetail,
    setViewingOrderDetail,
    selectedOrderForPayment,
    setSelectedOrderForPayment,
    refetchOrders,
    handleViewOrderDetail,
  } = useProfileOrders(tabs);

  const {
    addresses,
    isAddAddressOpen,
    setIsAddAddressOpen,
    deletingAddressId,
    setDeletingAddressId,
    isDeletingAddress,
    addAddress,
    setDefaultAddress,
    confirmDeleteAddress,
  } = useAddressBook(profile?.addresses);

  const [isVerifyEmailOpen, setIsVerifyEmailOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyToast(`${label} ${tActions('copy')}`);
    setTimeout(() => setCopyToast(null), 2500);
  };

  const handleRelogin = async () => {
    try {
      await apiSignOut();
    } catch {}
    router.push(`/${locale}/sign-in?reason=session_expired`);
  };

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <ErrorState
          title={t('title')}
          message={t('subtitle')}
          onRetry={handleRelogin}
        />
      </div>
    );
  }

  const safeOrders = Array.isArray(userOrders) ? userOrders : [];
  const safeTrees = Array.isArray(trees) ? trees : [];
  const safeAddresses = Array.isArray(addresses) ? addresses : [];

  const fullName = profile?.fullName ?? profile?.name ?? '—';
  const email = profile?.email || '';
  const rank = profile?.rank || 'bronze';
  const referralCode = profile?.referralCode || (profile?.id ? String(profile.id).slice(0, 6).toUpperCase() : 'N/A');

  return (
    <div className="w-full bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative">
      {copyToast && (
        <div className="fixed top-6 right-6 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl z-50 transition-opacity animate-in fade-in slide-in-from-top-2 duration-200 flex items-center gap-2 border border-slate-800">
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
        profile={{ fullName, email, rank }}
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
              editPhone={business?.phone || ''}
              onCopyText={handleCopyText}
              onVerifyEmailClick={() => setIsVerifyEmailOpen(true)}
              onSaveProfile={saveInlineProfile}
            />
          )}

          {tabs === 'orders' && (
            <ProfileOrdersTab
              ordersLoading={ordersLoading}
              ordersError={ordersError}
              safeOrders={safeOrders}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              statusCounts={statusCounts}
              pagination={pagination}
              hasMore={hasMore}
              onLoadMore={loadMore}
              onViewDetail={(ord) => handleViewOrderDetail(ord)}
              onPayOrder={(ord) => {
                window.location.href = `/api/proxy/public/payment/sepay/pay/${ord.code || ord.id}`;
              }}
              onRetry={refetchOrders}
            />
          )}

          {(tabs === 'assets' || tabs === 'trees') && (
            <ProfileTreesTab wallet={wallet} safeTrees={safeTrees} />
          )}

          {tabs === 'address' && (
            <ProfileAddressTab
              safeAddresses={safeAddresses}
              isAddAddressOpen={isAddAddressOpen}
              setIsAddAddressOpen={setIsAddAddressOpen}
              onAddAddress={addAddress}
              onSetDefaultAddress={setDefaultAddress}
              onDeleteAddress={setDeletingAddressId}
            />
          )}

          {tabs === 'kyc' && (
            <ProfileKycTab
              profile={profile}
              kycStatusData={kycStatusData}
              refetchKycStatus={refetchKycStatus}
              submitKycMutation={submitKycMutation}
            />
          )}

          {tabs === 'contracts' && (
            <ProfileContractsTab
              contractsLoading={contractsLoading}
              contractsData={Array.isArray(contractsData) ? contractsData : []}
              onOpenContractModal={setSelectedContractId}
            />
          )}

          {(tabs === 'password' || tabs === 'change-password') && (
            <ProfileChangePasswordTab locale={locale} />
          )}

          {(tabs === 'settings' || tabs === 'pin') && (
            <ProfileSettingsTab locale={locale} />
          )}

          {tabs === 'referral' && (
            <ProfileReferralTab
              referralCode={referralCode}
              onCopyText={handleCopyText}
            />
          )}
        </div>
      </AccountLayout>

      {selectedOrderForPayment && (
        <SepayPaymentModal
          isOpen={!!selectedOrderForPayment}
          onClose={() => setSelectedOrderForPayment(null)}
          paymentInfo={{
            qrUrl: '',
            accountNumber: '',
            accountName: '',
            bankBrand: '',
            amount: selectedOrderForPayment.totalAmount,
            orderCode: selectedOrderForPayment.code,
          }}
          onPaymentSuccess={() => {
            toast.success(tCart('paymentSuccess'));
            setSelectedOrderForPayment(null);
            refetchOrders();
          }}
        />
      )}

      {viewingOrderDetail && (
        <OrderDetailModal
          order={viewingOrderDetail}
          onClose={() => setViewingOrderDetail(null)}
          onRefreshOrders={refetchOrders}
        />
      )}

      {selectedContractId && (
        <EContractModal
          contractId={selectedContractId}
          onClose={() => setSelectedContractId(null)}
        />
      )}

      <VerifyEmailModal
        isOpen={isVerifyEmailOpen}
        onClose={() => setIsVerifyEmailOpen(false)}
        userEmail={email}
      />

      <ConfirmModal
        isOpen={!!deletingAddressId}
        title={tConfirm('title')}
        description={tConfirm('description')}
        cancelText={tActions('cancel')}
        confirmText={tActions('delete')}
        isDestructive={true}
        isLoading={isDeletingAddress}
        onConfirm={confirmDeleteAddress}
        onCancel={() => setDeletingAddressId(null)}
      />
    </div>
  );
};
