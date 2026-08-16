import type { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/lib/I18nNavigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

type ContractPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Hợp Đồng Mua Bán, Ký Gửi & Chăm Sóc Cây Sâm Ngọc Linh',
    description: 'Văn bản hợp đồng mua bán, ký gửi và chăm sóc sâm Ngọc Linh chính thức tại Kon Tum.',
  };
}

export default async function ContractPage(props: ContractPageProps) {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="w-full bg-slate-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Actions Topbar */}
        <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <Link
            href="/campaigns/free-tree"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang ưu đãi</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Văn bản pháp lý chính thức</span>
            </span>
          </div>
        </div>

        {/* Legal Paper Document Container */}
        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 sm:p-14 text-slate-900 space-y-8 print:shadow-none print:border-none print:p-0">
          
          {/* Header National Motto */}
          <div className="text-center space-y-1 pb-6 border-b border-slate-200">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-800">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </h4>
            <p className="text-xs font-extrabold text-slate-700 tracking-wider">
              Độc lập – Tự do – Hạnh phúc
            </p>
            <div className="w-32 h-[1px] bg-slate-300 mx-auto mt-2"></div>
          </div>

          {/* Company Branding & Title */}
          <div className="text-center space-y-4 pt-4">
            <div className="w-16 h-16 relative mx-auto">
              <Image
                src="/assets/images/logo_ruou_sam.png?v=2"
                alt="Rượu Sâm Ngọc Linh Logo"
                width={64}
                height={64}
                unoptimized
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-extrabold text-emerald-800 uppercase tracking-widest">
                CÔNG TY CỔ PHẦN SÂM NGỌC LINH
              </h3>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight uppercase font-display-lg pt-2">
                HỢP ĐỒNG MUA BÁN, KÝ GỬI VÀ CHĂM SÓC CÂY SÂM NGỌC LINH
              </h1>
              <p className="text-xs text-slate-500 font-medium italic">
                Số: HĐ-{slug.toUpperCase().slice(0, 10)}/2026/SNL-KT
              </p>
            </div>
          </div>

          {/* Preamble */}
          <div className="text-xs sm:text-sm leading-relaxed text-slate-700 space-y-3 pt-4 border-t border-slate-100">
            <p>
              Căn cứ Bộ luật Dân sự nước Cộng hòa Xã hội Chủ nghĩa Việt Nam số 91/2015/QH13;
            </p>
            <p>
              Căn cứ Luật Thương mại số 36/2005/QH11 ban hành ngày 14 tháng 06 năm 2005;
            </p>
            <p>
              Căn cứ nhu cầu và khả năng thực tế của hai bên ký kết hợp đồng.
            </p>
          </div>

          {/* Parties Section */}
          <div className="space-y-4 bg-slate-50/80 border border-slate-200/70 rounded-2xl p-5 text-xs sm:text-sm">
            <div className="space-y-1">
              <h4 className="font-bold text-emerald-900 uppercase">BÊN A (BÊN BÁN VÀ NHẬN KÝ GỬI CHĂM SÓC):</h4>
              <p className="font-semibold text-slate-800">CÔNG TY CỔ PHẦN SÂM NGỌC LINH</p>
              <p>Mã số doanh nghiệp: 0316913632 cấp ngày 22/06/2021 tại Sở Kế hoạch và Đầu tư TP.HCM</p>
              <p>Địa chỉ Showroom: 156 Tây Thạnh, P. Tây Thạnh, Q. Tân Phú, TP. Hồ Chí Minh</p>
              <p>Địa chỉ Vườn sâm: Huyện Nam Trà My & Đắk Lei, Tỉnh Kon Tum, Việt Nam</p>
              <p>Hotline hỗ trợ: 0967 234 234 – Email: admin@wefarm.com.vn</p>
            </div>

            <div className="border-t border-slate-200 pt-3 space-y-1">
              <h4 className="font-bold text-emerald-900 uppercase">BÊN B (BÊN MUA VÀ CHỦ SỞ HỮU CÂY SÂM):</h4>
              <p className="font-semibold text-slate-800">KHÁCH HÀNG ĐĂNG KÝ TRÊN HỆ THỐNG iWE FARM</p>
              <p>Thông tin định danh cá nhân được xác thực tự động qua mã tài khoản người dùng trực tuyến.</p>
            </div>
          </div>

          {/* Contract Clauses */}
          <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base text-emerald-900">
                ĐIỀU 1: ĐỐI TƯỢNG HỢP ĐỒNG VÀ CHƯƠNG TRÌNH ƯU ĐÃI
              </h3>
              <p>
                1.1. Bên A đồng ý bán/tặng và chuyển giao quyền sở hữu cây Sâm Ngọc Linh thuần chủng Kon Tum cho Bên B theo đúng mã số quản lý định danh.
              </p>
              <p>
                1.2. Bên B ủy quyền ký gửi toàn bộ quá trình chăm sóc, bảo vệ và nuôi trồng cây Sâm Ngọc Linh cho Bên A tại khu vực Vườn sâm chuẩn sinh thái của Bên A tại Kon Tum.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base text-emerald-900">
                ĐIỀU 2: CHẤT LƯỢNG VÀ QUY TRÌNH CHĂM SÓC
              </h3>
              <p>
                2.1. Bên A cam kết cây Sâm Ngọc Linh là giống chuẩn 100% nguồn gốc Kon Tum, sinh trưởng hoàn toàn trong môi trường bán tự nhiên dưới tán rừng nguyên sinh.
              </p>
              <p>
                2.2. Bên A chịu trách nhiệm áp dụng đúng quy trình kỹ thuật nông nghiệp hữu cơ, không sử dụng hóa chất độc hại, đảm bảo cây đạt tỷ lệ sống và phát triển tối ưu.
              </p>
              <p>
                2.3. Định kỳ hàng tháng/quý, Bên A cung cấp nhật ký tăng trưởng, hình ảnh và video thực tế cây sâm của Bên B trên hồ sơ ứng dụng trực tuyến.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base text-emerald-900">
                ĐIỀU 3: BẢO HIỂM VÀ CAM KẾT RỦI RO
              </h3>
              <p>
                3.1. Đối với các cây sâm tham gia Gói Bảo Vệ/Đảm Bảo: Trong trường hợp cây sâm bị rủi ro thiên tai, dịch bệnh hoặc hư hại ngoài mong muốn, Bên A cam kết đền bù 100% cây sâm cùng độ tuổi tương đương cho Bên B.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base text-emerald-900">
                ĐIỀU 4: THỜI HẠN VÀ ĐIỀU KHẢO N KÍCH HOẠT
              </h3>
              <p>
                4.1. Hợp đồng này có hiệu lực kể từ thời điểm Bên B hoàn tất đăng ký và thanh toán các phí dịch vụ đi kèm thành công trên hệ thống.
              </p>
              <p>
                4.2. Hai bên cam kết thực hiện đúng các điều khoản nêu trên. Mọi tranh chấp nếu có sẽ được ưu tiên giải quyết thông qua thương lượng hòa giải trên tinh thần hợp tác minh bạch.
              </p>
            </div>
          </div>

          {/* Signatures & Seal Section */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs sm:text-sm">
            <div className="space-y-12">
              <div>
                <p className="font-bold text-slate-900 uppercase">ĐẠI DIỆN BÊN B</p>
                <p className="text-xs text-slate-500 italic">(Ký, ghi rõ họ tên và xác thực điện tử)</p>
              </div>
              <div className="pt-8 font-bold text-slate-800">
                [XÁC THỰC ĐIỆN TỬ QUA TÀI KHOẢN]
              </div>
            </div>

            <div className="space-y-12">
              <div>
                <p className="font-bold text-slate-900 uppercase">ĐẠI DIỆN BÊN A</p>
                <p className="text-xs text-slate-500 italic">CÔNG TY CỔ PHẦN SÂM NGỌC LINH</p>
              </div>
              <div className="pt-4 flex flex-col items-center">
                <div className="w-24 h-24 relative border-2 border-dashed border-emerald-600/40 rounded-full flex items-center justify-center p-2 text-center text-[10px] font-black text-emerald-800 leading-tight rotate-[-6deg] bg-emerald-50/50">
                  <span>ĐÃ KÝ & ĐÓNG DẤU ĐIỆN TỬ</span>
                </div>
                <p className="font-bold text-slate-900 mt-2">Tổng Giám Đốc</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
