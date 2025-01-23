'use client'

import appConfig from '@/config/app.config'

import { Banner } from '@links-base/ui/banner'
import { SidebarInset } from '@links-base/ui/sidebar'

import { AppSidebar } from './app-sidebar'
import { Header } from './header'

type LayoutPublicProps = {
  children: React.ReactNode
}

export const LayoutPublic = ({ children }: LayoutPublicProps) => {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        {appConfig.bannerText && <Banner text={appConfig.bannerText} />}
        <Header />
        <main className="flex min-h-screen flex-col">
          <div className="p-6 md:p-10">{children}</div>
        </main>
      </SidebarInset>
    </>
  )
}
