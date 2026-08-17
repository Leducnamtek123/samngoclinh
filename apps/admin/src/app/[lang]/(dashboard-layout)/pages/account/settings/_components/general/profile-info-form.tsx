"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { ChangeEvent } from "react"
import type { ProfileInfoFormType, UserType } from "../../../types"

import { ProfileInfoSchema } from "../../_schemas/profile-info-form-schema"
import { usersService } from "@/services"

import { Button, ButtonLoading } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { PhotoUploadSection } from "./photo-upload-section"
import { ProfileFieldsSection } from "./profile-fields-section"

export function ProfileInfoForm({ user }: { user?: UserType }) {
  const router = useRouter()
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(
    user?.avatar
  )

  const form = useForm<ProfileInfoFormType>({
    resolver: zodResolver(ProfileInfoSchema),
    values: {
      ...user,
      avatar: undefined,
    },
  })

  const { isSubmitting, isDirty } = form.formState
  const isDisabled = isSubmitting || !isDirty // Disable button if form is unchanged or submitting

  function handleResetForm() {
    form.reset() // Reset the form to the initial state
    setPhotoPreview(user?.avatar) // Reset photoPreview to the initial state
  }

  function handleUploadPhoto(e: ChangeEvent<HTMLInputElement>) {
    // Get the selected file from the file input
    const file = e.target.files?.[0]

    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPhotoPreview(reader.result)
        }
      }
      reader.readAsDataURL(file)

      form.setValue("avatar", file, { shouldDirty: true })
      form.trigger("avatar") // Trigger validation for the "avatar" field
    }
  }

  function handleRemovePhoto() {
    form.resetField("avatar") // Reset the "avatar" field in the form to its initial state
    setPhotoPreview(undefined)
  }

  async function onSubmit(data: ProfileInfoFormType) {
    try {
      const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ").trim()

      await usersService.updateSelfProfile({
        name: fullName || data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode,
        language: data.language,
        timeZone: data.timeZone,
        currency: data.currency,
        organization: data.organization,
      })

      if (data.avatar instanceof File) {
        await usersService.uploadAvatar(data.avatar)
      }

      toast.success("Lưu thay đổi thông tin tài khoản thành công!")
      form.reset({
        ...data,
        avatar: undefined,
      })
      router.refresh()
    } catch (error: unknown) {
      console.error("Save profile error:", error)
      toast.error(error instanceof Error ? error.message : "Không thể lưu thông tin tài khoản.")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
        <PhotoUploadSection
          photoPreview={photoPreview}
          form={form}
          user={user}
          handleUploadPhoto={handleUploadPhoto}
          handleRemovePhoto={handleRemovePhoto}
        />
        <ProfileFieldsSection form={form} />

        <div className="flex gap-x-2 mt-4">
          <ButtonLoading
            isLoading={isSubmitting}
            className="w-fit bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
            disabled={isDisabled}
          >
            Lưu thay đổi
          </ButtonLoading>
          <Button
            type="reset"
            variant="outline"
            className="w-fit text-xs"
            disabled={isDisabled}
            onClick={handleResetForm}
          >
            Đặt lại
          </Button>
        </div>
      </form>
    </Form>
  )
}
