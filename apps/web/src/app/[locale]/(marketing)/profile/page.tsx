import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ProfileClient } from '@/components/ProfileClient';
import { fetchApi } from '@/libs/Api';

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tabs?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Hồ Sơ Cá Nhân | Rượu Sâm Ngọc Linh',
    description: 'Quản lý thông tin tài khoản, ví điểm và tài sản của bạn.',
  };
}

async function getProfile() {
  try {
    const res = await fetchApi('/user/profile/me', { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Error prefetching profile:', error);
    return null;
  }
}

async function getBusiness() {
  try {
    const res = await fetchApi('/user/profile/business', { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Error prefetching business profile:', error);
    return null;
  }
}

async function getWallet() {
  try {
    const res = await fetchApi('/user/wallet/summary', { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Error prefetching wallet:', error);
    return null;
  }
}

async function getTrees() {
  try {
    const res = await fetchApi('/user/cultivation/trees', { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.items || [];
  } catch (error) {
    console.error('Error prefetching trees:', error);
    return [];
  }
}

export default async function ProfilePage(props: ProfilePageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const { tabs = 'info' } = await props.searchParams;

  // Run calls in parallel for optimal speed
  const [profile, business, wallet, trees] = await Promise.all([
    getProfile(),
    getBusiness(),
    getWallet(),
    getTrees(),
  ]);

  return (
    <div className="w-full">
      <ProfileClient
        locale={locale}
        initialTab={tabs}
        initialProfile={profile}
        initialBusiness={business}
        initialWallet={wallet}
        initialTrees={trees}
      />
    </div>
  );
}
