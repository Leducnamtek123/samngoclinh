import type { ReactNode } from "react"

import { NavList } from "./_components/nav-list"

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container grid w-full items-start gap-6 p-4 sm:p-6 md:grid-cols-[200px_1fr]">
      <div className="grid gap-6">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Cài đặt tài khoản</h1>
        <NavList />
      </div>
      <div className="grid gap-6">{children}</div>
    </div>
  )
}
