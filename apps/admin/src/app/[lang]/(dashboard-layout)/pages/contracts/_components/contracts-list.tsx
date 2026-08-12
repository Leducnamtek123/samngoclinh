"use client"

import React from "react"
import { Pencil, Trash2 } from "lucide-react"

import type { EContract, User } from "./use-contracts-manager"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ContractsListProps {
  contracts: EContract[]
  users: User[]
  onEdit: (contract: EContract) => void
  onDelete: (id: string) => void
  formatVND: (value: number) => string
  getStatusBadge: (status: string) => React.ReactNode
}

export function ContractsList({
  contracts,
  users,
  onEdit,
  onDelete,
  formatVND,
  getStatusBadge,
}: ContractsListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã HĐ</TableHead>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Cây trồng</TableHead>
            <TableHead>Giá trị (VND)</TableHead>
            <TableHead>Thanh toán</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày hết hạn</TableHead>
            <TableHead>Cảnh báo nhắc</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center py-12 text-muted-foreground"
              >
                Không tìm thấy hợp đồng nào phù hợp.
              </TableCell>
            </TableRow>
          ) : (
            contracts.map((contract) => {
              const userObj = users.find((u) => u.id === contract.userId)
              return (
                <TableRow key={contract.id}>
                  <TableCell className="font-mono text-xs font-semibold">
                    {contract.code}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                    {contract.title}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {userObj?.name || "Hệ thống"}
                      </span>
                      <span className="text-muted-foreground">
                        {userObj?.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-600">
                    {contract.treeCode ? (
                      <Badge variant="outline" className="font-mono text-xs">
                        {contract.treeCode}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-700">
                    {formatVND(contract.contractValue)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        contract.paymentStatus === "paid"
                          ? "bg-emerald-500/10 text-emerald-600 border-transparent font-semibold"
                          : "bg-amber-500/10 text-amber-600 border-transparent font-semibold"
                      }
                    >
                      {contract.paymentStatus === "paid"
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(contract.expiredAt).toLocaleDateString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                    })}
                  </TableCell>
                  <TableCell className="text-xs">
                    {contract.isReminderSent ? (
                      <div className="flex flex-col text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 w-max">
                        <span className="font-bold">Đã gửi nhắc</span>
                        {contract.reminderSentAt && (
                          <span>
                            {new Date(
                              contract.reminderSentAt
                            ).toLocaleDateString("vi-VN", {
                              timeZone: "Asia/Ho_Chi_Minh",
                            })}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(contract)}
                        className="h-8 w-8 text-blue-600 hover:text-blue-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(contract.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
