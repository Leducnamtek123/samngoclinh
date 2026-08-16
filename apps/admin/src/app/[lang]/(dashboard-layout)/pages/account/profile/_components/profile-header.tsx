import Image from "next/image"
import Link from "next/link"
import { ShieldCheck, UserPen, MapPin, Sparkles } from "lucide-react"

import type { LocaleType } from "@/types"

import { ensureLocalizedPathname } from "@/lib/i18n"
import { cn, getInitials } from "@/lib/utils"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button-variants"
import { Badge } from "@/components/ui/badge"

export function ProfileHeader({
  locale,
  user,
}: {
  locale: LocaleType
  user?: any
}) {
  const profileUser = user || {}
  const name = profileUser.name || "Quản trị viên Hệ thống"
  const email = profileUser.email || "admin@samngoclinh.com"
  const roleName = profileUser.role || "SUPER_ADMIN"

  return (
    <section className="bg-card border-b border-border rounded-b-2xl overflow-hidden shadow-xs">
      <AspectRatio ratio={6 / 1} className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 relative">
        <Image
          src="/images/banners/homepage_banner_1.png"
          fill
          priority
          className="h-full w-full object-cover opacity-40 mix-blend-overlay"
          alt="Profile Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </AspectRatio>
      <div className="relative w-full flex flex-col items-center gap-4 p-6 md:flex-row md:items-end">
        <div className="relative -mt-16 md:-mt-20">
          <Avatar className="size-28 md:size-32 ring-4 ring-card shadow-xl">
            <AvatarImage
              src={profileUser.avatar}
              alt="Profile Avatar"
              className="object-cover"
            />
            <AvatarFallback className="bg-emerald-700 text-white font-black text-2xl">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-card animate-pulse" />
        </div>

        <div className="flex-1 text-center md:text-start space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <h1 className="text-2xl font-black text-foreground tracking-tight line-clamp-1">
              {name}
            </h1>
            <Badge variant="secondary" className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{roleName === 'SUPER_ADMIN' ? 'Quản Trị Cấp Cao' : 'Quản Lý Nông Trường'}</span>
            </Badge>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-muted-foreground font-medium">
            <span>Email: <strong className="text-foreground">{email}</strong></span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kon Tum & Gia Lai, Việt Nam</span>
            </span>
            <span>Mã NV: <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">SNL-ADM01</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={ensureLocalizedPathname("/pages/account/settings", locale)}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5 font-semibold text-xs rounded-xl shadow-xs"
            )}
          >
            <UserPen className="size-3.5 text-emerald-600" />
            <span>Cài đặt tài khoản</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
