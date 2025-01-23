import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { noop } from '@/utils/noop'

import {
  type InferRequestLinkFormSchema,
  RequestLinkFormSchema
} from '@/features/request-link/schemas/request-link.schema'
import {
  handleEmailSubmission,
  handleGithubSubmission
} from '@/features/request-link/utils/request-link-handlers'
import { type Settings } from '@/features/settings/types/settings.types'

import { useToast } from '@links-base/ui/hooks'

export const useRequestLinkForm = (settings: Settings | undefined) => {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<InferRequestLinkFormSchema>({
    resolver: zodResolver(RequestLinkFormSchema),
    defaultValues: {
      method: 'github',
      category: 'none',
      name: '',
      url: '',
      description: '',
      requesterName: '',
      requesterEmail: '',
      suggestedCategory: ''
    },
    mode: 'onChange'
  })

  const onSubmit = async (values: InferRequestLinkFormSchema) => {
    setIsSubmitting(true)
    try {
      const categoryValue =
        values.category === 'other'
          ? `New category suggestion: ${values.suggestedCategory}`
          : values.category === 'none'
            ? 'No category selected'
            : values.category

      if (values.method === 'email' && settings?.requests.email.enabled) {
        if (!settings.requests.email.address) {
          throw new Error('Email address is not configured')
        }
        await handleEmailSubmission(
          values,
          categoryValue,
          {
            ...settings.requests.email,
            address: settings.requests.email.address,
            subject: settings.requests.email.subject ?? 'New Link Request'
          },
          toast
        )
      } else if (
        values.method === 'github' &&
        settings?.requests.github.enabled
      ) {
        if (!settings.requests.github.owner || !settings.requests.github.repo) {
          throw new Error('GitHub owner and repo must be configured')
        }
        await handleGithubSubmission(
          values,
          categoryValue,
          {
            ...settings.requests.github,
            owner: settings.requests.github.owner,
            repo: settings.requests.github.repo,
            template: settings.requests.github.template ?? 'link-request.md',
            labels: settings.requests.github.labels ?? []
          },
          toast
        )
      }
    } catch (error) {
      console.error('Error in form submission:', error)
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to process your request. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    isSubmitting,
    onSubmit: settings ? onSubmit : noop
  }
}
