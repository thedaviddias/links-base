import { Suspense } from 'react'

import slugify from '@sindresorhus/slugify'

import { CategorySkeleton } from '@/components/skeletons/category-skeleton'

import { CategoryPageClient } from '@/app/category/_components/category-page-client'
import { getCategories } from '@/features/category/utils/manage-categories'

// Make sure this is exported as a named export
export async function generateStaticParams() {
  try {
    const categories = await getCategories()

    if (!categories || categories.length === 0) {
      return [{ slug: 'default' }] // Provide at least one path so the page doesn't 404
    }

    return categories.map(category => {
      const slug = slugify(category.name)

      return { slug }
    })
  } catch (error) {
    console.error('Error generating static params:', error)
    return [{ slug: 'default' }] // Fallback path in case of error
  }
}

type CategoryPageProps = {
  params: { slug: string }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryPageClient slug={params.slug} />
    </Suspense>
  )
}
