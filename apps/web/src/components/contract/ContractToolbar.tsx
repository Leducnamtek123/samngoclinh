'use client';

import { useState } from 'react';
import { ArrowLeft, Printer, ShieldCheck, Share2, Check } from 'lucide-react';
import { Link } from '@/lib/I18nNavigation';
import { Button } from '@/components/ui/button';

type ContractToolbarProps = {
  backHref?: string;
  contractCode?: string;
  contractTitle?: string;
};

export const ContractToolbar = ({
  backHref = '/campaigns/free-tree',
  contractCode,
  contractTitle = 'Hợp Đồng Mua Bán, Ký Gửi & Chăm Sóc Sâm Ngọc Linh',
}: ContractToolbarProps) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCopyLink = async () => {
    if (typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  return (
    <aside aria-label="Thanh công cụ hợp đồng" className="no-print sticky top-20 sm:top-24 z-40 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-3">
      {/* Left side: Back link & Title */}
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-800 transition-colors px-2.5 py-1.5 rounded-xl hover:bg-slate-100/80"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Quay lại</span>
        </Link>

        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/80">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{contractCode ? `${contractTitle} (${contractCode})` : contractTitle}</span>
        </span>
      </div>

      {/* Right side: Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="h-9 px-3 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-slate-100 rounded-xl inline-flex items-center gap-1.5"
          title="Sao chép liên kết hợp đồng"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Đã sao chép</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden xs:inline">Chia sẻ</span>
            </>
          )}
        </Button>

        <Button
          type="button"
          onClick={handlePrint}
          className="h-9 px-4 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl shadow-xs inline-flex items-center gap-2 transition-all hover:shadow-md cursor-pointer"
          title="In hoặc Lưu thành tệp PDF chuẩn"
        >
          <Printer className="w-4 h-4" />
          <span>In / Xuất PDF</span>
        </Button>
      </div>
    </aside>
  );
};
