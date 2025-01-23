import { SidebarTrigger } from '@links-base/ui/sidebar'

import { NavbarPublic } from './navbar-public'

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full shrink-0 items-center gap-2 border-b border-sidebar-border bg-white px-6 backdrop-blur-sm dark:bg-[hsl(220,13%,6.5%)]">
      <div className="flex flex-1 items-center">
        <SidebarTrigger />
      </div>
      <NavbarPublic />
    </header>
  )
}
