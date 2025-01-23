import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { LoadingSpinner } from '@/components/skeletons/loading-spinner'

const renderComponent = (props = {}) => {
  return render(<LoadingSpinner {...props} />)
}

describe('<LoadingSpinner />', () => {
  it('<LoadingSpinner /> should render correctly', () => {
    const { container } = renderComponent()
    expect(container).toMatchSnapshot()
  })

  it('should be accessible', async () => {
    const { container } = renderComponent()
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })

  it('should render with different sizes', () => {
    const { rerender } = renderComponent({ size: 'sm' })
    expect(screen.getByRole('status')).toBeInTheDocument()

    rerender(<LoadingSpinner size="lg" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
