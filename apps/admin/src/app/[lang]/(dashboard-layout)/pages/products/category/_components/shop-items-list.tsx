"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Pencil, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { EmptyState, EmptySearchResult, ImagePlaceholder } from "@/components/ui/feedback-components"

interface ShopItem {
  id: string
  code: string
  name: string
  price: number
  unit: string
  category: string
  stock?: number
  status?: string
  images?: string[]
  description?: string
}

interface ShopItemsListProps {
  filteredItems: ShopItem[]
  searchQuery: string
  onClearSearch: () => void
  openCreateDialog: () => void
  openEditDialog: (item: ShopItem) => void
  onDelete: (id: string) => void
  metadata: {
    page: number
    perPage: number
    totalPage: number
    count: number
    hasNext: boolean
    hasPrevious: boolean
  } | null
  handlePageChange: (page: number) => void
  formatVND: (price: number) => string
  categoryNameMap: Record<string, string>
}

export function ShopItemsList({
  filteredItems,
  searchQuery,
  onClearSearch,
  openCreateDialog,
  openEditDialog,
  onDelete,
  metadata,
  handlePageChange,
  formatVND,
  categoryNameMap,
}: ShopItemsListProps) {
  return (
    <>
      {filteredItems.length === 0 ? (
        <div className="py-6">
          {searchQuery ? (
            <EmptySearchResult
              query={searchQuery}
              onClear={onClearSearch}
            />
          ) : (
            <EmptyState
              title="Chưa có sản phẩm nào"
              description="Danh mục này hiện chưa có sản phẩm thương mại hoặc vật tư nào. Hãy tạo sản phẩm đầu tiên."
              actionLabel="Thêm sản phẩm"
              onAction={openCreateDialog}
            />
          )}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ảnh</TableHead>
              <TableHead>Mã sản phẩm</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Đơn vị</TableHead>
              <TableHead>Đơn giá</TableHead>
              <TableHead>Tồn kho</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.images?.[0] ? (
                    <div className="relative size-12 rounded-md overflow-hidden border">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative size-12 rounded-md overflow-hidden border">
                      <ImagePlaceholder className="rounded-none border-none min-h-0 h-full w-full p-1" showText={false} />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-semibold">{item.code}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground max-w-xs truncate">
                      {item.description || "Không có mô tả"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {categoryNameMap[item.category] || item.category}
                  </Badge>
                </TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {formatVND(item.price)}
                </TableCell>
                <TableCell className="font-medium">{item.stock}</TableCell>
                <TableCell>
                  <Badge variant={item.status === "active" ? "default" : "secondary"} className={item.status === "active" ? "bg-emerald-600 text-white" : ""}>
                    {item.status === "active" ? "Hoạt động" : "Tạm ngưng"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(item)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/15"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination Controls */}
      {metadata && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/30 flex items-center justify-between mt-4 rounded-b-md">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Hiển thị trang {metadata.page} / {metadata.totalPage} (Tổng số {metadata.count} sản phẩm)
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
