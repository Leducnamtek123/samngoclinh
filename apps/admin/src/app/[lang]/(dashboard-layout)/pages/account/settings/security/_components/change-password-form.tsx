"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useTranslation } from "@/providers/i18n-provider"

import type { ChangePasswordFormType } from "../../../types"

import { ChangePasswordSchema } from "../_schemas/change-password-schema"
import { usersService } from "@/services"

import { ButtonLoading } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function ChangePasswordForm() {
  const { t } = useTranslation()
  const form = useForm<ChangePasswordFormType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const { isSubmitting } = form.formState

  async function onSubmit(data: ChangePasswordFormType) {
    try {
      await usersService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      toast.success(t("users.security.changePasswordSuccess"))
      form.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: unknown) {
      console.error("Change password error:", error)
      toast.error(error instanceof Error ? error.message : t("users.security.changePasswordError"))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-2">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("users.security.currentPassword")}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("users.security.newPassword")}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("users.security.confirmPassword")}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ButtonLoading isLoading={isSubmitting} className="mt-2 w-fit bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs">
          {t("users.security.changePassword")}
        </ButtonLoading>
      </form>
    </Form>
  )
}
