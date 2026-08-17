import * as fs from 'node:fs';
import * as path from 'node:path';
import DOMPurify from 'isomorphic-dompurify';
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ContractToolbar } from '@/components/contract/ContractToolbar';
import { fetchApi } from '@/lib/Api';

type ContractPageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams?: Promise<Record<string, string>>;
};

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'econtract' });
  return {
    title: `${t('title')} | Sâm Ngọc Linh`,
    description: t('subtitle'),
  };
}

/**
 * Helper to get fallback HTML from disk template if API is unreachable
 */
function getDiskFallbackHtml(slug: string, placeholders: Record<string, string>): string {
  const possiblePaths = [
    path.resolve(process.cwd(), 'templates/contracts', `${slug}.html`),
    path.resolve(process.cwd(), '../../templates/contracts', `${slug}.html`),
    path.resolve(
      process.cwd(),
      'templates/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh.html',
    ),
    path.resolve(
      process.cwd(),
      '../../templates/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh.html',
    ),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      let content = fs.readFileSync(p, 'utf-8');
      for (const [k, v] of Object.entries(placeholders)) {
        content = content.split(`{{${k}}}`).join(v || '');
      }
      return content;
    }
  }
  return '';
}

export default async function ContractPage(props: ContractPageProps) {
  const { locale, slug } = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'econtract' });

  const contractCodeFormatted = slug
    ? `HĐ-${slug
        .toUpperCase()
        .replaceAll(/[^A-Z0-9]/g, '')
        .slice(0, 10)}/2026/SNL`
    : 'HĐ-SNL/2026/01';

  const defaultPlaceholders: Record<string, string> = {
    TEN_KHACH_HANG: searchParams.customerName || 'CÔNG TY [*] HOẶC ÔNG/BÀ [*]',
    CCCD_MST: searchParams.idCard || '[*]',
    DIA_CHI: searchParams.address || '[*]',
    SO_DIEN_THOAI: searchParams.phone || '[*]',
    MA_HOP_DONG: contractCodeFormatted,
    SO_LUONG_CAY: searchParams.treeCount || '[*]',
    SO_LUONG_CAY_CHU: searchParams.treeCountWords || '[*]',
    TONG_GIA_TRI: searchParams.totalAmount || '[*]',
    TONG_GIA_TRI_CHU: searchParams.totalAmountWords || '[*]',
    PHI_CHAM_SOC: searchParams.careFee || '[*]',
    PHI_CHAM_SOC_CHU: searchParams.careFeeWords || '[*]',
    NGAY_KY: new Date().toLocaleDateString('vi-VN'),
  };

  let renderedHtml = '';

  // 1. Try fetching from dynamic API
  try {
    const queryParams = new URLSearchParams(defaultPlaceholders);
    const targetSlug = slug || 'hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh';
    const res = await fetchApi(
      `/public/contracts/templates/${targetSlug}?${queryParams.toString()}`,
      {
        next: { revalidate: 60 },
      },
    );
    const payload = await res.json();
    if (res.status < 400 && payload.data?.contentHtml) {
      renderedHtml = payload.data.contentHtml;
    }
  } catch (error) {
    console.warn(
      '[ContractPage] Could not fetch dynamic template from API, using fallback:',
      error,
    );
  }

  // 2. If API not available or empty, load from disk template
  if (!renderedHtml) {
    renderedHtml = getDiskFallbackHtml(slug, defaultPlaceholders);
  }

  return (
    <div className="min-h-screen w-full bg-slate-100/80 px-3 py-8 font-sans sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Print & Action Controls Toolbar */}
        <ContractToolbar
          backHref="/campaigns/free-tree"
          contractCode={contractCodeFormatted}
          contractTitle={t('title')}
        />

        {/* Legal Paper Document Container */}
        <article className="legal-document-container overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-4 font-sans leading-relaxed text-slate-800 shadow-xl sm:p-8">
          {renderedHtml ? (
            <div
              className="contract-rendered-content text-sm leading-relaxed sm:text-base"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(renderedHtml, {
                  ADD_TAGS: ['style'],
                  ADD_ATTR: ['target', 'style', 'class'],
                }),
              }}
            />
          ) : (
            <div className="p-12 text-center font-medium text-slate-500">
              {t('loadingContract')}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
