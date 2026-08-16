"use client"

import Image from "next/image"
import { Pencil, Trash2 } from "lucide-react"

import { useTranslation } from "@/providers/i18n-provider"
import { Pagination } from "@/components/ui/app-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  EmptySearchResult,
  EmptyState,
  ImagePlaceholder,
} from "@/components/ui/feedback-components"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { PaginationMeta, ShopItem } from "@/types"

interface ShopItemsListProps {
  filteredItems: ShopItem[]
  searchQuery: string
  onClearSearch: () => void
  openCreateDialog: () => void
  openEditDialog: (item: ShopItem) => void
  onDelete: (id: string) => void
  metadata: PaginationMeta | null
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
  const { t } = useTranslation()

  return (
    <>
      {filteredItems.length === 0 ? (
        <div className="py-6">
          {searchQuery ? (
            <EmptySearchResult query={searchQuery} onClear={onClearSearch} />
          ) : (
            <EmptyState
              title={t("common.table.noResults")}
              description={t("products.subtitle")}
              actionLabel={t("products.addProduct")}
              onAction={openCreateDialog}
            />
          )}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("products.fields.image")}</TableHead>
              <TableHead>{t("products.fields.sku")}</TableHead>
              <TableHead>{t("products.fields.name")}</TableHead>
              <TableHead>{t("products.fields.category")}</TableHead>
              <TableHead>{t("products.fields.unit")}</TableHead>
              <TableHead>{t("products.fields.price")}</TableHead>
              <TableHead>{t("products.fields.stock")}</TableHead>
              <TableHead>{t("products.fields.status")}</TableHead>
              <TableHead className="text-right">
                {t("common.actions.actions")}
              </TableHead>
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
                      <ImagePlaceholder
                        className="rounded-none border-none min-h-0 h-full w-full p-1"
                        showText={false}
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-semibold">{item.code}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground max-w-xs truncate">
                      {item.description || "-"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {item.category ? categoryNameMap[item.category] || item.category : "-"}
                  </Badge>
                </TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {formatVND(item.price)}
                </TableCell>
                <TableCell className="font-medium">{item.stock}</TableCell>
                <TableCell>
                  <Badge
                    variant={item.status === "active" ? "default" : "secondary"}
                    className={
                      item.status === "active"
                        ? "bg-emerald-600 text-white"
                        : ""
                    }
                  >
                    {item.status === "active"
                      ? t("common.status.active")
                      : t("common.status.inactive")}
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
      <Pagination metadata={metadata} onPageChange={handlePageChange} />
    </>
  )
}
