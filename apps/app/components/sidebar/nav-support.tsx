import { ExternalLink, GitPullRequest, Heart, HelpCircle } from 'lucide-react'

import { SUPPORT_LINKS } from '@/constants'
import { useSettings } from '@/features/settings/hooks/use-settings'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@links-base/ui/sidebar'

export function NavSupport() {
  const { settings } = useSettings()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Support</SidebarGroupLabel>
      <SidebarMenu>
        {settings?.help?.links?.enabled && (
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a
                href={SUPPORT_LINKS.HELP}
                target="_blank"
                rel="noopener noreferrer"
                title="Help (external)"
              >
                <HelpCircle className="size-4" />
                <span className="flex items-center gap-1">
                  Help <ExternalLink className="size-3" />
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        {settings?.help?.featureRequests?.enabled && (
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a
                href={SUPPORT_LINKS.FEATURE_REQUESTS}
                target="_blank"
                rel="noopener noreferrer"
                title="Request a feature (external)"
              >
                <GitPullRequest className="size-4" />
                <span className="flex items-center gap-1">
                  Request a feature <ExternalLink className="size-3" />
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <a
              href={SUPPORT_LINKS.SPONSOR}
              target="_blank"
              rel="noopener noreferrer"
              title="Support this project (external)"
            >
              <Heart className="size-4" />
              <span className="flex items-center gap-1">
                Support Project <ExternalLink className="size-3" />
              </span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
