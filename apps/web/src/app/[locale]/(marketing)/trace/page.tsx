'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, QrCode, ShieldCheck, ArrowRight, Sprout, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TraceIndexPage() {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase().startsWith('hd-') || trimmed.toLowerCase().startsWith('contract-')) {
      router.push(`/trace/contract/${trimmed}`);
    } else {
      router.push(`/trace/${trimmed}`);
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-[80vh] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto space-y-8 text-center">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Cổng Xác Minh Nguồn Gốc & Hợp Đồng</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight font-display-lg">
            Truy Xuất Nguồn Gốc Sâm Ngọc Linh
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Nhập mã định danh trên tem chống hàng giả, mã gốc sâm hoặc mã hợp đồng điện tử để xác minh tính minh bạch.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <QrCode className="w-5 h-5 text-emerald-600" />
              </div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Nhập mã cây sâm (VD: SAM-01) hoặc mã hợp đồng..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            <Button
              type="submit"
              disabled={!code.trim()}
              className="w-full py-4 h-auto rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>Tra Cứu Thông Tin</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Quick Categories */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-left text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300">
                <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                <span>Tra cứu gốc sâm</span>
              </div>
              <p className="text-[11px] text-gray-500">Xem tuổi sâm, vị trí luống, quy trình bón phân và chăm sóc định kỳ.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300">
                <FileText className="w-3.5 h-3.5 text-blue-700" />
                <span>Hợp đồng điện tử</span>
              </div>
              <p className="text-[11px] text-gray-500">Xác thực tính pháp lý chữ ký số và bảo hiểm sinh trưởng cây sâm.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
