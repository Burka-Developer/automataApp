"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface StepNavigatorProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
}

export function StepNavigator({ currentStep, totalSteps, onPrevious, onNext }: StepNavigatorProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <Button variant="outline" onClick={onPrevious} disabled={currentStep === 0}>
        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
      </Button>

      <div className="text-sm text-muted-foreground">
        Step {currentStep + 1} of {totalSteps}
      </div>

      <Button variant="outline" onClick={onNext} disabled={currentStep === totalSteps - 1}>
        Next <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
