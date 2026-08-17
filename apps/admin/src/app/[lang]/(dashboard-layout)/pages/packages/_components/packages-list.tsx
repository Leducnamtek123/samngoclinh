"use client"

import { Pencil, Trash2 } from "lucide-react"

import type { CarePackage, PaginationMeta, ProtectionPackage } from "@/types"

import { useTranslation } from "@/providers/i18n-provider"
import { Pagination } from "@/components/ui/app-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/feedback-components"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CarePackagesListProps {
  packages: CarePackage[]
  onEdit: (pkg: CarePackage) => void
  onDelete: (id: string) => void
  onOpenCreate: () => void
  formatVND: (amount: number) => string
  metadata?: PaginationMeta | null
  handlePageChange?: (page: number) => void
}

interface ProtectionPackagesListProps {
  packages: ProtectionPackage[]
  onEdit: (pkg: ProtectionPackage) => void
  onDelete: (id: string) => void
  onOpenCreate: () => void
  formatVND: (amount: number) => string
  metadata?: PaginationMeta | null
  handlePageChange?: (page: number) => void
}

export function CarePackagesList({
  packages,
  onEdit,
  onDelete,
  onOpenCreate,
  formatVND,
  metadata,
  handlePageChange,
}: CarePackagesListProps) {
  const { t } = useTranslation()

  if (packages.length === 0) {
    return (
      <EmptyState
        title={t("packages.emptyCareTitle")}
        description={t("packages.emptyCareDesc")}
        actionLabel={t("packages.addCarePackage")}
        onAction={onOpenCreate}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("packages.fields.code")}</TableHead>
              <TableHead>{t("packages.fields.name")}</TableHead>
              <TableHead>{t("packages.fields.duration")}</TableHead>
              <TableHead>{t("packages.fields.price")}</TableHead>
              <TableHead>{t("packages.fields.status")}</TableHead>
              <TableHead className="text-right">
                {t("common.actions.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-mono font-medium text-xs">
                  {pkg.code}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{pkg.name}</div>
                  {pkg.description && (
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {pkg.description}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {pkg.durationMonths} {t("packages.months")}
                </TableCell>
                <TableCell className="font-semibold text-emerald-600">
                  {formatVND(pkg.price)}
                </TableCell>
                <TableCell>
                  {pkg.status === "active" ? (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      {t("common.status.active")}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-slate-50 text-slate-700 border-slate-200"
                    >
                      {t("common.status.inactive")}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(pkg)}
                      className="h-8 w-8 text-slate-600 hover:text-slate-900"
                      title={t("common.actions.edit")}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(pkg.id)}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title={t("common.actions.delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {metadata && handlePageChange && (
        <Pagination metadata={metadata} onPageChange={handlePageChange} />
      )}
    </div>
  )
}

export function ProtectionPackagesList({
  packages,
  onEdit,
  onDelete,
  onOpenCreate,
  formatVND,
  metadata,
  handlePageChange,
}: ProtectionPackagesListProps) {
  const { t } = useTranslation()

  if (packages.length === 0) {
    return (
      <EmptyState
        title={t("packages.emptyProtectionTitle")}
        description={t("packages.emptyProtectionDesc")}
        actionLabel={t("packages.addProtectionPackage")}
        onAction={onOpenCreate}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("packages.fields.code")}</TableHead>
              <TableHead>{t("packages.fields.name")}</TableHead>
              <TableHead>{t("packages.fields.duration")}</TableHead>
              <TableHead>{t("packages.fields.coverage")}</TableHead>
              <TableHead>{t("packages.fields.price")}</TableHead>
              <TableHead>{t("packages.fields.status")}</TableHead>
              <TableHead className="text-right">
                {t("common.actions.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-mono font-medium text-xs">
                  {pkg.code}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{pkg.name}</div>
                  {pkg.description && (
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {pkg.description}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {pkg.durationMonths} {t("packages.months")}
                </TableCell>
                <TableCell className="font-medium text-blue-600">
                  {pkg.coveragePercentage
                    ? `${pkg.coveragePercentage}%`
                    : "100%"}
                </TableCell>
                <TableCell className="font-semibold text-emerald-600">
                  {formatVND(pkg.price)}
                </TableCell>
                <TableCell>
                  {pkg.status === "active" ? (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      {t("common.status.active")}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-slate-50 text-slate-700 border-slate-200"
                    >
                      {t("common.status.inactive")}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(pkg)}
                      className="h-8 w-8 text-slate-600 hover:text-slate-900"
                      title={t("common.actions.edit")}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(pkg.id)}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title={t("common.actions.delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {metadata && handlePageChange && (
        <Pagination metadata={metadata} onPageChange={handlePageChange} />
      )}
    </div>
  )
}
