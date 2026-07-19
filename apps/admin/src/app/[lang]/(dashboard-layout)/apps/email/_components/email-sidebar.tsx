"use client"

import { useMedia } from "react-use"

import { useEmailContext } from "../_hooks/use-email-context"
import { Card } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { EmailSidebarHeader } from "./email-sidebar-header"
import { EmailSidebarList } from "./email-sidebar-list"

function EmailSidebarContent() {
  return (
    <>
      <EmailSidebarHeader />
      <EmailSidebarList />
    </>
  )
}

export function EmailSidebar() {
  const { isEmailSidebarOpen, setIsEmailSidebarOpen } = useEmailContext()
  const isMediumOrSmaller = useMedia("(max-width: 767px)")

  // Render a persistent sidebar for larger screens
  if (!isMediumOrSmaller) {
    return (
      <aside>
        <Card className="h-full w-72 flex flex-col border border-border">
          <EmailSidebarContent />
        </Card>
      </aside>
    )
  }

  // Render a sheet sidebar for smaller screens
  return (
    <Sheet open={isEmailSidebarOpen} onOpenChange={setIsEmailSidebarOpen}>
      <SheetContent side="start" className="p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Email Sidebar</SheetTitle>
          <SheetDescription>
            Access your email folders and categories. Navigate between Inbox,
            Sent, Drafts, and custom labels.
          </SheetDescription>
        </SheetHeader>
        <div className="h-full w-72 flex flex-col">
          <EmailSidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  )
}
