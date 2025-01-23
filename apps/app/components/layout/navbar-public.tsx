'use client'

import { ThemeSwitcher } from '@/components/layout/theme-switcher'

import { SearchBar } from '@/features/search/components/search-bar'
import { DisplayPreferences } from '@/features/user/components/display-preferences/display-preferences'

export const NavbarPublic = () => {
  return (
    <div className="ml-auto">
      <nav>
        <div className="mx-auto flex max-w-7xl items-center justify-between py-3 pl-4">
          <div className="flex items-center gap-4">
            <div className="ml-auto flex gap-2">
              <SearchBar />
              <DisplayPreferences />
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
