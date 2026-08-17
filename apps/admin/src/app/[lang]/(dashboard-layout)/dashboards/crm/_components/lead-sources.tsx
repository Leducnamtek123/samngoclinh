import type { BackofficeOverview } from "@/types"

import { Card } from "@/components/ui/card"
import { LeadSourcesChart } from "./lead-sources-chart"

interface LeadSourcesProps {
  overview?: BackofficeOverview | null
  contactsCount?: number
}

export function LeadSources({ overview, contactsCount = 0 }: LeadSourcesProps) {
  const users = overview?.totalUsers || 0
  const inquiries = contactsCount || 0
  const contracts = overview?.totalContracts || 0

  const leads = {
    socialMedia: Math.round(inquiries * 0.3),
    emailCampaigns: Math.round(inquiries * 0.2),
    referrals: Math.round(users * 0.4),
    website: inquiries + Math.round(users * 0.6),
    other: contracts,
  }

  const summary = {
    totalLeads: users + inquiries + contracts,
  }

  return (
    <Card className="h-56 p-6">
      <LeadSourcesChart
        data={{
          leads,
          summary,
        }}
      />
    </Card>
  )
}
