import { ExternalLink, Globe, Info, Server } from 'lucide-react'

import { ImageError } from '@/utils/image-error'

import { AccessTypeIcon } from '@/features/links/components/access-type-icon'
import { type AccessType } from '@/features/links/constants/access-types'
import { type LinksApp } from '@/features/links/types/link.types'

import { Badge } from '@links-base/ui/badge'
import { Button } from '@links-base/ui/button'
import { Separator } from '@links-base/ui/separator'

type LinkDetailsProps = {
  link: LinksApp
  variant: 'preview' | 'modal'
}

type EnvironmentUrlProps = {
  label: string
  url?: string
  variant: 'preview' | 'modal'
}

/**
 * Displays a single environment URL with proper formatting
 */
const EnvironmentUrl = ({ label, url, variant }: EnvironmentUrlProps) => {
  if (!url) return null

  if (variant === 'preview') {
    return (
      <div className="flex flex-col">
        <span className="text-xs font-medium capitalize text-muted-foreground">
          {label}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          {url}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border bg-muted/50 p-1">
      <div className="flex min-w-[120px] items-center gap-2">
        <Badge variant="outline" className="capitalize">
          {label}
        </Badge>
      </div>
      <div className="flex flex-1 items-center gap-2">
        <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate text-sm text-muted-foreground">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            {url}
          </a>
        </span>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="sr-only">Open {label}</span>
        </a>
      </Button>
    </div>
  )
}

/**
 * Shared component for displaying link details in both preview and modal views
 */
export const LinkDetails = ({ link, variant }: LinkDetailsProps) => {
  const hasInstructions = Boolean(link.instructions)
  const { environments } = link

  const validEnvironments = environments
    ? Object.entries(environments).filter(
        ([_, url]) => url && url.trim() !== ''
      )
    : []

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-2">
          <div className="h-6 w-6 shrink-0 rounded-full border border-border">
            <ImageError app={link} />
          </div>
          <div className="min-w-0">
            <h3
              className={
                variant === 'modal' ? 'text-xl font-semibold' : 'font-semibold'
              }
            >
              {link.name}
            </h3>
            <p className="break-words text-sm text-muted-foreground">
              {link.description}
            </p>
          </div>
        </div>
        <div
          className="h-6 w-6 shrink-0 rounded-full border border-border"
          style={{ backgroundColor: link.color }}
        />
      </div>

      {/* Environments */}
      {variant === 'preview' ? (
        <div className="flex flex-col gap-2 rounded-md bg-muted/30 p-2">
          <EnvironmentUrl
            variant={variant}
            label="production"
            url={environments.production}
          />
          {(environments.staging || environments.integration) && (
            <Separator className="my-1" />
          )}
          <EnvironmentUrl
            variant={variant}
            label="staging"
            url={environments.staging}
          />
          <EnvironmentUrl
            variant={variant}
            label="integration"
            url={environments.integration}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-medium">
            <Server className="h-4 w-4" />
            Available Environments
          </h3>
          <div className="grid gap-2">
            {validEnvironments.map(([env, url]) => (
              <EnvironmentUrl
                key={env}
                variant={variant}
                label={env}
                url={url}
              />
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {hasInstructions && (
        <div className="space-y-2 text-sm">
          <span className="flex items-center gap-2 font-medium">
            <Info className="h-4 w-4" />
            Instructions
          </span>
          <p
            className={`text-muted-foreground ${variant === 'preview' ? 'line-clamp-2' : 'whitespace-pre-wrap'}`}
          >
            {link.instructions}
          </p>
        </div>
      )}

      {/* Access Type */}
      {link.accessType && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Access:</span>
          <AccessTypeIcon
            type={link.accessType as AccessType}
            size={16}
            className="text-muted-foreground"
          />
          <span className="text-sm text-muted-foreground">
            {link.accessType.charAt(0).toUpperCase() + link.accessType.slice(1)}
          </span>
        </div>
      )}

      {/* Category */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Category:</span>
        <span className="text-sm text-muted-foreground">{link.category}</span>
      </div>

      {/* Tags */}
      {link.tags && link.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {link.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="border border-muted bg-background/80 text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
