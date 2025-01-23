'use client'

import * as React from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { ChevronsUpDown } from 'lucide-react'

import appConfig from '@/config/app.config'

import { Button } from '@links-base/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@links-base/ui/dropdown-menu'
import { cn } from '@links-base/ui/utils'

import { type AdminEnvironment } from './navigation'

export interface AppSwitcherProps {
  environments: AdminEnvironment[]
}

export function AppSwitcher({ environments }: AppSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()

  const isAdminContext = pathname?.startsWith('/admin')

  const currentApp = React.useMemo(() => {
    if (!pathname || !environments?.length) return null

    // Find the matching environment
    const matchingApp =
      environments.find(app =>
        pathname.startsWith(app.path === appConfig.url ? '/' : `${app.path}`)
      ) || environments[0]

    return {
      ...matchingApp,
      name: isAdminContext ? `${environments[1].name}` : matchingApp.name
    }
  }, [pathname, environments, isAdminContext])

  if (!currentApp || !environments?.length) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between border-none bg-background/50 hover:bg-accent"
        >
          <span className="truncate">{currentApp.name}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {environments.map(app => {
          const displayName =
            pathname?.startsWith(app.path) && isAdminContext
              ? `${app.name}`
              : app.name

          const isActive =
            app.path === appConfig.url
              ? !pathname.startsWith('/admin')
              : pathname.startsWith('/admin')

          return (
            <DropdownMenuItem
              key={app.path}
              onClick={() => router.push(app.path)}
              className={cn(
                'flex items-center gap-2',
                isActive && 'bg-accent font-medium text-accent-foreground'
              )}
            >
              {displayName}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
