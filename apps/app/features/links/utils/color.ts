import { formatHex, rgb } from 'culori'

import { DEFAULT_COLOR } from '@/constants'

/**
 * Extracts the dominant color from an image URL
 */
export const extractColorFromImage = async (
  imageUrl: string
): Promise<string> => {
  return new Promise(resolve => {
    const img = document.createElement('img')
    img.crossOrigin = 'anonymous'

    // Add timeout to prevent hanging
    const timeout = setTimeout(() => {
      console.error('Image loading timeout')
      resolve(DEFAULT_COLOR)
    }, 5000)

    img.onload = () => {
      clearTimeout(timeout)

      try {
        // Test if we can actually access the image data
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d', { willReadFrequently: true })

        if (!ctx) {
          console.error('Could not get canvas context')
          resolve(DEFAULT_COLOR)
          return
        }

        canvas.width = img.width
        canvas.height = img.height

        // This will throw if there's a CORS issue
        ctx.drawImage(img, 0, 0)
        try {
          // This will throw if we can't access the pixel data
          ctx.getImageData(0, 0, 1, 1)
        } catch (e) {
          console.error('CORS error: Cannot access image data', e)
          resolve(DEFAULT_COLOR)
          return
        }

        // Now proceed with the actual color extraction
        const maxDimension = 100
        const scale = Math.min(
          1,
          maxDimension / Math.max(img.width, img.height)
        )

        canvas.width = img.width * scale
        canvas.height = img.height * scale

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        let r = 0,
          g = 0,
          b = 0
        let count = 0

        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 128) continue // Skip transparent pixels
          r += data[i]
          g += data[i + 1]
          b += data[i + 2]
          count++
        }

        if (count > 0) {
          r = Math.round(r / count)
          g = Math.round(g / count)
          b = Math.round(b / count)

          const color = formatHex(
            rgb({ mode: 'rgb', r: r / 255, g: g / 255, b: b / 255 })
          )
          if (color) {
            resolve(color)
          } else {
            console.error('Could not format color')
            resolve(DEFAULT_COLOR)
          }
        } else {
          console.error('No valid pixels found')
          resolve(DEFAULT_COLOR)
        }
      } catch (error) {
        console.error('Error processing image:', error)
        resolve(DEFAULT_COLOR)
      }
    }

    img.onerror = () => {
      clearTimeout(timeout)
      // Try without crossOrigin as fallback
      const fallbackImg = new Image()
      fallbackImg.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d', { willReadFrequently: true })
          if (!ctx) {
            resolve(DEFAULT_COLOR)
            return
          }
          canvas.width = fallbackImg.width
          canvas.height = fallbackImg.height
          ctx.drawImage(fallbackImg, 0, 0)
          resolve(DEFAULT_COLOR) // Even if we can load it, we can't access the data
        } catch (e) {
          console.error('Fallback image processing failed:', e)
          resolve(DEFAULT_COLOR)
        }
      }
      fallbackImg.onerror = () => {
        console.error('Both CORS and non-CORS image loading failed')
        resolve(DEFAULT_COLOR)
      }
      fallbackImg.src = imageUrl
    }

    try {
      img.src = imageUrl
    } catch (error) {
      console.error('Error setting image source:', error)
      resolve(DEFAULT_COLOR)
    }
  })
}
