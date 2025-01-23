import { useState } from 'react'

import Link from 'next/link'

import { Eye, EyeOff, MoreVertical } from 'lucide-react'

import { getIconComponent } from '@/utils/icon-mapping'

import appConfig from '@/config/app.config'
import { useCategories } from '@/features/category/hooks/use-categories'
import { useUserSettingsStore } from '@/features/user/stores/useUserSettingsStore'

import { Button } from '@links-base/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@links-base/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarSeparator
} from '@links-base/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@links-base/ui/tooltip'

export function NavCategories({
  showCategory
}: { showCategory: (categoryName: string) => void }) {
  const { categories, isLoading, error } = useCategories()
  const { hiddenCategories, newLinksInHiddenCategories, toggleHiddenCategory } =
    useUserSettingsStore()
  const [showHidden, setShowHidden] = useState(false)

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Categories</SidebarGroupLabel>
        <SidebarMenu>
          {Array.from({ length: 5 }).map((_, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuSkeleton showIcon />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  if (!categories || error) {
    return null
  }

  const categoriesWithLinks = categories.filter(cat => (cat.linkCount || 0) > 0)

  const visibleCategories = categoriesWithLinks.filter(
    cat => !hiddenCategories.includes(cat.name)
  )

  const hiddenCategoriesWithLinks = categoriesWithLinks.filter(cat =>
    hiddenCategories.includes(cat.name)
  )

  if (
    visibleCategories.length === 0 &&
    hiddenCategoriesWithLinks.length === 0
  ) {
    return null
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
        <div className="flex items-center justify-between">
          <span>Categories</span>
          {hiddenCategoriesWithLinks.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHidden(!showHidden)}
              className="h-6 px-2 text-xs"
              data-show-hidden
            >
              {showHidden ? 'Hide' : 'Show Hidden'}
              {Object.values(newLinksInHiddenCategories).some(
                count => count > 0
              ) && (
                <span className="ml-2 rounded bg-secondary px-1 text-xs text-secondary-foreground">
                  New
                </span>
              )}
            </Button>
          )}
        </div>
      </SidebarGroupLabel>

      <SidebarMenu>
        {visibleCategories.map(item => {
          const Icon = getIconComponent(item.icon || 'Folder')

          return (
            <SidebarMenuItem
              key={item.name}
              className="group flex items-center justify-between"
            >
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      className="flex-1 data-[collapsible=icon]:justify-center"
                    >
                      <Link
                        href={`${appConfig.url}/category/${encodeURIComponent(item.name.toLowerCase().replace(/\s+/g, '-'))}`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.name}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="group-data-[collapsible=default]:hidden"
                  >
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="relative flex items-center group-data-[collapsible=icon]:hidden">
                <SidebarMenuBadge className="transition-opacity group-hover:opacity-0">
                  {item.linkCount || 0}
                </SidebarMenuBadge>
                <div className="absolute right-0 opacity-0 transition-opacity group-hover:opacity-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => toggleHiddenCategory(item.name)}
                      >
                        <EyeOff className="mr-2 h-4 w-4" />
                        Hide Category
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </SidebarMenuItem>
          )
        })}

        {showHidden && hiddenCategoriesWithLinks.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroupLabel className="pl-2 text-xs">
              Hidden Categories
            </SidebarGroupLabel>
            {hiddenCategoriesWithLinks.map(item => {
              const Icon = getIconComponent(item.icon || 'Folder')
              return (
                <SidebarMenuItem
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="peer/menu-button flex h-8 w-full flex-1 items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-secondary/50 px-2 py-0.5 text-xs text-muted-foreground">
                      {newLinksInHiddenCategories[item.name] > 0
                        ? `+${newLinksInHiddenCategories[item.name]}`
                        : item.linkCount || 0}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => showCategory(item.name)}
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Show Category</span>
                    </Button>
                  </div>
                </SidebarMenuItem>
              )
            })}
          </>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
