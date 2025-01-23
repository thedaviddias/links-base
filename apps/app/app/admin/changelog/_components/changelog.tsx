import { type FC } from 'react'
import ReactMarkdown from 'react-markdown'

import { Card } from '@links-base/ui/card'

interface ChangelogProps {
  content: string
}

export const Changelog: FC<ChangelogProps> = ({ content }) => {
  return (
    <Card className="p-6">
      <ReactMarkdown
        className="prose dark:prose-invert max-w-none"
        components={{
          // Customize markdown components if needed
          h2: ({ children }) => (
            <h2 className="mb-4 mt-6 text-xl font-bold">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-lg font-semibold">{children}</h3>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </Card>
  )
}
