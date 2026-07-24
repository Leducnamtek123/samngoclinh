import type { Metadata } from "next"
import { fetchApi } from "@/lib/api"
import { pricingData } from "./_data/pricing"
import { Pricing } from "./_components/pricing"
import type { PricingPlansType } from "@/components/pricing-plans"

export const metadata: Metadata = {
  title: "Service Package Pricing | Admin",
  description: "Manage Ginseng farm care and protection service packages",
}

export default async function PricingPage() {
  let plans: PricingPlansType[] = pricingData

  try {
    const [careRes, protRes] = await Promise.all([
      fetchApi("/admin/packages/care").catch(() => null),
      fetchApi("/admin/packages/protection").catch(() => null),
    ])

    const fetchedPlans: PricingPlansType[] = []

    if (careRes && careRes.ok) {
      const carePayload = await careRes.json()
      const careItems = carePayload?.data?.items || carePayload?.data || []
      if (Array.isArray(careItems) && careItems.length > 0) {
        careItems.slice(0, 2).forEach((pkg: any, idx: number) => {
          fetchedPlans.push({
            title: pkg.name || `Care Package ${idx + 1}`,
            description: pkg.description || "Periodic Ginseng farm care package",
            price: pkg.price || (idx === 0 ? 1500000 : 3500000),
            period: "month",
            features: pkg.features || [
              "Automated irrigation & nutrients",
              "Soil & weather monitoring",
              "Weekly photo cultivation log",
            ],
            isFeatured: idx === 1,
            href: "/pages/packages",
            buttonContent: "Manage Package",
          })
        })
      }
    }

    if (protRes && protRes.ok) {
      const protPayload = await protRes.json()
      const protItems = protPayload?.data?.items || protPayload?.data || []
      if (Array.isArray(protItems) && protItems.length > 0) {
        const pkg = protItems[0]
        fetchedPlans.push({
          title: pkg.name || "Comprehensive Protection Package",
          description: pkg.description || "Risk insurance & 24/7 monitoring",
          price: pkg.price || 5000000,
          period: "year",
          features: pkg.features || [
            "Natural disaster & disease risk insurance",
            "24/7 AI Camera live monitoring",
            "On-site agricultural specialist support",
          ],
          isFeatured: false,
          href: "/pages/packages",
          buttonContent: "Manage Package",
        })
      }
    }

    if (fetchedPlans.length > 0) {
      plans = fetchedPlans
    }
  } catch (err) {
    console.error("Error fetching pricing packages in admin pricing page:", err)
  }

  return (
    <section className="container grid gap-8 p-4">
      <div className="mx-auto text-center space-y-1.5">
        <h2 className="text-3xl font-bold text-emerald-950 dark:text-emerald-50">Ginseng Service Package Pricing</h2>
        <p className="max-w-prose text-sm text-muted-foreground">
          Manage system-wide Ginseng care, protection, and cultivation packages.
        </p>
      </div>
      <Pricing data={plans} />
    </section>
  )
}
