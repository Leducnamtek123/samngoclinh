"use client"

import Image from "next/image"
import { ImageIcon, Pencil, Trash2 } from "lucide-react"

import type { Article, PaginationMeta } from "@/types"

import { useTranslation } from "@/providers/i18n-provider"
import { Pagination } from "@/components/ui/app-pagination"
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

interface NewsListProps {
  articles: Article[]
  categoryNameMap: Record<string, string>
  statusNameMap: Record<string, string>
  onEdit: (art: Article) => void
  onDelete: (id: string) => void
  metadata: PaginationMeta | null
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
  const { t } = useTranslation()

  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden bg-white dark:bg-slate-900">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-900/40">
          <TableRow>
            <TableHead className="w-16">{t("products.fields.image")}</TableHead>
            <TableHead>{t("content.articles.articleTitle")}</TableHead>
            <TableHead className="w-32">
              {t("content.articles.category")}
            </TableHead>
            <TableHead className="w-32">
              {t("products.fields.status")}
            </TableHead>
            <TableHead className="w-32">
              {t("users.fields.createdAt")}
            </TableHead>
            <TableHead className="w-24 text-right">
              {t("common.actions.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-16 text-slate-400 text-xs"
              >
                {t("common.table.noResults")}
              </TableCell>
            </TableRow>
          ) : (
            articles.map((art) => (
              <TableRow key={art.id} className="hover:bg-slate-50/50">
                <TableCell>
                  {art.coverImage || art.image ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-100">
                      <Image
                        src={(art.coverImage || art.image)!}
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
                    {art.category
                      ? categoryNameMap[art.category] || art.category
                      : "-"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-2 py-0.5 ${
                      art.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : art.status === "draft"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    {statusNameMap[art.status] || art.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-400 text-xs font-mono">
                  {art.createdAt
                    ? new Date(art.createdAt).toLocaleDateString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      })
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(art)}
                      className="h-7 w-7 text-slate-600 hover:text-slate-900"
                      title={t("common.actions.edit")}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(art.id)}
                      className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title={t("common.actions.delete")}
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

      {metadata && handlePageChange && (
        <Pagination
          metadata={metadata}
          onPageChange={handlePageChange}
          className="px-4 pb-4"
        />
      )}
    </Card>
  )
}
