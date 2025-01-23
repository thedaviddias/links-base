'use client'

import { CategoryField } from '@/components/forms/fields/category-field'
import { DescriptionField } from '@/components/forms/fields/description-field'
import { NameField } from '@/components/forms/fields/name-field'
import {
  RequestMethodField,
  SuggestedCategoryField
} from '@/components/forms/fields/request-fields'
import { UrlField } from '@/components/forms/fields/url-field'

import { getAvailableRequestMethods } from '@/features/request-link/constants/request-methods'
import { useRequestLinkForm } from '@/features/request-link/hooks/use-request-link-form'
import { useSettings } from '@/features/settings/hooks/use-settings'

import { Button } from '@links-base/ui/button'
import { Form } from '@links-base/ui/form'

import { PersonalInformationSection } from './personal-information-section'

export const RequestLinkForm = () => {
  const { settings } = useSettings()
  const { form, isSubmitting, onSubmit } = useRequestLinkForm(settings)

  if (!settings) {
    return <p>Loading settings...</p>
  }

  if (!settings.requests.email.enabled && !settings.requests.github.enabled) {
    return <p>Link requests are currently disabled.</p>
  }

  const selectedMethod = form.watch('method')
  const selectedCategory = form.watch('category')
  const availableMethods = getAvailableRequestMethods(settings)

  if (availableMethods.length === 0) {
    return <p>No request methods are currently enabled.</p>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <RequestMethodField form={form} availableMethods={availableMethods} />

        {selectedMethod === 'email' && (
          <PersonalInformationSection form={form} />
        )}

        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">Link Information</legend>
          <NameField form={form} />
          <UrlField
            form={form}
            initialValues={{}}
            settings={settings}
            showIcon={false}
            mode="request"
          />
          <CategoryField form={form} mode="request" />
          {selectedCategory === 'other' && (
            <SuggestedCategoryField form={form} />
          )}
          <DescriptionField form={form} />
        </fieldset>

        <div className="mt-6 flex justify-end">
          <Button type="submit" className="relative">
            {isSubmitting ? (
              <>
                <span className="opacity-0">Suggest this link</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  Submitting...
                </span>
              </>
            ) : (
              'Suggest this link'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
