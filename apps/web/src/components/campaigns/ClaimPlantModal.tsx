'use client';

import { useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { 
  Minus, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Gift, 
  ExternalLink,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button, ButtonLoading } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

const emptySubscribe = () => () => {};

export type ClaimPlantModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item?: any;
};

export function ClaimPlantModal({ isOpen, onClose, item }: ClaimPlantModalProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const [quantity, setQuantity] = useState(1);
  const [careYears, setCareYears] = useState(1);
  const [protectionYears, setProtectionYears] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !mounted) return null;

  // Base costs per unit for 1 year
  const careCostPerYear = 50800;
  const protectionCostPerYear = 23007;

  // Total cost calculations
  const totalCareFee = careCostPerYear * careYears * quantity;
  const vatCare = Math.round(totalCareFee * 0.1);
  const totalProtectionFee = protectionCostPerYear * protectionYears * quantity;
  const vatProtection = Math.round(totalProtectionFee * 0.1);

  const grandTotal = totalCareFee + vatCare + totalProtectionFee + vatProtection;

  const formatVND = (num: number) => {
    return num.toLocaleString('vi-VN') + ' đ';
  };

  const handleClaimSubmit = async () => {
    if (!agreed) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setIsSuccess(true);
    } catch (error) {
      console.error('Claim plant error:', error);
    }
    setIsSubmitting(false);
  };

  const plantName = item?.plantCatalog?.name ?? '—';
  const imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nhận cây sâm 1 năm</DialogTitle>
          <DialogDescription>
            Ưu đãi tặng giá trị cây sâm 1 năm. Bạn chỉ cần chọn đủ gói chăm sóc và bảo vệ cây để nhận ưu đãi.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-foreground">Đăng Ký Nhận Cây Thành Công!</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Đơn nhận cây sâm 1 năm đã được khởi tạo thành công trên hệ thống. Cây sâm đã được ghi nhận trực tiếp vào tài khoản của bạn tại vườn Kon Tum.
              </p>
            </div>
            <div className="pt-4">
              <Button
                onClick={onClose}
                className="px-8"
              >
                Hoàn tất
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-5">
            {/* Product Summary Card */}
            <Card className="p-4 flex items-center gap-4 bg-muted/40 border-border">
              <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                <Image
                  src={imageUrl}
                  alt={plantName}
                  fill
                  sizes="80px"
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <h4 className="font-extrabold text-foreground text-base leading-snug">{plantName}</h4>
                <p className="text-xs text-muted-foreground font-medium">Tồn kho: {item?.remainingSlots ?? 0}</p>
                <Badge variant="secondary">Giá cây được tặng</Badge>
              </div>
            </Card>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm font-bold text-foreground">Số lượng</span>
              <div className="flex items-center border border-border rounded-xl overflow-hidden bg-muted/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="h-8 px-2.5"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-4 py-1 text-sm font-extrabold text-foreground border-x border-border">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-8 px-2.5"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Package Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-primary" />
                  <span>Gói chăm sóc</span>
                </span>
                <Select
                  value={String(careYears)}
                  onValueChange={(val) => setCareYears(Number(val))}
                >
                  <SelectTrigger className="border-border bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 năm - {formatVND(careCostPerYear * quantity)}</SelectItem>
                    <SelectItem value="2">2 năm - {formatVND(careCostPerYear * 2 * quantity)}</SelectItem>
                    <SelectItem value="3">3 năm - {formatVND(careCostPerYear * 3 * quantity)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <span>Gói đảm bảo</span>
                </span>
                <Select
                  value={String(protectionYears)}
                  onValueChange={(val) => setProtectionYears(Number(val))}
                >
                  <SelectTrigger className="border-border bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 năm - {formatVND(protectionCostPerYear * quantity)}</SelectItem>
                    <SelectItem value="2">2 năm - {formatVND(protectionCostPerYear * 2 * quantity)}</SelectItem>
                    <SelectItem value="3">3 năm - {formatVND(protectionCostPerYear * 3 * quantity)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Detailed Price Breakdown Table */}
            <Card className="p-4 space-y-2 text-xs text-muted-foreground bg-muted/30 border-border">
              <div className="flex justify-between">
                <span>VAT cây (5%):</span>
                <span className="font-semibold text-foreground">0 đ</span>
              </div>
              <div className="flex justify-between">
                <span>Phí chăm sóc:</span>
                <span className="font-semibold text-foreground">{formatVND(totalCareFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT chăm sóc (10%):</span>
                <span className="font-semibold text-foreground">{formatVND(vatCare)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí bảo vệ cây:</span>
                <span className="font-semibold text-foreground">{formatVND(totalProtectionFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT bảo vệ (10%):</span>
                <span className="font-semibold text-foreground">{formatVND(vatProtection)}</span>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-sm sm:text-base font-extrabold text-foreground">
                <span>Tổng cộng:</span>
                <span className="text-primary text-lg sm:text-xl font-black">{formatVND(grandTotal)}</span>
              </div>
            </Card>

            {/* Terms & Legal Contract Accordion Box */}
            <div className="bg-muted/40 border border-border rounded-2xl p-4 sm:p-5 space-y-3">
              <label htmlFor="claim-agreed-checkbox" className="flex items-center gap-3 cursor-pointer select-none group py-1">
                <Checkbox
                  id="claim-agreed-checkbox"
                  checked={agreed}
                  onCheckedChange={(checked: boolean | 'indeterminate') => setAgreed(!!checked)}
                  className="shrink-0"
                />
                <span className="text-xs font-semibold text-foreground leading-normal group-hover:text-primary transition-colors">
                  Tôi đã đọc và đồng ý với điều khoản sử dụng và hợp đồng mua bán, ký gửi, chăm sóc cây Sâm Ngọc Linh.
                </span>
              </label>

              <Accordion type="single" collapsible className="pt-2 border-t border-border">
                <AccordionItem value="terms">
                  <AccordionTrigger>Điều khoản sử dụng – Sâm Ngọc Linh</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-xs">
                    <p>
                      Điều khoản sử dụng áp dụng cho tất cả tài khoản đăng ký nhận cây ưu đãi và sử dụng dịch vụ chăm sóc tại vườn Sâm Ngọc Linh.
                    </p>
                    <div className="mt-1">
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline font-bold transition-colors"
                      >
                        <span>Xem toàn văn 13 Điều khoản sử dụng</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="contract">
                  <AccordionTrigger>Hợp đồng mua bán cây</AccordionTrigger>
                  <AccordionContent>
                    <p className="leading-relaxed">
                      Hợp đồng mua bán, ký gửi và chăm sóc cây Sâm Ngọc Linh áp dụng cho đơn hàng cây trồng và các dịch vụ đi kèm.
                    </p>
                    <div className="mt-2">
                      <a
                        href="/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary hover:underline font-bold transition-colors"
                      >
                        <span>Mở hợp đồng mua bán, ký gửi và chăm sóc cây Sâm Ngọc Linh</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <ButtonLoading
                variant="default"
                isLoading={isSubmitting}
                disabled={!agreed}
                onClick={handleClaimSubmit}
              >
                Nhận cây
              </ButtonLoading>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
