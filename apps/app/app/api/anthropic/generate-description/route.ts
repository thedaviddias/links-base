import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: Request) {
  const { url, name } = await req.json()

  // Validate input
  if (!url && !name) {
    return new Response('Missing url or name', { status: 400 })
  }

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY!
    })

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: `Generate a brief, engaging description (maximum 80 characters, no more) for a website link with the following details:
        URL: ${url}
        Name: ${name}

        The description should be informative but concise, don't start with the name.`
        }
      ]
    })

    if (
      message.content &&
      message.content.length > 0 &&
      'text' in message.content[0]
    ) {
      return new Response(message.content[0].text)
    } else {
      console.error('Unexpected response format:', message)
      return new Response('Unexpected response format', { status: 500 })
    }
  } catch (error) {
    console.error('Error generating description:', error)
    return new Response('Error generating description', { status: 500 })
  }
}
