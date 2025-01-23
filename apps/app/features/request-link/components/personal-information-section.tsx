import { type UseFormReturn } from 'react-hook-form'

import {
  RequesterEmailField,
  RequesterNameField
} from '@/components/forms/fields/request-fields'

import { type InferRequestLinkFormSchema } from '@/features/request-link/schemas/request-link.schema'

interface PersonalInformationSectionProps {
  form: UseFormReturn<InferRequestLinkFormSchema>
}

export const PersonalInformationSection = ({
  form
}: PersonalInformationSectionProps) => {
  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold">Personal Information</legend>
      <RequesterNameField form={form} />
      <RequesterEmailField form={form} />
    </fieldset>
  )
}
