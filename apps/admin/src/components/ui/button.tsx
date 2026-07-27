import { Slot } from "@radix-ui/react-slot"
import { LoaderCircle } from "lucide-react"

import type { IconType } from "@/types"
import type { VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

import { buttonVariants } from "./button-variants"

interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

interface ButtonLoadingProps extends ButtonProps {
  isLoading: boolean
  loadingIconClassName?: string
  iconClassName?: string
  icon?: IconType
}

export function ButtonLoading({
  isLoading,
  disabled,
  children,
  loadingIconClassName,
  iconClassName,
  icon: Icon,
  ...props
}: ButtonLoadingProps) {
  let RenderedIcon
  if (isLoading) {
    RenderedIcon = (
      <LoaderCircle
        className={cn("me-2 size-4 animate-spin", loadingIconClassName)}
        aria-hidden
      />
    )
  } else if (Icon) {
    RenderedIcon = (
      <Icon className={cn("me-2 size-4", iconClassName)} aria-hidden />
    )
  }

  return (
    <Button
      data-slot="button-loading"
      type="submit"
      disabled={isLoading || disabled}
      aria-live="assertive"
      aria-label={isLoading ? "Loading" : props["aria-label"]}
      {...props}
    >
      {RenderedIcon}
      {children}
    </Button>
  )
}
