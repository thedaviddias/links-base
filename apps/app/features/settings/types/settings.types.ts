import { type InferSettingsSchema } from '../schemas/settings.schema'

export interface EmailSettings {
  enabled: boolean
  /** Email address where link requests will be sent */
  address: string
  /** Base subject line for the email */
  subject: string
}

export interface GithubSettings {
  enabled: boolean
  /** GitHub repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
  /** Issue template with placeholders for link details */
  template: string
  /** Labels to be applied to the created issue */
  labels: string[]
}

export type Settings = InferSettingsSchema
