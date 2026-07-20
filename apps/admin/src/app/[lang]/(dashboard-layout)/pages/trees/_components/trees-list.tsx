"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Pencil, ChevronLeft, ChevronRight } from "lucide-react"
import { EmptyState, EmptySearchResult } from "@/components/ui/feedback-components"

interface Tree {
  id: string
  code: string
  name: string
  ageYear: number
  quantity: number
  status: string
  bedCode?: string
  ownerUserId?: string
  carePackageCode?: string
  carePackageExpiredAt?: string
  protectionPackageCode?: string
  protectionPackageExpiredAt?: string
  plantedAt?: string
  healthStatus?: string
  lastCareDate?: string
  nextCareDate?: string
  expectedHarvestAt?: string
  images?: string[]
  priceBought?: number
  metadata?: any
}

interface TreesListProps {
  filteredTrees: Tree[]
  searchQuery: string
  onClearSearch: () => void
  onOpenCreate: () => void
  onOpenEdit: (tree: Tree) => void
  onDelete: (id: string) => void
  getOwnerName: (userId: string | undefined) => string
  metadata: {
    page: number
    perPage: number
    totalPage: number
    count: number
    hasNext: boolean
    hasPrevious: boolean
  } | null
  handlePageChange: (page: number) => void
}

export function TreesList({
  filteredTrees,
  searchQuery,
  onClearSearch,
  onOpenCreate,
  onOpenEdit,
  onDelete,
  getOwnerName,
  metadata,
  handlePageChange,
}: TreesListProps) {
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã cây</TableHead>
              <TableHead>Tên cây giống</TableHead>
              <TableHead>Mã Luống</TableHead>
              <TableHead>Tuổi sâm</TableHead>
              <TableHead>Số lượng gốc</TableHead>
              <TableHead>Chủ sở hữu</TableHead>
              <TableHead>Sức khỏe</TableHead>
              <TableHead>Gói Chăm Sóc</TableHead>
              <TableHead>Gói Bảo Vệ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="py-8">
                  {searchQuery ? (
                    <EmptySearchResult
                      query={searchQuery}
                      onClear={onClearSearch}
                    />
                  ) : (
                    <EmptyState
                      title="Chưa có cây trồng"
                      description="Không tìm thấy lô gốc sâm nào trong hệ thống hoặc luống hiện tại. Hãy trồng thêm lô cây mới để bắt đầu theo dõi."
                      actionLabel="Trồng cây mới"
                      onAction={onOpenCreate}
                    />
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredTrees.map((tree) => (
                <TableRow key={tree.id}>
                  <TableCell className="font-mono text-xs font-semibold">{tree.code}</TableCell>
                  <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                    {tree.name}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {tree.bedCode ? (
                      <Badge variant="secondary" className="font-mono text-xs">
                        {tree.bedCode}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">— Chưa gán luống —</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{tree.ageYear} tuổi</TableCell>
                  <TableCell className="font-semibold text-slate-700 dark:text-slate-300">
                    {tree.quantity} gốc
                  </TableCell>
                  <TableCell className="text-xs truncate max-w-[150px]" title={tree.ownerUserId}>
                    {getOwnerName(tree.ownerUserId)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {tree.metadata?.healthStatus || "Tốt"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {tree.carePackageCode ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-emerald-700">{tree.carePackageCode}</span>
                        {tree.carePackageExpiredAt && (
                          <span className="text-[10px] text-muted-foreground">
                            Hết hạn: {new Date(tree.carePackageExpiredAt).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">Chưa đăng ký</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    {tree.protectionPackageCode ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-indigo-700">{tree.protectionPackageCode}</span>
                        {tree.protectionPackageExpiredAt && (
                          <span className="text-[10px] text-muted-foreground">
                            Hết hạn: {new Date(tree.protectionPackageExpiredAt).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">Chưa đăng ký</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        tree.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600 border-transparent font-semibold"
                          : "bg-slate-500/10 text-slate-600 border-transparent font-semibold"
                      }
                    >
                      {tree.status === "active" ? "Đang trồng" : tree.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenEdit(tree)}
                        className="h-8 w-8 text-blue-600 hover:text-blue-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(tree.id)}
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

      {/* Pagination Controls */}
      {metadata && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Hiển thị trang {metadata.page} / {metadata.totalPage} (Tổng số {metadata.count} lô gốc sâm)
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={!metadata.hasPrevious}
              onClick={() => handlePageChange(metadata.page - 1)}
              className="h-8 text-xs flex items-center gap-1 text-slate-600 dark:text-slate-400"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Trước</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!metadata.hasNext}
              onClick={() => handlePageChange(metadata.page + 1)}
              className="h-8 text-xs flex items-center gap-1 text-slate-600 dark:text-slate-400"
            >
              <span>Kế tiếp</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
