import { Check, type LucideIcon } from 'lucide-react';

type Step = {
  step: number;
  label: string;
  icon: LucideIcon;
};

type CartStepProgressProps = {
  currentStep: number;
  stepsList: Step[];
};

export const CartStepProgress = ({ currentStep, stepsList }: CartStepProgressProps) => {
  return (
    <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between max-w-2xl mx-auto relative px-2 sm:px-6">
        {/* Background Line */}
        <div className="absolute left-6 right-6 top-5 -translate-y-1/2 h-1 bg-gray-100 z-0 rounded-full"></div>
        {/* Active Progress Fill Line */}
        <div 
          className="absolute left-6 top-5 -translate-y-1/2 h-1 bg-emerald-600 z-0 rounded-full transition-[width] duration-500"
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        ></div>

        {stepsList.map(({ step, label, icon: Icon }) => {
          const isCompleted = currentStep > step;
          const isActive = currentStep === step;

          return (
            <div key={step} className="flex flex-col items-center relative z-10 group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 font-bold text-xs ${
                  isCompleted
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : isActive
                    ? 'bg-emerald-800 border-emerald-800 text-white shadow-lg ring-4 ring-emerald-800/10'
                    : 'bg-white border-gray-200 text-gray-400'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={`text-[11px] font-bold mt-2.5 uppercase tracking-wider transition-colors ${
                  isActive ? 'text-emerald-800 font-extrabold' : isCompleted ? 'text-emerald-600 font-bold' : 'text-gray-400'
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
};
