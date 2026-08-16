'use client';

import React from 'react';
import { Award, Check, Sparkles } from 'lucide-react';
import { ScrollReveal } from '@/components/animation';

export const HomeSaponinComparison: React.FC = () => {
  return (
    <section className="w-full py-16 sm:py-24 bg-gradient-to-b from-white via-emerald-50/40 to-white dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300 text-xs font-black uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Dược Tính Độc Bản Quốc Bảo Việt Nam</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-tight font-display-lg">
              Vì Sao Sâm Ngọc Linh Đứng Đầu Thế Giới Về Dược Tính?
            </h2>
            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              Kết quả kiểm nghiệm khoa học quốc tế khẳng định Sâm Ngọc Linh sở hữu hàm lượng saponin khung Ocotillol độc bản cùng số lượng hợp chất quý vượt trội mọi loài nhân sâm trên toàn cầu.
            </p>
          </div>
        </ScrollReveal>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: Sâm Ngọc Linh (Hero/Winner) */}
          <ScrollReveal delay={0.1}>
            <div className="relative rounded-3xl p-8 bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-950 text-white shadow-2xl border-2 border-emerald-500 flex flex-col justify-between h-full transform lg:-translate-y-2">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-xs uppercase px-4 py-1 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
                <Award className="w-3.5 h-3.5" />
                <span>Quốc Bảo Thượng Hạng</span>
              </div>

              <div className="space-y-6">
                <div className="border-b border-emerald-800/80 pb-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">Việt Nam</span>
                  <h3 className="text-2xl font-black text-white mt-1">Sâm Ngọc Linh</h3>
                  <p className="text-xs text-emerald-300/80 font-mono italic">Panax vietnamensis Ha et Grushv</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-amber-400">52</span>
                    <span className="text-sm font-bold text-emerald-200 uppercase">Hợp chất Saponin</span>
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    Bao gồm <strong className="text-amber-300">26 saponin cấu trúc mới</strong> chưa từng tìm thấy ở bất kỳ loại sâm nào trên thế giới.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-emerald-800/60 text-xs">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Majonoside R2 (MR2):</strong> Chiếm &gt;50% tổng saponin, chống stress tâm lý, chống oxy hóa và ức chế tế bào lạ.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Địa hình sinh trưởng:</strong> Rừng nguyên sinh 1.800m - 2.598m đỉnh núi Ngọc Linh.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">17 Axit Amin & 20 Khoáng chất:</strong> Tăng cường sinh lực, bồi bổ tế bào thần kinh.</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-emerald-800/80 text-center">
                <span className="inline-block text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                  Chỉ Dẫn Địa Lý Số 00049 • GACP-WHO
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Nhân Sâm Hàn Quốc */}
          <ScrollReveal delay={0.2}>
            <div className="rounded-3xl p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 shadow-md flex flex-col justify-between h-full">
              <div className="space-y-6">
                <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Hàn Quốc / Triều Tiên</span>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">Nhân Sâm Hàn Quốc</h3>
                  <p className="text-xs text-gray-400 font-mono italic">Panax ginseng C.A. Meyer</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-800 dark:text-gray-200">26</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">Hợp chất Saponin</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Chủ yếu gồm các saponin nhóm Dammaran (Ginsenoside Rb1, Rg1, Rd).
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span><strong className="text-gray-800 dark:text-gray-200">Hợp chất MR2:</strong> 0% (Không chứa saponin nhóm Ocotillol quý hiếm).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-gray-800 dark:text-gray-200">Tác dụng:</strong> Phục hồi năng lượng, hỗ trợ tiêu hóa và tuần hoàn máu.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-gray-800 dark:text-gray-200">Quy mô canh tác:</strong> Trồng đại trà theo nông nghiệp công nghiệp.</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
                <span className="text-[11px] font-semibold text-gray-400">
                  Phổ biến trên thị trường quốc tế
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Nhân Sâm Mỹ */}
          <ScrollReveal delay={0.3}>
            <div className="rounded-3xl p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 shadow-md flex flex-col justify-between h-full">
              <div className="space-y-6">
                <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Hoa Kỳ & Canada</span>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">Tây Dương Sâm (Sâm Mỹ)</h3>
                  <p className="text-xs text-gray-400 font-mono italic">Panax quinquefolius</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-800 dark:text-gray-200">14</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">Hợp chất Saponin</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Hàm lượng saponin ở mức vừa phải, có tính mát và an thần nhẹ.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span><strong className="text-gray-800 dark:text-gray-200">Hợp chất MR2:</strong> 0% (Không chứa hợp chất kháng ung thư MR2).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-gray-800 dark:text-gray-200">Tác dụng:</strong> Thanh nhiệt giải độc, an thần, hỗ trợ giấc ngủ.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-gray-800 dark:text-gray-200">Quy mô canh tác:</strong> Nông trại thương mại tại Wisconsin và Ontario.</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
                <span className="text-[11px] font-semibold text-gray-400">
                  Thích hợp cho người thể nhiệt
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom Trust Indicators Banner */}
        <ScrollReveal delay={0.4}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-950 shadow-sm text-center">
            <div className="space-y-1">
              <div className="text-2xl font-black text-emerald-800 dark:text-emerald-400">100%</div>
              <div className="text-xs font-bold text-gray-700 dark:text-gray-300">Sâm Ngọc Linh Thuần Chủng</div>
              <p className="text-[10px] text-gray-400">Kiểm định DNA gen chuẩn giống</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-black text-emerald-800 dark:text-emerald-400">2.598m</div>
              <div className="text-xs font-bold text-gray-700 dark:text-gray-300">Độ Cao Rừng Nguyên Sinh</div>
              <p className="text-[10px] text-gray-400">Khí hậu sương mù quanh năm</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-black text-emerald-800 dark:text-emerald-400">GACP-WHO</div>
              <div className="text-xs font-bold text-gray-700 dark:text-gray-300">Chuẩn Canh Tác Quốc Tế</div>
              <p className="text-[10px] text-gray-400">Hoàn toàn hữu cơ, không hóa chất</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-black text-emerald-800 dark:text-emerald-400">QR Code</div>
              <div className="text-xs font-bold text-gray-700 dark:text-gray-300">Tem Chống Hàng Giả</div>
              <p className="text-[10px] text-gray-400">Truy xuất từng gốc sâm & ngày ngâm</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
