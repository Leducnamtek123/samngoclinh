"use client"

import React from "react"
import { Check } from "lucide-react"

export interface WizardStep {
  id: number
  title: string
  desc: string
  icon?: React.ComponentType<{ className?: string }> | null
}

interface CreateContractStepperProps {
  steps: WizardStep[]
  currentStep: number
  onStepClick: (stepId: number) => void
}

export function CreateContractStepper({
  steps,
  currentStep,
  onStepClick,
}: CreateContractStepperProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {steps.map((s) => {
        const isActive = s.id === currentStep
        const isCompleted = s.id < currentStep

        return (
          <button
            key={s.id}
            type="button"
            onClick={() => s.id < currentStep && onStepClick(s.id)}
            disabled={s.id > currentStep}
            className={`text-left p-3.5 rounded-xl border transition-colors ${
              isActive
                ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/20"
                : isCompleted
                  ? "bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:border-slate-300"
                  : "bg-white border-slate-200/60 opacity-60 dark:bg-slate-950 dark:border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3 inline" />
                ) : (
                  `0${s.id}`
                )}
              </span>
              {isCompleted && (
                <span className="text-[10px] text-emerald-600 font-semibold uppercase">
                  Hoàn tất
                </span>
              )}
            </div>
            <p
              className={`mt-2 font-bold text-sm leading-tight ${isActive ? "text-primary" : "text-slate-800 dark:text-slate-200"}`}
            >
              {s.title}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {s.desc}
            </p>
          </button>
        )
      })}
    </div>
  )
}
