import { ROUTES } from '@/constants/routes'

export const TEST_CONSTANTS = {
  PATHS: {
    HOME: '/',
    RECENT: '/recent',
    ANALYTICS: '/analytics',
    ADMIN_SETTINGS: '/admin/settings',
    ADMIN_MANAGE_LINKS: '/admin/manage/links',
    ADMIN_DASHBOARD: '/admin'
  },
  HEADINGS: {
    HOME: 'Home',
    RECENT: 'Recent Activity',
    ANALYTICS: 'Analytics Dashboard',
    SETTINGS: 'Settings',
    MANAGE_LINKS: 'Manage Links',
    DASHBOARD: 'Dashboard'
  },
  TABLE_COLUMNS: {
    LINKS: ['Name', 'Brand Color', 'Category', 'Tags', 'Actions'],
    RECENT: ['Name', 'Category', 'Added']
  },
  STATS_CARDS: {
    TOTAL_LINKS: 'Total Links',
    TOTAL_CATEGORIES: 'Total Categories',
    TOTAL_TAGS: 'Total Tags'
  }
} as const
