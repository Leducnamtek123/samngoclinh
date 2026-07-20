"use client"

import { useState, useEffect } from "react"
import { ToastCard } from "@/components/ui/feedback-components"

interface AnalyticsToastErrorProps {
  errorMsg: string
}

export function AnalyticsToastError({ errorMsg }: AnalyticsToastErrorProps) {
  const [localError, setLocalError] = useState(errorMsg || "")

  useEffect(() => {
    if (errorMsg) {
      setLocalError(errorMsg)
    }
  }, [errorMsg])

  if (!localError) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-auto">
      <ToastCard
        type="error"
        title="Lỗi xảy ra"
        description={`${localError} (Hiển thị dữ liệu tạm thời)`}
        onClose={() => setLocalError("")}
      />
    </div>
  )
}
