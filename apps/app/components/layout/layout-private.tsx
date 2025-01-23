'use client'

import { AdminSidebar } from '@/app/admin/_components/sidebar'
import appConfig from '@/config/app.config'

import { Banner } from '@links-base/ui/banner'
import { SidebarInset, SidebarTrigger } from '@links-base/ui/sidebar'

import { NavbarPrivate } from './navbar-private'

type LayoutPrivateProps = {
  children: React.ReactNode
}

export const LayoutPrivate = ({ children }: LayoutPrivateProps) => {
  return (
    <>
      <AdminSidebar />
      <SidebarInset>
        {appConfig.bannerText && <Banner text={appConfig.bannerText} />}
        <header className="sticky top-0 z-50 flex h-14 w-full shrink-0 items-center gap-2 border-b border-sidebar-border bg-white px-6 backdrop-blur-sm dark:bg-[hsl(220,13%,6.5%)]">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
          </div>
          <NavbarPrivate />
        </header>
        <main className="flex min-h-screen flex-col">
          <div className="p-6 md:p-10">{children}</div>
        </main>
      </SidebarInset>
    </>
  )
}
