"use client"

import * as TogglePrimitive from "@radix-ui/react-toggle"

import type { VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

import { toggleVariants } from "./toggle-variants"

export function Toggle({
  className,
  variant,
  size,
  ...props
}: ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}
