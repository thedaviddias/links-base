import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis
} from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@links-base/ui/card'
import { ChartTooltip } from '@links-base/ui/chart'

interface TimeAnalysisProps {
  hourlyData: Record<string, number>
  dailyData: Record<string, number>
}

export const TimeAnalysis = ({ hourlyData, dailyData }: TimeAnalysisProps) => (
  <div className="grid gap-6 md:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle>Peak Usage Hours</CardTitle>
        <CardDescription>
          Displays click activity across different hours of the day. Helps
          identify when your links are most frequently accessed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          data={Object.entries(hourlyData)
            .sort(([hourA], [hourB]) => hourA.localeCompare(hourB))
            .map(([hour, count]) => ({
              hour,
              clicks: count
            }))}
          width={800}
          height={400}
          margin={{ top: 20, right: 40, left: 60, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="hour"
            interval={1}
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            allowDecimals={false}
            label={{
              value: 'Number of Clicks',
              angle: -90,
              position: 'insideLeft',
              dy: 50
            }}
          />
          <Bar dataKey="clicks" fill="#8884d8" name="Clicks" />
          <ChartTooltip
            formatter={(value: number) => [
              `${value} click${value === 1 ? '' : 's'}`,
              'Clicks'
            ]}
            cursor={{ fill: 'transparent' }}
          />
        </BarChart>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Daily Activity</CardTitle>
        <CardDescription>
          Shows the trend of clicks over time. Useful for identifying patterns
          in link usage and tracking growth.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart
          data={Object.entries(dailyData)
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .map(([date, count]) => ({
              date: new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              }),
              clicks: count
            }))}
          width={800}
          height={400}
          margin={{ top: 20, right: 40, left: 60, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            allowDecimals={false}
            label={{
              value: 'Number of Clicks',
              angle: -90,
              position: 'insideLeft',
              dy: 50
            }}
          />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="#8884d8"
            name="Clicks"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <ChartTooltip
            formatter={(value: number) => [
              `${value} click${value === 1 ? '' : 's'}`,
              'Clicks'
            ]}
            cursor={{ stroke: '#666', strokeWidth: 1 }}
          />
        </LineChart>
      </CardContent>
    </Card>
  </div>
)
