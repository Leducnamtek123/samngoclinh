"use client"

import React from "react"

import { useTranslation } from "@/providers/i18n-provider"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CreateContractIdentityFieldsProps {
  customerName: string
  onCustomerNameChange: (val: string) => void
  customerCccd: string
  onCustomerCccdChange: (val: string) => void
  customerPhone: string
  onCustomerPhoneChange: (val: string) => void
  customerEmail: string
  onCustomerEmailChange: (val: string) => void
  customerAddress: string
  onCustomerAddressChange: (val: string) => void
}

export function CreateContractIdentityFields({
  customerName,
  onCustomerNameChange,
  customerCccd,
  onCustomerCccdChange,
  customerPhone,
  onCustomerPhoneChange,
  customerEmail,
  onCustomerEmailChange,
  customerAddress,
  onCustomerAddressChange,
}: CreateContractIdentityFieldsProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-3 pt-2 border-t">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {t("contracts.identity.title")}
        </span>
        <Badge variant="outline" className="text-[10px]">
          {t("contracts.identity.autoBadge")}
        </Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5">
          <Label className="text-xs">{t("contracts.identity.fullName")}</Label>
          <Input
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            placeholder={t("contracts.identity.fullNamePlaceholder")}
            className="bg-white dark:bg-slate-950"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">{t("contracts.identity.cccd")}</Label>
          <Input
            value={customerCccd}
            onChange={(e) => onCustomerCccdChange(e.target.value)}
            placeholder={t("contracts.identity.cccdPlaceholder")}
            className="bg-white dark:bg-slate-950"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">{t("contracts.identity.phone")}</Label>
          <Input
            value={customerPhone}
            onChange={(e) => onCustomerPhoneChange(e.target.value)}
            placeholder={t("contracts.identity.phonePlaceholder")}
            className="bg-white dark:bg-slate-950"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">{t("contracts.identity.email")}</Label>
          <Input
            value={customerEmail}
            onChange={(e) => onCustomerEmailChange(e.target.value)}
            placeholder={t("contracts.identity.emailPlaceholder")}
            className="bg-white dark:bg-slate-950"
          />
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <Label className="text-xs">{t("contracts.identity.address")}</Label>
          <Input
            value={customerAddress}
            onChange={(e) => onCustomerAddressChange(e.target.value)}
            placeholder={t("contracts.identity.addressPlaceholder")}
            className="bg-white dark:bg-slate-950"
          />
        </div>
      </div>
    </div>
  )
}
