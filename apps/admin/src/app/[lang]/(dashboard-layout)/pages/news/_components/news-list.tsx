"use client"

import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Pencil,
  Trash2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Article {
  id: string
  slug: string
  title: string
  category: string
  summary: string
  body?: string
  status: string
  sortOrder?: number
  coverImage?: string
  image?: string
  createdAt: string
}

interface NewsListProps {
  articles: Article[]
  categoryNameMap: Record<string, string>
  statusNameMap: Record<string, string>
  onEdit: (art: Article) => void
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
}

export function NewsList({
  articles,
  categoryNameMap,
  statusNameMap,
  onEdit,
  onDelete,
  metadata,
  handlePageChange,
}: NewsListProps) {
  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden bg-white dark:bg-slate-900">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-900/40">
          <TableRow>
            <TableHead className="w-16">Ảnh bìa</TableHead>
            <TableHead>Bài viết</TableHead>
            <TableHead className="w-32">Chuyên mục</TableHead>
            <TableHead className="w-32">Trạng thái</TableHead>
            <TableHead className="w-32">Ngày tạo</TableHead>
            <TableHead className="w-24 text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-16 text-slate-400 text-xs"
              >
                Không tìm thấy bài viết tin tức nào.
              </TableCell>
            </TableRow>
          ) : (
            articles.map((art) => (
              <TableRow key={art.id} className="hover:bg-slate-50/50">
                <TableCell>
                  {art.coverImage || art.image ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-100">
                      <Image
                        src={art.coverImage || art.image}
                        alt={art.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border text-slate-350">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-xs line-clamp-1">
                      {art.title}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 line-clamp-1">
                      /{art.slug}
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1 max-w-lg">
                      {art.summary}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-2 py-0.5 border-slate-200"
                  >
                    {categoryNameMap[art.category] || art.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      art.status === "published"
                        ? "default"
                        : art.status === "draft"
                          ? "secondary"
                          : "destructive"
                    }
                    className="text-[10px] font-bold px-2 py-0.5"
                  >
                    {statusNameMap[art.status] || art.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-400 text-[10px] font-medium">
                  {art.createdAt
                    ? new Date(art.createdAt).toLocaleDateString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      })
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-slate-500 hover:text-emerald-600"
                      onClick={() => onEdit(art)}
                      title="Chỉnh sửa bài viết"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-slate-500 hover:text-red-650"
                      onClick={() => onDelete(art.id)}
                      title="Xóa bài viết"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {metadata && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/30 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Hiển thị trang {metadata.page} / {metadata.totalPage} (Tổng số{" "}
            {metadata.count} bài viết)
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
    </Card>
  )
}
