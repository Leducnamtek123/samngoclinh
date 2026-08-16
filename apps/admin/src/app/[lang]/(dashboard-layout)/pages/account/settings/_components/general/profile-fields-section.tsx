"use client"

import type { UseFormReturn } from "react-hook-form"
import type { ProfileInfoFormType } from "../../../types"

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
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem className="grow">
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Tên</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Nhập tên" {...field} />
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
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Họ & Tên đệm</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Nhập họ và tên đệm" {...field} />
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
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Tên tài khoản / Mã nhân viên</FormLabel>
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
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Địa chỉ Email</FormLabel>
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
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Số điện thoại liên hệ</FormLabel>
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
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Tỉnh / Thành phố công tác</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || "Kon Tum"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tỉnh thành" />
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
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Quốc gia</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || "Việt Nam"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn quốc gia" />
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
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Địa chỉ cơ sở / Vườn phụ trách</FormLabel>
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
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Mã bưu chính / Khu vực</FormLabel>
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
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Ngôn ngữ giao diện</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || "Tiếng Việt"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngôn ngữ" />
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
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Múi giờ vận hành</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || "GMT+07:00 (Hà Nội, Băng Cốc)"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn múi giờ" />
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
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Đơn vị tiền tệ mặc định</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || "VND (₫)"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn đơn vị tiền tệ" />
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
            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Tổ chức / Nông trường quản lý</FormLabel>
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
