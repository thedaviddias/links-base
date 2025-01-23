'use client'

import * as React from 'react'

import {
  format,
  formatDistanceToNow,
  isAfter,
  parseISO,
  subDays
} from 'date-fns'
import { BarChart3, Folder, Link, Plus, Users } from 'lucide-react'

import { LoadingSpinner } from '@/components/skeletons/loading-spinner'

import { useCategories } from '@/features/category/hooks/use-categories'
import { useLinks } from '@/features/links/hooks/links/use-links'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@links-base/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@links-base/ui/table'

import { MiniLink } from './_components/links/mini-link'

export default function Dashboard() {
  const { links, isLoading: isLoadingLinks, error } = useLinks()
  const { categories } = useCategories()

  const categoryStats = Array.isArray(categories)
    ? categories.map(category => ({
        name: category.name,
        count: links.filter(link => link.category.includes(category.name))
          .length
      }))
    : []

  const mostPopularCategory =
    categoryStats.length > 0
      ? categoryStats.reduce((prev, current) =>
          prev.count > current.count ? prev : current
        )
      : { name: 'No category', count: 0 }

  const recentLinks = [...links]
    .sort((a, b) => {
      const dateA = parseISO(a.timestamp)
      const dateB = parseISO(b.timestamp)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 7)

  const recentLinksCount = links.filter(link => {
    const addedDate = parseISO(link.timestamp)
    const sevenDaysAgo = subDays(new Date(), 10)
    return isAfter(addedDate, sevenDaysAgo)
  }).length

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <main className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="flex-1 overflow-y-auto">
        {isLoadingLinks ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Links
                  </CardTitle>
                  <Link className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{links.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all categories
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Categories
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Distinct link category
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Most Popular
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mostPopularCategory.name}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {mostPopularCategory.count > 0
                      ? 'Category with most links'
                      : 'No category available'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Recent Additions
                  </CardTitle>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recentLinksCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Links added in the last 7 days
                  </p>
                </CardContent>
              </Card>
            </div>

            <div
              data-testid="stats-grid"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Recently Added Links</CardTitle>
                  <CardDescription>
                    The latest additions to your link manager
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Added</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentLinks.length > 0 ? (
                        recentLinks.map(link => (
                          <TableRow key={`${link.name}-${link.timestamp}`}>
                            <TableCell>
                              <MiniLink link={link} />
                            </TableCell>
                            <TableCell>{link.category}</TableCell>
                            <TableCell>
                              {isAfter(
                                parseISO(link.timestamp),
                                subDays(new Date(), 7)
                              )
                                ? formatDistanceToNow(
                                    parseISO(link.timestamp),
                                    { addSuffix: true }
                                  )
                                : format(
                                    parseISO(link.timestamp),
                                    'MMM d, yyyy'
                                  )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                              <Plus className="h-8 w-8" />
                              <p>No recent links</p>
                              <p className="text-sm">
                                New links will appear here as they are added
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>
                    Distribution of links across category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryStats.length > 0 ? (
                        categoryStats.map(category => (
                          <TableRow key={category.name}>
                            <TableCell>{category.name}</TableCell>
                            <TableCell className="text-right">
                              {category.count}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                              <Folder className="h-8 w-8" />
                              <p>No categories found</p>
                              <p className="text-sm">
                                Categories will appear here as they are added
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
