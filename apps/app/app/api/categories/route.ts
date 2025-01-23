import fs from 'node:fs/promises'

import { type NextRequest, NextResponse } from 'next/server'

import { IS_PRODUCTION } from '@/constants'
import {
  addCategory,
  categoriesPath,
  editCategory,
  getCategories
} from '@/features/category/utils/manage-categories'
import { linksPath } from '@/features/links/utils/manage-links'

export async function GET() {
  if (IS_PRODUCTION) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  try {
    const categories = await getCategories()

    if (!Array.isArray(categories)) {
      console.error('getCategories did not return an array:', categories)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error in GET categories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  if (IS_PRODUCTION) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  try {
    const category = await request.json()
    await addCategory(category)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add category' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  if (IS_PRODUCTION) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  try {
    const {
      oldName,
      newName,
      icon,
      description
    }: {
      oldName: string
      newName: string
      icon?: string
      description?: string
    } = await request.json()

    if (!oldName || !newName) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    if (icon && typeof icon !== 'string') {
      return NextResponse.json(
        { error: 'Icon must be a string' },
        { status: 400 }
      )
    }

    if (description && typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description must be a string' },
        { status: 400 }
      )
    }

    await editCategory(oldName, newName, icon, description)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  if (IS_PRODUCTION) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  try {
    const { categoryName, deleteLinks } = await request.json()

    const categories = JSON.parse(await fs.readFile(categoriesPath, 'utf8'))
    const links = JSON.parse(await fs.readFile(linksPath, 'utf8'))

    const categoryLinks = links.filter(
      (link: any) => link.category === categoryName
    )

    if (categoryLinks.length > 0 && !deleteLinks) {
      return NextResponse.json(
        {
          error: 'Category has links',
          count: categoryLinks.length
        },
        { status: 400 }
      )
    }

    if (deleteLinks) {
      const updatedLinks = links.filter(
        (link: any) => link.category !== categoryName
      )
      await fs.writeFile(linksPath, JSON.stringify(updatedLinks, null, 2))
    }

    const updatedCategories = categories.filter(
      (cat: any) => cat.name !== categoryName
    )
    await fs.writeFile(
      categoriesPath,
      JSON.stringify(updatedCategories, null, 2)
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
