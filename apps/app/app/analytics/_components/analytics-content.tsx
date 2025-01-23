'use client'

import { useMemo } from 'react'

import { BarChart3 } from 'lucide-react'

import { LayoutPublic } from '@/components/layout/layout-public'
import { PageHeader } from '@/components/layout/page-header'

import { useCategories } from '@/features/category/hooks/use-categories'
import { useLinks } from '@/features/links/hooks/links/use-links'
import { useLinkClickStore } from '@/features/links/stores/use-link-click-store'
import { getFaviconUrl } from '@/features/links/utils/favicon'

import { type ChartConfig } from '@links-base/ui/chart'

import { CategoryPerformance } from './category-performance'
import { ClickDistribution } from './click-distribution'
import { OverviewCards } from './overview-cards'
import { TimeAnalysis } from './time-analysis'

// Define chart configuration
const chartConfig = {
  clicks: {
    label: 'Clicks',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig

// Add this helper function at the top level
const generateHourLabels = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    clicks: 0
  }))
}

export const AnalyticsContent = () => {
  const { clickCounts } = useLinkClickStore()
  const { links } = useLinks()
  const { categories } = useCategories()

  const chartData = Object.entries(clickCounts)
    .map(([linkId, data]) => {
      if (!data) return null

      let domain
      try {
        const url = new URL(data.url)
        domain = url.hostname
      } catch {
        domain = data.url.replace(/^https?:\/\//, '').split('/')[0]
      }

      return {
        linkId: linkId.slice(0, 25) + (linkId.length > 25 ? '...' : ''),
        clicks: data.count,
        icon: getFaviconUrl(domain)
      }
    })
    .filter(
      (item): item is { linkId: string; clicks: number; icon: string } =>
        item !== null
    )
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 10)

  const totalClicks = Object.values(clickCounts).reduce(
    (sum, data) => sum + (data?.count || 0),
    0
  )
  const mostClickedLink = chartData[0]

  // Calculate time-based metrics
  const timeMetrics = useMemo(() => {
    const now = new Date()
    const clicks = Object.values(clickCounts)
    const hourlyData = generateHourLabels().reduce(
      (acc, { hour }) => {
        acc[hour] = 0
        return acc
      },
      {} as Record<string, number>
    )
    const dailyData: Record<string, number> = {}
    let totalDuration = 0
    let clickCount = 0

    clicks.forEach(data => {
      if (!data?.lastClicked) return
      const clickDate = new Date(data.lastClicked)

      // Hourly distribution
      const hour = `${clickDate.getHours().toString().padStart(2, '0')}:00`
      hourlyData[hour] = (hourlyData[hour] || 0) + (data.count || 0)

      // Daily distribution
      const day = clickDate.toISOString().split('T')[0]
      dailyData[day] = (dailyData[day] || 0) + (data.count || 0)

      // Time between clicks
      if (data.count > 1) {
        totalDuration += now.getTime() - clickDate.getTime()
        clickCount += data.count
      }
    })

    return {
      hourlyData,
      dailyData,
      averageTimeBetweenClicks: clickCount ? totalDuration / clickCount : 0
    }
  }, [clickCounts])

  // Calculate category metrics
  const categoryMetrics = useMemo(() => {
    const categoryClicks: Record<string, number> = {}
    const categoryLinks: Record<string, number> = {}
    const validCategories = new Set((categories ?? []).map(cat => cat.name))

    links?.forEach(link => {
      // Only process links with valid categories
      if (!link.category || !validCategories.has(link.category)) return

      const category = link.category
      categoryLinks[category] = (categoryLinks[category] || 0) + 1

      const clicks = clickCounts[link.name]?.count || 0
      categoryClicks[category] = (categoryClicks[category] || 0) + clicks
    })

    return {
      categoryClicks,
      categoryLinks,
      averageClicksPerCategory: Object.entries(categoryClicks)
        .filter(([category]) => validCategories.has(category))
        .map(([category, clicks]) => ({
          category,
          average: clicks / (categoryLinks[category] || 1)
        }))
        .sort((a, b) => b.average - a.average)
    }
  }, [links, clickCounts, categories])

  return (
    <LayoutPublic>
      <div className="mb-10 flex items-center justify-between">
        <PageHeader
          pageData={{
            pageTitle: 'Analytics Dashboard',
            description: 'Track and analyze your bookmark usage',
            icon: BarChart3
          }}
        />
      </div>

      <div className="space-y-8">
        <OverviewCards
          totalClicks={totalClicks}
          mostClickedLink={mostClickedLink}
          uniqueLinksCount={Object.keys(clickCounts).length}
        />

        <ClickDistribution chartData={chartData} chartConfig={chartConfig} />

        <TimeAnalysis
          hourlyData={timeMetrics.hourlyData}
          dailyData={timeMetrics.dailyData}
        />

        <CategoryPerformance
          averageClicksPerCategory={categoryMetrics.averageClicksPerCategory}
        />
      </div>
    </LayoutPublic>
  )
}
