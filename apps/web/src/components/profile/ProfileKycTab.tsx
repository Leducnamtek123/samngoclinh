'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { ButtonLoading, Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import type { UserProfile, IdentityVerificationStatus } from '@/types';
import { useIdentityVerificationHistory, UserIdentityHistoryItem } from '@/hooks/queries/useIdentityVerification';

type ProfileKycTabProps = {
  profile?: UserProfile | null;
  kycStatusData?: IdentityVerificationStatus | null;
  refetchKycStatus?: () => void;
  submitKycMutation: any;
};

export const ProfileKycTab = ({
  profile,
  kycStatusData,
  refetchKycStatus,
  submitKycMutation,
}: ProfileKycTabProps) => {
  const t = useTranslations('kyc');
  const [frontImagePreview, setFrontImagePreview] = useState('');
  const [backImagePreview, setBackImagePreview] = useState('');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [kycErrorMsg, setKycErrorMsg] = useState('');
  const [isReuploadMode, setIsReuploadMode] = useState(false);

  const { data: historyList = [] } = useIdentityVerificationHistory();

  const actualKycData = (kycStatusData as any)?.data || kycStatusData;
  const existingFront = actualKycData?.frontImageUrl || actualKycData?.front || frontImagePreview;
  const existingBack = actualKycData?.backImageUrl || actualKycData?.back || backImagePreview;

  const isVerified = !!(
    profile?.isVerified ||
    (profile as any)?.verified ||
    actualKycData?.status === 'VERIFIED' ||
    actualKycData?.status === 'APPROVED'
  );

  const isRejected = !isVerified && actualKycData?.status === 'REJECTED';
  const isPending = !isVerified && (actualKycData?.status === 'PENDING' || (!isRejected && !!actualKycData?.id && !isReuploadMode));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setKycErrorMsg('');
    if ((!frontFile && !frontImagePreview) || (!backFile && !backImagePreview)) {
      setKycErrorMsg('Vui lòng tải lên đầy đủ cả mặt trước và mặt sau của CMND/CCCD.');
      return;
    }
    try {
      await submitKycMutation.mutateAsync({
        front: frontFile,
        back: backFile,
        frontBase64: frontImagePreview || undefined,
        backBase64: backImagePreview || undefined,
      });
      toast.success('Hồ sơ eKYC đã được gửi lên hệ thống thành công!');
      setIsReuploadMode(false);
      refetchKycStatus?.();
    } catch (err: any) {
      setKycErrorMsg(err.message || 'Có lỗi xảy ra khi gửi xác minh. Vui lòng thử lại.');
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-5">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2.5">
            <FileCheck className="w-6 h-6 text-emerald-600" />
            {t('title')}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
            {t('subtitle')}
          </p>
        </div>

        {/* Status Badge */}
        <div>
          {isVerified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {t('verified')}
            </span>
          ) : isRejected ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              {t('rejected')}
            </span>
          ) : isPending ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
              <Clock className="w-4 h-4 text-amber-600" />
              {t('pending')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300">
              {t('unverified')}
            </span>
          )}
        </div>
      </div>

      {/* STATE 1: VERIFIED */}
      {isVerified && (
        <Card className="bg-gradient-to-br from-emerald-50/80 to-teal-50/40 border-emerald-200 text-emerald-900 p-6 rounded-2xl shadow-xs">
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-emerald-900">Tài khoản đã xác minh chính thức (eKYC Verified)</h4>
                <p className="text-xs text-emerald-700 font-medium">Hồ sơ CCCD/CMND của bạn đã được đối soát hợp lệ và có đầy đủ quyền lợi ký Hợp đồng điện tử.</p>
              </div>
            </div>

            {existingFront && existingBack && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-emerald-200/70">
                <div className="bg-white/90 dark:bg-gray-800/90 p-3 rounded-xl border border-emerald-200/80">
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block mb-2">Mặt trước CCCD</span>
                  <div className="relative h-32 w-full rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                    <Image src={existingFront} alt="Mặt trước CCCD" fill unoptimized className="object-contain" />
                  </div>
                </div>
                <div className="bg-white/90 dark:bg-gray-800/90 p-3 rounded-xl border border-emerald-200/80">
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block mb-2">Mặt sau CCCD</span>
                  <div className="relative h-32 w-full rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                    <Image src={existingBack} alt="Mặt sau CCCD" fill unoptimized className="object-contain" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* STATE 2: PENDING (Waiting for Admin) */}
      {!isVerified && isPending && !isReuploadMode && (
        <Card className="bg-gradient-to-br from-amber-50/90 to-orange-50/40 border-amber-200 text-amber-950 p-6 sm:p-8 rounded-2xl shadow-xs">
          <CardContent className="p-0 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 flex-shrink-0">
                  <Clock className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-amber-900">Hồ sơ đã nộp thành công – Đang chờ xét duyệt</h4>
                  <p className="text-xs text-amber-800/90 font-medium mt-0.5">
                    Ban quản trị đang đối soát giấy tờ tùy thân của bạn (thời gian dự kiến trong vòng 24 giờ làm việc).
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsReuploadMode(true)}
                className="text-xs font-bold border-amber-300 bg-white/80 hover:bg-amber-100 text-amber-900 flex items-center gap-1.5 flex-shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Gửi lại ảnh khác
              </Button>
            </div>

            {existingFront && existingBack && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-amber-200/70">
                <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-xs">
                  <span className="text-[11px] font-bold text-amber-900 block mb-2">Ảnh mặt trước đã gửi</span>
                  <div className="relative h-36 w-full rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                    <Image src={existingFront} alt="Mặt trước" fill unoptimized className="object-contain" />
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-xs">
                  <span className="text-[11px] font-bold text-amber-900 block mb-2">Ảnh mặt sau đã gửi</span>
                  <div className="relative h-36 w-full rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                    <Image src={existingBack} alt="Mặt sau" fill unoptimized className="object-contain" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* STATE 3: REJECTED OR INITIAL FORM OR RE-UPLOAD MODE */}
      {(!isVerified && (!isPending || isReuploadMode || isRejected)) && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          {/* Rejection Alert Banner */}
          {isRejected && (
            <div className="bg-rose-50/90 border-2 border-rose-200 text-rose-950 p-5 rounded-2xl space-y-2 flex gap-3.5 shadow-xs">
              <div className="text-rose-600 flex-shrink-0 mt-0.5">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-rose-900">Hồ sơ xác minh eKYC bị từ chối</h4>
                  {actualKycData?.reviewedAt && (
                    <span className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(actualKycData.reviewedAt)}
                    </span>
                  )}
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-xl border border-rose-200 text-xs font-semibold text-rose-800">
                  <span className="font-bold text-rose-900 block mb-0.5">Lý do từ chối:</span>
                  {actualKycData?.rejectionReason || 'Ảnh chụp CCCD/CMND không đủ rõ nét hoặc bị lóa sáng/mất góc. Vui lòng tải lại ảnh mới.'}
                </div>
                <p className="text-xs text-rose-700 font-medium pt-1">
                  👉 Vui lòng chụp lại ảnh rõ nét cả 2 mặt và bấm <strong>&ldquo;Gửi lại hồ sơ eKYC&rdquo;</strong> ở bên dưới để được duyệt lại nhanh nhất.
                </p>
              </div>
            </div>
          )}

          {/* Guide banner */}
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200 p-5 rounded-xl space-y-1.5 flex gap-3">
            <div className="text-emerald-600 flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm">Hướng dẫn chụp ảnh CCCD/CMND hợp lệ</h4>
              <ul className="text-xs text-emerald-800 dark:text-emerald-300 space-y-0.5 font-medium list-disc list-inside">
                <li>Ảnh chụp đầy đủ 4 góc của thẻ CCCD, không bị cắt viền.</li>
                <li>Không bị lóa đèn flash, chữ và số thể hiện rõ nét, không bị mờ nhòe.</li>
                <li>Giấy tờ còn hạn sử dụng và là bản gốc chính chủ.</li>
              </ul>
            </div>
          </div>

          {kycErrorMsg && kycErrorMsg !== 'Not Found' && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl font-bold">
              {kycErrorMsg}
            </div>
          )}

          {/* Upload Dropzones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
                Ảnh mặt trước CMND/CCCD *
              </span>
              <label className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-emerald-600 dark:hover:border-emerald-500 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-gray-50/60 dark:bg-gray-800/40 min-h-[170px] relative group overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
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
                  <div className="relative h-36 w-full flex items-center justify-center">
                    <Image src={frontImagePreview} alt="Mặt trước mới" fill unoptimized className="object-contain rounded-lg" />
                    <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      Đã chọn ảnh mới
                    </span>
                  </div>
                ) : existingFront && !isReuploadMode ? (
                  <div className="relative h-36 w-full flex items-center justify-center">
                    <Image src={existingFront} alt="Mặt trước cũ" fill unoptimized className="object-contain rounded-lg" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-bold block">Tải ảnh mặt trước lên</span>
                      <span className="text-[11px] text-gray-400 font-medium">PNG, JPG, JPEG (tối đa 20MB)</span>
                    </div>
                  </div>
                )}
              </label>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
                Ảnh mặt sau CMND/CCCD *
              </span>
              <label className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-emerald-600 dark:hover:border-emerald-500 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-gray-50/60 dark:bg-gray-800/40 min-h-[170px] relative group overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
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
                  <div className="relative h-36 w-full flex items-center justify-center">
                    <Image src={backImagePreview} alt="Mặt sau mới" fill unoptimized className="object-contain rounded-lg" />
                    <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      Đã chọn ảnh mới
                    </span>
                  </div>
                ) : existingBack && !isReuploadMode ? (
                  <div className="relative h-36 w-full flex items-center justify-center">
                    <Image src={existingBack} alt="Mặt sau cũ" fill unoptimized className="object-contain rounded-lg" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-bold block">Tải ảnh mặt sau lên</span>
                      <span className="text-[11px] text-gray-400 font-medium">PNG, JPG, JPEG (tối đa 20MB)</span>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <ButtonLoading
              type="submit"
              isLoading={submitKycMutation.isPending}
              variant="default"
              className="px-8 font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {submitKycMutation.isPending
                ? 'Đang gửi hồ sơ...'
                : isRejected || isReuploadMode
                ? 'Gửi lại hồ sơ eKYC'
                : 'Gửi xác thực eKYC'}
            </ButtonLoading>

            {isReuploadMode && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsReuploadMode(false)}
                className="text-xs font-semibold text-gray-600"
              >
                Hủy bỏ
              </Button>
            )}
          </div>
        </form>
      )}

      {/* SECTION 4: VERIFICATION HISTORY TIMELINE */}
      {Array.isArray(historyList) && historyList.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <History className="w-4 h-4 text-gray-500" />
              Lịch sử các lần gửi xác minh
            </h4>
            <span className="text-xs text-gray-400 font-medium">{historyList.length} lần gửi</span>
          </div>

          <div className="space-y-3 pt-1">
            {historyList.map((item: UserIdentityHistoryItem, idx: number) => {
              const isItemApproved = item.status === 'APPROVED';
              const isItemRejected = item.status === 'REJECTED';

              return (
                <div
                  key={item.id || idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isItemApproved
                        ? 'bg-emerald-100 text-emerald-700'
                        : isItemRejected
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {isItemApproved ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isItemRejected ? (
                        <AlertOctagon className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                          Lần gửi #{historyList.length - idx}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isItemApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : isItemRejected
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isItemApproved ? 'Đã duyệt' : isItemRejected ? 'Từ chối' : 'Chờ duyệt'}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400 block">
                        Ngày gửi: {formatDate(item.createdAt)}
                      </span>
                      {item.rejectionReason && (
                        <span className="text-rose-700 dark:text-rose-400 font-medium block pt-0.5">
                          Lý do từ chối: {item.rejectionReason}
                        </span>
                      )}
                    </div>
                  </div>

                  {item.reviewedAt && (
                    <div className="text-right text-[11px] text-gray-400">
                      Xét duyệt: {formatDate(item.reviewedAt)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
