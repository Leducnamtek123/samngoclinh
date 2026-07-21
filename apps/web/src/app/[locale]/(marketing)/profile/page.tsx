import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ProfileClient } from '@/components/ProfileClient';

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

export default async function ProfilePage(props: ProfilePageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const { tabs = 'info' } = await props.searchParams;

  return (
    <div className="w-full">
      <ProfileClient
        locale={locale}
        initialTab={tabs}
      />
    </div>
  );
}
