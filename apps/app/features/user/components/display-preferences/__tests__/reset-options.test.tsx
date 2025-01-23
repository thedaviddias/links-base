import { toast } from 'sonner'

import { fireEvent, render, screen } from '@/utils/test-utils'

import { ResetOptions } from '../reset-options'

// Mock sonner toast
jest.mock('sonner')

const renderComponent = (
  props: Partial<Parameters<typeof ResetOptions>[0]> = {}
) => {
  const defaultProps = {
    onResetWarnings: jest.fn(),
    onResetDefaults: jest.fn()
  }

  return render(<ResetOptions {...defaultProps} {...props} />)
}

describe('ResetOptions', () => {
  it('ResetOptions should render correctly', () => {
    const { container } = renderComponent()
    expect(container).toMatchSnapshot()
  })

  it('should display both reset options', () => {
    renderComponent()

    expect(screen.getByText('Reset Warning Dialogs')).toBeInTheDocument()
    expect(screen.getByText('Reset to Default Settings')).toBeInTheDocument()
  })

  it('should call onResetWarnings and show success toast when clicking reset warnings', () => {
    const onResetWarnings = jest.fn()
    renderComponent({ onResetWarnings })

    fireEvent.click(screen.getByText('Reset Warning Dialogs'))

    expect(onResetWarnings).toHaveBeenCalledTimes(1)
    expect(toast.success).toHaveBeenCalledWith(
      'All warning dialogs have been reset'
    )
  })

  it('should call onResetDefaults and show success toast when clicking reset defaults', () => {
    const onResetDefaults = jest.fn()
    renderComponent({ onResetDefaults })

    fireEvent.click(screen.getByText('Reset to Default Settings'))

    expect(onResetDefaults).toHaveBeenCalledTimes(1)
    expect(toast.success).toHaveBeenCalledWith(
      'Display preferences restored to defaults'
    )
  })
})
