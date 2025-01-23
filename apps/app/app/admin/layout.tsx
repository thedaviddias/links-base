import { redirect } from 'next/navigation'

import { LayoutPrivate } from '@/components/layout/layout-private'

import appConfig from '@/config/app.config'
import { IS_PRODUCTION } from '@/constants'

export default function AdminLayout({
  children
}: { children: React.ReactNode }) {
  if (IS_PRODUCTION) {
    redirect(appConfig.url)
  }

  return <LayoutPrivate>{children}</LayoutPrivate>
}
