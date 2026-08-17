"use client"

import type { UseFormReturn } from "react-hook-form"
import type { ProfileInfoFormType } from "../../../types"
import { useTranslation } from "@/providers/i18n-provider"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputPhone } from "@/components/ui/input-phone"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const VIETNAM_PROVINCES = [
  "Kon Tum",
  "Gia Lai",
  "Quảng Nam",
  "Đắk Lắk",
  "Lâm Đồng",
  "Đà Nẵng",
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Bình Định",
  "Phú Yên",
  "Khánh Hòa",
  "Khác",
]

const COUNTRIES = [
  "Việt Nam",
  "Hoa Kỳ (US)",
  "Nhật Bản",
  "Hàn Quốc",
  "Singapore",
  "Khác",
]

const LANGUAGES = [
  "Tiếng Việt",
  "English",
]

const TIMEZONES = [
  "GMT+07:00 (Hà Nội, Băng Cốc)",
  "GMT+08:00 (Singapore, Bắc Kinh)",
  "GMT+09:00 (Tokyo, Seoul)",
  "GMT+00:00 (London, UTC)",
  "GMT-05:00 (New York, EST)",
]

const CURRENCIES = [
  "VND (₫)",
  "USD ($)",
  "EUR (€)",
]

interface ProfileFieldsSectionProps {
  form: UseFormReturn<ProfileInfoFormType>
}

export function ProfileFieldsSection({ form }: ProfileFieldsSectionProps) {
  const { t } = useTranslation()

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem className="grow">
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">{t("users.profileFields.firstName")}</FormLabel>
            <FormControl>
              <Input type="text" placeholder={t("users.profileFields.firstNamePlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem className="grow">
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">{t("users.profileFields.lastName")}</FormLabel>
            <FormControl>
              <Input type="text" placeholder={t("users.profileFields.lastNamePlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">{t("users.profileFields.username")}</FormLabel>
            <FormControl>
              <Input type="text" placeholder="admin_snl" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">{t("users.profileFields.email")}</FormLabel>
            <FormControl>
              <Input type="email" placeholder="admin@samngoclinh.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">{t("users.profileFields.phone")}</FormLabel>
            <FormControl>
              <InputPhone placeholder="0967 234 234" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">{t("users.profileFields.state")}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || "Kon Tum"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("users.profileFields.selectState")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {VIETNAM_PROVINCES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">{t("users.profileFields.country")}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || "Việt Nam"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("users.profileFields.selectCountry")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">{t("users.profileFields.address")}</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Đăk Tô, Kon Tum" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="zipCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">{t("users.profileFields.zipCode")}</FormLabel>
            <FormControl>
              <Input type="text" placeholder="600000" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="language"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">{t("users.profileFields.language")}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || "Tiếng Việt"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("users.profileFields.selectLanguage")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {LANGUAGES.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="timeZone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">{t("users.profileFields.timeZone")}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || "GMT+07:00 (Hà Nội, Băng Cốc)"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("users.profileFields.selectTimeZone")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TIMEZONES.map((timezone) => (
                  <SelectItem key={timezone} value={timezone}>
                    {timezone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="currency"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">{t("users.profileFields.currency")}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || "VND (₫)"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("users.profileFields.selectCurrency")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency} value={currency.split(" ")[0]}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="organization"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">{t("users.profileFields.organization")}</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Công ty CP Sâm Ngọc Linh Kon Tum" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
