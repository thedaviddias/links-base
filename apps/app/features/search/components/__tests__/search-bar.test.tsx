import { screen } from '@testing-library/react'
import { default as userEvent } from '@testing-library/user-event'

import { render } from '@/utils/test-utils'

import { useCommandStore } from '../../stores/use-command-store'
import { SearchBar } from '../search-bar'

// Mock the hooks
jest.mock('@links-base/ui/hooks', () => ({
  useIsMobile: () => false
}))

jest.mock('../../stores/use-command-store', () => ({
  useCommandStore: jest.fn() as unknown as typeof useCommandStore
}))

const mockSetOpen = jest.fn()

const renderComponent = (props = {}) => {
  return render(<SearchBar {...props} />)
}

describe('SearchBar', () => {
  beforeEach(() => {
    ;(useCommandStore as unknown as jest.Mock).mockImplementation(() => ({
      setOpen: mockSetOpen
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render SearchBar correctly', async () => {
    const { container } = renderComponent()
    // Wait for any state updates to complete
    await screen.findByRole('button')
    expect(container).toMatchSnapshot()
  })

  it('should display search icon and text', () => {
    renderComponent()

    expect(screen.getByLabelText('search icon')).toBeInTheDocument()
    expect(screen.getByText('Search')).toBeInTheDocument()
  })

  it('should display keyboard shortcut', () => {
    renderComponent()

    expect(
      screen.getByRole('textbox', { name: 'keyboard shortcut' })
    ).toBeInTheDocument()
    expect(screen.getByText('⌘')).toBeInTheDocument()
    expect(screen.getByText('K')).toBeInTheDocument()
  })

  it('should open command menu when clicked', async () => {
    const user = userEvent.setup()
    renderComponent()

    const button = screen.getByRole('button')
    await user.click(button)

    expect(mockSetOpen).toHaveBeenCalledWith(true)
  })
})
