'use client'

import { notFound } from 'next/navigation'

import slugify from '@sindresorhus/slugify'

import { LayoutPublic } from '@/components/layout/layout-public'
import { PageHeader } from '@/components/layout/page-header'

import { getIconComponent } from '@/utils/icon-mapping'

import { useCategories } from '@/features/category/hooks/use-categories'
import { FavouriteBar } from '@/features/favourite/components/favourite-bar'
import { AllLinks } from '@/features/links/components/all-links'

export function CategoryPageClient({ slug }: { slug: string }) {
  const { categories, isLoading } = useCategories()

  const categorySlug = Array.isArray(slug) ? slug[0] : slug

  const category = categories.find(cat => slugify(cat.name) === categorySlug)

  if (!isLoading && !category) {
    notFound()
  }

  return (
    <LayoutPublic>
      <div className="mb-10 flex items-center justify-between">
        <PageHeader
          pageData={{
            pageTitle: category?.name || 'Loading...',
            description: category?.description || '',
            icon: category?.icon ? getIconComponent(category.icon) : undefined
          }}
        />
      </div>

      <FavouriteBar />

      {!isLoading && category && <AllLinks category={category.name} />}
    </LayoutPublic>
  )
}
