import { useSession } from "next-auth/react"

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER"

export function useRole() {
  const { data: session, status } = useSession()

  const user = session?.user as any
  const email = user?.email?.toLowerCase() || ""

  let rawRole = user?.role?.code || user?.role?.name || user?.role || ""
  const strRole = String(rawRole).toUpperCase()

  const isSuperAdmin =
    strRole.includes("SUPER_ADMIN") ||
    email.includes("superadmin") ||
    email.includes("super_admin")
  const isAdmin =
    isSuperAdmin || strRole.includes("ADMIN") || email.includes("admin")
  const isLoading = status === "loading"

  const role: UserRole = isSuperAdmin
    ? "SUPER_ADMIN"
    : isAdmin
      ? "ADMIN"
      : "USER"

  const hasRole = (allowedRoles?: UserRole[]) => {
    if (!allowedRoles || allowedRoles.length === 0) return true
    if (isSuperAdmin) return true
    if (
      isAdmin &&
      (allowedRoles.includes("ADMIN") || allowedRoles.includes("SUPER_ADMIN"))
    )
      return true
    return allowedRoles.includes(role)
  }

  return {
    role,
    isSuperAdmin,
    isAdmin,
    isLoading,
    hasRole,
    user,
  }
}
