import { type FC } from 'react'

import { ArrowRight, CheckCircle2, ExternalLink, XCircle } from 'lucide-react'

import appConfig from '@/config/app.config'

import { Badge } from '@links-base/ui/badge'
import { Button } from '@links-base/ui/button'
import { Card } from '@links-base/ui/card'
import { Separator } from '@links-base/ui/separator'

interface Release {
  tag_name: string
  name: string
  published_at: string
  body: string
  html_url: string
}

interface VersionComparisonProps {
  currentVersion: string
  releases: Release[]
}

export const VersionComparison: FC<VersionComparisonProps> = ({
  currentVersion,
  releases
}) => {
  const latestVersion = releases[0]?.tag_name
  const isLatest = currentVersion === latestVersion
  const newReleases = releases.filter(
    release => release.tag_name > currentVersion
  )

  const githubReleasesUrl = `https://github.com/${appConfig.githubRepo}/releases`

  return (
    <Card className="p-6">
      {/* Version Status Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Version Status</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-base">
              {currentVersion}
            </Badge>
            {!isLatest && (
              <>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className="text-base">
                  {latestVersion}
                </Badge>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isLatest ? (
            <Badge className="bg-green-500/15 text-green-500 hover:bg-green-500/20">
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Up to date
            </Badge>
          ) : (
            <Badge
              variant="destructive"
              className="bg-destructive/15 hover:bg-destructive/20"
            >
              <XCircle className="mr-1 h-4 w-4" />
              Update available
            </Badge>
          )}
          <Button variant="outline" size="sm" asChild>
            <a
              href={githubReleasesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              View releases
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* New Releases Section */}
      {!isLatest && newReleases.length > 0 && (
        <>
          <Separator className="my-6" />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What&apos;s New</h3>
            <div className="space-y-4">
              {newReleases.map(release => (
                <Card key={release.tag_name} className="bg-muted/50 p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{release.name}</h4>
                      <time className="text-sm text-muted-foreground">
                        {new Date(release.published_at).toLocaleDateString(
                          undefined,
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }
                        )}
                      </time>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={release.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        Details
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                  <div className="prose dark:prose-invert max-w-none text-sm">
                    <p>{release.body}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </Card>
  )
}
