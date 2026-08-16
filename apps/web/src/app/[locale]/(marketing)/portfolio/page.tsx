import type { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/lib/I18nNavigation';
import { Award, ShieldCheck, Sparkles, Check, ArrowRight, Droplets, Clock, Flame } from 'lucide-react';
import { ScrollReveal, StaggerContainer } from '@/components/animation';

type PortfolioPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Bộ Sưu Tập Rượu Sâm Ngọc Linh Thượng Hạng | Di Sản Quốc Bảo',
    description: 'Chiêm ngưỡng các kiệt tác bình rượu Sâm Ngọc Linh ngâm ủ lâu năm độc bản, chuẩn nguồn gốc đỉnh núi Ngọc Linh.',
  };
}

export default async function Portfolio(props: PortfolioPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const masterpiece = {
    id: 'COL-GRAND-01',
    code: 'SNL-VINTAGE-2014',
    title: 'Rượu Sâm Ngọc Linh Cổ Thụ Độc Bản 12 Năm Tuổi',
    volume: 'Bình Pha Lê 20 Lít • Củ Sâm Tự Nhiên 12 Năm',
    edition: 'Phiên bản Hoàng gia giới hạn 09 bình',
    age: '12 năm tuổi',
    abv: '39% Vol',
    steepTime: 'Ngâm ủ 5 năm trong hầm đá ngầm',
    desc: 'Tuyển chọn từ củ sâm Ngọc Linh nguyên vẹn rễ nhánh khai thác ở độ cao 2.100m đỉnh núi Ngọc Linh. Kết hợp cùng rượu men lá thảo dược bí truyền của đồng bào Xơ Đăng, trải qua quá trình hạ thổ tách lọc độc tố Andehit hoàn hảo.',
    price: 68000000,
    image: '/images/products/wine_root.png',
    highlights: [
      'Hàm lượng Saponin MR2 đạt đỉnh >52% tổng dược tính',
      'Rượu êm dịu, hậu vị ngọt sâu lắng, màu hổ phách sóng sánh',
      'Đính kèm Chứng Thư Giám Định Gen DNA & Tem QR Chống Giả',
    ],
  };

  const reserveCollections = [
    {
      id: 'COL-02',
      code: 'SNL-RESERVE-8Y',
      title: 'Rượu Sâm Ngọc Linh Hạ Thổ Thượng Hạng',
      volume: 'Bình 10 Lít • Sâm củ 8 năm tuổi',
      age: '8 năm tuổi',
      abv: '38% Vol',
      steepTime: 'Hạ thổ 3 năm trong chum sành mộc',
      desc: 'Ngâm ủ từ những củ sâm đạt chuẩn dược điển, hương vị đậm đà, bổ khí huyết, tăng cường sinh lực và tăng khả năng miễn dịch.',
      price: 32000000,
      image: '/images/products/wine_root.png',
    },
    {
      id: 'COL-03',
      code: 'SNL-CLASSIC-6Y',
      title: 'Rượu Sâm Ngọc Linh Chum Sành Cổ Truyền',
      volume: 'Bình 5 Lít • Sâm củ 6 năm tuổi',
      age: '6 năm tuổi',
      abv: '35% Vol',
      steepTime: 'Ngâm ủ 2 năm trong chum sành không tráng men',
      desc: 'Dòng sản phẩm lý tưởng để thưởng thức hàng ngày hoặc làm quà biếu đối tác ngoại giao, mang trọn tinh hoa của núi rừng Kon Tum.',
      price: 15500000,
      image: '/images/products/wine_root.png',
    },
  ];

  return (
    <div className="w-full bg-brand-bg text-gray-900 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        
        {/* Header Section (Editorial Asymmetric Layout) */}
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-gray-200/80 pb-8">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900 text-amber-300 text-xs font-black uppercase tracking-widest shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tuyển Tập Kiệt Tác Độc Bản</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-primary font-display tracking-tight leading-tight">
                Bộ Sưu Tập Rượu Sâm Ngọc Linh
              </h1>
              <p className="text-gray-600 text-sm sm:text-base font-normal leading-relaxed">
                Được tuyển chọn nghiêm ngặt từ những gốc sâm cổ thuần chủng tại rừng nguyên sinh Nam Trà My & Kon Tum, ngâm ủ trong chum sành men lá truyền thống để giữ trọn vẹn dược tính vàng.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 shrink-0">
              <span className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Chỉ Dẫn Địa Lý Số 00049</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Chuẩn Men Lá Cổ Truyền</span>
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Masterpiece Feature Spotlight (60/40 Asymmetric Split) */}
        <ScrollReveal variant="scale" duration={1.1} scaleFrom={0.96}>
          <div className="bg-gradient-to-br from-emerald-950 via-[#122B18] to-slate-950 rounded-3xl p-6 sm:p-12 text-white shadow-2xl border border-emerald-800/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              {/* Left Visual: Grand Bottle Display */}
              <div className="lg:col-span-5 relative group">
                <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-2xl bg-white/5 border border-emerald-700/40 backdrop-blur-md p-6 flex items-center justify-center overflow-hidden">
                  <div className="absolute top-4 left-4 bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                    {masterpiece.edition}
                  </div>
                  <Image
                    src={masterpiece.image}
                    alt={masterpiece.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-contain p-4 group-hover:scale-108 transition-transform duration-700 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
                    unoptimized
                  />
                </div>
              </div>

              {/* Right Content: Narrative & Biological Breakdown */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">
                    {masterpiece.code}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white font-display tracking-tight leading-snug">
                    {masterpiece.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed font-normal">
                    {masterpiece.desc}
                  </p>
                </div>

                {/* Key Specs Matrix */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-white/5 rounded-2xl border border-emerald-700/30 text-center">
                  <div className="space-y-1">
                    <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" /> Tuổi sâm
                    </span>
                    <p className="text-sm sm:text-base font-extrabold text-white">{masterpiece.age}</p>
                  </div>
                  <div className="space-y-1 border-x border-emerald-800/60">
                    <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center justify-center gap-1">
                      <Flame className="w-3 h-3" /> Nồng độ
                    </span>
                    <p className="text-sm sm:text-base font-extrabold text-white">{masterpiece.abv}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center justify-center gap-1">
                      <Droplets className="w-3 h-3" /> Quy cách
                    </span>
                    <p className="text-sm sm:text-base font-extrabold text-white">Bình 20 Lít</p>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="space-y-2.5 text-xs text-emerald-100">
                  {masterpiece.highlights.map((point) => (
                    <div key={point} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                {/* Price & Acquisition Call to Action */}
                <div className="pt-4 border-t border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">
                      Giá niêm yết độc bản
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
                      {masterpiece.price.toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  <Link
                    href={`/${locale}/products`}
                    className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm px-7 py-3.5 rounded-2xl shadow-xl transition-[transform,background-color] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <span>Liên Hệ Sở Hữu Ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Reserve Editions (Asymmetric 2-Column Staggered Grid) */}
        <div className="space-y-8">
          <div className="border-b border-gray-200/80 pb-4">
            <h3 className="text-2xl font-extrabold text-primary font-display">
              Các Dòng Rượu Hạ Thổ Dự Trữ Đặc Biệt
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Tuyển chọn các phiên bản bình rượu sâm ngâm chum sành từ 6 đến 8 năm tuổi dành cho người sành thưởng thức.
            </p>
          </div>

          <StaggerContainer variant="fade-up" stagger={0.15} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {reserveCollections.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between group p-6 sm:p-8"
              >
                <div className="space-y-6">
                  {/* Top Image + Quick Spec Tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    <div className="sm:col-span-5 aspect-square bg-gray-50/80 rounded-2xl border border-gray-100 p-4 relative overflow-hidden flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    </div>
                    
                    <div className="sm:col-span-7 space-y-3">
                      <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md inline-block border border-emerald-100">
                        {item.code}
                      </span>
                      <h4 className="font-extrabold text-gray-900 text-lg leading-snug group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Spec Row */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-xl text-center text-xs font-semibold text-gray-600 border border-gray-100">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">Quy cách</span>
                      <span className="font-bold text-gray-800">{item.volume.split('•')[0]}</span>
                    </div>
                    <div className="border-x border-gray-200">
                      <span className="text-[10px] text-gray-400 block font-medium">Niên vụ</span>
                      <span className="font-bold text-gray-800">{item.age}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">Nồng độ</span>
                      <span className="font-bold text-gray-800">{item.abv}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-6">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Giá niêm yết</span>
                    <span className="text-xl font-black text-primary tracking-tight">
                      {item.price.toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  <Link
                    href={`/${locale}/products`}
                    className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-[box-shadow,transform,background-color] shadow-xs hover:shadow-md active:scale-[0.98] cursor-pointer"
                  >
                    <span>Đặt mua ngay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>

      </div>
    </div>
  );
}
