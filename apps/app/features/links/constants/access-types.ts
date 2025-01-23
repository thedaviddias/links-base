export const ACCESS_TYPES = [
  { id: 'public', label: 'Public Access' },
  { id: 'okta', label: 'Okta SSO' },
  { id: 'ldap', label: 'LDAP Authentication' },
  { id: 'google', label: 'Google Authentication' },
  { id: 'basic', label: 'Basic Auth' },
  { id: 'custom', label: 'Custom Authentication' }
] as const

export type AccessType = (typeof ACCESS_TYPES)[number]['id']
