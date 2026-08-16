"use client"

import { Pencil, Trash2 } from "lucide-react"

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

interface CarePackage {
  id: string
  code: string
  name: string
  price: number
  durationMonths: number
  description?: string
  status: string
}

interface ProtectionPackage {
  id: string
  code: string
  name: string
  price: number
  coverage?: string
  description?: string
  status: string
}

interface CarePackagesListProps {
  packages: CarePackage[]
  onEdit: (pkg: CarePackage) => void
  onDelete: (id: string) => void
  onOpenCreate: () => void
  formatVND: (amount: number) => string
  metadata?: any
  handlePageChange?: (page: number) => void
}

interface ProtectionPackagesListProps {
  packages: ProtectionPackage[]
  onEdit: (pkg: ProtectionPackage) => void
  onDelete: (id: string) => void
  onOpenCreate: () => void
  formatVND: (amount: number) => string
  metadata?: any
  handlePageChange?: (page: number) => void
}

export function CarePackagesList({
  packages,
  onEdit,
  onDelete,
  onOpenCreate,
  formatVND,
  metadata,
  handlePageChange = () => {},
}: CarePackagesListProps) {
  const { t } = useTranslation()

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("packages.fields.code")}</TableHead>
            <TableHead>{t("packages.fields.name")}</TableHead>
            <TableHead>{t("packages.fields.price")}</TableHead>
            <TableHead>{t("packages.fields.duration")}</TableHead>
            <TableHead>{t("packages.fields.description")}</TableHead>
            <TableHead>{t("packages.fields.status")}</TableHead>
            <TableHead className="text-right">
              {t("common.actions.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <EmptyState
                  title={t("common.table.noResults")}
                  description={t("common.table.noResults")}
                  actionLabel={t("common.actions.add")}
                  onAction={onOpenCreate}
                />
              </TableCell>
            </TableRow>
          ) : (
            packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-mono text-xs font-semibold">
                  {pkg.code}
                </TableCell>
                <TableCell className="font-medium">{pkg.name}</TableCell>
                <TableCell>{formatVND(pkg.price)}</TableCell>
                <TableCell>{pkg.durationMonths} tháng</TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground text-xs">
                  {pkg.description || "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      pkg.status.toLowerCase() === "active"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {pkg.status.toLowerCase() === "active"
                      ? t("common.status.active")
                      : t("common.status.inactive")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(pkg)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(pkg.id)}
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
      <Pagination metadata={metadata} onPageChange={handlePageChange} />
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
  handlePageChange = () => {},
}: ProtectionPackagesListProps) {
  const { t } = useTranslation()

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("packages.fields.code")}</TableHead>
            <TableHead>{t("packages.fields.name")}</TableHead>
            <TableHead>{t("packages.fields.price")}</TableHead>
            <TableHead>{t("packages.fields.coverage")}</TableHead>
            <TableHead>{t("packages.fields.description")}</TableHead>
            <TableHead>{t("packages.fields.status")}</TableHead>
            <TableHead className="text-right">
              {t("common.actions.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8">
                <EmptyState
                  title={t("common.table.noResults")}
                  description={t("common.table.noResults")}
                  actionLabel={t("common.actions.add")}
                  onAction={onOpenCreate}
                />
              </TableCell>
            </TableRow>
          ) : (
            packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-mono text-xs font-semibold">
                  {pkg.code}
                </TableCell>
                <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                  {pkg.name}
                </TableCell>
                <TableCell className="font-medium text-emerald-600">
                  {formatVND(pkg.price)}
                </TableCell>
                <TableCell className="text-sm">{pkg.coverage || "—"}</TableCell>
                <TableCell className="text-sm max-w-[200px] truncate">
                  {pkg.description || "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={pkg.status === "active" ? "default" : "outline"}
                  >
                    {t(`common.status.${pkg.status.toLowerCase()}`)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(pkg)}
                      className="h-8 w-8 text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(pkg.id)}
                      className="h-8 w-8 text-destructive"
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
      {handlePageChange && metadata && (
        <Pagination
          metadata={metadata}
          onPageChange={handlePageChange}
          className="px-4 pb-2"
        />
      )}
    </div>
  )
}
