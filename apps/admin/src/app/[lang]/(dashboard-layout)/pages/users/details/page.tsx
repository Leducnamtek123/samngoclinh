"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useTranslation } from "@/providers/i18n-provider"

import type { LocaleType } from "@/types"

import { fetchApi } from "@/lib/api"
import { ensureLocalizedPathname } from "@/lib/i18n"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DetailsSkeleton } from "@/components/ui/loading-skeletons"

interface CustomerDetail {
  id: string
  name: string | null
  username: string
  email: string
  phoneNumber: string | null
  status: string
  role: string
  isVerified: boolean
  createdAt: string
}

function CustomerDetailsContent() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useParams()
  const locale = params.lang as LocaleType
  const searchParams = useSearchParams()
  const userId = searchParams.get("id")

  const [user, setUser] = useState<CustomerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const loadUserDetails = useCallback(async () => {
    if (!userId) {
      setErrorMsg(t("users.details.userIdNotFound"))
      setLoading(false)
      return
    }

    try {
      const res = await fetchApi(`/admin/user/get/${userId}`)
      const payload = await res.json()
      if (res.status >= 400) {
        setErrorMsg(payload?.message || t("users.details.loadError"))
      } else {
        setUser(payload.data)
      }
    } catch (e) {
      console.error(e)
      setErrorMsg(t("messages.networkError"))
    } finally {
      setLoading(false)
    }
  }, [userId, t])

  useEffect(() => {
    loadUserDetails()
  }, [userId, loadUserDetails])

  const handleUpdateStatus = async (status: "active" | "blocked") => {
    if (!userId) return
    setUpdating(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetchApi(`/admin/user/update/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })

      const payload = await res.json()
      if (res.status >= 400) {
        setErrorMsg(
          payload?.message || t("users.details.updateError")
        )
      } else {
        setSuccessMsg(
          t("users.details.updateStatusSuccess", { status })
        )
        await loadUserDetails()
      }
    } catch (e) {
      console.error(e)
      setErrorMsg(t("messages.networkError"))
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <DetailsSkeleton />
  }

  if (errorMsg && !user) {
    return (
      <Alert variant="destructive" className="max-w-xl mx-auto">
        <AlertTitle>{t("common.error")}</AlertTitle>
        <AlertDescription>{errorMsg}</AlertDescription>
      </Alert>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("users.details.notFound")}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {t("users.details.title")}
            </h1>
            <Badge
              variant={
                user.status === "ACTIVE" || user.status === "active"
                  ? "default"
                  : "destructive"
              }
            >
              {user.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {t("users.details.idLabel")}{" "}
            <span className="font-mono text-sm">{user.id}</span>
          </p>
        </div>
        <div>
          <Button
            variant="outline"
            onClick={() =>
              router.push(ensureLocalizedPathname("/pages/users", locale))
            }
          >
            {t("common.back")}
          </Button>
        </div>
      </div>

      {successMsg && (
        <Alert className="border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <AlertTitle>{t("common.success")}</AlertTitle>
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="destructive">
          <AlertTitle>{t("common.error")}</AlertTitle>
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("users.details.profileInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 border-b pb-3">
              <div>
                <span className="text-sm text-muted-foreground block">
                  {t("users.details.displayName")}
                </span>
                <span className="font-semibold text-lg">
                  {user.name || t("users.details.notSet")}
                </span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">
                  {t("users.details.username")}
                </span>
                <span className="font-semibold text-lg">{user.username}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b pb-3">
              <div>
                <span className="text-sm text-muted-foreground block">
                  {t("users.details.email")}
                </span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">
                  {t("users.details.phoneNumber")}
                </span>
                <span className="font-medium">
                  {user.phoneNumber || t("users.details.notSet")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground block">
                  {t("users.details.role")}
                </span>
                <Badge
                  variant="outline"
                  className="capitalize text-sm font-semibold"
                >
                  {typeof user.role === "object" && user.role
                    ? (user.role as { name?: string; code?: string }).name || (user.role as { name?: string; code?: string }).code || "USER"
                    : String(user.role || "USER")}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">
                  {t("users.details.registeredAt")}
                </span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("users.details.actions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.status === "ACTIVE" || user.status === "active" ? (
                <Button
                  disabled={updating}
                  onClick={() => handleUpdateStatus("blocked")}
                  variant="destructive"
                  className="w-full font-semibold"
                >
                  {t("users.details.lockAccount")}
                </Button>
              ) : (
                <Button
                  disabled={updating}
                  onClick={() => handleUpdateStatus("active")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  {t("users.details.unlockAccount")}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function CustomerDetailsPage() {
  return (
    <div className="container p-4 md:p-6 mx-auto">
      <Suspense fallback={<DetailsSkeleton />}>
        <CustomerDetailsContent />
      </Suspense>
    </div>
  )
}
