import { Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Step = {
  step: number;
  label: string;
  icon: LucideIcon;
};

type CartStepProgressProps = {
  currentStep: number;
  stepsList: Step[];
};

export const CartStepProgress = ({ currentStep, stepsList }: CartStepProgressProps) => (
  <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm">
    <div className="relative mx-auto flex max-w-2xl items-center justify-between px-2 sm:px-6">
      {/* Background Line */}
      <div className="absolute top-5 right-6 left-6 z-0 h-1 -translate-y-1/2 rounded-full bg-gray-100" />
      {/* Active Progress Fill Line */}
      <div
        className="absolute top-5 left-6 z-0 h-1 -translate-y-1/2 rounded-full bg-emerald-600 transition-[width] duration-500"
        style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
      />

      {stepsList.map(({ step, label, icon: Icon }) => {
        const isCompleted = currentStep > step;
        const isActive = currentStep === step;

        return (
          <div key={step} className="group relative z-10 flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors duration-300 ${
                isCompleted
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : isActive
                    ? 'border-emerald-800 bg-emerald-800 text-white shadow-lg ring-4 ring-emerald-800/10'
                    : 'border-gray-200 bg-white text-gray-400'
              }`}
            >
              {isCompleted ? (
                <Check className="h-5 w-5 stroke-[3]" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
            </div>
            <span
              className={`mt-2.5 text-[11px] font-bold tracking-wider uppercase transition-colors ${
                isActive
                  ? 'font-extrabold text-emerald-800'
                  : isCompleted
                    ? 'font-bold text-emerald-600'
                    : 'text-gray-400'
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);
