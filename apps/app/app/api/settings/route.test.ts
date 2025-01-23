/**
 * @jest-environment node
 */
import { mockValidSettings } from '@/features/settings/__mocks__/settings.mock'
import * as manageSettings from '@/features/settings/utils/manage-settings'

import { GET } from './route'

// Mock the manage-settings module
jest.mock('@/features/settings/utils/manage-settings', () => ({
  getSettings: jest.fn(),
  updateSettings: jest.fn(),
  SettingsError: jest.requireActual('@/features/settings/utils/manage-settings')
    .SettingsError
}))

describe('/api/settings', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return settings with status 200', async () => {
      // Mock getSettings to return mockValidSettings synchronously
      ;(manageSettings.getSettings as jest.Mock).mockReturnValue(
        mockValidSettings
      )

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockValidSettings)
      expect(manageSettings.getSettings).toHaveBeenCalledTimes(1)
    })

    // Store the original console.error
    const originalConsoleError = console.error

    beforeEach(() => {
      // Mock console.error before each test
      console.error = jest.fn()
    })

    afterEach(() => {
      // Restore console.error after each test
      console.error = originalConsoleError
    })

    it('should handle errors and return 500 status', async () => {
      // Mock getSettings to throw an error
      ;(manageSettings.getSettings as jest.Mock).mockImplementation(() => {
        throw new manageSettings.SettingsError('Failed to read settings')
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to read settings' })

      // Verify console.error was called with the expected message
      expect(console.error).toHaveBeenCalledWith(
        'Error reading settings:',
        expect.any(manageSettings.SettingsError)
      )
    })
  })
})
