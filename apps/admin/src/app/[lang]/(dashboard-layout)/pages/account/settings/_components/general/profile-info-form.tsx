"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { ChangeEvent } from "react"
import type { ProfileInfoFormType, UserType } from "../../../types"

import { ProfileInfoSchema } from "../../_schemas/profile-info-form-schema"

import { Button, ButtonLoading } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { PhotoUploadSection } from "./photo-upload-section"
import { ProfileFieldsSection } from "./profile-fields-section"

export function ProfileInfoForm({ user }: { user?: UserType }) {
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
      // Generate a temporary URL for the uploaded image for preview purposes
      const imageUrl = URL.createObjectURL(file)

      setPhotoPreview(imageUrl)
      form.setValue("avatar", file)
      form.trigger("avatar") // Trigger validation for the "avatar" field
    }
  }

  function handleRemovePhoto() {
    form.resetField("avatar") // Reset the "avatar" field in the form to its initial state
    setPhotoPreview(undefined)
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

        <div className="flex gap-x-2 mt-2">
          <ButtonLoading
            isLoading={isSubmitting}
            className="w-fit"
            disabled={isDisabled}
          >
            Save
          </ButtonLoading>
          <Button
            type="reset"
            variant="secondary"
            className="w-fit"
            disabled={isDisabled}
            onClick={handleResetForm}
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  )
}

async function onSubmit(_data: ProfileInfoFormType) {}
