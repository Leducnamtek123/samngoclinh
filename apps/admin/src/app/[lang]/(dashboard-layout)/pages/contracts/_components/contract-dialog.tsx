"use client"

import React from "react"

import type { Tree, User } from "./use-contracts-manager"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface ContractFormData {
  userId: string
  treeCode: string
  title: string
  content: string
  contractValue: number
  paymentStatus: string
  status: string
  expiredAt: string
  contractType: string
  partyA: string
  partyB: string
  pdfUrl: string
  terms: string
}

interface ContractDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  formData: ContractFormData
  onChange: (updater: (prev: ContractFormData) => ContractFormData) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  error: string
  users: User[]
  trees: Tree[]
}

export function ContractDialog({
  isOpen,
  onClose,
  mode,
  formData,
  onChange,
  onSubmit,
  loading,
  error,
  users,
  trees,
}: ContractDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create"
                ? "Soạn hợp đồng mới"
                : "Chỉnh sửa điều khoản hợp đồng"}
            </DialogTitle>
            <DialogDescription>
              Nhập thông số hợp đồng. Khách hàng sẽ nhận được thông báo ký hợp đồng.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="my-3 p-3 bg-destructive/15 text-destructive rounded-md text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid gap-4 py-4 grid-cols-2">
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="ctr-user">Khách hàng</Label>
              <Select
                value={formData.userId}
                onValueChange={(val) =>
                  onChange((prev) => ({ ...prev, userId: val }))
                }
                disabled={mode === "edit"}
              >
                <SelectTrigger id="ctr-user">
                  <SelectValue placeholder="Chọn khách hàng" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name || user.username} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ctr-tree">Gán vào lô cây giống</Label>
              <Select
                value={formData.treeCode}
                onValueChange={(val) =>
                  onChange((prev) => ({ ...prev, treeCode: val }))
                }
              >
                <SelectTrigger id="ctr-tree">
                  <SelectValue placeholder="Chọn cây trồng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    — Không gán lô cây giống —
                  </SelectItem>
                  {trees.map((tree) => (
                    <SelectItem key={tree.id} value={tree.code}>
                      {tree.name} ({tree.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ctr-type">Loại hợp đồng</Label>
              <Select
                value={formData.contractType}
                onValueChange={(val) =>
                  onChange((prev) => ({ ...prev, contractType: val }))
                }
              >
                <SelectTrigger id="ctr-type">
                  <SelectValue placeholder="Chọn loại hợp đồng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">
                    Mua bán sâm
                  </SelectItem>
                  <SelectItem value="care_service">
                    Dịch vụ chăm sóc
                  </SelectItem>
                  <SelectItem value="leasing">
                    Cho thuê đất vườn
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="ctr-title">Tiêu đề hợp đồng</Label>
              <Input
                id="ctr-title"
                value={formData.title}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Ví dụ: Hợp đồng ký gửi chăm sóc sâm Ngọc Linh"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ctr-partyA">Bên A</Label>
              <Input
                id="ctr-partyA"
                value={formData.partyA}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, partyA: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ctr-partyB">Bên B</Label>
              <Input
                id="ctr-partyB"
                value={formData.partyB}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, partyB: e.target.value }))
                }
                placeholder="Nhập tên khách hàng"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ctr-value">Giá trị hợp đồng</Label>
              <Input
                id="ctr-value"
                type="number"
                value={formData.contractValue}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    contractValue: Number(e.target.value),
                  }))
                }
                min={0}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ctr-pay-status">Thanh toán</Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(val) =>
                  onChange((prev) => ({ ...prev, paymentStatus: val }))
                }
              >
                <SelectTrigger id="ctr-pay-status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">
                    Chưa thanh toán
                  </SelectItem>
                  <SelectItem value="paid">Đã thanh toán</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ctr-expiry">Ngày hết hạn</Label>
              <Input
                id="ctr-expiry"
                type="date"
                value={formData.expiredAt}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, expiredAt: e.target.value }))
                }
                required
              />
            </div>

            {mode === "edit" && (
              <div className="grid gap-2">
                <Label htmlFor="ctr-status">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    onChange((prev) => ({ ...prev, status: val }))
                  }
                >
                  <SelectTrigger id="ctr-status">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      Chờ ký
                    </SelectItem>
                    <SelectItem value="signed">Đã ký</SelectItem>
                    <SelectItem value="expired">Hết hạn</SelectItem>
                    <SelectItem value="terminated">
                      Đã hủy
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="ctr-pdf">Đường dẫn tệp PDF</Label>
              <Input
                id="ctr-pdf"
                value={formData.pdfUrl}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, pdfUrl: e.target.value }))
                }
                placeholder="Ví dụ: https://storage.googleapis.com/contracts/contract_xyz.pdf"
              />
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="ctr-terms">Điều khoản bổ sung</Label>
              <Input
                id="ctr-terms"
                value={formData.terms}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, terms: e.target.value }))
                }
                placeholder="Nhập điều khoản bổ sung nếu có..."
              />
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="ctr-content">Nội dung điều khoản</Label>
              <Textarea
                id="ctr-content"
                value={formData.content}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Nhập chi tiết các điều khoản..."
                rows={4}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
