import { type InferRequestLinkFormSchema } from '@/features/request-link/schemas/request-link.schema'
import {
  type EmailSettings,
  type GithubSettings
} from '@/features/settings/types/settings.types'

import { type ToasterToast } from '@links-base/ui/hooks'

export const handleEmailSubmission = async (
  values: InferRequestLinkFormSchema,
  categoryValue: string,
  emailSettings: EmailSettings,
  toast: (props: Omit<ToasterToast, 'id'>) => void
) => {
  const { address, subject: baseSubject } = emailSettings

  if (!address || !baseSubject) {
    throw new Error('Email configuration is incomplete')
  }

  const body = `
Link Details:
Name: ${values.name}
URL: ${values.url}
Category: ${categoryValue}
${values.description ? `Description: ${values.description}` : ''}
${values.requesterName ? `\nFrom: ${values.requesterName}` : ''}${values.requesterEmail ? ` <${values.requesterEmail}>` : ''}
`
  const subject = `${baseSubject} - ${values.name}`
  const mailtoUrl = `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.trim())}`

  try {
    const mailWindow = window.open(mailtoUrl, '_blank')
    if (!mailWindow) {
      window.location.href = mailtoUrl
    }
    toast({
      title: 'Email client opened',
      description: 'Please send the email to submit your request.'
    })
  } catch (e: unknown) {
    console.error('Failed to open email client:', e)
    const errorMessage =
      e instanceof Error ? e.message : 'Unknown error occurred'
    throw new Error(`Failed to open email client: ${errorMessage}`)
  }
}

export const handleGithubSubmission = async (
  values: InferRequestLinkFormSchema,
  categoryValue: string,
  githubSettings: GithubSettings,
  toast: (props: Omit<ToasterToast, 'id'>) => void
) => {
  const { owner, repo, template, labels } = githubSettings
  const body = template
    .replace('%name%', values.name)
    .replace('%url%', values.url)
    .replace('%category%', categoryValue)
    .replace('%description%', values.description || '')

  const url = `https://github.com/${owner}/${repo}/issues/new?body=${encodeURIComponent(body)}&labels=${encodeURIComponent(labels.join(','))}`
  window.open(url, '_blank')
  toast({
    title: 'GitHub issue form opened',
    description: 'Please complete the submission on GitHub.'
  })
}
