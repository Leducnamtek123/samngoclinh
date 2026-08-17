import type { Metadata } from "next"
import type { BackofficeOverview, ContactRequest, EContract } from "@/types"

import { backofficeService } from "@/services/backoffice.service"
import { legalService } from "@/services/legal.service"

import { ActiveProjects } from "./_components/active-projects"
import { ActivityTimeline } from "./_components/activity-timeline"
import { CustomerSatisfaction } from "./_components/customer-satisfaction"
import { LeadSources } from "./_components/lead-sources"
import { Overview } from "./_components/overview"
import { RevenueTrend } from "./_components/revenue-trend"
import { SalesByCountry } from "./_components/sales-by-country"
import { SalesTrend } from "./_components/sales-trend"
import { TopSalesRepresentatives } from "./_components/top-sales-representatives"

export const metadata: Metadata = {
  title: "CRM & Quan hệ Nhà đầu tư | Sâm Ngọc Linh Admin",
  description:
    "Theo dõi hành trình khách hàng VIP, tỷ lệ chuyển đổi nhà đầu tư và chăm sóc các chủ sở hữu luống sâm.",
}

interface CRMPageProps {
  params: Promise<{
    lang: string
  }>
}

export default async function CRMPage(props: CRMPageProps) {
  await props.params
  let overview: BackofficeOverview | null = null
  let contacts: ContactRequest[] = []
  let contracts: EContract[] = []

  try {
    const [overviewRes, contactsRes, contractsRes] = await Promise.all([
      backofficeService.getOverview().catch(() => null),
      legalService.getContacts({ perPage: 10 }).catch(() => null),
      legalService.getContracts({ perPage: 10 }).catch(() => null),
    ])

    if (overviewRes?.data) {
      overview = overviewRes.data
    }
    if (contactsRes?.data && Array.isArray(contactsRes.data)) {
      contacts = contactsRes.data
    }
    if (contractsRes?.data && Array.isArray(contractsRes.data)) {
      contracts = contractsRes.data
    }
  } catch (error) {
    console.error("Error loading CRM dashboard data:", error)
  }

  return (
    <section className="container grid gap-6 p-4 md:p-6 mx-auto md:grid-cols-2">
      <div className="col-span-full flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-950 dark:text-emerald-50">
            Quản trị Khách hàng & Quan hệ Nhà đầu tư (CRM)
          </h1>
          <p className="text-muted-foreground">
            Theo dõi hành trình khách hàng VIP, tiến độ hợp đồng điện tử và nhật ký tư vấn đầu tư luống sâm.
          </p>
        </div>
      </div>
      <Overview stats={overview} />
      <div className="col-span-full grid gap-4 md:grid-cols-4">
        <SalesTrend overview={overview} />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
          <RevenueTrend overview={overview} />
          <LeadSources overview={overview} contactsCount={contacts.length} />
        </div>
      </div>
      <ActiveProjects contracts={contracts} />
      <ActivityTimeline contacts={contacts} />
      <SalesByCountry overview={overview} />
      <TopSalesRepresentatives overview={overview} />
      <CustomerSatisfaction overview={overview} />
    </section>
  )
}
