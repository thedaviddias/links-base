import { RequestsSettings } from '@/app/admin/settings/_components/requests-settings'

import { type StepProps } from '../../types/types'

export const RequestSettingsStep = ({ form }: StepProps) => {
  return (
    <div className="space-y-6">
      <RequestsSettings form={form} />
    </div>
  )
}
