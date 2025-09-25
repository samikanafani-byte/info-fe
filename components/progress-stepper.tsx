import { cn } from "@/lib/utils"

interface ProgressStepperProps {
  steps: string[]
  currentStep: number
  stepIndices: { [key: string]: number }
}

export default function ProgressStepper({ steps, currentStep, stepIndices }: ProgressStepperProps) {
  const getStepLabel = (stepName: string) => {
    if (stepName.toLowerCase() === "benchmarking") {
      if (currentStep === stepIndices.benchmarking) {
        return "Benchmark\n(1/2: Titles)"
      }
      if (currentStep > stepIndices.benchmarking) {
        return "Benchmark\n(2/2: Profiles)"
      }
    }
    return stepName
  }

  const isStepActive = (stepName: string) => {
    const key = stepName.toLowerCase()
    if (key === "sourcing") {
      return currentStep >= stepIndices.sourcing && currentStep < stepIndices.review
    }
    return currentStep >= stepIndices[key]
  }

  const isStepCurrent = (stepName: string) => {
    const key = stepName.toLowerCase()
    if (key === "sourcing") {
      return currentStep >= stepIndices.sourcing && currentStep < stepIndices.review
    }
    if (key === "review") {
      return currentStep === stepIndices.review
    }
    return currentStep === stepIndices[key]
  }

  return (
    <div className="mt-3">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const isActive = isStepActive(step)
          const isCurrent = isStepCurrent(step)

          return (
            <div key={step} className="flex items-center w-full">
              <div className="flex flex-col items-center w-full">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors flex-shrink-0",
                    isActive ? "bg-primary text-text-on-primary" : "bg-custom-border text-text-secondary",
                  )}
                >
                  {index + 1}
                </div>
                <p
                  className={cn(
                    "text-xs mt-1 text-center whitespace-pre-line leading-tight transition-colors",
                    isCurrent ? "font-bold text-text-primary" : "text-text-secondary",
                  )}
                >
                  {getStepLabel(step)}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-auto border-t-2 mx-2 mt-4 transition-colors",
                    isActive ? "border-primary" : "border-custom-border",
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
