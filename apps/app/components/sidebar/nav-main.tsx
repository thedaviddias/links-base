import { useEffect, useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Settings } from 'lucide-react'

import appConfig from '@/config/app.config'
import { BADGE_STYLE } from '@/constants'
import { ROUTES } from '@/constants/routes'
import { STORAGE_KEYS } from '@/constants/storage'
import { useLinks } from '@/features/links/hooks/links/use-links'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem
} from '@links-base/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@links-base/ui/tooltip'

import {
  ADDITIONAL_NAV_ITEMS,
  type MAIN_NAVIGATION
} from '../layout/navigation'

export function NavMain({ items }: { items: typeof MAIN_NAVIGATION }) {
  const pathname = usePathname()
  const { links } = useLinks()
  const [showNewBadge, setShowNewBadge] = useState(false)

  useEffect(() => {
    const lastVisit = localStorage.getItem(STORAGE_KEYS.LAST_RECENT_LINKS_VISIT)

    if (!links?.length) return

    const mostRecentLink = [...links].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0]

    if (!mostRecentLink) return

    const mostRecentTimestamp = new Date(mostRecentLink.timestamp).getTime()
    setShowNewBadge(!lastVisit || mostRecentTimestamp > parseInt(lastVisit))
  }, [links])

  useEffect(() => {
    if (pathname === ROUTES.RECENT.path) {
      localStorage.setItem(
        STORAGE_KEYS.LAST_RECENT_LINKS_VISIT,
        Date.now().toString()
      )
      setShowNewBadge(false)
    }
  }, [pathname])

  const isLinkActive = (url: string) => {
    // Normalize paths for comparison
    const normalizedUrl = url === appConfig.url ? '/' : url
    const normalizedPathname = pathname || '/'

    // For home page, only match exact path
    if (normalizedUrl === '/') {
      return normalizedPathname === '/'
    }

    // For other pages, match the exact path
    return normalizedPathname === normalizedUrl
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
        Main
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => (
          <SidebarMenuItem key={item.title}>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    isActive={isLinkActive(item.url)}
                    className="flex-1"
                  >
                    <Link href={item.url} className="flex items-center">
                      <div className="flex h-4 w-4 items-center justify-center">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="group-data-[collapsible=default]:hidden"
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
        ))}
        {ADDITIONAL_NAV_ITEMS.map(item => (
          <SidebarMenuItem key={item.title}>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    isActive={isLinkActive(item.url)}
                    className="flex-1"
                  >
                    <Link href={item.url} className="flex items-center">
                      <div className="flex h-4 w-4 items-center justify-center">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                      {item.url === ROUTES.RECENT.path && showNewBadge && (
                        <SidebarMenuBadge
                          className={`${BADGE_STYLE} group-data-[collapsible=icon]:hidden`}
                        >
                          New
                        </SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="group-data-[collapsible=default]:hidden"
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/settings" title="Settings">
              <Settings className="size-4" />
              <span>Settings</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
