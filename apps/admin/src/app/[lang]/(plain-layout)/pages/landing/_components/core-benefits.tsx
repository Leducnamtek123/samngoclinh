import { CoreBenefitsList } from "./core-benefits-list"

export function CoreBenefits() {
  return (
    <section id="benefits" className="container grid gap-8">
      <div className="text-center mx-auto space-y-1.5">
        <h2 className="text-4xl font-semibold">Core Benefits</h2>
        <p className="max-w-prose text-sm text-muted-foreground">
          Sâm Ngọc Linh Admin delivers real-world benefits from day one—fast
          setup, flexible theming, and production-ready features that scale with
          your team.
        </p>
      </div>
      <CoreBenefitsList />
    </section>
  )
}
