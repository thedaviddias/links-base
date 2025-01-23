import { act } from 'react'

import { userEvent } from '@testing-library/user-event'

import { render, screen } from '@/utils/test-utils'

// Import the mocks
import '../../__mocks__/radix-ui'
import { ViewSelector } from '../view-selector'

const renderComponent = (
  props: Partial<Parameters<typeof ViewSelector>[0]> = {}
) => {
  const defaultProps = {
    cardSize: 'default' as const,
    onViewChange: jest.fn()
  }

  return render(<ViewSelector {...defaultProps} {...props} />)
}

describe('ViewSelector', () => {
  it('should render ViewSelector correctly', () => {
    const { container } = renderComponent()
    expect(container).toMatchSnapshot()
  })

  it('should display both compact and default view options', () => {
    renderComponent()

    expect(screen.getByLabelText('Compact')).toBeInTheDocument()
    expect(screen.getByLabelText('Default')).toBeInTheDocument()
  })

  it('should call onViewChange when selecting a different view', async () => {
    const user = userEvent.setup()
    const onViewChange = jest.fn()

    await act(async () => {
      renderComponent({ onViewChange })
    })

    const compactOption = screen.getByLabelText('Compact')

    await act(async () => {
      await user.click(compactOption)
      // Add a small delay to allow for state updates
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(onViewChange).toHaveBeenCalledWith('compact')
  })

  it('should highlight the selected view option', () => {
    renderComponent({ cardSize: 'compact' })

    const compactLabel = screen.getByText('Compact').parentElement
    const defaultLabel = screen.getByText('Default').parentElement

    expect(compactLabel).toHaveClass('border-primary')
    expect(defaultLabel).not.toHaveClass('border-primary')
  })
})
