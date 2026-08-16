"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { FieldPath, UseFormReturn } from "react-hook-form"
import type { NotificationPreferencesFormType } from "../../../types"

import { NotificationPreferencesSchema } from "../_schemas/notifications-preferenes-schema"

import { Button, ButtonLoading } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"

export function NotificationPreferencesForm() {
  const form = useForm<NotificationPreferencesFormType>({
    resolver: zodResolver(NotificationPreferencesSchema),
    defaultValues: {
      security: {
        email: true,
        browser: false,
        sms: false,
      },
      communication: {
        email: true,
        browser: false,
        sms: false,
      },
      meetups: {
        email: true,
        browser: false,
        sms: false,
      },
    },
  })

  const { isSubmitting, isDirty } = form.formState
  const isDisabled = isSubmitting || !isDirty // Disable button if form is unchanged or submitting

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
        <FormField
          control={form.control}
          name="security"
          render={({ field }) => (
            <FormItem className="flex justify-between items-center gap-8 py-2 border-b border-border/40">
              <div>
                <FormLabel className="text-sm font-bold text-foreground">Cảnh báo Bảo mật & Đăng nhập</FormLabel>
                <FormDescription className="text-xs text-muted-foreground">
                  Nhận thông báo khi có đăng nhập từ thiết bị lạ hoặc thay đổi mật khẩu quản trị.
                </FormDescription>
              </div>
              <FormControl>
                <ChangeButton form={form} field={field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="communication"
          render={({ field }) => (
            <FormItem className="flex justify-between items-center gap-8 py-2 border-b border-border/40">
              <div>
                <FormLabel className="text-sm font-bold text-foreground">Thông báo Hoạt động Vườn & Đơn hàng</FormLabel>
                <FormDescription className="text-xs text-muted-foreground">
                  Nhận cập nhật về trạng thái đơn hàng mua sâm, hợp đồng và tiến độ chăm sóc cây.
                </FormDescription>
              </div>
              <FormControl>
                <ChangeButton form={form} field={field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="meetups"
          render={({ field }) => (
            <FormItem className="flex justify-between items-center gap-8 py-2">
              <div>
                <FormLabel className="text-sm font-bold text-foreground">Bảo trì Hệ thống & Sự kiện Mở bán</FormLabel>
                <FormDescription className="text-xs text-muted-foreground">
                  Nhận thông báo lịch bảo trì máy chủ và các sự kiện mở bán luống sâm mới.
                </FormDescription>
              </div>
              <FormControl>
                <ChangeButton form={form} field={field} />
              </FormControl>
            </FormItem>
          )}
        />

        <ButtonLoading
          isLoading={isSubmitting}
          disabled={isDisabled}
          className="mt-4 w-fit bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
        >
          Lưu thay đổi
        </ButtonLoading>
      </form>
    </Form>
  )
}

interface ChangeButtonProps {
  form: UseFormReturn<NotificationPreferencesFormType>
  field: {
    name: FieldPath<NotificationPreferencesFormType>
    value: { email: boolean; browser: boolean; sms: boolean }
  }
}

function ChangeButton({ form, field }: ChangeButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">Thay đổi</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          checked={field.value.email}
          onCheckedChange={() =>
            form.setValue(
              field.name,
              {
                ...field.value,
                email: !field.value.email,
              },
              { shouldDirty: true }
            )
          }
        >
          Email
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={field.value.browser}
          onCheckedChange={() =>
            form.setValue(
              field.name,
              {
                ...field.value,
                browser: !field.value.browser,
              },
              { shouldDirty: true }
            )
          }
        >
          Trình duyệt (Push)
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={field.value.sms}
          onCheckedChange={() =>
            form.setValue(
              field.name,
              {
                ...field.value,
                sms: !field.value.sms,
              },
              { shouldDirty: true }
            )
          }
        >
          Tin nhắn SMS
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function onSubmit(_data: NotificationPreferencesFormType) {}
