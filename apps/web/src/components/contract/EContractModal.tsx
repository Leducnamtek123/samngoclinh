'use client';

import React from 'react';
import Image from 'next/image';
import { FileText, CheckCircle2, AlertCircle, X, PenTool, ShieldCheck, Clock, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/common/LoadingState';
import { EContractSignaturePad } from './EContractSignaturePad';
import { EContractDocumentView } from './EContractDocumentView';
import { useEContractModal } from './useEContractModal';

type EContractModalProps = {
  contractId: string | null;
  onClose: () => void;
};

export const EContractModal: React.FC<EContractModalProps> = ({ contractId, onClose }) => {
  const modal = useEContractModal({ contractId });

  if (!contractId) return null;

  return (
    <div data-lenis-prevent className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 transition-opacity duration-200 animate-fade-in overflow-y-auto">
      <div data-lenis-prevent className="bg-white dark:bg-slate-900 bg-card text-card-foreground rounded-2xl max-w-3xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-xl border border-border shrink-0">
        
        {/* Sticky Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800 shrink-0 z-10 rounded-t-[20px] shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary rounded-xl text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-snug">
                Hợp Đồng Điện Tử #{modal.contract?.code || contractId.slice(0, 8)}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Hợp đồng hợp tác đầu tư & ủy quyền chăm sóc Sâm Ngọc Linh
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Đóng modal hợp đồng"
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content Body Inner Scroll Area */}
        <div data-lenis-prevent className="flex-1 p-6 space-y-6 overflow-y-auto overscroll-contain min-h-0">
          {modal.isLoading ? (
            <div className="py-20">
              <LoadingState message="Đang tải nội dung hợp đồng..." />
            </div>
          ) : modal.isError || !modal.contract ? (
            <div className="py-12 bg-red-50 text-red-700 p-6 rounded-2xl text-center font-medium space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-red-500" />
              <p>Không thể tải thông tin hợp đồng. Vui lòng thử lại sau.</p>
            </div>
          ) : (
            <>
              {/* Contract Metadata Banner */}
              {(() => {
                const status = (modal.contract.status || '').toLowerCase();
                const isDraft = status === 'draft' || status === 'pending_issue';
                const isExpired = status === 'expired';
                const rawVal = modal.contract.contractValue ?? modal.contract.totalAmount ?? modal.contract.value ?? modal.contract.order?.total ?? 0;
                const contractValueNum = Number(rawVal) || 0;

                return (
                  <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Trạng thái hợp đồng</span>
                      <div className="flex items-center gap-2">
                        {modal.isSigned ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-xs">
                            <CheckCircle2 className="w-4 h-4" /> Đã ký điện tử
                          </span>
                        ) : isDraft ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-600 text-white rounded-full text-xs font-bold shadow-xs">
                            <Clock className="w-4 h-4" /> Bản nháp (Đang khởi tạo)
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 text-white rounded-full text-xs font-bold shadow-xs">
                            <AlertCircle className="w-4 h-4" /> Đã hết hạn
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-bold shadow-xs">
                            <PenTool className="w-4 h-4" /> Vui lòng hoàn tất chữ ký
                          </span>
                        )}
                        <span className="text-xs text-slate-500 font-medium">
                          • Ngày tạo: {modal.contract.createdAt ? new Date(modal.contract.createdAt).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : '—'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-500 font-semibold block">Giá trị hợp đồng</span>
                      <span className="text-lg font-black text-primary">
                        {contractValueNum.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Contract Document Text Container */}
              <EContractDocumentView contract={modal.contract} />

              {/* Signature Section */}
              {modal.isSigned ? (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">Hợp đồng đã có hiệu lực pháp lý</h5>
                        <p className="text-xs text-slate-500">
                          Thời gian ký: {modal.contract.signedAt ? new Date(modal.contract.signedAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : 'Đã hoàn tất'}
                        </p>
                      </div>
                    </div>

                    {modal.contract.userSignatureUrl && (
                      <div className="border border-slate-200 rounded-lg p-2 bg-white text-center shrink-0">
                        <Image src={modal.contract.userSignatureUrl} alt="Chữ ký" width={120} height={48} unoptimized className="h-12 w-auto object-contain mx-auto" />
                        <span className="text-[10px] text-slate-400 font-semibold block">Chữ ký điện tử</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      href={`/api/proxy/public/contracts/pdf?code=${encodeURIComponent(modal.contract.code)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span>Tải tệp PDF có dấu mộc & QR</span>
                    </a>
                    <a
                      href={`/vi/trace/contract/${modal.contract.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      <Search className="w-4 h-4 shrink-0" />
                      <span>Tra cứu chứng nhận số</span>
                    </a>
                  </div>
                </div>
              ) : (modal.contract?.status || '').toLowerCase() === 'draft' || (modal.contract?.status || '').toLowerCase() === 'pending_issue' ? (
                <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Bản nháp hợp đồng đang được xử lý</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Ban Quản Trị đang rà soát thông tin cây sâm và các điều khoản giao kết. Quý khách sẽ nhận được thông báo ký số ngay khi hợp đồng được phát hành chính thức.
                    </p>
                  </div>
                </div>
              ) : (
                <EContractSignaturePad
                  signatureType={modal.signatureType}
                  setSignatureType={modal.setSignatureType}
                  savedSignatureUrl={modal.savedSignatureUrl}
                  typedName={modal.typedName}
                  setTypedName={modal.setTypedName}
                  errorMessage={modal.errorMessage}
                  canvasRef={modal.canvasRef}
                  hasCanvasDrawn={modal.hasCanvasDrawn}
                  startDrawing={modal.startDrawing}
                  stopDrawing={modal.stopDrawing}
                  draw={modal.draw}
                  clearCanvas={modal.clearCanvas}
                />
              )}
            </>
          )}
        </div>

        {/* Sticky Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-4 shrink-0 z-10 rounded-b-[20px] shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors h-auto"
          >
            Đóng
          </Button>

          {!modal.isSigned &&
            modal.contract &&
            (modal.contract.status || '').toLowerCase() !== 'draft' &&
            (modal.contract.status || '').toLowerCase() !== 'pending_issue' && (
              <Button
                type="button"
                onClick={modal.handleSign}
                disabled={modal.signMutation.isPending}
                isLoading={modal.signMutation.isPending}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover active:bg-primary/80 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md h-auto"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác nhận ký điện tử</span>
              </Button>
            )}
        </div>
      </div>
    </div>
  );
};
