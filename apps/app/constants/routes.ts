import {
  BarChart3,
  FolderTree,
  History,
  LinkIcon,
  type LucideIcon,
  Settings,
  Tag
} from 'lucide-react'
import { z } from 'zod'

import appConfig from '@/config/app.config'

// Base segments
const API = '/api'
const ADMIN = '/admin'

// Define a type for route segments
type RouteSegment = {
  path: string
  params?: z.ZodType<any>
}

// Route segments
export const ROUTES = {
  HOME: { path: `${appConfig.url}` },
  ANALYTICS: { path: `${appConfig.url}/analytics` },
  RECENT: { path: `${appConfig.url}/recent` },
  SETUP: { path: '/setup' },
  API: {
    TAGS: { path: `${API}/tags`, params: z.string().min(1) },
    CATEGORIES: { path: `${API}/categories`, params: z.string().min(1) },
    LINKS: { path: `${API}/links`, params: z.string().min(1) },
    SETTINGS: { path: `${API}/settings` }
  },
  ADMIN: {
    DASHBOARD: { path: `${ADMIN}` },
    MANAGE: {
      TAGS: { path: `${ADMIN}/manage/tags` },
      CATEGORIES: { path: `${ADMIN}/manage/categories` },
      LINKS: { path: `${ADMIN}/manage/links` }
    },
    SETTINGS: { path: `${ADMIN}/settings` }
  },
  DATA: {
    CATEGORIES: { path: `${appConfig.url}/data/categories.json` },
    TAGS: { path: `${appConfig.url}/data/tags.json` },
    LINKS: { path: `${appConfig.url}/data/links.json` },
    SETTINGS: { path: `${appConfig.url}/data/settings.json` }
  }
} as const

// Generic function for generating API routes
function getApiRoute<T extends RouteSegment>(
  routeSegment: T,
  param?: string
): string {
  if (param && routeSegment.params) {
    const validatedParam = routeSegment.params.parse(param)

    return `${routeSegment.path}/${validatedParam.toLowerCase()}`
  }
  return routeSegment.path
}

export const getCategoriesPath = () => ROUTES.DATA.CATEGORIES.path

export const getTags = () => ROUTES.DATA.TAGS.path

export const getLinksPath = () => ROUTES.DATA.LINKS.path

export const getSettingsPath = () => ROUTES.DATA.SETTINGS.path

// Typed route generation functions
export const getTagApiRoute = () => getApiRoute(ROUTES.API.TAGS)

export const getCategoryApiRoute = () => getApiRoute(ROUTES.API.CATEGORIES)

export const getLinkApiRoute = () => getApiRoute(ROUTES.API.LINKS)

export const getSettingsApiRoute = () => getApiRoute(ROUTES.API.SETTINGS)

/**
 * Get the JSON API route
 */
export const getJsonApiRoute = () => '/api/json'

export type AdminLink = {
  href: string
  title: string
  icon: LucideIcon
  isActive?: boolean
}

export const adminLinks: AdminLink[] = [
  { href: ROUTES.ADMIN.DASHBOARD.path, title: 'Dashboard', icon: BarChart3 }
]

export const adminManageLinks: AdminLink[] = [
  { href: ROUTES.ADMIN.MANAGE.LINKS.path, title: 'Links', icon: LinkIcon },
  {
    href: ROUTES.ADMIN.MANAGE.CATEGORIES.path,
    title: 'Categories',
    icon: FolderTree
  },
  { href: ROUTES.ADMIN.MANAGE.TAGS.path, title: 'Tags', icon: Tag },
  {
    title: 'Changelog',
    href: '/admin/changelog',
    icon: History,
    isActive: false
  }
]

export const adminNavSecondary: AdminLink[] = [
  { href: ROUTES.ADMIN.SETTINGS.path, title: 'Settings', icon: Settings }
]
