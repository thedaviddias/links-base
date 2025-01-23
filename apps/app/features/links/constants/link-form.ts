import { type LinksApp } from '@/features/links/types/link.types'

export const DEFAULT_LINK_VALUES: Partial<LinksApp> = {
  name: '',
  description: '',
  environments: {
    production: '',
    staging: '',
    integration: ''
  },
  category: '',
  tags: [],
  color: '',
  accessType: 'public',
  instructions: ''
}

export const getInitialValues = (initialValues?: Partial<LinksApp>) => ({
  ...DEFAULT_LINK_VALUES,
  createdAt: initialValues?.createdAt || new Date().toISOString(),
  timestamp: new Date().toISOString(),
  ...initialValues
})
