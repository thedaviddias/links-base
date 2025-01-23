import { Card, CardContent, CardHeader, CardTitle } from '@links-base/ui/card'

interface OverviewCardsProps {
  totalClicks: number
  mostClickedLink: { clicks: number; linkId: string } | null
  uniqueLinksCount: number
}

export const OverviewCards = ({
  totalClicks,
  mostClickedLink,
  uniqueLinksCount
}: OverviewCardsProps) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <CardHeader>
        <CardTitle>Total Clicks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalClicks}</div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Most Clicked Link</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{mostClickedLink?.clicks || 0}</div>
        <p className="text-sm text-muted-foreground">
          {mostClickedLink?.linkId || 'No clicks yet'}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Unique Links Clicked</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{uniqueLinksCount}</div>
      </CardContent>
    </Card>
  </div>
)
