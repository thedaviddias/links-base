import { Loader2 } from 'lucide-react'

import { Button } from '@links-base/ui/button'

interface StepNavigationProps {
  currentStep: number
  onBack: () => void
  onNext: () => void
  onComplete: () => void
  isSkipping: boolean
  showBackButton: boolean
  isLastStep: boolean
}

export const StepNavigation = ({
  currentStep,
  onBack,
  onNext,
  onComplete,
  isSkipping,
  showBackButton,
  isLastStep
}: StepNavigationProps) => {
  // Don't render navigation buttons on the welcome step (step 0)
  if (currentStep === 0) {
    return null
  }

  const NextButton = () => (
    <Button type="button" onClick={onNext} disabled={isSkipping}>
      Next
    </Button>
  )

  const CompleteSetupButton = () => (
    <Button type="submit" onClick={onComplete} disabled={isSkipping}>
      Complete Setup
    </Button>
  )

  return (
    <div className="flex justify-between">
      {showBackButton && (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSkipping}
        >
          Back
        </Button>
      )}
      {isSkipping ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Setting up...
        </>
      ) : isLastStep ? (
        <CompleteSetupButton />
      ) : (
        <NextButton />
      )}
    </div>
  )
}
