import { DEFAULT_COLOR } from '@/constants'
import { extractColorFromImage } from '@/features/links/utils/color'

import { extractColorFromImageUrl } from '../image'

// Mock the color extraction utility
jest.mock('@/features/links/utils/color')
const mockExtractColorFromImage = extractColorFromImage as jest.MockedFunction<
  typeof extractColorFromImage
>

describe('extractColorFromImageUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('extractColorFromImageUrl should render correctly', () => {
    expect(extractColorFromImageUrl).toBeDefined()
  })

  it('should extract color directly from URL when proxy is disabled', async () => {
    const targetUrl = 'https://example.com/image.jpg'
    const expectedColor = '#FF0000'
    mockExtractColorFromImage.mockResolvedValueOnce(expectedColor)

    const result = await extractColorFromImageUrl(targetUrl, {
      enabled: false,
      primary: '',
      fallback: ''
    })

    expect(result).toBe(expectedColor)
    expect(mockExtractColorFromImage).toHaveBeenCalledWith(targetUrl)
    expect(mockExtractColorFromImage).toHaveBeenCalledTimes(1)
  })

  it('should use primary proxy when enabled', async () => {
    const targetUrl = 'https://example.com/image.jpg'
    const primaryProxy = 'https://proxy.com'
    const expectedColor = '#00FF00'
    mockExtractColorFromImage.mockResolvedValueOnce(expectedColor)

    const result = await extractColorFromImageUrl(targetUrl, {
      enabled: true,
      primary: primaryProxy,
      fallback: ''
    })

    expect(result).toBe(expectedColor)
    expect(mockExtractColorFromImage).toHaveBeenCalledWith(
      `${primaryProxy}?url=${encodeURIComponent(targetUrl)}`
    )
    expect(mockExtractColorFromImage).toHaveBeenCalledTimes(1)
  })

  it('should try fallback proxy when primary fails', async () => {
    const targetUrl = 'https://example.com/image.jpg'
    const primaryProxy = 'https://proxy.com'
    const fallbackProxy = 'https://backup-proxy.com'
    const expectedColor = '#0000FF'

    mockExtractColorFromImage
      .mockRejectedValueOnce(new Error('Primary proxy failed'))
      .mockResolvedValueOnce(expectedColor)

    const result = await extractColorFromImageUrl(targetUrl, {
      enabled: true,
      primary: primaryProxy,
      fallback: fallbackProxy
    })

    expect(result).toBe(expectedColor)
    expect(mockExtractColorFromImage).toHaveBeenCalledTimes(2)
    expect(mockExtractColorFromImage).toHaveBeenNthCalledWith(
      1,
      `${primaryProxy}?url=${encodeURIComponent(targetUrl)}`
    )
    expect(mockExtractColorFromImage).toHaveBeenNthCalledWith(
      2,
      `${fallbackProxy}?url=${encodeURIComponent(targetUrl)}`
    )
  })

  it('should return null when color extraction fails and no fallback is available', async () => {
    const targetUrl = 'https://example.com/image.jpg'
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    mockExtractColorFromImage.mockRejectedValueOnce(
      new Error('Extraction failed')
    )

    const result = await extractColorFromImageUrl(targetUrl, {
      enabled: false,
      primary: '',
      fallback: ''
    })

    expect(result).toBeNull()
    expect(mockExtractColorFromImage).toHaveBeenCalledTimes(1)
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error in color extraction:',
      expect.any(Error)
    )

    consoleSpy.mockRestore()
  })

  it('should return null when extracted color is DEFAULT_COLOR', async () => {
    const targetUrl = 'https://example.com/image.jpg'
    mockExtractColorFromImage.mockResolvedValueOnce(DEFAULT_COLOR)

    const result = await extractColorFromImageUrl(targetUrl, {
      enabled: false,
      primary: '',
      fallback: ''
    })

    expect(result).toBeNull()
    expect(mockExtractColorFromImage).toHaveBeenCalledTimes(1)
  })
})
