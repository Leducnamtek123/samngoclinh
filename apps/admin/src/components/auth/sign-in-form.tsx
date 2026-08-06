"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"

import type { LocaleType, SignInFormType } from "@/types"

import { SignInSchema } from "@/schemas/sign-in-schema"

import { ensureLocalizedPathname } from "@/lib/i18n"
import { ensureRedirectPathname } from "@/lib/utils"

import { toast } from "@/hooks/use-toast"
import { useTranslation } from "@/providers/i18n-provider"
import { ButtonLoading } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function SignInForm() {
  const { t } = useTranslation()
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const redirectPathname =
    searchParams.get("redirectTo") ||
    process.env.NEXT_PUBLIC_HOME_PATHNAME ||
    "/"

  useEffect(() => {
    const token = searchParams.get("token")
    const refreshToken = searchParams.get("refreshToken")
    const expiresIn = searchParams.get("expiresIn")
    if (token) {
      const autoLogin = async () => {
        try {
          const result = await signIn("credentials", {
            redirect: false,
            accessToken: token,
            refreshToken: refreshToken || "",
            expiresIn: expiresIn || "3600",
          })

          if (result && result.error) {
            throw new Error(result.error)
          }

          window.location.replace(redirectPathname)
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Auto Sign In Failed",
            description: error instanceof Error ? error.message : undefined,
          })
        }
      }
      autoLogin()
    }
  }, [searchParams, router, redirectPathname])

  const form = useForm<SignInFormType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  })

  const locale = params.lang as LocaleType
  const { isSubmitting } = form.formState
  const isDisabled = isSubmitting

  async function onSubmit(data: SignInFormType) {
    const { email, password, rememberMe } = data

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        rememberMe: rememberMe ? "true" : "false",
      })

      if (result && result.error) {
        throw new Error(result.error)
      }

      router.push(redirectPathname)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid grow gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href={ensureLocalizedPathname(
                      redirectPathname
                        ? ensureRedirectPathname(
                            "/forgot-password",
                            redirectPathname
                          )
                        : "/forgot-password",
                      locale
                    )}
                    className="ms-auto inline-block text-sm underline text-emerald-700 dark:text-emerald-400 hover:text-emerald-800"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0 py-1">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  {t("auth.rememberMe") &&
                  t("auth.rememberMe") !== "auth.rememberMe"
                    ? t("auth.rememberMe")
                    : "Ghi nhớ đăng nhập 30 ngày trên thiết bị này"}
                </FormLabel>
              </FormItem>
            )}
          />
        </div>

        <ButtonLoading
          isLoading={isSubmitting}
          disabled={isDisabled}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
        >
          {t("navigation.signIn") || "Đăng nhập"}
        </ButtonLoading>
      </form>
    </Form>
  )
}
