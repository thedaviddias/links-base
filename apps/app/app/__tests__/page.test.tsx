// import { fireEvent, render, screen } from '@/utils/test-utils';
import { render, screen } from '@testing-library/react'

import { RootProvider } from '@/components/root-provider'

import Home from '../page'

// Mock all required modules
jest.mock('@/features/category/hooks/use-categories')
jest.mock('@/features/links/hooks/links/use-links')
jest.mock('@/features/favourite/hooks/use-favourites')
jest.mock('@/features/user/stores/useUserSettingsStore')
jest.mock('@/features/links/stores/use-recent-links-store')
jest.mock('@/config/app.config', () => ({
  __esModule: true,
  default: {
    bannerText: ''
  }
}))

// Mock motion
jest.mock('motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    )
  }
}))

// Setup all hook mocks
const mockUseCategories = jest.requireMock(
  '@/features/category/hooks/use-categories'
)
const mockUseLinks = jest.requireMock('@/features/links/hooks/links/use-links')
const mockUseFavourites = jest.requireMock(
  '@/features/favourite/hooks/use-favourites'
)
const mockUseUserSettingsStore = jest.requireMock(
  '@/features/user/stores/useUserSettingsStore'
)
const mockUseRecentLinksStore = jest.requireMock(
  '@/features/links/stores/use-recent-links-store'
)

const renderComponent = () => {
  return render(
    <RootProvider>
      <Home />
    </RootProvider>
  )
}

describe('Home Page', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()

    // Setup default mock implementations
    mockUseCategories.useCategories.mockReturnValue({
      categories: [],
      isLoading: false
    })

    mockUseLinks.useLinks.mockReturnValue({
      links: [],
      isLoading: false
    })

    mockUseFavourites.useFavourites.mockReturnValue({
      favourites: [],
      removeFavourite: jest.fn()
    })

    mockUseUserSettingsStore.useUserSettingsStore.mockReturnValue({
      hiddenCategories: []
    })

    mockUseRecentLinksStore.useRecentLinksStore.mockReturnValue({
      setRecentLinks: jest.fn()
    })

    // Clear localStorage
    localStorage.clear()
  })

  it.skip('should render correctly', () => {
    const { container } = renderComponent()
    expect(container).toMatchSnapshot()
  })

  it.skip('should show loading skeleton when data is loading', () => {
    mockUseCategories.useCategories.mockReturnValue({
      categories: [],
      isLoading: true
    })

    renderComponent()
    expect(screen.getByTestId('home-skeleton')).toBeInTheDocument()
  })

  it.skip('should render page header with correct title', () => {
    renderComponent()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Home' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Manage and access your bookmarks')
    ).toBeInTheDocument()
  })

  it.skip('should render no links found message', () => {
    renderComponent()

    expect(screen.getByText('No links found')).toBeInTheDocument()
    expect(
      screen.getByText('Request a new link to be added')
    ).toBeInTheDocument()
  })

  // describe('Hidden Categories Alert', () => {
  //   beforeEach(() => {
  //     const mockCategories = [{ name: 'Test Category', icon: 'Folder' }];
  //     const mockLinks = [{ category: 'Test Category', title: 'Test Link' }];

  //     mockUseCategories.useCategories.mockReturnValue({
  //       categories: mockCategories,
  //       isLoading: false
  //     });

  //     mockUseLinks.useLinks.mockReturnValue({
  //       links: mockLinks,
  //       isLoading: false
  //     });

  //     mockUseUserSettingsStore.useUserSettingsStore.mockReturnValue({
  //       hiddenCategories: ['Test Category']
  //     });
  //   });

  //   it.skip('should show hidden categories alert when there are hidden categories with links', () => {
  //     renderComponent();
  //     expect(screen.getByText('Hidden Categories')).toBeInTheDocument();
  //   });

  //   it.skip('should dismiss hidden categories alert when clicking close button', () => {
  //     renderComponent();

  //     const dismissButton = screen.getByRole('button', { name: /dismiss/i });
  //     fireEvent.click(dismissButton);

  //     expect(screen.queryByText('Hidden Categories')).not.toBeInTheDocument();
  //     expect(screen.getByText('1 hidden category')).toBeInTheDocument();
  //   });

  //   it.skip('should persist alert dismissal in localStorage', () => {
  //     renderComponent();

  //     const dismissButton = screen.getByRole('button', { name: /dismiss/i });
  //     fireEvent.click(dismissButton);

  //     expect(localStorage.getItem('hasSeenHiddenCategoriesAlert')).toBe('true');
  //   });
  // });

  // it.skip('should initialize recent links when links are loaded', () => {
  //   const mockLinks = [{ id: '1', title: 'Test Link', category: 'Test' }];
  //   const mockSetRecentLinks = jest.fn();

  //   mockUseLinks.useLinks.mockReturnValue({
  //     links: mockLinks,
  //     isLoading: false
  //   });

  //   mockUseRecentLinksStore.useRecentLinksStore.mockReturnValue({
  //     setRecentLinks: mockSetRecentLinks
  //   });

  //   renderComponent();

  //   expect(mockSetRecentLinks).toHaveBeenCalled();
  // });
})
