import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ContractToolbar } from '@/components/contract/ContractToolbar';
import { fetchApi } from '@/lib/Api';
import * as fs from 'fs';
import * as path from 'path';

type ContractPageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams?: Promise<Record<string, string>>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Hợp Đồng Mua Bán, Ký Gửi & Chăm Sóc Cây Sâm Ngọc Linh',
    description:
      'Văn bản pháp lý chính thức: Hợp đồng mua bán và ký gửi, chăm sóc cây Sâm Ngọc Linh chuẩn nguồn gốc Kon Tum, Nam Trà My.',
  };
}

/**
 * Helper to get fallback HTML from disk template if API is unreachable
 */
function getDiskFallbackHtml(slug: string, placeholders: Record<string, string>): string {
  const possiblePaths = [
    path.resolve(process.cwd(), 'templates/contracts', `${slug}.html`),
    path.resolve(process.cwd(), '../../templates/contracts', `${slug}.html`),
    path.resolve(process.cwd(), 'templates/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh.html'),
    path.resolve(process.cwd(), '../../templates/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh.html'),
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

  const contractCodeFormatted = slug
    ? `HĐ-${slug.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)}/2026/SNL`
    : 'HĐ-SNL/2026/01';

  const defaultPlaceholders: Record<string, string> = {
    TEN_KHACH_HANG: searchParams.customerName || 'CÔNG TY [*] HOẶC ÔNG/BÀ [*] (KHÁCH HÀNG SỞ HỮU)',
    CCCD_MST: searchParams.idCard || '[*]',
    DIA_CHI: searchParams.address || '[*]',
    SO_DIEN_THOAI: searchParams.phone || '[*]',
    MA_HOP_DONG: contractCodeFormatted,
    SO_LUONG_CAY: searchParams.treeCount || '[*]',
    SO_LUONG_CAY_CHU: searchParams.treeCountWords || '[* cây]',
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
    const res = await fetchApi(`/public/contracts/templates/${targetSlug}?${queryParams.toString()}`, {
      next: { revalidate: 60 }, // Cache 60s for performance, automatic revalidation
    });
    const payload = await res.json();
    if (res.status < 400 && payload.data?.contentHtml) {
      renderedHtml = payload.data.contentHtml;
    }
  } catch (e) {
    console.warn('[ContractPage] Could not fetch dynamic template from API, using fallback:', e);
  }

  // 2. If API not available or empty, load from disk template
  if (!renderedHtml) {
    renderedHtml = getDiskFallbackHtml(slug, defaultPlaceholders);
  }

  return (
    <div className="w-full bg-slate-100/80 min-h-screen py-8 sm:py-12 px-3 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Print & Action Controls Toolbar */}
        <ContractToolbar
          backHref="/campaigns/free-tree"
          contractCode={contractCodeFormatted}
          contractTitle="Hợp Đồng Mua Bán, Ký Gửi & Chăm Sóc Sâm Ngọc Linh"
        />

        {/* Legal Paper Document Container */}
        <article className="legal-document-container bg-white border border-slate-200/90 shadow-xl rounded-3xl p-2 sm:p-4 text-slate-800 leading-relaxed font-sans overflow-hidden">
          {renderedHtml ? (
            <iframe
              title="Văn bản hợp đồng pháp lý"
              srcDoc={renderedHtml}
              className="w-full h-[1150px] min-h-[850px] border-0 rounded-2xl bg-white"
              sandbox="allow-same-origin"
            />
          ) : (
            <div className="p-8 text-center text-slate-500">
              Đang tải nội dung văn bản hợp đồng...
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
