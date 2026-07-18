import { SiGithub } from "react-icons/si"

import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function ReadyToBuildCTA() {
  return (
    <section id="ready-to-build" className="container">
      <Card className="flex flex-col justify-center items-center gap-3 text-center px-6 py-12">
        <div className="space-y-1.5">
          <h2 className="text-4xl font-semibold">
            Ready to build your next project faster?
          </h2>
          <p className="max-w-prose mx-auto text-sm text-muted-foreground">
            Get started with our administration dashboard panel.
          </p>
        </div>
        <a
          href="/dashboards/analytics"
          className={buttonVariants({ size: "lg" })}
        >
          Get Started
        </a>
      </Card>
    </section>
  )
}
