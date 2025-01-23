import { type UseFormReturn } from 'react-hook-form'

import { GeneralSettings } from '@/app/admin/settings/_components/general-settings'
import { type Settings } from '@/features/settings/types/settings.types'

interface BasicSettingsStepProps {
  form: UseFormReturn<Settings>
}

export const BasicSettingsStep = ({ form }: BasicSettingsStepProps) => {
  return (
    <div className="space-y-6">
      <GeneralSettings form={form} hideBannerField />
    </div>
  )
}
