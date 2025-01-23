'use client'

import { RefreshCw, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

type ResetOptionsProps = {
  onResetWarnings: () => void
  onResetDefaults: () => void
}

export const ResetOptions = ({
  onResetWarnings,
  onResetDefaults
}: ResetOptionsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex cursor-pointer items-center gap-2 text-sm hover:text-primary"
        onClick={() => {
          onResetWarnings()
          toast.success('All warning dialogs have been reset')
        }}
      >
        <RotateCcw className="h-4 w-4" />
        Reset Warning Dialogs
      </div>

      <div
        className="flex cursor-pointer items-center gap-2 text-sm hover:text-primary"
        onClick={() => {
          onResetDefaults()
          toast.success('Display preferences restored to defaults')
        }}
      >
        <RefreshCw className="h-4 w-4" />
        Reset to Default Settings
      </div>
    </div>
  )
}
