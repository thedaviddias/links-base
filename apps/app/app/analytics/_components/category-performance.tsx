import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@links-base/ui/card'
import { ChartTooltip } from '@links-base/ui/chart'

interface CategoryPerformanceProps {
  averageClicksPerCategory: Array<{ category: string; average: number }>
}

export const CategoryPerformance = ({
  averageClicksPerCategory
}: CategoryPerformanceProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Category Performance</CardTitle>
      <CardDescription>
        Compares average clicks across different categories. Helps identify
        which types of links are most engaging and which categories might need
        more attention.
      </CardDescription>
    </CardHeader>
    <CardContent>
      {averageClicksPerCategory.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center text-muted-foreground">
          No category data available
        </div>
      ) : (
        <BarChart
          data={averageClicksPerCategory}
          width={800}
          height={400}
          margin={{ top: 20, right: 30, left: 120, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="category"
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
            tick={{
              fontSize: 12,
              dy: 25
            }}
          />
          <YAxis
            label={{
              value: 'Average Clicks',
              angle: -90,
              position: 'insideLeft',
              dy: 50
            }}
          />
          <Bar dataKey="average" fill="#8884d8" name="Average Clicks" />
          <ChartTooltip
            formatter={(value: number) => [
              `${value.toFixed(1)} clicks`,
              'Average'
            ]}
            cursor={{ fill: 'transparent' }}
          />
        </BarChart>
      )}
    </CardContent>
  </Card>
)
