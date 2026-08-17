"use client"

import { Edit, Plus, Trash2 } from "lucide-react"

import { useTranslation } from "@/providers/i18n-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ConfirmationDialog,
  ToastCard,
} from "@/components/ui/feedback-components"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CategoryDialog } from "./category-dialog"
import { useCategoriesManager } from "./use-categories-manager"

export function CategoriesTable() {
  const { t } = useTranslation()
  const {
    categories,
    searchQuery,
    setSearchQuery,
    successMsg,
    setSuccessMsg,
    errorMsg,
    setErrorMsg,
    confirmDialog,
    setConfirmDialog,
    dialogState,
    setDialogState,
    openCreateDialog,
    openEditDialog,
    handleSaveCategory,
    handleDelete,
  } = useCategoriesManager()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("products.categories")}
          </h1>
          <p className="text-muted-foreground">{t("products.subtitle")}</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="size-4 mr-2" />
          {t("products.addCategory")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="space-y-1">
              <CardTitle>{t("products.categories")}</CardTitle>
              <CardDescription>
                {categories.length} {t("products.categories").toLowerCase()}
              </CardDescription>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                placeholder={t("common.actions.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">
                    {t("products.categoryForm.code")}
                  </TableHead>
                  <TableHead>{t("products.categoryForm.name")}</TableHead>
                  <TableHead>{t("products.categoryForm.slug")}</TableHead>
                  <TableHead>{t("products.categoryForm.desc")}</TableHead>
                  <TableHead className="text-center">
                    {t("products.title")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("products.fields.status")}
                  </TableHead>
                  <TableHead className="text-right">
                    {t("common.actions.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-muted-foreground"
                    >
                      {t("common.table.noResults")}
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell className="font-mono text-xs font-semibold">
                        {cat.code}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {cat.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs font-mono">
                        /{cat.slug}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground text-sm">
                        {cat.description || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-semibold">
                          {cat.productCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {cat.status === "active" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                            {t("products.categoryForm.active")}
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-muted-foreground"
                          >
                            {t("products.categoryForm.inactive")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(cat)}
                            title={t("common.actions.edit")}
                          >
                            <Edit className="size-4 text-muted-foreground hover:text-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(cat.id)}
                            title={t("common.actions.delete")}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Category Add/Edit Dialog */}
      <CategoryDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
        mode={dialogState.mode}
        selectedCategory={dialogState.selectedCategory}
        onSave={handleSaveCategory}
      />

      {/* Confirm Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.action}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel={t("common.actions.confirm")}
        cancelLabel={t("common.actions.cancel")}
        type="danger"
        isLoading={confirmDialog.loading}
      />

      {/* Toast Notification */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-auto">
        {successMsg && (
          <ToastCard
            type="success"
            title={t("common.status.success")}
            description={successMsg}
            onClose={() => setSuccessMsg("")}
          />
        )}
        {errorMsg && (
          <ToastCard
            type="error"
            title="Có lỗi xảy ra"
            description={errorMsg}
            onClose={() => setErrorMsg("")}
          />
        )}
      </div>
    </div>
  )
}
