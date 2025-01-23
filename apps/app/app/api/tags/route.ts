import fs from 'node:fs/promises'

import { type NextRequest, NextResponse } from 'next/server'

import { IS_PRODUCTION } from '@/constants'
import { linksPath } from '@/features/links/utils/manage-links'
import {
  addTag,
  editTag,
  getAllTags,
  tagsFilePath
} from '@/features/links/utils/manage-tags'

export async function GET() {
  if (IS_PRODUCTION) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  try {
    const tags = await getAllTags()

    if (!Array.isArray(tags)) {
      console.error('getTags did not return an array:', tags)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }

    return NextResponse.json(tags)
  } catch (error) {
    console.error('Error in GET tags:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (IS_PRODUCTION) {
      return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
    }

    const tag = await request.json()
    await addTag(tag)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing tag:', error)
    return NextResponse.json(
      { error: 'Failed to process tag' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  if (IS_PRODUCTION) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  const { tagName, deleteLinks } = await request.json()

  try {
    // Read current data
    const tags = JSON.parse(await fs.readFile(tagsFilePath, 'utf8'))
    const links = JSON.parse(await fs.readFile(linksPath, 'utf8'))

    // Check if tag has links
    const tagLinks = links.filter((link: any) => link.tags?.includes(tagName))
    if (tagLinks.length > 0 && !deleteLinks) {
      return new Response(
        JSON.stringify({
          error: 'Tag has links',
          count: tagLinks.length
        }),
        {
          status: 400
        }
      )
    }

    // If deleteLinks is true, remove tag from all links
    if (deleteLinks) {
      const updatedLinks = links.map((link: any) => ({
        ...link,
        tags: link.tags?.filter((tag: string) => tag !== tagName) || []
      }))
      await fs.writeFile(linksPath, JSON.stringify(updatedLinks, null, 2))
    }

    // Remove tag
    const updatedTags = tags.filter((tag: any) => tag.name !== tagName)
    await fs.writeFile(tagsFilePath, JSON.stringify(updatedTags, null, 2))

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return new Response(JSON.stringify({ error: 'Failed to delete tag' }), {
      status: 500
    })
  }
}

export async function PUT(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  try {
    const tag = await request.json()

    if (!tag.oldName || !tag.name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      )
    }

    await editTag(tag.oldName, tag)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 })
  }
}
