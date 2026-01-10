import { NextResponse } from 'next/server'

// Skip this route in static export - only available in development
export const dynamic = 'error'

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Not available in production', { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new NextResponse(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/png',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    )
  }
}
