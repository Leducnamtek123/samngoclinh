"use client"

import React from "react"

import type { CarePackage, ProtectionPackage } from "@/types"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CarePackagesList, ProtectionPackagesList } from "./packages-list"

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

const formatVND = (price: number) => {
  return vndFormatter.format(price)
}

interface PackagesTabsProps {
  activeTab: "care" | "protection"
  setActiveTab: (tab: "care" | "protection") => void
  setErrorMsg: (msg: string) => void
  setSuccessMsg: (msg: string) => void
  carePackages: CarePackage[]
  protectionPackages: ProtectionPackage[]
  handleOpenEdit: (pkg: CarePackage | ProtectionPackage) => void
  handleDelete: (id: string, name: string) => void
  handleOpenCreate: () => void
}

export function PackagesTabs({
  activeTab,
  setActiveTab,
  setErrorMsg,
  setSuccessMsg,
  carePackages,
  protectionPackages,
  handleOpenEdit,
  handleDelete,
  handleOpenCreate,
}: PackagesTabsProps) {
  return (
    <Tabs
      defaultValue="care"
      value={activeTab}
      onValueChange={(val) => {
        setActiveTab(val as "care" | "protection")
        setErrorMsg("")
        setSuccessMsg("")
      }}
      className="w-full"
    >
      <TabsList className="grid w-full sm:w-[400px] grid-cols-2 mb-4">
        <TabsTrigger value="care">Gói Chăm Sóc</TabsTrigger>
        <TabsTrigger value="protection">Gói Bảo Vệ</TabsTrigger>
      </TabsList>

      <TabsContent value="care">
        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle>Gói Chăm Sóc Định Kỳ</CardTitle>
            <CardDescription>
              Cung cấp phân bón, tưới nước và chăm sóc sâm theo định kỳ tháng.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CarePackagesList
              packages={carePackages}
              onEdit={handleOpenEdit}
              onDelete={(id) => {
                const pkg = carePackages.find((p) => p.id === id)
                handleDelete(id, pkg?.name || "Gói chăm sóc")
              }}
              onOpenCreate={handleOpenCreate}
              formatVND={formatVND}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="protection">
        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle>Gói Bảo Vệ & Bảo Hiểm Cây</CardTitle>
            <CardDescription>
              Bảo vệ cây giống trước dịch bệnh, rủi ro thiên tai và bồi thường.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProtectionPackagesList
              packages={protectionPackages}
              onEdit={handleOpenEdit}
              onDelete={(id) => {
                const pkg = protectionPackages.find((p) => p.id === id)
                handleDelete(id, pkg?.name || "Gói bảo hiểm")
              }}
              onOpenCreate={handleOpenCreate}
              formatVND={formatVND}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
