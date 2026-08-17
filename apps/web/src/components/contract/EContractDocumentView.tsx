'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { econtractService } from '@/services/econtract.service';
import { ExternalLink, Loader2, ShieldCheck, Eye, ListFilter } from 'lucide-react';
import { formatVNDPrice } from '@/utils/formatters';

const vnDateFormatter = new Intl.DateTimeFormat('vi-VN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const formatDate = (val?: string | number | Date | null) => {
  if (!val) return '—';
  try {
    return vnDateFormatter.format(new Date(val));
  } catch {
    return '—';
  }
};

type EContractDocumentViewProps = {
  contract: any;
};

export const EContractDocumentView = ({ contract }: EContractDocumentViewProps) => {
  const t = useTranslations('econtract');
  const [activeView, setActiveView] = useState<'full' | 'summary'>('full');

  const contractCode = contract?.code || contract?.id || 'SNL-2026';
  const customerName = contract?.userName || contract?.user?.name || contract?.partyB || 'Customer';
  const customerCccd = contract?.userIdentityNumber || contract?.customerIdentity || contract?.metadata?.cccd || 'eKYC Verified';
  const customerAddress = contract?.userAddress || contract?.metadata?.address || 'Hải Châu, TP. Đà Nẵng';
  const customerPhone = contract?.userPhone || contract?.user?.mobileNumbers?.[0]?.number || contract?.metadata?.phone || '—';
  const customerEmail = contract?.userEmail || contract?.user?.email || contract?.metadata?.email || '—';
  const contractValue = contract?.totalAmount || contract?.value || contract?.contractValue || 0;
  const treeCount = String(contract?.items?.length || contract?.metadata?.totalPlants || 1);

  const isTemplateNeeded =
    !contract?.content ||
    (!contract.content.includes('<!DOCTYPE') && !contract.content.includes('<html'));

  const { data: dynamicTemplateHtml = '', isLoading: isLoadingTemplate } = useQuery({
    queryKey: ['contract-template', 'hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh'],
    queryFn: () => econtractService.getTemplate('hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh').catch(() => ''),
    enabled: isTemplateNeeded,
  });

  const templateHtml = dynamicTemplateHtml;

  const renderedFullHtml = (() => {
    if (contract?.content && (contract.content.includes('<!DOCTYPE') || contract.content.includes('<html') || contract.content.length > 100)) {
      let content = contract.content;
      if (contract.signatureUrl) {
        content = content.replace(
          /Chờ khách hàng ký|Chờ ký/g,
          `<img src="${contract.signatureUrl}" alt="Customer Signature" style="max-height: 48px; display: inline-block; object-fit: contain;" />`
        );
      }
      return content;
    }
    if (!templateHtml) return '';

    const totalVal = formatVNDPrice(contractValue);
    const meta = (contract?.metadata || {}) as any;
    const careFee = meta.careFee ? formatVNDPrice(meta.careFee) : formatVNDPrice(Math.round(contractValue * 0.1));
    const signDate = formatDate(contract?.signedAt || contract?.createdAt);
    const expireDate = formatDate(contract?.expiredAt);

    let result = templateHtml
      .replace(/\{\{TEN_KHACH_HANG\}\}/g, customerName)
      .replace(/\{\{CCCD_MST\}\}/g, customerCccd)
      .replace(/\{\{DIA_CHI\}\}/g, customerAddress)
      .replace(/\{\{SO_DIEN_THOAI\}\}/g, customerPhone)
      .replace(/\{\{EMAIL\}\}/g, customerEmail)
      .replace(/\{\{MA_HOP_DONG\}\}/g, String(contractCode || 'HĐ-SNL/2026/01'))
      .replace(/\{\{SO_LUONG_CAY\}\}/g, treeCount)
      .replace(/\{\{SO_LUONG_CAY_CHU\}\}/g, `${treeCount} plants`)
      .replace(/\{\{TONG_GIA_TRI\}\}/g, totalVal)
      .replace(/\{\{TONG_GIA_TRI_CHU\}\}/g, totalVal)
      .replace(/\{\{PHI_CHAM_SOC\}\}/g, careFee)
      .replace(/\{\{PHI_CHAM_SOC_CHU\}\}/g, careFee)
      .replace(/\{\{NGAY_KY\}\}/g, signDate)
      .replace(/\{\{NGAY_HET_HAN\}\}/g, expireDate);

    if (contract?.signatureUrl) {
      result = result.replace(
        /Chờ khách hàng ký|Chờ ký/g,
        `<img src="${contract.signatureUrl}" alt="Customer Signature" style="max-height: 48px; display: inline-block; object-fit: contain;" />`
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
            onClick={() => setActiveView('full')}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-[color,background-color,box-shadow] ${
              activeView === 'full'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t('fullText')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('summary')}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-[color,background-color,box-shadow] ${
              activeView === 'summary'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>{t('summary')}</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          {t('latestVersion')}
        </span>
      </div>

      {activeView === 'full' ? (
        <div className="border border-slate-200 rounded-2xl bg-slate-100/80 p-2 sm:p-3 shadow-inner">
          {isLoadingTemplate && !renderedFullHtml ? (
            <div className="h-96 bg-white rounded-xl flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              <span>{t('loadingContract')}</span>
            </div>
          ) : (
            <div className="w-full bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <iframe
                title={t('fullText')}
                srcDoc={renderedFullHtml}
                className="w-full h-[520px] border-0 bg-white"
                sandbox="allow-same-origin"
              />
            </div>
          )}
        </div>
      ) : (
        /* Summary View */
        <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 bg-slate-50/70 space-y-4 max-h-96 overflow-y-auto text-xs sm:text-sm text-slate-700 leading-relaxed font-sans shadow-inner">
          {/* Header */}
          <div className="text-center pb-3 border-b border-slate-200 space-y-1">
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-xs sm:text-sm">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </h4>
            <p className="text-[11px] font-bold text-slate-600">
              Độc lập - Tự do - Hạnh phúc
            </p>
            <div className="w-24 h-0.5 bg-slate-300 mx-auto mt-1.5"></div>
          </div>

          <div className="text-center space-y-1 py-1">
            <h3 className="font-black text-emerald-900 uppercase text-sm sm:text-base">
              {t('title')}
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              HĐ-{String(contractCode).toUpperCase().slice(0, 10)}/2026/SNL
            </p>
          </div>

          {/* Parties */}
          <div className="space-y-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
            <div className="space-y-1">
              <p className="font-bold text-emerald-900 uppercase">
                BÊN A (BÊN BÁN VÀ NHẬN KÝ GỬI CHĂM SÓC):
              </p>
              <p className="font-semibold text-slate-800">CÔNG TY CỔ PHẦN SÂM NGỌC LINH</p>
              <p className="text-slate-600">Địa chỉ: Thôn 2, Xã Trà Linh, Thành phố Đà Nẵng / Huyện Nam Trà My, Tỉnh Quảng Nam</p>
              <p className="text-slate-600">Mã số thuế: 4001248522 • Hotline: 0967 234 234</p>
            </div>

            <div className="border-t border-slate-100 pt-2 space-y-1">
              <p className="font-bold text-emerald-900 uppercase">
                BÊN B (BÊN MUA, KHÁCH HÀNG SỞ HỮU CÂY SÂM):
              </p>
              <p className="font-semibold text-slate-800">{customerName}</p>
              <p className="text-slate-600">CCCD/ID: <span className="font-medium text-slate-900">{customerCccd}</span></p>
              <p className="text-slate-600">{t('contractValue')}: <span className="font-bold text-emerald-800">{formatVNDPrice(contractValue)}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Link */}
      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
        <a
          href="/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('openNewTab')}</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
      </div>
    </div>
  );
};
