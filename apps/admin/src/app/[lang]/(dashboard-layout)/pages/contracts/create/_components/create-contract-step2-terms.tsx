"use client"

import React from "react"
import { DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { CreateContractIdentityFields } from "./create-contract-identity-fields"
import { CreateContractCustomPlaceholders } from "./create-contract-custom-placeholders"

interface CreateContractStep2Props {
  contractValue: number
  onContractValueChange: (val: number) => void
  careFee: number
  onCareFeeChange: (fee: number) => void
  treeQuantity: number
  onTreeQuantityChange: (qty: number) => void
  expiredAt: string
  onExpiredAtChange: (dateStr: string) => void
  partyA: string
  onPartyAChange: (val: string) => void
  partyB: string
  onPartyBChange: (val: string) => void
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
  customTerms: string
  onCustomTermsChange: (val: string) => void
  customPlaceholders: Record<string, string>
  onCustomPlaceholdersChange: React.Dispatch<React.SetStateAction<Record<string, string>>>
  allPlaceholders: Record<string, string>
  docTienBangChu: (num: number) => string
  docSoLuongCay: (num: number) => string
  formatPlaceholderLabel: (key: string) => string
  parseLocalDate: (d: string) => Date | undefined
  formatLocalDate: (d: Date) => string
}

export function CreateContractStep2Terms({
  contractValue,
  onContractValueChange,
  careFee,
  onCareFeeChange,
  treeQuantity,
  onTreeQuantityChange,
  expiredAt,
  onExpiredAtChange,
  partyA,
  onPartyAChange,
  partyB,
  onPartyBChange,
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
  customTerms,
  onCustomTermsChange,
  customPlaceholders,
  onCustomPlaceholdersChange,
  allPlaceholders,
  docTienBangChu,
  docSoLuongCay,
  formatPlaceholderLabel,
  parseLocalDate,
  formatLocalDate,
}: CreateContractStep2Props) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="w-5 h-5 text-emerald-600" /> Điều khoản thương mại & Thông tin định danh
          </CardTitle>
          <CardDescription>
            Thiết lập giá trị hợp đồng, phí chăm sóc, thời hạn hiệu lực và tùy chỉnh thông tin hiển thị trên văn bản.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Financial & Contract Core */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valueInput">Tổng giá trị hợp đồng (VNĐ) *</Label>
              <Input
                id="valueInput"
                type="number"
                min={0}
                step={500000}
                value={contractValue}
                onChange={(e) => onContractValueChange(Number(e.target.value) || 0)}
                className="font-semibold text-base"
              />
              <p className="text-[11px] font-medium text-emerald-600 truncate">
                {docTienBangChu(contractValue)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="careFeeInput">Phí chăm sóc năm đầu (VNĐ) *</Label>
              <Input
                id="careFeeInput"
                type="number"
                min={0}
                step={100000}
                value={careFee}
                onChange={(e) => onCareFeeChange(Number(e.target.value) || 0)}
                className="font-semibold text-base"
              />
              <p className="text-[11px] font-medium text-purple-600 truncate">
                {docTienBangChu(careFee)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="treeQuantityInput">Số lượng cây sở hữu (Cây) *</Label>
              <Input
                id="treeQuantityInput"
                type="number"
                min={1}
                max={1000}
                value={treeQuantity}
                onChange={(e) => onTreeQuantityChange(Math.max(1, Number(e.target.value) || 1))}
                className="font-semibold text-base"
              />
              <p className="text-[11px] font-medium text-slate-500 truncate">
                {docSoLuongCay(treeQuantity)}
              </p>
            </div>
          </div>

          {/* Date & Parties Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t">
            <div className="space-y-2">
              <Label>Ngày hết hạn hợp đồng *</Label>
              <DatePicker
                value={parseLocalDate(expiredAt)}
                onValueChange={(d) => {
                  if (d) onExpiredAtChange(formatLocalDate(d))
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partyAInput">Đại diện Bên A (Chủ sở hữu vườn)</Label>
              <Input
                id="partyAInput"
                value={partyA}
                onChange={(e) => onPartyAChange(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partyBInput">Đại diện Bên B (Khách hàng) *</Label>
              <Input
                id="partyBInput"
                value={partyB}
                onChange={(e) => onPartyBChange(e.target.value)}
                placeholder="Nguyễn Văn A - SĐT: 090xxxxxxx"
              />
            </div>
          </div>

          {/* Customer Identity Overrides */}
          <CreateContractIdentityFields
            customerName={customerName}
            onCustomerNameChange={onCustomerNameChange}
            customerCccd={customerCccd}
            onCustomerCccdChange={onCustomerCccdChange}
            customerPhone={customerPhone}
            onCustomerPhoneChange={onCustomerPhoneChange}
            customerEmail={customerEmail}
            onCustomerEmailChange={onCustomerEmailChange}
            customerAddress={customerAddress}
            onCustomerAddressChange={onCustomerAddressChange}
          />

          {/* Dynamic Custom Template Fields Card */}
          <CreateContractCustomPlaceholders
            customPlaceholders={customPlaceholders}
            onCustomPlaceholdersChange={onCustomPlaceholdersChange}
            allPlaceholders={allPlaceholders}
            formatPlaceholderLabel={formatPlaceholderLabel}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Đại diện Bên A</Label>
              <Input value={partyA} onChange={(e) => onPartyAChange(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Đại diện Bên B (Hiển thị tiêu đề)</Label>
              <Input value={partyB} onChange={(e) => onPartyBChange(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="termsInput">Điều khoản bổ sung</Label>
            <Textarea
              id="termsInput"
              rows={3}
              value={customTerms}
              onChange={(e) => onCustomTermsChange(e.target.value)}
              placeholder="Ghi chú thêm các cam kết hoặc thỏa thuận riêng nếu có..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
