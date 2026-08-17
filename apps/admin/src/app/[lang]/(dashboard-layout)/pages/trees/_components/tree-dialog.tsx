"use client"

import React, { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { TreeFormValues } from "@/schemas/tree-schema"
import type { AdminUser } from "@/types"
import type { Bed } from "./tree-form-fields"

import { treeFormSchema } from "@/schemas/tree-schema"

import { useTranslation } from "@/providers/i18n-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { TreeFormFields } from "./tree-form-fields"

export type { Bed }

interface TreeDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  formData: TreeFormValues
  beds: Bed[]
  users:
    | AdminUser[]
    | Array<{
        id: string
        name?: string | null
        username: string
        email?: string
      }>
  onSubmit: (values: TreeFormValues) => void
  loading: boolean
  error: string
}

export function TreeDialog({
  isOpen,
  onClose,
  mode,
  formData,
  beds,
  users,
  onSubmit,
  loading,
  error,
}: TreeDialogProps) {
  const { t } = useTranslation()

  const form = useForm<TreeFormValues>({
    resolver: zodResolver(treeFormSchema),
    defaultValues: formData,
  })

  useEffect(() => {
    if (isOpen) {
      form.reset(formData)
    }
  }, [isOpen, formData, form])

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                {mode === "create" ? t("trees.addTree") : t("trees.editTree")}
              </DialogTitle>
              <DialogDescription>{t("trees.subtitle")}</DialogDescription>
            </DialogHeader>

            {error && (
              <div className="p-3 bg-destructive/15 text-destructive rounded-md text-xs font-medium">
                {error}
              </div>
            )}

            <TreeFormFields
              form={form}
              mode={mode}
              beds={beds}
              users={users}
              t={t}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                {t("common.actions.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {loading
                  ? t("common.status.pending")
                  : t("common.actions.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
