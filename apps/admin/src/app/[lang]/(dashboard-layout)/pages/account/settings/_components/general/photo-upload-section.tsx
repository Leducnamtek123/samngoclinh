"use client"

import type { ChangeEvent } from "react"
import type { UseFormReturn } from "react-hook-form"
import type { ProfileInfoFormType, UserType } from "../../../types"

import { cn, getInitials } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface PhotoUploadSectionProps {
  photoPreview: string | undefined
  form: UseFormReturn<ProfileInfoFormType>
  user: UserType
  handleUploadPhoto: (e: ChangeEvent<HTMLInputElement>) => void
  handleRemovePhoto: () => void
}

export function PhotoUploadSection({
  photoPreview,
  form,
  user,
  handleUploadPhoto,
  handleRemovePhoto,
}: PhotoUploadSectionProps) {
  return (
    <div className="flex items-center gap-x-4">
      <Avatar className="size-22">
        <AvatarImage src={photoPreview} alt="Profile Avatar" />
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="grid gap-2">
        <FormField
          control={form.control}
          name="avatar"
          render={() => (
            <FormItem>
              <FormLabel
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "cursor-pointer w-full"
                )}
              >
                Upload Photo
              </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadPhoto}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" variant="destructive" onClick={handleRemovePhoto}>
          Remove Photo
        </Button>
      </div>
    </div>
  )
}
