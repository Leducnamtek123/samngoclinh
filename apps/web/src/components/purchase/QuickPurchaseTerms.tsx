'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, ShieldCheck, FileCheck } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

type QuickPurchaseTermsProps = {
  agreedTerms: boolean;
  setAgreedTerms: (agreed: boolean) => void;
  t: (key: string) => string;
};

export const QuickPurchaseTerms: React.FC<QuickPurchaseTermsProps> = ({
  agreedTerms,
  setAgreedTerms,
}) => {
  return (
    <div className="space-y-3 border-t border-border pt-5">
      <label
        htmlFor="agreed-terms-checkbox"
        className="flex items-start sm:items-center gap-3 cursor-pointer select-none group py-1"
      >
        <Checkbox
          id="agreed-terms-checkbox"
          checked={agreedTerms}
          onCheckedChange={(checked: boolean | 'indeterminate') => setAgreedTerms(!!checked)}
          className="shrink-0 mt-0.5 sm:mt-0"
        />
        <span className="text-xs text-foreground font-semibold leading-normal group-hover:text-primary transition-colors">
          Tôi đã đọc và đồng ý với <strong className="text-emerald-800">Điều khoản sử dụng</strong> và <strong className="text-emerald-800">Hợp đồng mua bán, ký gửi &amp; chăm sóc cây Sâm Ngọc Linh</strong>.
        </span>
      </label>

      {/* Pure shadcn Accordion */}
      <Accordion type="single" collapsible className="space-y-2 text-xs pt-1 font-sans">
        {/* Item 1: Terms of Use */}
        <AccordionItem value="terms" className="border border-border/80 rounded-xl px-3 bg-slate-50/50">
          <AccordionTrigger className="py-2.5 hover:no-underline font-bold text-slate-800 text-xs">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Điều Khoản Sử Dụng – Sâm Ngọc Linh</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-2 text-slate-700 text-xs pb-3 pt-1">
            <ul className="list-disc pl-4 space-y-1">
              <li>
                <strong>Giao dịch &amp; Thanh toán:</strong> Nạp tiền và thanh toán 100% bằng VNĐ qua cổng tự động / mã QR trên nền tảng Sâm Ngọc Linh.
              </li>
              <li>
                <strong>Quản lý tài sản:</strong> Cây được trồng và chăm sóc tại farm Sâm Ngọc Linh (xã Trà Linh) và cấp mã định danh vạch/QR theo dõi trên hệ thống.
              </li>
              <li>
                <strong>Bảo đảm đền bù:</strong> Nhà vườn cam kết đền bù củ sâm cùng độ tuổi/trọng lượng quy chuẩn nếu xảy ra rủi ro do lỗi kỹ thuật chăm sóc.
              </li>
            </ul>
            <div className="pt-1.5 border-t border-slate-200/80">
              <Link
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:text-emerald-950 font-bold transition-colors"
              >
                <span>Xem toàn văn 13 Điều khoản sử dụng</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Item 2: Legal eContract */}
        <AccordionItem value="contract" className="border border-border/80 rounded-xl px-3 bg-slate-50/50">
          <AccordionTrigger className="py-2.5 hover:no-underline font-bold text-slate-800 text-xs">
            <span className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Hợp Đồng Mua Bán, Ký Gửi &amp; Chăm Sóc Cây Sâm</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-2 text-slate-700 text-xs pb-3 pt-1">
            <p className="leading-relaxed">
              Hợp đồng mua bán, ký gửi và chăm sóc cây Sâm Ngọc Linh áp dụng cho đơn hàng cây trồng và các dịch vụ đi kèm.
            </p>
            <div className="pt-1.5 border-t border-slate-200/80">
              <Link
                href="/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:text-emerald-950 font-bold transition-colors"
              >
                <span>Mở hợp đồng mua bán, ký gửi và chăm sóc cây Sâm Ngọc Linh</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
