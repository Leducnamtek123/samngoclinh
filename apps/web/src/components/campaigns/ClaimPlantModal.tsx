'use client';

import { Minus, Plus, CheckCircle2, ShieldCheck, Gift } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState, useSyncExternalStore } from 'react';
import { cultivationService } from '@/services/cultivation.service';
import { formatVNDPrice } from '@/utils/formatters';
import { Badge } from '../ui/badge';
import { Button, ButtonLoading } from '../ui/button';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

const emptySubscribe = () => () => {};

export type ClaimPlantModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item?: {
    id?: string;
    name?: string;
    title?: string;
    plantCatalog?: { name?: string };
    remainingSlots?: number | string;
    ageYears?: number;
    ageYear?: number;
    image?: string;
    imageUrl?: string;
    [key: string]: unknown;
  } | null;
};

export function ClaimPlantModal({ isOpen, onClose, item }: ClaimPlantModalProps) {
  const t = useTranslations('freeTreeCampaign');
  const tCart = useTranslations('cart');
  const tActions = useTranslations('actions');

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const [quantity, setQuantity] = useState(1);
  const [careYears, setCareYears] = useState(1);
  const [protectionYears, setProtectionYears] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !mounted) {
    return null;
  }

  // Base costs per unit for 1 year
  const careCostPerYear = 50_800;
  const protectionCostPerYear = 23_007;

  // Total cost calculations
  const totalCareFee = careCostPerYear * careYears * quantity;
  const vatCare = Math.round(totalCareFee * 0.1);
  const totalProtectionFee = protectionCostPerYear * protectionYears * quantity;
  const vatProtection = Math.round(totalProtectionFee * 0.1);

  const grandTotal = totalCareFee + vatCare + totalProtectionFee + vatProtection;

  const handleClaimSubmit = async () => {
    if (!agreed) {
      return;
    }
    setIsSubmitting(true);
    try {
      if (item?.id) {
        await cultivationService
          .subscribePackage({
            treeId: String(item.id),
            packageType: 'care',
            packageId: String(item.id),
            months: careYears * 12,
          })
          .catch((error) => {
            console.warn('Care package sub warning:', error);
          });
      }
      setIsSuccess(true);
    } catch (error) {
      console.error('Claim plant error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const plantName = item?.plantCatalog?.name ?? item?.name ?? item?.title ?? '—';
  const imageUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('modalTitle')}</DialogTitle>
          <DialogDescription>{t('subtitle')}</DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="animate-in fade-in space-y-5 py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-xs">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-foreground">{t('successToast')}</h3>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
                {t('rule3')}
              </p>
            </div>
            <div className="pt-4">
              <Button onClick={onClose} className="px-8">
                {tActions('cancel')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 py-4">
            {/* Product Summary Card */}
            <Card className="flex items-center gap-4 border-border bg-muted/40 p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                <Image
                  src={imageUrl}
                  alt={plantName}
                  fill
                  sizes="80px"
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <h4 className="text-base leading-snug font-extrabold text-foreground">
                  {plantName}
                </h4>
                <p className="text-xs font-medium text-muted-foreground">
                  {t('remainingCount', { count: Number(item?.remainingSlots ?? 0) })}
                </p>
                <Badge variant="secondary">{t('badge')}</Badge>
              </div>
            </Card>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between border-b border-border py-2">
              <span className="text-sm font-bold text-foreground">{tCart('itemCount')}</span>
              <div className="flex items-center overflow-hidden rounded-xl border border-border bg-muted/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setQuantity((q) => Math.max(1, q - 1));
                  }}
                  disabled={quantity <= 1}
                  className="h-8 px-2.5"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="border-x border-border px-4 py-1 text-sm font-extrabold text-foreground">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setQuantity((q) => q + 1);
                  }}
                  className="h-8 px-2.5"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Package Options */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Gift className="h-3.5 w-3.5 text-primary" />
                  <span>{t('rule2')}</span>
                </span>
                <Select
                  value={String(careYears)}
                  onValueChange={(val) => {
                    setCareYears(Number(val));
                  }}
                >
                  <SelectTrigger className="border-border bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">
                      1 year - {formatVNDPrice(careCostPerYear * quantity)}
                    </SelectItem>
                    <SelectItem value="2">
                      2 years - {formatVNDPrice(careCostPerYear * 2 * quantity)}
                    </SelectItem>
                    <SelectItem value="3">
                      3 years - {formatVNDPrice(careCostPerYear * 3 * quantity)}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span>{t('rule1')}</span>
                </span>
                <Select
                  value={String(protectionYears)}
                  onValueChange={(val) => {
                    setProtectionYears(Number(val));
                  }}
                >
                  <SelectTrigger className="border-border bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">
                      1 year - {formatVNDPrice(protectionCostPerYear * quantity)}
                    </SelectItem>
                    <SelectItem value="2">
                      2 years - {formatVNDPrice(protectionCostPerYear * 2 * quantity)}
                    </SelectItem>
                    <SelectItem value="3">
                      3 years - {formatVNDPrice(protectionCostPerYear * 3 * quantity)}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Detailed Price Breakdown Table */}
            <Card className="space-y-2 border-border bg-muted/30 p-4 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>{tCart('subtotal')}:</span>
                <span className="font-semibold text-foreground">
                  {formatVNDPrice(totalCareFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{tCart('shippingFee')}:</span>
                <span className="font-semibold text-foreground">
                  {formatVNDPrice(totalProtectionFee)}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3 text-sm font-extrabold text-foreground sm:text-base">
                <span>{tCart('total')}:</span>
                <span className="text-lg font-black text-primary sm:text-xl">
                  {formatVNDPrice(grandTotal)}
                </span>
              </div>
            </Card>

            {/* Terms & Legal Contract Accordion Box */}
            <div className="space-y-3 rounded-2xl border border-border bg-muted/40 p-4 sm:p-5">
              <label
                htmlFor="claim-agreed-checkbox"
                className="group flex cursor-pointer items-center gap-3 py-1 select-none"
              >
                <Checkbox
                  id="claim-agreed-checkbox"
                  checked={agreed}
                  onCheckedChange={(checked: boolean | 'indeterminate') => {
                    setAgreed(!!checked);
                  }}
                  className="shrink-0"
                />
                <span className="text-xs leading-normal font-semibold text-foreground transition-colors group-hover:text-primary">
                  {t('agreeNotice')}
                </span>
              </label>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" onClick={onClose}>
                {tActions('cancel')}
              </Button>
              {isSubmitting ? (
                <ButtonLoading>...</ButtonLoading>
              ) : (
                <Button onClick={handleClaimSubmit} disabled={!agreed}>
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
