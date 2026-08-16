'use client';

import { useState } from 'react';
import { Sprout, ShieldCheck, Video, Calendar, Sparkles, ArrowRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/I18nNavigation';

export const GinsengCalculator = ({ locale: _locale = 'vi' }: { locale?: string }) => {
  const [treeCount, setTreeCount] = useState<number>(20);
  const [years, setYears] = useState<number>(5);
  const [seedAge, setSeedAge] = useState<number>(1);

  // Biological & Economic constants for Sâm Ngọc Linh in Măng Ri
  const pricePerSeedling = seedAge === 1 ? 350000 : seedAge === 2 ? 650000 : 1200000;
  const initialCost = treeCount * pricePerSeedling;
  const annualCareFeePerTree = 150000; // Phí chăm sóc bón phân hữu cơ và bảo vệ rừng hàng năm
  const totalCareCost = treeCount * annualCareFeePerTree * years;
  const totalInvestment = initialCost + totalCareCost;

  // Survival rate in pristine forest
  const survivalRate = 0.94; // 94%
  const finalTreesHarvested = Math.round(treeCount * survivalRate);

  // Weight estimation (grams per root at total age)
  const totalAgeAtHarvest = seedAge + years;
  // 4yr: ~25g, 5yr: ~35g, 6yr: ~50g, 7yr: ~70g, 8yr: ~95g
  const weightPerRootGrams = Math.round(Math.pow(totalAgeAtHarvest, 2.1) * 1.8);
  const totalWeightKg = (finalTreesHarvested * weightPerRootGrams) / 1000;

  // Market price per kg based on age (VND)
  // Sâm 5-6 năm: ~90-120tr/kg, 7-8 năm: ~150-200tr/kg
  const pricePerKg = totalAgeAtHarvest <= 5 ? 100000000 : totalAgeAtHarvest <= 7 ? 150000000 : 220000000;
  const estimatedRevenue = Math.round(totalWeightKg * pricePerKg);
  const estimatedProfit = Math.max(0, estimatedRevenue - totalInvestment);
  const annualizedROI = totalInvestment > 0 ? Math.round((estimatedProfit / totalInvestment / years) * 100) : 0;

  return (
    <div className="w-full bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-emerald-800/40 relative overflow-hidden my-10">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-emerald-800/60 pb-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mô Phỏng Tài Chính Nông Nghiệp Số</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Bộ Tính Lợi Nhuận Canh Tác Sâm Ngọc Linh
          </h3>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-xl">
            Minh bạch hóa chi phí giống, tỷ lệ sinh trưởng và giá trị thương phẩm thu hoạch tại đỉnh núi Ngọc Linh (Kon Tum).
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-emerald-300 uppercase tracking-wider block font-bold">Tỷ suất sinh lời kỳ vọng</span>
          <span className="text-3xl sm:text-4xl font-black text-amber-400">+{annualizedROI}%<span className="text-sm font-semibold text-emerald-200">/năm</span></span>
        </div>
      </div>

      {/* Main Grid: Left Controls, Right Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 relative z-10 items-stretch">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Number of Trees */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-emerald-700/40 space-y-3">
            <div className="flex justify-between items-center">
              <label htmlFor="tree-count-slider" className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-400" />
                Số lượng cây giống ủy thác
              </label>
              <span className="text-lg font-black text-white bg-emerald-800/90 px-3 py-1 rounded-xl border border-emerald-600">
                {treeCount} cây
              </span>
            </div>
            <input
              id="tree-count-slider"
              type="range"
              min={5}
              max={200}
              step={5}
              value={treeCount}
              onChange={(e) => setTreeCount(Number(e.target.value))}
              className="w-full h-2 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[11px] text-emerald-400/80 font-medium">
              <span>5 cây (Trải nghiệm)</span>
              <span>50 cây (Luống tiêu chuẩn)</span>
              <span>200 cây (Quy mô trang trại)</span>
            </div>
          </div>

          {/* Slider 2: Cultivation Duration */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-emerald-700/40 space-y-3">
            <div className="flex justify-between items-center">
              <label htmlFor="cultivation-years-slider" className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Thời gian ủy quyền nuôi dưỡng
              </label>
              <span className="text-lg font-black text-amber-400 bg-amber-950/80 px-3 py-1 rounded-xl border border-amber-600/60">
                {years} năm
              </span>
            </div>
            <input
              id="cultivation-years-slider"
              type="range"
              min={3}
              max={7}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[11px] text-emerald-400/80 font-medium">
              <span>3 năm (Dược tính ổn định)</span>
              <span>5 năm (Chuẩn ngâm rượu)</span>
              <span>7 năm (Thượng hạng quý hiếm)</span>
            </div>
          </div>

          {/* Initial Seed Age */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-emerald-700/40 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 block">
              Độ tuổi cây giống ban đầu khi trồng
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { age: 1, label: 'Cây 1 năm tuổi', desc: '350.000 đ/cây' },
                { age: 2, label: 'Cây 2 năm tuổi', desc: '650.000 đ/cây' },
                { age: 3, label: 'Cây 3 năm tuổi', desc: '1.200.000 đ/cây' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.age}
                  onClick={() => setSeedAge(item.age)}
                  className={`p-3 rounded-xl text-left border transition-[color,background-color,border-color,box-shadow] cursor-pointer ${
                    seedAge === item.age
                      ? 'bg-emerald-700 border-emerald-400 text-white shadow-lg'
                      : 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/60'
                  }`}
                >
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projections Card (5 cols) */}
        <div className="lg:col-span-5 bg-emerald-900/80 backdrop-blur-xl border-2 border-emerald-500/40 rounded-3xl p-6 flex flex-col justify-between shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
              <h4 className="font-bold text-sm text-emerald-200">Dự Toán Sản Lượng Thu Hoạch</h4>
              <Award className="w-5 h-5 text-amber-400" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-emerald-300">Tổng tuổi củ khi thu hoạch:</span>
                <span className="font-extrabold text-white text-sm">{totalAgeAtHarvest} năm tuổi</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-300">Số cây thu hoạch (Tỷ lệ 94%):</span>
                <span className="font-extrabold text-white text-sm">{finalTreesHarvested} cây</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-300">Tổng trọng lượng củ tươi ước tính:</span>
                <span className="font-extrabold text-amber-300 text-sm">~{totalWeightKg.toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between items-center border-t border-emerald-800/60 pt-2">
                <span className="text-emerald-300">Tổng vốn ban đầu & phí chăm sóc:</span>
                <span className="font-bold text-emerald-100">{totalInvestment.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            {/* Big Revenue Number */}
            <div className="bg-emerald-950/80 rounded-2xl p-4 border border-emerald-700/60 text-center space-y-1">
              <span className="text-[11px] text-emerald-400 uppercase tracking-wider font-bold">Giá Trị Thương Phẩm Ước Tính</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">
                {estimatedRevenue.toLocaleString('vi-VN')} đ
              </div>
              <p className="text-[10px] text-emerald-400">
                Lợi nhuận ròng dự kiến: <strong className="text-white">{estimatedProfit.toLocaleString('vi-VN')} đ</strong>
              </p>
            </div>

            {/* Trust Points */}
            <div className="space-y-2 text-[11px] text-emerald-200/90 pt-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bảo hiểm 100% rủi ro thiên tai dịch bệnh</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Camera giám sát trực tuyến qua App di động</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Link href="/campaigns/free-tree" className="block w-full">
              <Button className="w-full py-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-colors cursor-pointer">
                <span>Đăng Ký Sở Hữu Luống Sâm Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
