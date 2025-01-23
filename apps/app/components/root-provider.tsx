'use client'

import { ThemeProvider } from 'next-themes'
import { usePathname } from 'next/navigation'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { useSidebarState } from '@/hooks/use-sidebar-state'

import { queryClient } from '@/lib/query-client'

import { ROUTES } from '@/constants/routes'
import { FavouritesProvider } from '@/features/favourite/context/FavouritesContext'
import { EnvironmentsProvider } from '@/features/links/context/environements/EnvironmentsContext'
import { CommandWrapper } from '@/features/search/components/CommandWrapper'
import { SearchProvider } from '@/features/search/context/SearchContext'

import { SidebarProvider } from '@links-base/ui/sidebar'
import { Toaster } from '@links-base/ui/toaster'

type RootProviderProps = {
  children: React.ReactNode
}

/**
 * Root provider for the app.
 * @param children - The children to render.
 * @returns The root provider.
 */
export const RootProvider = ({ children }: RootProviderProps) => {
  const { open, setOpen } = useSidebarState()
  const pathname = usePathname()

  if (open === null) {
    return null // Wait for the initial value to be loaded from localStorage
  }

  const isSetupRoute = pathname?.startsWith(ROUTES.SETUP.path)

  const content = (
    <SearchProvider>
      <EnvironmentsProvider>
        <FavouritesProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </FavouritesProvider>
      </EnvironmentsProvider>
    </SearchProvider>
  )

  if (isSetupRoute) {
    return (
      <>
        {content}
        <Toaster />
      </>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider open={open} onOpenChange={setOpen}>
        {content}
        <CommandWrapper />
        <Toaster />
      </SidebarProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
