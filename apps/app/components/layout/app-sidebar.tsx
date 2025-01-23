'use client'

import * as React from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import packageJson from '@/package.json'

import { MAIN_NAVIGATION } from '@/components/layout/navigation'

import { useCategoryNotifications } from '@/features/category/hooks/use-category-notifications'
import { RequestLinkButton } from '@/features/request-link/components/request-link-button'
import { useUserSettingsStore } from '@/features/user/stores/useUserSettingsStore'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar
} from '@links-base/ui/sidebar'

import { NavBranding } from '../sidebar/nav-branding'
import { NavCategories } from '../sidebar/nav-categories'
import { NavMain } from '../sidebar/nav-main'
import { NavSupport } from '../sidebar/nav-support'

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  useCategoryNotifications()

  const { hiddenCategories, setHiddenCategories } = useUserSettingsStore()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const { state } = useSidebar()

  /** Show a previously hidden category */
  const showCategory = (categoryName: string) => {
    const newHiddenCategories = hiddenCategories.filter(
      cat => cat !== categoryName
    )
    setHiddenCategories(newHiddenCategories)

    const params = new URLSearchParams(searchParams.toString())
    const urlHidden = params.get('hidden')?.split(',').filter(Boolean) || []
    const newUrlHidden = urlHidden.filter(cat => cat !== categoryName)

    if (newUrlHidden.length) {
      params.set('hidden', newUrlHidden.join(','))
    } else {
      params.delete('hidden')
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Sidebar className="border-r-0" collapsible="icon" {...props}>
      <SidebarHeader>
        <NavBranding />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={MAIN_NAVIGATION} />
        <NavCategories showCategory={showCategory} />
        <NavSupport />
        <RequestLinkButton />
      </SidebarContent>
      <SidebarRail />
      {state !== 'collapsed' && (
        <div className="mt-auto p-4 text-center text-xs text-muted-foreground">
          v{packageJson.version}
        </div>
      )}
    </Sidebar>
  )
}
