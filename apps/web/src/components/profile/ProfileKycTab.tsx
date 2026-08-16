'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Camera,
  AlertOctagon,
  History,
  RotateCcw,
  ShieldCheck,
  Calendar,
  FileCheck,
  CreditCard,
  Car,
  Globe,
  UploadCloud,
  Lock,
  Info,
  Check,
} from 'lucide-react';
import { ButtonLoading, Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import type { UserProfile, IdentityVerificationStatus } from '@/types';
import {
  useIdentityVerificationHistory,
  type IdentityDocumentType,
} from '@/hooks/queries/useIdentityVerification';

type ProfileKycTabProps = {
  profile?: UserProfile | null;
  kycStatusData?: IdentityVerificationStatus | null;
  refetchKycStatus?: () => void;
  submitKycMutation: any;
};

interface DocumentOption {
  id: IdentityDocumentType;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  fieldLabel: string;
  fieldPlaceholder: string;
  frontTitle: string;
  frontDescription: string;
  backTitle: string;
  backDescription: string;
  isBackRequired: boolean;
  notes: string[];
}

const DOCUMENT_OPTIONS: DocumentOption[] = [
  {
    id: 'cccd',
    title: 'Căn cước công dân',
    subtitle: 'Thẻ CCCD gắn chip hoặc CMND 12 số',
    icon: CreditCard,
    fieldLabel: 'Số Căn cước công dân (12 chữ số)',
    fieldPlaceholder: 'Nhập số CCCD gắn chip...',
    frontTitle: 'Ảnh mặt trước CCCD',
    frontDescription: 'Chụp rõ nét khuôn mặt, số CCCD và quốc huy',
    backTitle: 'Ảnh mặt sau CCCD',
    backDescription: 'Chụp rõ nét chip điện tử, mã MRZ và ngày cấp',
    isBackRequired: true,
    notes: [
      'Chụp đủ 4 góc của thẻ, không để lóa đèn flash hoặc mất viền',
      'Giấy tờ gốc còn hạn sử dụng, không dùng bản photocopy hoặc scan đen trắng',
    ],
  },
  {
    id: 'driver_license',
    title: 'Giấy phép lái xe',
    subtitle: 'Bằng lái xe thẻ PET hợp lệ toàn quốc',
    icon: Car,
    fieldLabel: 'Số Giấy phép lái xe (GPLX)',
    fieldPlaceholder: 'Nhập số GPLX...',
    frontTitle: 'Ảnh mặt trước GPLX',
    frontDescription: 'Chụp rõ ảnh chân dung, số bằng và họ tên',
    backTitle: 'Ảnh mặt sau GPLX',
    backDescription: 'Chụp rõ hạng lái xe và ngày cấp',
    isBackRequired: true,
    notes: [
      'Chụp rõ 2 mặt thẻ PET chính chủ, không bị mờ nhòe số bằng lái',
      'Đảm bảo thông tin ngày hết hạn còn hiệu lực pháp lý',
    ],
  },
  {
    id: 'passport',
    title: 'Hộ chiếu',
    subtitle: 'Hộ chiếu phổ thông (Passport) còn hạn',
    icon: Globe,
    fieldLabel: 'Số Hộ chiếu (Passport Number)',
    fieldPlaceholder: 'Ví dụ: B1234567, C8910111...',
    frontTitle: 'Trang thông tin nhân thân',
    frontDescription: 'Trang đôi có ảnh chân dung, số hộ chiếu và mã ICAO',
    backTitle: 'Trang bìa hoặc thị thực',
    backDescription: 'Ảnh bổ sung (không bắt buộc)',
    isBackRequired: false,
    notes: [
      'Mở phẳng trang thông tin nhân thân, không để ngón tay che chữ',
      'Đảm bảo vùng mã máy đọc ICAO ở chân trang hiển thị trọn vẹn',
    ],
  },
];

export const ProfileKycTab = ({
  profile,
  kycStatusData,
  refetchKycStatus,
  submitKycMutation,
}: ProfileKycTabProps) => {
  const actualKycData = (kycStatusData as any)?.data || kycStatusData;

  const [documentType, setDocumentType] = useState<IdentityDocumentType>('cccd');
  const [idCardNumber, setIdCardNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [frontImagePreview, setFrontImagePreview] = useState('');
  const [backImagePreview, setBackImagePreview] = useState('');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [kycErrorMsg, setKycErrorMsg] = useState('');
  const [isReuploadMode, setIsReuploadMode] = useState(false);

  const { data: historyList = [] } = useIdentityVerificationHistory();

  useEffect(() => {
    if (actualKycData) {
      if (actualKycData.documentType) {
        setDocumentType(actualKycData.documentType as IdentityDocumentType);
      }
      if (actualKycData.idCardNumber || actualKycData.idNumber) {
        setIdCardNumber(actualKycData.idCardNumber || actualKycData.idNumber || '');
      }
      if (actualKycData.fullName || profile?.name) {
        setFullName(actualKycData.fullName || profile?.name || '');
      }
    }
  }, [actualKycData, profile]);

  const activeOption =
    DOCUMENT_OPTIONS.find((opt) => opt.id === documentType) || DOCUMENT_OPTIONS[0]!;

  const existingFront =
    actualKycData?.frontImageUrl || actualKycData?.front || frontImagePreview;
  const existingBack =
    actualKycData?.backImageUrl || actualKycData?.back || backImagePreview;

  const isVerified = !!(
    profile?.isVerified ||
    (profile as any)?.verified ||
    actualKycData?.status === 'VERIFIED' ||
    actualKycData?.status === 'APPROVED'
  );

  const isRejected = !isVerified && actualKycData?.status === 'REJECTED';
  const isPending =
    !isVerified &&
    (actualKycData?.status === 'PENDING' ||
      (!isRejected && !!actualKycData?.id && !isReuploadMode));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setKycErrorMsg('');

    if (!frontFile && !frontImagePreview) {
      setKycErrorMsg(`Vui lòng tải lên ${activeOption.frontTitle.toLowerCase()}.`);
      return;
    }

    if (activeOption.isBackRequired && !backFile && !backImagePreview) {
      setKycErrorMsg('Vui lòng tải lên đầy đủ ảnh mặt trước và mặt sau của giấy tờ.');
      return;
    }

    try {
      await submitKycMutation.mutateAsync({
        documentType,
        idCardNumber: idCardNumber.trim() || undefined,
        fullName: fullName.trim() || profile?.name || undefined,
        front: frontFile,
        back: backFile,
        frontBase64: frontImagePreview || undefined,
        backBase64: backImagePreview || undefined,
      });
      toast.success('Hồ sơ xác thực danh tính đã được gửi thành công.');
      setIsReuploadMode(false);
      refetchKycStatus?.();
    } catch (err: any) {
      setKycErrorMsg(err.message || 'Có lỗi xảy ra khi gửi hồ sơ xác thực. Vui lòng thử lại.');
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const renderDocTypeBadge = (type?: string) => {
    switch (type) {
      case 'passport':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            Hộ chiếu
          </span>
        );
      case 'driver_license':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            <Car className="w-3.5 h-3.5 text-sky-600" />
            Bằng lái xe
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
            Căn cước công dân
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section with refined luxury framing */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Xác thực danh tính điện tử
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium max-w-2xl leading-relaxed">
            Hồ sơ định danh bảo mật phục vụ ký kết Hợp đồng điện tử, xác thực quyền sở hữu cây sâm và giao dịch tài sản số trên nền tảng.
          </p>
        </div>

        {/* Global Verification Status Indicator */}
        <div className="flex-shrink-0">
          {isVerified ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Đã xác thực chính thức
            </span>
          ) : isRejected ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
              <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              Yêu cầu cập nhật lại
            </span>
          ) : isPending ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 animate-pulse">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Đang chờ đối soát
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              Chưa xác thực
            </span>
          )}
        </div>
      </div>

      {/* STATE 1: VERIFIED CERTIFICATE CARD */}
      {isVerified && (
        <Card className="border border-emerald-200/90 dark:border-emerald-900 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30 rounded-2xl shadow-xs overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    Chứng nhận định danh hợp lệ
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400 font-medium mt-0.5">
                    Hồ sơ của bạn đã được đối soát thành công và có đầy đủ quyền lợi ký Hợp đồng điện tử.
                  </p>
                </div>
              </div>
              <div className="self-start sm:self-auto">
                {renderDocTypeBadge(actualKycData?.documentType)}
              </div>
            </div>

            {/* Document metadata panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/90 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-medium block">Số giấy tờ tùy thân</span>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                  {actualKycData?.idCardNumber || actualKycData?.idNumber || 'Đã đối soát'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-medium block">Họ và tên chủ sở hữu</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {actualKycData?.fullName || profile?.name || 'Chủ tài khoản'}
                </span>
              </div>
            </div>

            {/* Photos preview */}
            {existingFront && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-emerald-200/60 dark:border-emerald-900/60">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Ảnh mặt trước / Trang thông tin
                  </span>
                  <div className="relative h-36 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center">
                    <Image
                      src={existingFront}
                      alt="Ảnh mặt trước"
                      fill
                      unoptimized
                      className="object-contain p-1"
                    />
                  </div>
                </div>

                {existingBack && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                      Ảnh mặt sau
                    </span>
                    <div className="relative h-36 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center">
                      <Image
                        src={existingBack}
                        alt="Ảnh mặt sau"
                        fill
                        unoptimized
                        className="object-contain p-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* STATE 2: PENDING REVIEW NOTICE */}
      {isPending && !isReuploadMode && (
        <Card className="border border-amber-200/90 dark:border-amber-900/80 bg-gradient-to-br from-amber-50/60 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 rounded-2xl shadow-xs overflow-hidden">
          <CardContent className="p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    Hồ sơ đang trong quá trình xét duyệt
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-400 font-medium mt-0.5">
                    Ban quản trị đang đối soát giấy tờ tùy thân. Thời gian xử lý tiêu chuẩn từ 1 đến 2 giờ làm việc.
                  </p>
                </div>
              </div>
              <div className="self-start sm:self-auto">
                {renderDocTypeBadge(actualKycData?.documentType)}
              </div>
            </div>

            {existingFront && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-amber-200/60 dark:border-amber-900/40">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Ảnh mặt trước đã tải lên
                  </span>
                  <div className="relative h-32 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center">
                    <Image src={existingFront} alt="Mặt trước" fill unoptimized className="object-contain p-1" />
                  </div>
                </div>
                {existingBack && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                      Ảnh mặt sau đã tải lên
                    </span>
                    <div className="relative h-32 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center">
                      <Image src={existingBack} alt="Mặt sau" fill unoptimized className="object-contain p-1" />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsReuploadMode(true)}
                className="text-xs font-semibold text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-950/60 gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Thay đổi hoặc tải lại hồ sơ
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STATE 3: ONBOARDING / SUBMISSION FORM */}
      {(!isVerified && !isPending) || isReuploadMode ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Rejection notice if previously rejected */}
          {isRejected && !isReuploadMode && (
            <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/30 flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 text-xs flex-1">
                <h4 className="font-bold text-sm text-rose-900 dark:text-rose-200">
                  Hồ sơ xác thực trước đó không được phê duyệt
                </h4>
                <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 font-medium">
                  <span className="font-bold block text-rose-900 dark:text-rose-200 mb-0.5">Lý do từ chối:</span>
                  {actualKycData?.rejectionReason || 'Ảnh chụp không đủ rõ nét hoặc bị lóa sáng. Vui lòng tải lại ảnh mới.'}
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium pt-1">
                  Vui lòng kiểm tra lại thông tin và chụp lại ảnh rõ nét theo các tiêu chuẩn bên dưới.
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Select Document Type */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[11px] font-bold inline-flex items-center justify-center">
                  1
                </span>
                Chọn loại giấy tờ tùy thân
              </label>
              <span className="text-xs text-slate-400 font-medium">Bắt buộc</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DOCUMENT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = documentType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setDocumentType(opt.id);
                      setKycErrorMsg('');
                    }}
                    className={`relative p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[120px] ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-600/20 text-slate-900 dark:text-slate-100 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block">
                        {opt.title}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mt-0.5">
                        {opt.subtitle}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Document Details Input */}
          <div className="space-y-4 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[11px] font-bold inline-flex items-center justify-center">
                2
              </span>
              Thông tin chi tiết giấy tờ
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  {activeOption.fieldLabel} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={idCardNumber}
                  onChange={(e) => setIdCardNumber(e.target.value)}
                  placeholder={activeOption.fieldPlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold font-mono text-slate-900 dark:text-slate-100 placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Họ và tên in trên giấy tờ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: NGUYEN VAN A"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Standard Guidelines Box */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                Tiêu chuẩn ảnh chụp chứng thực
              </span>
              <ul className="space-y-0.5 text-slate-600 dark:text-slate-400 font-medium">
                {activeOption.notes.map((note, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Error Message banner */}
          {kycErrorMsg && (
            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{kycErrorMsg}</span>
            </div>
          )}

          {/* Step 3: Photo Upload Dropzones */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[11px] font-bold inline-flex items-center justify-center">
                3
              </span>
              Tải ảnh giấy tờ tùy thân
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Front Photo Zone */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {activeOption.frontTitle} <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[11px] text-slate-400">PNG, JPG tối đa 20MB</span>
                </div>

                <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-600 dark:hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-white dark:bg-slate-900 min-h-[190px] relative group overflow-hidden shadow-2xs hover:shadow-xs">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFrontFile(file);
                        const reader = new FileReader();
                        reader.onload = (ev) => setFrontImagePreview(ev.target?.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {frontImagePreview ? (
                    <div className="relative h-40 w-full flex items-center justify-center">
                      <Image
                        src={frontImagePreview}
                        alt="Ảnh mặt trước mới"
                        fill
                        unoptimized
                        className="object-contain rounded-xl"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-bold gap-1.5">
                        <Camera className="w-4 h-4" />
                        Nhấp để đổi ảnh khác
                      </div>
                      <span className="absolute bottom-2 right-2 bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                        Đã chọn ảnh mới
                      </span>
                    </div>
                  ) : existingFront && !isReuploadMode ? (
                    <div className="relative h-40 w-full flex items-center justify-center">
                      <Image
                        src={existingFront}
                        alt="Ảnh mặt trước cũ"
                        fill
                        unoptimized
                        className="object-contain rounded-xl"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2.5 text-center p-2">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                          Tải lên {activeOption.frontTitle.toLowerCase()}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                          {activeOption.frontDescription}
                        </span>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* Back Photo Zone */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {activeOption.backTitle}{' '}
                    {activeOption.isBackRequired ? (
                      <span className="text-rose-500">*</span>
                    ) : (
                      <span className="text-slate-400 font-normal">(Không bắt buộc)</span>
                    )}
                  </span>
                  <span className="text-[11px] text-slate-400">PNG, JPG tối đa 20MB</span>
                </div>

                <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-600 dark:hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-white dark:bg-slate-900 min-h-[190px] relative group overflow-hidden shadow-2xs hover:shadow-xs">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setBackFile(file);
                        const reader = new FileReader();
                        reader.onload = (ev) => setBackImagePreview(ev.target?.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {backImagePreview ? (
                    <div className="relative h-40 w-full flex items-center justify-center">
                      <Image
                        src={backImagePreview}
                        alt="Ảnh mặt sau mới"
                        fill
                        unoptimized
                        className="object-contain rounded-xl"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-bold gap-1.5">
                        <Camera className="w-4 h-4" />
                        Nhấp để đổi ảnh khác
                      </div>
                      <span className="absolute bottom-2 right-2 bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                        Đã chọn ảnh mới
                      </span>
                    </div>
                  ) : existingBack && !isReuploadMode ? (
                    <div className="relative h-40 w-full flex items-center justify-center">
                      <Image
                        src={existingBack}
                        alt="Ảnh mặt sau cũ"
                        fill
                        unoptimized
                        className="object-contain rounded-xl"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2.5 text-center p-2">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                          Tải lên {activeOption.backTitle.toLowerCase()}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                          {activeOption.backDescription}
                        </span>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Security Compliance Guarantee */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Thông tin và hình ảnh giấy tờ được mã hóa theo tiêu chuẩn an ninh <strong>SSL 256-bit</strong> và tuân thủ chặt chẽ <strong>Nghị định 13/2023/NĐ-CP</strong> về bảo vệ dữ liệu cá nhân.
            </span>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
            {isReuploadMode && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsReuploadMode(false)}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                Hủy bỏ
              </Button>
            )}
            <ButtonLoading
              type="submit"
              isLoading={submitKycMutation.isPending}
              className="bg-emerald-800 hover:bg-emerald-900 text-white px-8 py-3 rounded-xl font-bold text-xs shadow-md shadow-emerald-950/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              {isReuploadMode || isRejected ? 'Gửi lại hồ sơ eKYC' : 'Gửi hồ sơ xác thực'}
            </ButtonLoading>
          </div>
        </form>
      ) : null}

      {/* History Log Section */}
      {historyList.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
            <History className="w-4 h-4 text-emerald-600" />
            <span>Lịch sử xác thực eKYC ({historyList.length})</span>
          </div>

          <div className="space-y-3">
            {historyList.map((item: any, idx: number) => {
              const isItemApproved = item.status === 'APPROVED';
              const isItemRejected = item.status === 'REJECTED';
              return (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        Lần {historyList.length - idx}
                      </span>
                      {renderDocTypeBadge(item.documentType)}
                      <span
                        className={`font-semibold px-2.5 py-0.5 rounded-full text-[11px] ${
                          isItemApproved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isItemRejected
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {isItemApproved ? 'Đã duyệt' : isItemRejected ? 'Bị từ chối' : 'Chờ đối soát'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(item.createdAt)}</span>
                      {item.idCardNumber && (
                        <span>
                          Số giấy tờ: <strong className="font-mono text-slate-700 dark:text-slate-300">{item.idCardNumber}</strong>
                        </span>
                      )}
                    </div>

                    {isItemRejected && item.rejectionReason && (
                      <p className="text-rose-600 font-medium pt-1">
                        Lý do từ chối: {item.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
