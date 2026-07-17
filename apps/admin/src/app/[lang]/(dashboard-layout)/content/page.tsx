import type { LocaleType } from '@/types';
import type { Metadata } from 'next';
import { fetchApi } from '@/lib/api';
import { ContentManager } from '@/components/ContentManager';

export const metadata: Metadata = {
  title: 'Quản lý bài viết | Admin',
};

async function getArticles() {
  try {
    const res = await fetchApi('/public/content/articles', {
      cache: 'no-store',
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    return json.data?.items || [];
  } catch (error) {
    console.error('Error fetching articles for admin content page:', error);
    return [];
  }
}

async function getBannerSettings() {
  try {
    const [largeRes, smallRes] = await Promise.all([
      fetchApi('/public/settings/homepage_banner_large_image', { cache: 'no-store' }),
      fetchApi('/public/settings/homepage_banner_small_image', { cache: 'no-store' }),
    ]);

    let largeImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMsiW4ViCyUtMk4AfTXxRrJiQcT8tKQAUyVZSXqxfcf1L9lTee9CFuEtFGMMjXYCiQ171omUJD_nKj17QENbeUhZY9asWGZwU2oUtaEVYL2WrPG-leo-Rl4Z4xzRajZWEEFUdZuNQ-Oabmc8mly-VTAvsgCjL5V8dXv3dSEEgjgGwV9kzzLxA9nRYYRqkuY1002C6NkxdMXfId3twLyXv07FUV5yuZvj7I3k8B5ftQ2qY81eNSId_e';
    let smallImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMm0MsRntVMXJuZkq_isCb_qWD3-uvCuw7p3HKx0E-SWSpRdnCX13R14A5EkaBtLx0vmjYQa9E1AquPBXvMm4zbWQDvVaQQPjjBm16XxTYavFOm4o1KWFxMlGCevWg0QI8T27IldHLjvAOiCs1EeCWCXrhj79MnkffrdbmPfTMyjAjF3Wv0iwhVac1vCXcUBBnMZ7ZMLMT_ih8W6NH1PapFilnZDUzOs5D6CkUAPi6cZLtA3IMEEkn';

    if (largeRes.ok) {
      const json = await largeRes.json();
      if (json.data?.value) largeImage = json.data.value;
    }
    if (smallRes.ok) {
      const json = await smallRes.json();
      if (json.data?.value) smallImage = json.data.value;
    }

    return { largeImage, smallImage };
  } catch (error) {
    console.error('Error fetching banner settings for admin:', error);
    return {
      largeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMsiW4ViCyUtMk4AfTXxRrJiQcT8tKQAUyVZSXqxfcf1L9lTee9CFuEtFGMMjXYCiQ171omUJD_nKj17QENbeUhZY9asWGZwU2oUtaEVYL2WrPG-leo-Rl4Z4xzRajZWEEFUdZuNQ-Oabmc8mly-VTAvsgCjL5V8dXv3dSEEgjgGwV9kzzLxA9nRYYRqkuY1002C6NkxdMXfId3twLyXv07FUV5yuZvj7I3k8B5ftQ2qY81eNSId_e',
      smallImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMm0MsRntVMXJuZkq_isCb_qWD3-uvCuw7p3HKx0E-SWSpRdnCX13R14A5EkaBtLx0vmjYQa9E1AquPBXvMm4zbWQDvVaQQPjjBm16XxTYavFOm4o1KWFxMlGCevWg0QI8T27IldHLjvAOiCs1EeCWCXrhj79MnkffrdbmPfTMyjAjF3Wv0iwhVac1vCXcUBBnMZ7ZMLMT_ih8W6NH1PapFilnZDUzOs5D6CkUAPi6cZLtA3IMEEkn',
    };
  }
}

export default async function ContentPage(props: {
  params: Promise<{ lang: LocaleType }>;
}) {
  const [articles, bannerSettings] = await Promise.all([
    getArticles(),
    getBannerSettings(),
  ]);

  return (
    <div className="container py-6 space-y-6">
      <ContentManager initialArticles={articles} initialBannerSettings={bannerSettings} />
    </div>
  );
}
