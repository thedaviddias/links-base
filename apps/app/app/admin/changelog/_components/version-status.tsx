import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react'

import { Badge } from '@links-base/ui/badge'
import { Card } from '@links-base/ui/card'

interface VersionStatusProps {
  currentVersion: string
  latestVersion: string
}

export function VersionStatus({
  currentVersion,
  latestVersion
}: VersionStatusProps) {
  const isLatest = currentVersion === latestVersion

  return (
    <Card className="p-6">
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
        </div>
      </div>
    </Card>
  )
}
