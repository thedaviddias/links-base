import { type LinksApp } from '@/features/links/types/link.types'

export const mockLinkData: Record<string, LinksApp> = {
  basic: {
    name: 'Test App',
    description: 'Test Description',
    category: 'Category 1',
    color: '#000000',
    environments: {
      production: 'https://test.com'
    },
    tags: ['test-tag'],
    createdAt: '2024-03-20',
    timestamp: '2024-03-20'
  },
  withMultipleEnvironments: {
    name: 'Multi Env App',
    description: 'App with multiple environments',
    category: 'Category 2',
    color: '#000000',
    environments: {
      production: 'https://prod.test.com',
      staging: 'https://staging.test.com',
      integration: 'https://dev.test.com'
    },
    tags: ['test-tag'],
    createdAt: '2024-03-20',
    timestamp: '2024-03-20'
  }
} as const
