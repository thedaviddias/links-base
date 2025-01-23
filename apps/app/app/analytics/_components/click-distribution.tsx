import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@links-base/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@links-base/ui/chart'

interface ClickDistributionProps {
  chartData: Array<{ linkId: string; clicks: number; icon: string }>
  chartConfig: any
}

// Fix the custom label component
const CustomBarLabel = (props: any) => {
  const { x, y, width, payload } = props
  if (!payload?.icon) {
    return null
  }

  return (
    <g>
      <image
        x={x + width + 10}
        y={y - 12}
        width="24"
        height="24"
        xlinkHref={payload.icon}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  )
}

export const ClickDistribution = ({
  chartData,
  chartConfig
}: ClickDistributionProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Click Distribution</CardTitle>
      <CardDescription>
        Shows the number of clicks per link, ordered by most clicked. This helps
        identify your most frequently accessed links.
      </CardDescription>
    </CardHeader>
    <CardContent>
      {chartData.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center">
          <p className="text-muted-foreground">No click data available yet</p>
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            data={chartData}
            accessibilityLayer
            layout="vertical"
            margin={{ top: 5, right: 80, bottom: 5, left: 100 }}
            barSize={20}
            barGap={2}
            height={chartData.length * 40}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(value: number) => Math.floor(value).toString()}
              domain={[0, 'auto']}
              allowDecimals={false}
              interval={0}
            />
            <YAxis
              type="category"
              dataKey="linkId"
              tickLine={false}
              axisLine={false}
              width={80}
              interval={0}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: 'transparent' }}
            />
            <Bar
              dataKey="clicks"
              fill="var(--color-clicks)"
              radius={[0, 4, 4, 0]}
              label={props => <CustomBarLabel {...props} />}
            />
          </BarChart>
        </ChartContainer>
      )}
    </CardContent>
  </Card>
)
