"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useTranslation } from "@/providers/i18n-provider"
import { treeFormSchema, TreeFormValues } from "@/schemas/tree-schema"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Bed {
  id: string
  code: string
  name: string
}

interface TreeDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  formData: TreeFormValues
  beds: Bed[]
  users: any[]
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

            <div className="grid gap-4 py-2 grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{t("trees.fields.name")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("trees.fields.name")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ageYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("trees.fields.age")}</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mode === "create" && (
                <FormField
                  control={form.control}
                  name="bedCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("trees.fields.bed")}</FormLabel>
                      <Select
                        value={field.value || "none"}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("trees.fields.bed")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">— None —</SelectItem>
                          {beds.map((bed) => (
                            <SelectItem key={bed.id} value={bed.code}>
                              {bed.name} ({bed.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {mode === "edit" && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={field.value || "active"}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">
                            {t("common.status.active")}
                          </SelectItem>
                          <SelectItem value="harvested">
                            {t("common.status.completed")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="healthStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("trees.fields.healthStatus")}</FormLabel>
                    <Select
                      value={field.value || "healthy"}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("trees.fields.healthStatus")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="healthy">
                          {t("common.status.healthy")}
                        </SelectItem>
                        <SelectItem value="diseased">
                          {t("common.status.diseased")}
                        </SelectItem>
                        <SelectItem value="weak">
                          {t("common.status.warning")}
                        </SelectItem>
                        <SelectItem value="dead">
                          {t("common.status.error")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plantedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("trees.fields.plantedDate")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedHarvestAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Harvest</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceBought"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("products.fields.price")} (VND)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerUserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner</FormLabel>
                    <Select
                      value={field.value || "system"}
                      onValueChange={(val) => field.onChange(val === "system" ? "" : val)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select owner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="system">System</SelectItem>
                        {users.map((u) => {
                          const name = `${u.firstName || ""} ${u.lastName || ""} (${u.username || u.email})`.trim()
                          return (
                            <SelectItem key={u.id} value={u.id}>
                              {name}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                {loading ? t("common.status.pending") : t("common.actions.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
