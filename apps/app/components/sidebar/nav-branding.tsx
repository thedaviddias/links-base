import { lazy } from 'react'

import Link from 'next/link'

import { BookMarked } from 'lucide-react'

import appConfig from '@/config/app.config'
import { IS_NOT_PRODUCTION, IS_PRODUCTION } from '@/constants'

import { useSidebar } from '@links-base/ui/sidebar'

import { ADMIN_ENVIRONMENTS } from '../layout/navigation'

const AppSwitcher = lazy(() =>
  import('@/components/layout/app-switcher').then(mod => ({
    default: mod.AppSwitcher
  }))
)

export function NavBranding() {
  const { state } = useSidebar()

  return (
    <div className="px-1 py-1">
      <div className="flex items-center gap-2">
        <div className="flex aspect-square size-6 items-center justify-center rounded-lg text-secondary-foreground">
          <Link href={appConfig.url}>
            <BookMarked className="size-4" />
          </Link>
        </div>
        {state !== 'collapsed' && (
          <>
            {IS_NOT_PRODUCTION && (
              <div className="min-w-0 flex-1">
                <AppSwitcher environments={ADMIN_ENVIRONMENTS} />
              </div>
            )}
            {IS_PRODUCTION && (
              <Link href={appConfig.url} className="text-sm font-semibold">
                {appConfig.name}
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  )
}
