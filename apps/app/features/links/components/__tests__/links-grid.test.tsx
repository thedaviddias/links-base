import { default as userEvent } from '@testing-library/user-event'

import { render, screen } from '@/utils/test-utils'

import { mockLinkData } from '../../__mocks__/link-data'
import { type LinksApp } from '../../types/link.types'
import { LinksGrid } from '../links-grid'

// Create an array of mock links using the existing mock data
const mockLinks: LinksApp[] = [
  mockLinkData.basic,
  mockLinkData.withMultipleEnvironments
]

const renderComponent = (
  props: Partial<Parameters<typeof LinksGrid>[0]> = {}
) => {
  const defaultProps = {
    links: mockLinks,
    handleLinkClick: jest.fn(),
    clickedLinks: [],
    handleAddToFavorites: jest.fn(),
    isFavourite: jest.fn(),
    isArchived: jest.fn(),
    onArchiveToggle: jest.fn(),
    withAnimation: false
  }

  return render(<LinksGrid {...defaultProps} {...props} />)
}

describe('LinksGrid', () => {
  it.skip('should render correctly', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  it.skip('should render all links', () => {
    renderComponent()
    mockLinks.forEach(link => {
      expect(screen.getByText(link.name)).toBeInTheDocument()
    })
  })

  it.skip('should render without animation wrapper when withAnimation is false', () => {
    renderComponent({ withAnimation: false })
    const animatedElements = document.querySelectorAll('[data-motion-initial]')
    expect(animatedElements).toHaveLength(0)
  })

  it.skip('should call handleLinkClick when a link is clicked', () => {
    const handleLinkClick = jest.fn()
    renderComponent({ handleLinkClick })

    const firstLink = screen.getByText(mockLinks[0].name)
    firstLink.click()

    expect(handleLinkClick).toHaveBeenCalledWith(mockLinks[0])
  })

  it.skip('should call handleAddToFavorites when favorite button is clicked', async () => {
    const user = userEvent.setup()
    const handleAddToFavorites = jest.fn()

    renderComponent({ handleAddToFavorites })

    const moreInformationButton = screen.getAllByRole('button', {
      name: /Open (more menu|menu)/i
    })
    await user.click(moreInformationButton[0])

    const menu = screen.getByRole('menu')
    expect(menu).toBeInTheDocument()

    const favoriteButtons = screen.getAllByRole('menuitem', { name: /Pin/i })
    favoriteButtons[0].click()

    expect(handleAddToFavorites).toHaveBeenCalledWith(mockLinks[0])
  })

  it.skip('should call onArchiveToggle when archive button is clicked', async () => {
    const user = userEvent.setup()
    const onArchiveToggle = jest.fn()

    renderComponent({ onArchiveToggle })

    const moreInformationButton = screen.getAllByRole('button', {
      name: /Open (more menu|menu)/i
    })
    await user.click(moreInformationButton[0])

    const menu = screen.getByRole('menu')
    expect(menu).toBeInTheDocument()

    const archiveButtons = screen.getAllByRole('menuitem', { name: /Archive/i })

    await user.click(archiveButtons[0])

    expect(onArchiveToggle).toHaveBeenCalledWith(mockLinks[0].name)
  })
})
