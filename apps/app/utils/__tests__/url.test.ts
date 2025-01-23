import { debouncedValidateUrl, validateUrl } from '../url'

describe('URL utilities', () => {
  describe('validateUrl', () => {
    it('should return false for empty string', async () => {
      const result = await validateUrl('')
      expect(result).toBe(false)
    })

    it('should return true for valid URLs with protocol', async () => {
      const urls = [
        'https://example.com',
        'http://localhost:3000',
        'https://sub.domain.com/path?query=1'
      ]

      for (const url of urls) {
        const result = await validateUrl(url)
        expect(result).toBe(true)
      }
    })

    it('should return true for valid URLs without protocol', async () => {
      const urls = ['example.com', 'sub.domain.com', 'domain.co.uk']

      for (const url of urls) {
        const result = await validateUrl(url)
        expect(result).toBe(true)
      }
    })

    it('should return false for invalid URLs', async () => {
      const urls = [
        'unicorn',
        'hello',
        'notadomain',
        'https://notadomain.',
        'invalid@domain',
        'just-words',
        'no spaces allowed'
      ]

      for (const url of urls) {
        const result = await validateUrl(url)
        expect(result).toBe(false)
      }
    })
  })

  describe('debouncedValidateUrl', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should debounce multiple calls', async () => {
      const validatePromise1 = debouncedValidateUrl('https://example.com')
      const validatePromise2 = debouncedValidateUrl('https://example.org')

      // Fast-forward time
      jest.advanceTimersByTime(300)

      // Only the last call should be processed
      const result = await validatePromise2
      expect(result).toBe(true)
    })

    it('should wait for the specified delay', async () => {
      const promise = debouncedValidateUrl('https://example.com')

      // Advance time by less than the debounce delay
      jest.advanceTimersByTime(299)

      const immediateResult = await Promise.race([
        promise,
        Promise.resolve('not resolved')
      ])
      expect(immediateResult).toBe('not resolved')

      // Advance remaining time
      jest.advanceTimersByTime(1)

      const result = await promise
      expect(result).toBe(true)
    })
  })
})
