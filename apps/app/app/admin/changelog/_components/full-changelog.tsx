import ReactMarkdown from 'react-markdown'

export function FullChangelog({ content }: { content: string }) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="mb-4 mt-6 text-xl font-bold">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-lg font-semibold">{children}</h3>
          ),
          ul: ({ children }) => (
            <ul className="my-4 list-disc pl-6">{children}</ul>
          ),
          li: ({ children }) => <li className="mt-2">{children}</li>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
