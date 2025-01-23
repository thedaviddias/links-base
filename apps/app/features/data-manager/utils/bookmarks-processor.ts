import { DEFAULT_CATEGORY, DEFAULT_COLOR } from '@/constants'
import { type LinksApp } from '@/features/links/types/link.types'

export async function processBookmarksFile(
  file: File
): Promise<Partial<LinksApp>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = event => {
      try {
        const text = event.target?.result as string
        const parser = new DOMParser()
        const doc = parser.parseFromString(text, 'text/html')
        const bookmarks = Array.from(doc.getElementsByTagName('a'))

        const links = bookmarks.map(bookmark => ({
          name: bookmark.textContent || '',
          environments: {
            production: bookmark.href
          },
          category: DEFAULT_CATEGORY,
          color: DEFAULT_COLOR
        }))

        resolve(links.filter(link => link.name && link.environments.production))
      } catch (error) {
        reject(new Error('Failed to process bookmarks file'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read bookmarks file'))
    }

    reader.readAsText(file)
  })
}
