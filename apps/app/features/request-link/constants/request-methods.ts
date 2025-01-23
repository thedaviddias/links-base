import { type Settings } from '@/features/settings/types/settings.types'

export type GetAvailableRequestMethods = (settings: Settings) => (
  | false
  | {
      value: string
      label: string
    }
)[]

/** Get available request methods based on settings configuration */
export const getAvailableRequestMethods: GetAvailableRequestMethods =
  settings =>
    [
      settings.requests.github.enabled && {
        value: 'github',
        label: 'GitHub Issue'
      },
      settings.requests.email.enabled && { value: 'email', label: 'Email' }
    ].filter(Boolean)
