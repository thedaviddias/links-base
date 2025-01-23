import { render } from '@/utils/test-utils'

import * as environmentHooks from '@/features/links/hooks/environments/use-environment-config'
import { mockUserSettings } from '@/features/user/__mocks__/user-settings.mock'
import * as userSettingsStore from '@/features/user/stores/useUserSettingsStore'

import { mockEnvironmentConfig } from '../../__mocks__/environment-config.mock'
import { mockLinkData } from '../../__mocks__/link-data'
import { LinkCard } from '../link-card'

jest.mock('@/features/links/hooks/environments/use-environment-config', () => ({
  useEnvironmentConfig: jest.fn()
}))

jest.mock('@/features/user/stores/useUserSettingsStore', () => ({
  useUserSettingsStore: jest.fn()
}))

const renderComponent = (props = {}) => {
  const defaultProps = {
    app: mockLinkData.basic,
    handleLinkClick: jest.fn(),
    clickedLinks: [],
    handleAddToFavorites: jest.fn(),
    selectedEnvironment: 'production',
    onArchiveToggle: jest.fn(),
    isFavourite: false
  }

  return render(<LinkCard {...defaultProps} {...props} />)
}

describe('<LinkCard />', () => {
  beforeEach(() => {
    jest
      .spyOn(environmentHooks, 'useEnvironmentConfig')
      .mockReturnValue(mockEnvironmentConfig)
    jest
      .spyOn(userSettingsStore, 'useUserSettingsStore')
      .mockReturnValue(mockUserSettings)

    jest.clearAllMocks()
  })

  it.skip('should render correctly', () => {
    const { container } = renderComponent()
    expect(container).toMatchSnapshot()
  })

  // it('should display the app name and description', () => {
  //   renderComponent();
  //   expect(screen.getByText('Test App')).toBeInTheDocument();
  //   expect(screen.getByText('Test Description')).toBeInTheDocument();
  // });

  // it('should display the app description', () => {
  //   renderComponent();
  //   expect(screen.getByText('Test Description')).toBeInTheDocument();
  // });

  // it('should handle click events', () => {
  //   const handleLinkClick = jest.fn();
  //   renderComponent({ handleLinkClick });

  //   const link = screen.getByRole('link', { name: 'Test App' });
  //   fireEvent.click(link);

  //   expect(handleLinkClick).toHaveBeenCalledWith('https://test.com');
  // });

  // it('should display tags when provided', () => {
  //   renderComponent();
  //   expect(screen.getByText('test-tag')).toBeInTheDocument();
  // });

  // it('should show archived state when isArchived is true', () => {
  //   renderComponent({ isArchived: true });
  //   expect(screen.getByText('Archived')).toBeInTheDocument();
  // });

  // it('should not show archived state when isArchived is true', () => {
  //   renderComponent();
  //   expect(screen.queryByText('Archived')).not.toBeInTheDocument();
  // });

  // it.skip('should show instructions icon when instructions are provided', async () => {
  //   const user = userEvent.setup();

  //   const appWithInstructions = {
  //     ...mockLinkData.basic,
  //     instructions: 'Test instructions'
  //   };

  //   renderComponent({ app: appWithInstructions });

  //   const moreInformationButton = screen.getByRole('button', { name: /Open (more menu|menu)/i });
  //   await user.click(moreInformationButton);

  //   const moreInformationMenuItem = screen.getByRole('menuitem', { name: 'More Information' });
  //   await user.click(moreInformationMenuItem);
  // });

  // it.skip('should show environment badge where if there is an environment', () => {

  //   renderComponent({ app: mockLinkData.withMultipleEnvironments });

  //   // expect(screen.getByText('Production')).toBeInTheDocument();
  // });
})
