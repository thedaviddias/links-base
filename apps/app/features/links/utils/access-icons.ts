import { type AccessType } from '../constants/access-types'

const ACCESS_TYPE_URLS = {
  public: 'https://www.google.com',
  okta: 'https://www.okta.com',
  ldap: 'https://www.openldap.org',
  google: 'https://accounts.google.com',
  basic: 'https://www.w3.org',
  custom: 'https://www.oauth.net'
} as const

export const getAccessTypeIconUrl = (accessType: AccessType): string => {
  const baseUrl = ACCESS_TYPE_URLS[accessType]
  return `https://www.google.com/s2/favicons?sz=32&domain_url=${encodeURIComponent(baseUrl)}`
}
