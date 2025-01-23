import { fireEvent, render, screen } from '@/utils/test-utils'

import { useWarningPreferences } from '@/features/environment/hooks/useWarningPreferences'
import {
  useNonDefaultSettings,
  useUserSettingsStore
} from '@/features/user/stores/useUserSettingsStore'

import { DisplayPreferences } from '../display-preferences'

// Mock the hooks
jest.mock('@/features/user/stores/useUserSettingsStore')
jest.mock('@/features/environment/hooks/useWarningPreferences')

const renderComponent = () => {
  return render(<DisplayPreferences />)
}

describe('DisplayPreferences', () => {
  const mockUseUserSettingsStore = useUserSettingsStore as unknown as jest.Mock
  const mockUseWarningPreferences =
    useWarningPreferences as unknown as jest.Mock

  beforeEach(() => {
    // Reset all mocks before each test
    mockUseUserSettingsStore.mockReturnValue({
      cardSize: 'default',
      showGradients: true,
      showFavorites: true,
      showTags: true,
      showDescriptions: true,
      showIcons: true,
      showEnvironmentBadges: true,
      setCardSize: jest.fn(),
      setShowGradients: jest.fn(),
      setShowFavorites: jest.fn(),
      setShowTags: jest.fn(),
      setShowDescriptions: jest.fn(),
      setShowIcons: jest.fn(),
      setShowEnvironmentBadges: jest.fn(),
      resetToDefaults: jest.fn(),
      previousDescriptionState: true,
      previousTagsState: true
    })

    mockUseWarningPreferences.mockReturnValue({
      resetAllWarnings: jest.fn()
    })
  })

  it('should render DisplayPreferences correctly', () => {
    const { container } = renderComponent()
    expect(container).toMatchSnapshot()
  })

  it('should open popover when settings button is clicked', () => {
    renderComponent()

    const settingsButton = screen.getByRole('button')
    fireEvent.click(settingsButton)

    expect(screen.getByText('Display Preferences')).toBeInTheDocument()
    expect(
      screen.getByText('Customize how your dashboard looks')
    ).toBeInTheDocument()
  })

  it('should show non-default settings indicator when settings are changed', () => {
    const mockUseNonDefaultSettings = useNonDefaultSettings as jest.Mock
    mockUseNonDefaultSettings.mockReturnValue(true)

    renderComponent()

    // Check if the blue dot indicator is present
    expect(screen.getByTestId('settings-indicator')).toHaveClass('animate-ping')
  })

  it('should handle view change correctly', () => {
    const mockSetCardSize = jest.fn()
    const mockSetShowDescriptions = jest.fn()
    const mockSetShowTags = jest.fn()

    mockUseUserSettingsStore.mockReturnValue({
      ...mockUseUserSettingsStore(),
      setCardSize: mockSetCardSize,
      setShowDescriptions: mockSetShowDescriptions,
      setShowTags: mockSetShowTags
    })

    renderComponent()

    // Open popover
    fireEvent.click(screen.getByRole('button'))

    // Click compact view button
    fireEvent.click(screen.getByText('Compact'))

    expect(mockSetCardSize).toHaveBeenCalledWith('compact')
    expect(mockSetShowDescriptions).toHaveBeenCalledWith(false)
    expect(mockSetShowTags).toHaveBeenCalledWith(false)
  })

  it('should handle property toggles correctly', () => {
    const mockSetShowGradients = jest.fn()

    mockUseUserSettingsStore.mockReturnValue({
      ...mockUseUserSettingsStore(),
      setShowGradients: mockSetShowGradients
    })

    renderComponent()

    // Open popover
    fireEvent.click(screen.getByRole('button'))

    // Try different queries to find the element
    const gradientToggle =
      screen.getByRole('switch', { name: /gradients/i }) ||
      screen.getByLabelText(/gradients/i) ||
      screen.getByText(/gradients/i)

    fireEvent.click(gradientToggle)

    expect(mockSetShowGradients).toHaveBeenCalled()
  })

  it('should handle reset options correctly', () => {
    const mockResetToDefaults = jest.fn()
    const mockResetAllWarnings = jest.fn()

    mockUseUserSettingsStore.mockReturnValue({
      ...mockUseUserSettingsStore(),
      resetToDefaults: mockResetToDefaults
    })

    mockUseWarningPreferences.mockReturnValue({
      resetAllWarnings: mockResetAllWarnings
    })

    renderComponent()

    // Open popover
    fireEvent.click(screen.getByRole('button'))

    // Click reset buttons
    fireEvent.click(screen.getByText('Reset to Default Settings'))
    fireEvent.click(screen.getByText('Reset Warning Dialogs'))

    expect(mockResetToDefaults).toHaveBeenCalled()
    expect(mockResetAllWarnings).toHaveBeenCalled()
  })

  it('should restore previous description and tags state when switching back to default view', () => {
    const mockSetShowDescriptions = jest.fn()
    const mockSetShowTags = jest.fn()

    mockUseUserSettingsStore.mockReturnValue({
      ...mockUseUserSettingsStore(),
      cardSize: 'compact',
      previousDescriptionState: true,
      previousTagsState: false,
      setShowDescriptions: mockSetShowDescriptions,
      setShowTags: mockSetShowTags
    })

    renderComponent()

    // Open popover
    fireEvent.click(screen.getByRole('button'))

    // Find and click the default view option
    fireEvent.click(screen.getByLabelText(/default/i))

    // Verify previous states are restored
    expect(mockSetShowDescriptions).toHaveBeenCalledWith(true)
    expect(mockSetShowTags).toHaveBeenCalledWith(false)
  })
})
