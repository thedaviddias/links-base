import fs from 'node:fs/promises'

import { type NextRequest, NextResponse } from 'next/server'

import { IS_PRODUCTION } from '@/constants'
import { type LinksApp } from '@/features/links/types/link.types'
import {
  addLink,
  editLink,
  getLinks,
  linksPath
} from '@/features/links/utils/manage-links'

export async function GET() {
  if (IS_PRODUCTION) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  try {
    const links = getLinks()

    return NextResponse.json(links)
  } catch (error) {
    console.error('Error to get links:', error)
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
    const link = await request.json()
    await addLink(link)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding link:', error)

    return NextResponse.json({ error: 'Failed to add link' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (IS_PRODUCTION) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  try {
    const { linkName } = await request.json()
    // Read current data
    const links = JSON.parse(await fs.readFile(linksPath, 'utf8'))

    // Remove link
    const updatedLinks = links.filter(
      (link: LinksApp) => link.name !== linkName
    )
    await fs.writeFile(linksPath, JSON.stringify(updatedLinks, null, 2))

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error('Error deleting link:', error)
    return new Response(JSON.stringify({ error: 'Failed to delete link' }), {
      status: 500
    })
  }
}

export async function PUT(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  try {
    const link = await request.json()

    if (!link.linkName || !link.name) {
      return NextResponse.json(
        { error: 'Link name is required' },
        { status: 400 }
      )
    }

    // Validate tag count when creating/updating links
    if (link.tags.length > 3) {
      return new Response('Maximum of 3 tags allowed', { status: 400 })
    }

    await editLink(link.linkName, link)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update link' },
      { status: 500 }
    )
  }
}
