import { userEvent } from '@testing-library/user-event'

import { render, screen } from '@/utils/test-utils'

import {
  AdditionalFeatures,
  type AdditionalFeaturesProps
} from '../additional-features'

const renderComponent = (props: Partial<AdditionalFeaturesProps> = {}) => {
  const defaultProps = {
    showFavorites: false,
    onShowFavoritesChange: jest.fn()
  }

  return render(<AdditionalFeatures {...defaultProps} {...props} />)
}

describe('AdditionalFeatures', () => {
  it('should render additional features correctly', () => {
    const { container } = renderComponent()
    expect(container).toMatchSnapshot()
  })

  it('should display the correct heading', () => {
    renderComponent()
    expect(screen.getByText('Additional Features')).toBeInTheDocument()
  })

  it('should display the show favorites switch', () => {
    renderComponent()
    expect(screen.getByText('Show Favorites')).toBeInTheDocument()
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('should call onShowFavoritesChange when switch is toggled', async () => {
    const onShowFavoritesChange = jest.fn()
    renderComponent({ onShowFavoritesChange })

    const switchElement = screen.getByRole('switch')
    await userEvent.click(switchElement)

    expect(onShowFavoritesChange).toHaveBeenCalledWith(true)
  })

  it('should reflect the current showFavorites state', () => {
    renderComponent({ showFavorites: true })
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'checked')
  })
})
