import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t border-sidebar-border">
      <div className="container flex justify-between items-center p-4 md:px-6">
        <p className="text-xs text-muted-foreground md:text-sm">
          © {currentYear}{" "}
          <a
            href="/"
            className={cn(buttonVariants({ variant: "link" }), "inline p-0")}
          >
            Sâm Ngọc Linh Admin
          </a>
          . All rights reserved.
        </p>
      </div>
    </footer>
  )
}
