"use client"

import React from "react"
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
  return (
    <div className="space-y-3 pt-2 border-t">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Thông tin pháp lý hiển thị trên hợp đồng
        </span>
        <Badge variant="outline" className="text-[10px]">Tự động điền theo eKYC</Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5">
          <Label className="text-xs">Họ và tên khách hàng *</Label>
          <Input
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            placeholder="Họ và tên đầy đủ..."
            className="bg-white dark:bg-slate-950"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Số CMND / CCCD / MST *</Label>
          <Input
            value={customerCccd}
            onChange={(e) => onCustomerCccdChange(e.target.value)}
            placeholder="079090001234"
            className="bg-white dark:bg-slate-950"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Số điện thoại liên lạc *</Label>
          <Input
            value={customerPhone}
            onChange={(e) => onCustomerPhoneChange(e.target.value)}
            placeholder="0901234567"
            className="bg-white dark:bg-slate-950"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Địa chỉ Email</Label>
          <Input
            value={customerEmail}
            onChange={(e) => onCustomerEmailChange(e.target.value)}
            placeholder="email@domain.com"
            className="bg-white dark:bg-slate-950"
          />
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <Label className="text-xs">Địa chỉ thường trú / cư trú *</Label>
          <Input
            value={customerAddress}
            onChange={(e) => onCustomerAddressChange(e.target.value)}
            placeholder="Thôn 2, Xã Trà Linh, Huyện Nam Trà My, Tỉnh Quảng Nam"
            className="bg-white dark:bg-slate-950"
          />
        </div>
      </div>
    </div>
  )
}
