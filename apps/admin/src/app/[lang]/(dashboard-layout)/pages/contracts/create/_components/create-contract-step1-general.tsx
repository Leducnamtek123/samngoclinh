"use client"

import React from "react"
import { Building2, UserCheck, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

import type { AdminUser, Tree } from "@/types"

interface CreateContractStep1Props {
  users: AdminUser[]
  trees: Tree[]
  selectedUserId: string
  selectedUser: AdminUser | null
  onUserChange: (userId: string) => void
  title: string
  onTitleChange: (title: string) => void
  contractType: string
  onContractTypeChange: (type: string) => void
  selectedTreeCode: string
  onTreeCodeChange: (code: string) => void
}

export function CreateContractStep1General({
  users,
  trees,
  selectedUserId,
  selectedUser,
  onUserChange,
  title,
  onTitleChange,
  contractType,
  onContractTypeChange,
  selectedTreeCode,
  onTreeCodeChange,
}: CreateContractStep1Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="w-5 h-5 text-primary" /> 1. Khách hàng
            </CardTitle>
            <CardDescription>
              Chọn khách hàng đại diện Bên B tham gia ký kết hợp đồng.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerSelect">Chọn khách hàng *</Label>
              <Select value={selectedUserId} onValueChange={onUserChange}>
                <SelectTrigger id="customerSelect" className="w-full">
                  <SelectValue placeholder="-- Chọn khách hàng --" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{u.name || u.username}</span>
                        <span className="text-muted-foreground text-xs">({u.email})</span>
                        {u.isVerified && (
                          <Badge variant="secondary" className="text-[10px] px-1 py-0 bg-emerald-100 text-emerald-800">
                            eKYC
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedUser && (
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {selectedUser.name || selectedUser.username}
                    </span>
                    {selectedUser.isVerified ? (
                      <Badge className="bg-emerald-600 text-white gap-1 text-[10px]">
                        <UserCheck className="w-3 h-3" /> Đã xác thực eKYC
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 border-amber-300 text-[10px]">
                        Chưa xác thực eKYC
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                  {selectedUser.mobileNumbers?.[0]?.number && (
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      SĐT: <span className="font-medium">{selectedUser.mobileNumbers[0].number}</span>
                    </p>
                  )}
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  <span>Mã tài khoản: </span>
                  <code className="font-mono text-[11px] bg-slate-200/80 dark:bg-slate-800 px-1 py-0.5 rounded">
                    {selectedUser.id.slice(0, 12)}...
                  </code>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Thông tin hợp đồng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titleInput">Tiêu đề hợp đồng *</Label>
              <Input
                id="titleInput"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Ví dụ: Hợp đồng Mua bán và Ký gửi Chăm sóc Sâm Ngọc Linh"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nguồn phát sinh</Label>
                <Input
                  value="Tạo thủ công"
                  disabled
                  className="bg-slate-100 dark:bg-slate-800 text-slate-600 font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label>Loại hợp đồng *</Label>
                <Select value={contractType} onValueChange={onContractTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase_and_care">Mua bán & Ký gửi chăm sóc</SelectItem>
                    <SelectItem value="purchase">Mua bán sâm</SelectItem>
                    <SelectItem value="consignment">Ký gửi chăm sóc</SelectItem>
                    <SelectItem value="care">Dịch vụ chăm sóc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="treeSelect">Gắn mã cây sâm</Label>
              <Select value={selectedTreeCode} onValueChange={onTreeCodeChange}>
                <SelectTrigger id="treeSelect">
                  <SelectValue placeholder="-- Không gắn mã cây cụ thể --" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="none">-- Không gắn mã cây cụ thể --</SelectItem>
                  {trees.map((t) => (
                    <SelectItem key={t.id} value={t.code}>
                      {t.code} - {t.name || "Cây sâm"} {t.ageYear || t.ageYears ? `(${t.ageYear || t.ageYears} năm tuổi)` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Guide Card */}
      <div className="space-y-4">
        <Card className="bg-slate-50/70 dark:bg-slate-900/50 border-dashed border-slate-300 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Lưu ý khi tạo hợp đồng thủ công
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
            <p>
              <strong>1. Phát sinh tự động:</strong> Khách mua sâm trực tuyến sẽ được hệ thống tự động tạo hợp đồng khi đơn hàng thanh toán thành công.
            </p>
            <p>
              <strong>2. Khách hàng nhận thông báo:</strong> Sau khi phát hành ở trạng thái <em>Chờ ký</em>, khách hàng sẽ thấy văn bản trên tài khoản để ký điện tử.
            </p>
            <p>
              <strong>3. Chứng thực số:</strong> Sau khi khách ký, hệ thống tự động xác thực và gắn mã tra cứu.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
