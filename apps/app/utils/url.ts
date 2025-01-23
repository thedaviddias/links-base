import isUrl from 'is-url-superb'

/**
 * Validates if a string is a valid URL
 */
export const validateUrl = async (url: string): Promise<boolean> => {
  try {
    if (!url) return false

    // Reject URLs ending with a dot
    if (url.endsWith('.')) return false

    // Check if it's a valid URL with protocol
    if (url.includes('://')) {
      return isUrl(url)
    }

    // For URLs without protocol, only validate if they have a valid domain structure
    if (
      url.includes('.') &&
      /^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}/.test(url)
    ) {
      return isUrl(`https://${url}`)
    }

    return false
  } catch (error) {
    return false
  }
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 */
const createDebounce = <T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number,
  options?: { leading?: boolean; trailing?: boolean }
) => {
  let timeout: NodeJS.Timeout
  let lastCallArgs: Parameters<T> | null = null

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise(resolve => {
      const shouldCallLeading = options?.leading && !timeout

      const later = () => {
        if (options?.trailing !== false && lastCallArgs) {
          void (async () => {
            const result = await func(...lastCallArgs)
            resolve(result as ReturnType<T>)
            lastCallArgs = null
          })()
        }
      }

      if (timeout) {
        clearTimeout(timeout)
      }

      if (shouldCallLeading) {
        void (async () => {
          const result = await func(...args)
          resolve(result as ReturnType<T>)
        })()
      } else {
        lastCallArgs = args
      }

      timeout = setTimeout(later, wait)
    })
  }
}

/**
 * Debounced version of validateUrl
 */
export const debouncedValidateUrl = createDebounce(validateUrl, 300)

/**
 * Debounced version of getPageTitle with loading state management
 */
export const debouncedGetPageTitle = createDebounce(
  async (url: string): Promise<string | null> => {
    // First validate the URL
    const isValid = await validateUrl(url)
    if (!isValid) return null

    try {
      const response = await fetch(
        `https://api.microlink.io?url=${encodeURIComponent(url)}`
      )
      if (!response.ok) throw new Error('Failed to fetch metadata')

      const data = await response.json()
      return data?.data?.title || null
    } catch (error) {
      console.error('Error fetching page title:', error)
      return null
    }
  },
  1000,
  { leading: false, trailing: true }
)

export const getBaseUrl = () => {
  const environment = process.env.NODE_ENV

  const baseUrl =
    environment === 'development'
      ? 'http://localhost:3000'
      : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`

  return baseUrl
}
