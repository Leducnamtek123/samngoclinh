import type { Metadata } from "next"

import { FeedbackClientShowcase } from "./_components/feedback-client-showcase"

export const metadata: Metadata = {
  title: "Feedback Components",
}

export default function FeedbackShowcasePage() {
  return (
    <section className="container grid gap-6 p-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-primary">UI Feedback & States</h1>
        <p className="text-sm text-muted-foreground">
          Thư viện các linh kiện phản hồi trạng thái từ Stitch design system (Toast, Alerts, Skeletons, States).
        </p>
      </div>
      <FeedbackClientShowcase />
    </section>
  )
}
