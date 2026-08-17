'use client';

import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Loader2, ShieldCheck, Eye, ListFilter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { econtractService } from '@/services/econtract.service';
import { formatVNDPrice } from '@/utils/formatters';

const vnDateFormatter = new Intl.DateTimeFormat('vi-VN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const formatDate = (val?: string | number | Date | null) => {
  if (!val) {
    return '—';
  }
  try {
    return vnDateFormatter.format(new Date(val));
  } catch {
    return '—';
  }
};

import type { EContractData } from '@/types';

type EContractDocumentViewProps = {
  contract: (EContractData & Record<string, unknown>) | null | undefined;
};

export const EContractDocumentView = ({ contract }: EContractDocumentViewProps) => {
  const t = useTranslations('econtract');
  const [activeView, setActiveView] = useState<'full' | 'summary'>('full');

  const contractCode = String(contract?.code || contract?.id || 'SNL-2026');
  const customerName = String(
    contract?.userName ||
      contract?.user?.name ||
      contract?.user?.fullName ||
      contract?.partyB ||
      'Customer',
  );
  const customerCccd = String(
    contract?.userIdentityNumber ||
      contract?.customerIdentity ||
      (contract?.metadata?.cccd as string) ||
      'eKYC Verified',
  );
  const customerAddress = String(
    contract?.userAddress || (contract?.metadata?.address as string) || 'Hải Châu, TP. Đà Nẵng',
  );
  const customerPhone = String(
    contract?.userPhone ||
      contract?.user?.mobileNumbers?.[0]?.number ||
      (contract?.metadata?.phone as string) ||
      '—',
  );
  const customerEmail = String(
    contract?.userEmail || contract?.user?.email || (contract?.metadata?.email as string) || '—',
  );
  const contractValue = Number(
    contract?.totalAmount || contract?.value || contract?.contractValue || 0,
  );
  const treeCount = String(
    contract?.items?.length || (contract?.metadata?.totalPlants as number) || 1,
  );

  const isTemplateNeeded =
    !contract?.content ||
    (!contract.content.includes('<!DOCTYPE') && !contract.content.includes('<html'));

  const { data: dynamicTemplateHtml = '', isLoading: isLoadingTemplate } = useQuery({
    queryKey: ['contract-template', 'hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh'],
    queryFn: async () =>
      await econtractService
        .getTemplate('hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh')
        .catch(() => ''),
    enabled: isTemplateNeeded,
  });

  const templateHtml = dynamicTemplateHtml;

  const renderedFullHtml = (() => {
    if (
      contract?.content &&
      (contract.content.includes('<!DOCTYPE') ||
        contract.content.includes('<html') ||
        contract.content.length > 100)
    ) {
      let { content } = contract;
      if (contract.signatureUrl) {
        content = content.replaceAll(
          /Chờ khách hàng ký|Chờ ký/g,
          `<img src="${contract.signatureUrl}" alt="Customer Signature" style="max-height: 48px; display: inline-block; object-fit: contain;" />`,
        );
      }
      return content;
    }
    if (!templateHtml) {
      return '';
    }

    const totalVal = formatVNDPrice(contractValue);
    const meta = contract?.metadata || {};
    const careFee = meta.careFee
      ? formatVNDPrice(Number(meta.careFee))
      : formatVNDPrice(Math.round(contractValue * 0.1));
    const signDate = formatDate(
      (contract?.signedAt || contract?.createdAt) as string | number | Date,
    );
    const expireDate = formatDate(contract?.expiredAt as string | number | Date);

    let result = templateHtml
      .replaceAll('{{TEN_KHACH_HANG}}', customerName)
      .replaceAll('{{CCCD_MST}}', customerCccd)
      .replaceAll('{{DIA_CHI}}', customerAddress)
      .replaceAll('{{SO_DIEN_THOAI}}', customerPhone)
      .replaceAll('{{EMAIL}}', customerEmail)
      .replaceAll('{{MA_HOP_DONG}}', String(contractCode || 'HĐ-SNL/2026/01'))
      .replaceAll('{{SO_LUONG_CAY}}', treeCount)
      .replaceAll('{{SO_LUONG_CAY_CHU}}', `${treeCount} plants`)
      .replaceAll('{{TONG_GIA_TRI}}', totalVal)
      .replaceAll('{{TONG_GIA_TRI_CHU}}', totalVal)
      .replaceAll('{{PHI_CHAM_SOC}}', careFee)
      .replaceAll('{{PHI_CHAM_SOC_CHU}}', careFee)
      .replaceAll('{{NGAY_KY}}', signDate)
      .replaceAll('{{NGAY_HET_HAN}}', expireDate);

    if (contract?.signatureUrl) {
      result = result.replaceAll(
        /Chờ khách hàng ký|Chờ ký/g,
        `<img src="${contract.signatureUrl}" alt="Customer Signature" style="max-height: 48px; display: inline-block; object-fit: contain;" />`,
      );
    }

    return result;
  })();

  return (
    <div className="space-y-3">
      {/* View Switcher Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveView('full');
            }}
            className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-bold transition-[color,background-color,box-shadow] ${
              activeView === 'full'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{t('fullText')}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveView('summary');
            }}
            className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-bold transition-[color,background-color,box-shadow] ${
              activeView === 'summary'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ListFilter className="h-3.5 w-3.5" />
            <span>{t('summary')}</span>
          </button>
        </div>

        <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[11px] text-emerald-800">
          {t('latestVersion')}
        </span>
      </div>

      {activeView === 'full' ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-100/80 p-2 shadow-inner sm:p-3">
          {isLoadingTemplate && !renderedFullHtml ? (
            <div className="flex h-96 flex-col items-center justify-center gap-2 rounded-xl bg-white text-xs text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
              <span>{t('loadingContract')}</span>
            </div>
          ) : (
            <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
              <iframe
                title={t('fullText')}
                srcDoc={renderedFullHtml}
                className="h-[520px] w-full border-0 bg-white"
                sandbox="allow-same-origin"
              />
            </div>
          )}
        </div>
      ) : (
        /* Summary View */
        <div className="max-h-96 space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/70 p-5 font-sans text-xs leading-relaxed text-slate-700 shadow-inner sm:p-6 sm:text-sm">
          {/* Header */}
          <div className="space-y-1 border-b border-slate-200 pb-3 text-center">
            <h4 className="text-xs font-extrabold tracking-wider text-slate-900 uppercase sm:text-sm">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </h4>
            <p className="text-[11px] font-bold text-slate-600">Độc lập - Tự do - Hạnh phúc</p>
            <div className="mx-auto mt-1.5 h-0.5 w-24 bg-slate-300" />
          </div>

          <div className="space-y-1 py-1 text-center">
            <h3 className="text-sm font-black text-emerald-900 uppercase sm:text-base">
              {t('title')}
            </h3>
            <p className="font-mono text-[11px] text-slate-500">
              HĐ-{String(contractCode).toUpperCase().slice(0, 10)}/2026/SNL
            </p>
          </div>

          {/* Parties */}
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3.5 text-xs">
            <div className="space-y-1">
              <p className="font-bold text-emerald-900 uppercase">
                BÊN A (BÊN BÁN VÀ NHẬN KÝ GỬI CHĂM SÓC):
              </p>
              <p className="font-semibold text-slate-800">CÔNG TY CỔ PHẦN SÂM NGỌC LINH</p>
              <p className="text-slate-600">
                Địa chỉ: Thôn 2, Xã Trà Linh, Thành phố Đà Nẵng / Huyện Nam Trà My, Tỉnh Quảng Nam
              </p>
              <p className="text-slate-600">Mã số thuế: 4001248522 • Hotline: 0967 234 234</p>
            </div>

            <div className="space-y-1 border-t border-slate-100 pt-2">
              <p className="font-bold text-emerald-900 uppercase">
                BÊN B (BÊN MUA, KHÁCH HÀNG SỞ HỮU CÂY SÂM):
              </p>
              <p className="font-semibold text-slate-800">{customerName}</p>
              <p className="text-slate-600">
                CCCD/ID: <span className="font-medium text-slate-900">{customerCccd}</span>
              </p>
              <p className="text-slate-600">
                {t('contractValue')}:{' '}
                <span className="font-bold text-emerald-800">{formatVNDPrice(contractValue)}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Link */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-2">
        <a
          href="/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>{t('openNewTab')}</span>
          <ExternalLink className="ml-0.5 h-3 w-3" />
        </a>
      </div>
    </div>
  );
};
