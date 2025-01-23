import { type LinksApp } from '@/features/links/types/link.types'

export async function processCSVFile(file: File): Promise<Partial<LinksApp>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = event => {
      try {
        const text = event.target?.result as string
        const lines = text.split('\n')
        const headers = lines[0]
          .toLowerCase()
          .split(',')
          .map(header => header.trim())

        const links = lines
          .slice(1)
          .filter(line => line.trim()) // Skip empty lines
          .map(line => {
            const values = line.split(',').map(value => {
              // Remove quotes and trim
              return value.trim().replace(/^"(.*)"$/, '$1')
            })

            const link: Partial<LinksApp> = {
              environments: { production: '' }
            }

            headers.forEach((header, index) => {
              const value = values[index]

              if (!value) return

              switch (header) {
                case 'name':
                  link.name = value
                  break
                case 'description':
                  link.description = value
                  break
                case 'category':
                  link.category = value
                  break
                case 'color':
                  link.color = value
                  break
                case 'tags':
                  link.tags = value
                    .split(';')
                    .map(tag => tag.trim())
                    .filter(Boolean)
                  break
                case 'production_url':
                  if (!link.environments) link.environments = { production: '' }
                  link.environments.production = value
                  break
                case 'staging_url':
                  if (!link.environments) link.environments = { production: '' }
                  link.environments.staging = value
                  break
                case 'integration_url':
                  if (!link.environments) link.environments = { production: '' }
                  link.environments.integration = value
                  break
              }
            })

            return link
          })
          .filter(link => {
            // Filter out invalid links
            return link.name && link.environments?.production
          })

        resolve(links)
      } catch (error) {
        console.error('CSV Processing Error:', error)
        reject(
          new Error('Failed to process CSV file. Please check the file format.')
        )
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read CSV file'))
    }

    reader.readAsText(file)
  })
}
