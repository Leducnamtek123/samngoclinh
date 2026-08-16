'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Loader2, ShieldCheck, Eye, ListFilter } from 'lucide-react';

const vnDateFormatter = new Intl.DateTimeFormat('vi-VN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const vnCurrencyFormatter = new Intl.NumberFormat('vi-VN');

const formatVND = (v: number) => vnCurrencyFormatter.format(Number(v || 0)) + ' VNĐ';

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
  const [activeView, setActiveView] = useState<'full' | 'summary'>('full');

  const contractCode = contract?.code || contract?.id || 'SNL-2026';
  const customerName = contract?.userName || contract?.user?.name || contract?.partyB || 'Khách hàng';
  const customerCccd = contract?.userIdentityNumber || contract?.customerIdentity || contract?.metadata?.cccd || 'Đã xác thực eKYC';
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
    queryFn: async () => {
      const res = await fetch(
        '/api/proxy/public/contracts/templates/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh'
      );
      if (!res.ok) return '';
      const payload = await res.json();
      return (payload?.data?.contentHtml as string) || '';
    },
    enabled: isTemplateNeeded,
  });

  const templateHtml = dynamicTemplateHtml;

  const renderedFullHtml = (() => {
    if (contract?.content && (contract.content.includes('<!DOCTYPE') || contract.content.includes('<html') || contract.content.length > 100)) {
      let content = contract.content;
      if (contract.signatureUrl) {
        content = content.replace(
          /Chờ khách hàng ký|Chờ ký/g,
          `<img src="${contract.signatureUrl}" alt="Chữ ký khách hàng" style="max-height: 48px; display: inline-block; object-fit: contain;" />`
        );
      }
      return content;
    }
    if (!templateHtml) return '';

    const totalVal = formatVND(contractValue);
    const meta = (contract?.metadata || {}) as any;
    const careFee = meta.careFee ? formatVND(meta.careFee) : formatVND(Math.round(contractValue * 0.1));
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
      .replace(/\{\{SO_LUONG_CAY_CHU\}\}/g, `${treeCount} cây sâm`)
      .replace(/\{\{TONG_GIA_TRI\}\}/g, totalVal)
      .replace(/\{\{TONG_GIA_TRI_CHU\}\}/g, totalVal)
      .replace(/\{\{PHI_CHAM_SOC\}\}/g, careFee)
      .replace(/\{\{PHI_CHAM_SOC_CHU\}\}/g, careFee)
      .replace(/\{\{NGAY_KY\}\}/g, signDate)
      .replace(/\{\{NGAY_HET_HAN\}\}/g, expireDate);

    if (contract?.signatureUrl) {
      result = result.replace(
        /Chờ khách hàng ký|Chờ ký/g,
        `<img src="${contract.signatureUrl}" alt="Chữ ký khách hàng" style="max-height: 48px; display: inline-block; object-fit: contain;" />`
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
            <span>Toàn văn hợp đồng</span>
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
            <span>Tóm tắt</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Bản Mới Nhất
        </span>
      </div>

      {activeView === 'full' ? (
        <div className="border border-slate-200 rounded-2xl bg-slate-100/80 p-2 sm:p-3 shadow-inner">
          {isLoadingTemplate && !renderedFullHtml ? (
            <div className="h-96 bg-white rounded-xl flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              <span>Đang tải toàn văn hợp đồng điện tử mới nhất...</span>
            </div>
          ) : (
            <div className="w-full bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <iframe
                title="Toàn văn hợp đồng điện tử"
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
              HỢP ĐỒNG MUA BÁN VÀ KÝ GỬI, CHĂM SÓC CÂY SÂM NGỌC LINH
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Mã hợp đồng: HĐ-{String(contractCode).toUpperCase().slice(0, 10)}/2026/SNL
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
              <p className="text-slate-600">Số CCCD/Định danh: <span className="font-medium text-slate-900">{customerCccd}</span></p>
              <p className="text-slate-600">Giá trị hợp đồng: <span className="font-bold text-emerald-800">{contractValue.toLocaleString('vi-VN')} VNĐ</span></p>
            </div>
          </div>

          {/* Core Clauses */}
          <div className="space-y-3 pt-1 text-xs">
            <div>
              <p className="font-bold text-slate-900">ĐIỀU 1: ĐỐI TƯỢNG HỢP ĐỒNG VÀ PHƯƠNG ÁN LỰA CHỌN</p>
              <p className="text-slate-600 mt-0.5">
                Bên A đồng ý bán và Bên B đồng ý mua cây Sâm Ngọc Linh thuần chủng. Bên B ủy quyền cho Bên A thực hiện toàn bộ quy trình chăm sóc, nuôi dưỡng, bảo vệ tại Vườn Sâm Ngọc Linh sinh thái của Bên A.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900">ĐIỀU 2: QUẢN LÝ VÀ GIÁM SÁT TRÊN APP SÂM NGỌC LINH</p>
              <p className="text-slate-600 mt-0.5">
                Mỗi cây sâm được định danh bằng mã vạch/mã QR riêng biệt, cập nhật nhật ký tăng trưởng và camera giám sát 24/7 (cho gói từ 100 cây) trên Ứng dụng Sâm Ngọc Linh.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900">ĐIỀU 3: QUY ĐỊNH THỜI GIAN CHỜ VÀ TIỀN TỆ GIAO DỊCH</p>
              <p className="text-slate-600 mt-0.5">
                Áp dụng thời gian chờ kỹ thuật 24h trước khi kích hoạt. Thanh toán 100% bằng đồng Việt Nam (VNĐ), nghiêm cấm mọi hình thức tiền kỹ thuật số / tiền ảo không được pháp luật công nhận.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900">ĐIỀU 4 & 5: BẢO HIỂM VÀ NGUYÊN TẮC BỒI THƯỜNG (CAM KẾT ĐỀN CỦ, KHÔNG ĐỀN CÂY)</p>
              <p className="text-slate-600 mt-0.5">
                Ngoại trừ sự kiện bất khả kháng, nếu cây sâm từ 4 đến 8 tuổi bị hao hụt do lỗi nhà vườn, Bên A cam kết <strong>bồi thường bằng củ sâm thương phẩm thật</strong> đạt trọng lượng tối thiểu theo đúng Phụ lục 01.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900">ĐIỀU 6: THĂM VƯỜN, KIỂM TRA ADN VÀ ĐỀN BÙ CHẤT LƯỢNG</p>
              <p className="text-slate-600 mt-0.5">
                Bên B được quyền thăm vườn trực tiếp/gián tiếp. Nếu kết quả xét nghiệm ADN chứng minh mẫu cây không phải Sâm Ngọc Linh thuần chủng, Bên A chịu trách nhiệm bồi thường <strong>gấp 03 lần</strong> giá trị đã mua.
              </p>
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
          <span>Mở toàn văn hợp đồng trong tab mới</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
      </div>
    </div>
  );
};
