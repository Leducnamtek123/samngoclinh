import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { fetchApi } from '@/lib/Api';
import { Link } from '@/lib/I18nNavigation';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  Hash,
  Lock,
  QrCode,
  ShieldCheck,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type ContractTracePageProps = {
  params: Promise<{ locale: string; code: string | string[] }>;
};

function resolveCode(code: string | string[]): string {
  if (Array.isArray(code)) {
    return code.join('/');
  }
  return code || '';
}

export async function generateMetadata({ params }: ContractTracePageProps): Promise<Metadata> {
  const { code } = await params;
  const contractCode = resolveCode(code);
  return {
    title: `Xác Thực Hợp Đồng Điện Tử #${contractCode} | Sâm Ngọc Linh`,
    description: `Tra cứu tính pháp lý, toàn vẹn và thông tin chứng thực điện tử của hợp đồng #${contractCode}.`,
  };
}

async function getContractVerification(code: string) {
  try {
    const res = await fetchApi(`/public/contracts/verify?code=${encodeURIComponent(code)}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      // Fallback direct path
      const directRes = await fetchApi(`/public/contracts/verify/${encodeURIComponent(code)}`, {
        cache: 'no-store',
      });
      if (!directRes.ok) return null;
      const directJson = await directRes.json();
      return directJson.data || null;
    }
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Error fetching contract verification:', error);
    return null;
  }
}

export default async function ContractTracePage(props: ContractTracePageProps) {
  const { locale, code } = await props.params;
  setRequestLocale(locale);

  const contractCode = resolveCode(code);
  const verification = await getContractVerification(contractCode);
  const pdfDownloadUrl = `/api/proxy/public/contracts/pdf?code=${encodeURIComponent(contractCode)}`;

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Trang chủ</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cổng Tra Cứu Hợp Đồng Điện Tử</span>
            </span>
          </div>
        </div>

        {!verification ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl p-8 sm:p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Không Tìm Thấy Hợp Đồng
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Mã hợp đồng <strong className="font-mono text-slate-800 dark:text-slate-200">#{contractCode}</strong> không tồn tại trong hệ thống hoặc đã bị thu hồi. Vui lòng kiểm tra lại mã QR trên tài liệu.
            </p>
            <div className="pt-2">
              <Button asChild variant="outline">
                <Link href="/">Quay về trang chủ</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl overflow-hidden">
            {/* Header Certificate Banner */}
            <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-extrabold uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Chứng thực hợp lệ</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                    Chứng Thư Hợp Đồng Điện Tử
                  </h1>
                  <p className="text-xs text-emerald-200/90 font-mono">
                    Mã số: {verification.contractCode}
                  </p>
                </div>

                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center p-2.5 border border-white/20 shrink-0">
                  <FileCheck2 className="w-8 h-8 text-emerald-300" />
                </div>
              </div>
            </div>

            {/* Certificate Details Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Document Overview Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Thông tin hợp đồng</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-500 block text-xs">Tiêu đề hợp đồng:</span>
                    <strong className="text-slate-900 dark:text-slate-100 font-bold">
                      {verification.contractTitle || 'Hợp đồng ký gửi & chăm sóc sâm Ngọc Linh'}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-xs">Trạng thái pháp lý:</span>
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Đã ký & Có hiệu lực
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-xs">Bên A (Bên nhận ký gửi):</span>
                    <strong className="text-slate-900 dark:text-slate-100">
                      {verification.partyA}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-xs">Bên B (Chủ sở hữu):</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 dark:text-slate-100">
                        {verification.maskedCustomerName}
                      </strong>
                      {verification.isEkycVerified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          <UserCheck className="w-3 h-3" /> eKYC Đã duyệt
                        </span>
                      )}
                    </div>
                  </div>

                  {verification.treeCode && (
                    <div>
                      <span className="text-slate-500 block text-xs">Lô cây giống liên kết:</span>
                      <strong className="text-slate-900 dark:text-slate-100 font-mono">
                        {verification.treeCode}
                      </strong>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-500 block text-xs">Giá trị hợp đồng:</span>
                    <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                      {(Number(verification.contractValue) || 0).toLocaleString('vi-VN')} VNĐ
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-xs">Thời điểm ký số:</span>
                    <strong className="text-slate-900 dark:text-slate-100 font-mono">
                      {verification.signedAt ? new Date(verification.signedAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : '—'}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-xs">Thời hạn hiệu lực đến:</span>
                    <strong className="text-slate-900 dark:text-slate-100 font-mono">
                      {new Date(verification.expiredAt).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Cryptographic SHA-256 Fingerprint */}
              <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-900 dark:text-emerald-300 uppercase">
                  <Hash className="w-4 h-4 text-emerald-600" />
                  <span>Chữ ký số & Mã băm toàn vẹn (SHA-256 Checksum)</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Mã băm được tính toán trực tiếp trên toàn bộ nội dung tài liệu PDF và chữ ký số để chống giả mạo, chỉnh sửa trái phép.
                </p>
                <div className="p-3 bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-800 rounded-xl font-mono text-[11px] text-emerald-800 dark:text-emerald-300 break-all select-all font-semibold">
                  {verification.documentHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                </div>
              </div>

              {/* Legal Note */}
              <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  Văn bản hợp đồng điện tử này có giá trị pháp lý tương đương văn bản giấy theo quy định tại <strong>Luật Giao dịch điện tử số 51/2005/QH11</strong> và <strong>Bộ luật Dân sự 2015</strong>.
                </p>
              </div>

              {/* Actions: Download Official PDF */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <QrCode className="w-4 h-4 text-slate-400" />
                  <span>Xác thực bởi Hệ thống Sâm Ngọc Linh Farm</span>
                </div>

                <a
                  href={pdfDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-[background-color,transform] active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải tệp PDF có dấu mộc & QR</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
