import { usePathname, useRouter } from "next/navigation"
import { EllipsisVertical, Star } from "lucide-react"

import type { KeyboardEvent } from "react"
import type { EmailType } from "../types"

import { cn, ensureWithSuffix, formatDate } from "@/lib/utils"

import { useEmailContext } from "../_hooks/use-email-context"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface EmailListContentItemMoblieProps {
  email: EmailType
  isSelected: boolean
}

export function EmailListContentItemMoblie({
  email,
  isSelected,
}: EmailListContentItemMoblieProps) {
  const { handleToggleSelectEmail, handleToggleStarEmail, handleSetRead } =
    useEmailContext()
  const router = useRouter()
  const pathname = usePathname()

  const isStarred = email.starred

  function handleOnKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      handleSetRead(email)
      router.push(ensureWithSuffix(pathname, "/") + email.id)
    }
  }

  function handleOnClick() {
    handleSetRead(email)
    router.push(ensureWithSuffix(pathname, "/") + email.id)
  }

  return (
    <li
      key={email.id}
      className={cn(
        "flex items-center justify-between gap-1.5 p-1 ps-3",
        email.read && "bg-muted"
      )}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => handleToggleSelectEmail(email)}
        aria-label="Select email"
      />

      <button
        type="button"
        className="flex-1 text-left px-2 focus-visible:outline-none"
        onClick={handleOnClick}
        onKeyDown={handleOnKeyDown}
      >
        <span className="block font-bold line-clamp-1 break-all">
          {email.subject}
        </span>
        <span className="block text-muted-foreground line-clamp-1 break-all">
          From {email.sender.name}
        </span>
        <span className="block text-sm text-muted-foreground">
          {formatDate(email.createdAt)}
        </span>
      </button>
      <Button
        variant="ghost"
        size="icon"
        className="h-4 w-4"
        onClick={() => {
          handleToggleStarEmail(email)
        }}
        aria-label={isStarred ? `Unstar email` : `Star email`}
        aria-live="polite"
      >
        <Star
          className={`h-4 w-4 ${
            isStarred
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground"
          }`}
        />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="More actions"
          >
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Archive</DropdownMenuItem>
          <DropdownMenuItem>Mark as spam</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}
