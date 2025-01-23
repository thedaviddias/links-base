/**
 * Constants for localStorage keys used across the application
 */
export const STORAGE_KEYS = {
  // User Settings
  USER_SETTINGS: 'user-settings',
  SIDEBAR_STATE: 'sidebar-state', // Sidebar State
  LAST_CATEGORY_CHECK: 'last-category-check',
  THEME: 'theme', // Theme
  SHOW_ARCHIVED: 'show-archived', // Show Archived
  // Links Related
  LINK_CLICKS: 'link-clicks-storage',

  // Analytics
  // VISIT_COUNT: 'visitCount',
  // LAST_VISITED: 'lastVisited',
  LAST_RECENT_LINKS_VISIT: 'last-recent-links-visit',

  // Misc
  HAS_SEEN_IMPORT_MODAL: 'has-seen-import-modal',
  HAS_SEEN_HIDDEN_CATEGORIES_ALERT: 'has-seen-hidden-categories-alert',
  HAS_SEEN_ENVIRONMENT_WARNING: 'has-seen-environment-warning'
} as const

/**
 * Configuration key mappings for import/export functionality
 */
export const CONFIG_KEYS = {
  preferences: [
    STORAGE_KEYS.USER_SETTINGS,
    STORAGE_KEYS.SIDEBAR_STATE,
    STORAGE_KEYS.LAST_CATEGORY_CHECK,
    STORAGE_KEYS.HAS_SEEN_IMPORT_MODAL,
    STORAGE_KEYS.HAS_SEEN_HIDDEN_CATEGORIES_ALERT,
    STORAGE_KEYS.HAS_SEEN_ENVIRONMENT_WARNING,
    STORAGE_KEYS.THEME
  ],
  links: [STORAGE_KEYS.LAST_RECENT_LINKS_VISIT],
  analytics: [
    // STORAGE_KEYS.VISIT_COUNT,
    // STORAGE_KEYS.LAST_VISITED,
    STORAGE_KEYS.LINK_CLICKS
  ]
} as const
