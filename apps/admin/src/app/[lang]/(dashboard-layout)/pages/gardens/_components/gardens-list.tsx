"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { EmptyState, EmptySearchResult } from "@/components/ui/feedback-components"

interface Garden {
  id: string
  code: string
  name: string
  status: string
  totalBeds: number
  activeBeds: number
  totalTrees: number
  createdAt: string
  location?: string
  description?: string
  area?: number
  establishedAt?: string
  maxBeds?: number
}

interface GardensListProps {
  gardens: Garden[]
  selectedGardenIdsSet: Set<string>
  onToggleSelect: (id: string) => void
  onToggleAll: () => void
  onOpenEdit: (garden: Garden) => void
  onDelete: (id: string) => void
  deletingId: string | null
  searchVal: string
  onClearSearch: () => void
  onOpenCreate: () => void
}

export function GardensList({
  gardens,
  selectedGardenIdsSet,
  onToggleSelect,
  onToggleAll,
  onOpenEdit,
  onDelete,
  deletingId,
  searchVal,
  onClearSearch,
  onOpenCreate,
}: GardensListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={
                  gardens.length > 0 &&
                  gardens.every((g) => selectedGardenIdsSet.has(g.id))
                }
                onCheckedChange={onToggleAll}
              />
            </TableHead>
            <TableHead>Mã vườn</TableHead>
            <TableHead>Tên khu vườn</TableHead>
            <TableHead>Vị trí</TableHead>
            <TableHead>Tổng số luống</TableHead>
            <TableHead>Luống đang hoạt động</TableHead>
            <TableHead>Tổng số gốc sâm</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gardens.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="py-8">
                {searchVal ? (
                  <EmptySearchResult
                    query={searchVal}
                    onClear={onClearSearch}
                  />
                ) : (
                  <EmptyState
                    title="Chưa có khu vườn nào"
                    description="Không tìm thấy khu vườn nào trong hệ thống. Hãy tạo vườn đầu tiên để bắt đầu canh tác sâm."
                    actionLabel="Thêm khu vườn"
                    onAction={onOpenCreate}
                  />
                )}
              </TableCell>
            </TableRow>
          ) : (
            gardens.map((garden) => (
              <TableRow key={garden.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedGardenIdsSet.has(garden.id)}
                    onCheckedChange={() => onToggleSelect(garden.id)}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs">{garden.code}</TableCell>
                <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                  {garden.name}
                </TableCell>
                <TableCell className="text-sm">
                  {garden.location || "Kon Tum"}
                </TableCell>
                <TableCell className="font-medium">{garden.totalBeds}</TableCell>
                <TableCell className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {garden.activeBeds}
                </TableCell>
                <TableCell className="font-medium">
                  {garden.totalTrees.toLocaleString("vi-VN")} cây
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      garden.status === "active"
                        ? "bg-emerald-500/10 text-emerald-600 border-transparent font-semibold"
                        : "bg-slate-500/10 text-slate-600 border-transparent font-semibold"
                    }
                  >
                    {garden.status === "active" ? "Hoạt động" : garden.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(garden.createdAt).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onOpenEdit(garden)}
                      className="h-8 w-8 text-blue-600 hover:text-blue-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(garden.id)}
                      disabled={deletingId === garden.id}
                      className="h-8 w-8 text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
