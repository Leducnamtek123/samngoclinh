'use client';

import { useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { 
  Minus, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Gift, 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button, ButtonLoading } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { formatVNDPrice } from '@/utils/formatters';
import { cultivationService } from '@/services/cultivation.service';

const emptySubscribe = () => () => {};

export type ClaimPlantModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item?: any;
};

export function ClaimPlantModal({ isOpen, onClose, item }: ClaimPlantModalProps) {
  const t = useTranslations('freeTreeCampaign');
  const tCart = useTranslations('cart');
  const tActions = useTranslations('actions');

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

  const handleClaimSubmit = async () => {
    if (!agreed) return;
    setIsSubmitting(true);
    try {
      if (item?.id) {
        await cultivationService.subscribePackage({
          treeId: String(item.id),
          packageType: 'care',
          packageId: String(item.id),
          months: careYears * 12,
        }).catch((err) => console.warn('Care package sub warning:', err));
      }
      setIsSuccess(true);
    } catch (error) {
      console.error('Claim plant error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const plantName = item?.plantCatalog?.name ?? '—';
  const imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('modalTitle')}</DialogTitle>
          <DialogDescription>
            {t('subtitle')}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-foreground">{t('successToast')}</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                {t('rule3')}
              </p>
            </div>
            <div className="pt-4">
              <Button
                onClick={onClose}
                className="px-8"
              >
                {tActions('cancel')}
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
                <p className="text-xs text-muted-foreground font-medium">{t('remainingCount', { count: item?.remainingSlots ?? 0 })}</p>
                <Badge variant="secondary">{t('badge')}</Badge>
              </div>
            </Card>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm font-bold text-foreground">{tCart('itemCount')}</span>
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
                  <span>{t('rule2')}</span>
                </span>
                <Select
                  value={String(careYears)}
                  onValueChange={(val) => setCareYears(Number(val))}
                >
                  <SelectTrigger className="border-border bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 year - {formatVNDPrice(careCostPerYear * quantity)}</SelectItem>
                    <SelectItem value="2">2 years - {formatVNDPrice(careCostPerYear * 2 * quantity)}</SelectItem>
                    <SelectItem value="3">3 years - {formatVNDPrice(careCostPerYear * 3 * quantity)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <span>{t('rule1')}</span>
                </span>
                <Select
                  value={String(protectionYears)}
                  onValueChange={(val) => setProtectionYears(Number(val))}
                >
                  <SelectTrigger className="border-border bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 year - {formatVNDPrice(protectionCostPerYear * quantity)}</SelectItem>
                    <SelectItem value="2">2 years - {formatVNDPrice(protectionCostPerYear * 2 * quantity)}</SelectItem>
                    <SelectItem value="3">3 years - {formatVNDPrice(protectionCostPerYear * 3 * quantity)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Detailed Price Breakdown Table */}
            <Card className="p-4 space-y-2 text-xs text-muted-foreground bg-muted/30 border-border">
              <div className="flex justify-between">
                <span>{tCart('subtotal')}:</span>
                <span className="font-semibold text-foreground">{formatVNDPrice(totalCareFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>{tCart('shippingFee')}:</span>
                <span className="font-semibold text-foreground">{formatVNDPrice(totalProtectionFee)}</span>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-sm sm:text-base font-extrabold text-foreground">
                <span>{tCart('total')}:</span>
                <span className="text-primary text-lg sm:text-xl font-black">{formatVNDPrice(grandTotal)}</span>
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
                  {t('agreeNotice')}
                </span>
              </label>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={onClose}
              >
                {tActions('cancel')}
              </Button>
              {isSubmitting ? (
                <ButtonLoading>...</ButtonLoading>
              ) : (
                <Button
                  onClick={handleClaimSubmit}
                  disabled={!agreed}
                >
                  {t('claimBtn')}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
