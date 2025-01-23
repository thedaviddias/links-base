import { type LinksApp } from '@/features/links/types/link.types'

export const formatLinkDetails = (link: LinksApp): string => {
  const sections = [
    `${link.name}`,
    `${link.description || ''}`,
    '=== Environments ===',
    ...Object.entries(link.environments || {})
      .filter(([_, url]) => url)
      .map(([env, url]) => `- ${env}: ${url}`),
    '',
    link.access ? ['=== Access ===', link.access].join('\n') : '',
    '',
    link.instructions
      ? ['=== Instructions ===', link.instructions].join('\n')
      : '',
    '',
    link.tags?.length ? ['=== Tags ===', link.tags.join(', ')].join('\n') : '',
    ''
  ]

  // Double line breaks between sections for better readability
  return sections.filter(Boolean).join('\n\n')
}
