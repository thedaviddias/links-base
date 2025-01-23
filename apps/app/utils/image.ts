import { DEFAULT_COLOR } from '@/constants'
import { type InferSettingsSchema } from '@/features/settings/schemas/settings.schema'

import { extractColorFromImage } from '../features/links/utils/color'

/**
 * Extracts color from an image URL using proxy settings if enabled
 */
export const extractColorFromImageUrl = async (
  targetUrl: string,
  settings: InferSettingsSchema['services']['imageProxy'] | undefined
): Promise<string | null> => {
  const getProxyUrl = (proxy: string, url: string) =>
    `${proxy}?url=${encodeURIComponent(url)}`

  try {
    // Try primary proxy or direct URL
    const proxyUrl =
      settings?.enabled && settings.primary
        ? getProxyUrl(settings.primary, targetUrl)
        : targetUrl

    const color = await extractColorFromImage(proxyUrl)
    if (color && color !== DEFAULT_COLOR) {
      return color
    }
  } catch (error) {
    // Try fallback proxy if available
    if (settings?.enabled && settings.fallback) {
      try {
        const fallbackUrl = getProxyUrl(settings.fallback, targetUrl)
        const color = await extractColorFromImage(fallbackUrl)
        if (color && color !== DEFAULT_COLOR) {
          return color
        }
      } catch (fallbackError) {
        console.error('Error in color extraction with fallback:', fallbackError)
      }
    } else {
      console.error('Error in color extraction:', error)
    }
  }

  return null
}
