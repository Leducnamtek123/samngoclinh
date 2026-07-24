import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/libs/I18nNavigation';

type PortfolioPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Bộ Sưu Tập Rượu Sâm Ngọc Linh | Rượu Sâm Ngọc Linh',
    description: 'Khám phá các dòng bình rượu Sâm Ngọc Linh thượng hạng ngâm ủ lâu năm tại Đắk Tô, Quảng Nam.',
  };
}

export default async function Portfolio(props: PortfolioPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const collections = [
    {
      id: 'COL-01',
      title: 'Rượu Sâm Ngọc Linh Ngâm Chum Sành 5 Năm',
      volume: 'Bình 5 Lít • Sâm củ 6 năm tuổi',
      desc: 'Ngâm ủ thủ công trong chum sành không tráng men, tách lọc độc tố Andehit, hương thơm sâu lắng êm dịu.',
      image: '/images/products/product_ginseng_bottle_1.png',
      price: 15500000,
    },
    {
      id: 'COL-02',
      title: 'Rượu Sâm Ngọc Linh Hạ Thổ Thượng Hạng',
      volume: 'Bình 10 Lít • Sâm củ 8 năm tuổi',
      desc: 'Hạ thổ 3 năm dưới đại ngàn Ngọc Linh, giữ trọn vẹn 52 hợp chất Saponin quý giá cho sức khỏe.',
      image: '/images/products/product_ginseng_bottle_2.png',
      price: 32000000,
    },
    {
      id: 'COL-03',
      title: 'Rượu Sâm Ngọc Linh Cổ Thụ Nguyên Củ',
      volume: 'Bình 20 Lít • Sâm cổ thụ 12 năm tuổi',
      desc: 'Phiên bản giới hạn chứa củ sâm nguyên dáng tự nhiên độc bản, mang giá trị sưu tầm & phong thủy cao.',
      image: '/images/products/product_ginseng_bottle_3.png',
      price: 68000000,
    },
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-secondary uppercase tracking-widest block">
            BỘ SƯU TẬP ĐỘC BẢN
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary font-display-lg">
            Tinh Hoa Rượu Sâm Ngọc Linh
          </h1>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            Các kiệt tác bình rượu Sâm Ngọc Linh được tuyển chọn từ những củ sâm chuẩn nguồn gốc Quảng Nam, ngâm ủ trong men lá truyền thống.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="h-56 bg-gray-50 rounded-2xl flex items-center justify-center p-4 overflow-hidden border border-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).setAttribute('src', '/images/logo_ruou_sam.png');
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
                    {item.volume}
                  </span>
                  <h3 className="font-extrabold text-gray-900 text-base leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between mt-4">
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase block">Giá niêm yết</span>
                  <span className="text-lg font-black text-secondary">{item.price.toLocaleString('vi-VN')} đ</span>
                </div>
                <Link
                  href="/ginseng"
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  Sở hữu ngay
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
