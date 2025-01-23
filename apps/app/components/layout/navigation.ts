import {
  BarChart3,
  BookMarked,
  Clock,
  Home,
  LayoutDashboard,
  type LucideIcon,
  Scroll,
  Settings,
  Tags,
  Users
} from 'lucide-react'

import appConfig from '@/config/app.config'
import { ROUTES } from '@/constants/routes'

export type NavItem = {
  title: string
  url: string
  icon: LucideIcon
  pageTitle: string
  description: string
}

export const ADDITIONAL_NAV_ITEMS = [
  {
    title: 'Recently Added',
    url: ROUTES.RECENT.path,
    icon: Clock,
    pageTitle: 'Recently Added Links',
    description: 'View the most recently added links in your collection'
  },
  {
    title: 'Analytics',
    url: ROUTES.ANALYTICS.path,
    icon: BarChart3,
    pageTitle: 'Analytics Dashboard',
    description: 'View insights and statistics about your links'
  }
] as const

export type AdminNavItem = {
  title: string
  url: string
  icon: LucideIcon
}

export const ADMIN_NAVIGATION: { navMain: AdminNavItem[] } = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: LayoutDashboard
    },
    {
      title: 'Manage Links',
      url: '/admin/manage/links',
      icon: BookMarked
    },
    {
      title: 'Manage Categories',
      url: '/admin/manage/categories',
      icon: Users
    },
    {
      title: 'Manage Tags',
      url: '/admin/manage/tags',
      icon: Tags
    },
    {
      title: 'Settings',
      url: '/admin/settings',
      icon: Settings
    }
  ]
} as const

export const ADMIN_NAVIGATION_SUPPORT = [
  {
    title: 'Changelog',
    url: '/admin/changelog',
    icon: Scroll
  }
] as const

export type AdminEnvironment = {
  name: string
  path: string
}

export const ADMIN_ENVIRONMENTS: AdminEnvironment[] = [
  {
    name: appConfig.name,
    path: `${appConfig.url}`
  },
  {
    name: 'Admin Panel',
    path: `${appConfig.url}/admin`
  }
]

export const MAIN_NAVIGATION = [
  {
    title: 'Home',
    url: `${appConfig.url}`,
    icon: Home,
    isActive: true
  }
] as const
