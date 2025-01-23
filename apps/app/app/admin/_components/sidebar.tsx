'use client'

import * as React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import packageJson from '@/package.json'

import {
  ADMIN_NAVIGATION,
  ADMIN_NAVIGATION_SUPPORT,
  type AdminNavItem
} from '@/components/layout/navigation'
import { NavBranding } from '@/components/sidebar/nav-branding'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@links-base/ui/sidebar'

function NavMain({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
        Main
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.url}
              className="flex-1"
            >
              <a href={item.url}>
                <item.icon className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">
                  {item.title}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export const AdminSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar className="border-r-0" collapsible="icon" {...props}>
      <SidebarHeader>
        <NavBranding />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={ADMIN_NAVIGATION.navMain} />
        <NavSupport />
      </SidebarContent>
      <SidebarRail />
      <div className="mt-auto p-4 text-center text-xs text-muted-foreground">
        v{packageJson.version}
      </div>
    </Sidebar>
  )
}

function NavSupport() {
  return (
    <SidebarGroup className="mt-auto border-t pt-4 group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Support</SidebarGroupLabel>
      <SidebarMenu>
        {ADMIN_NAVIGATION_SUPPORT.map(item => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link href={item.url} title={item.title}>
                <item.icon className="size-4" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
