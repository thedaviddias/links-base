import { userEvent } from '@testing-library/user-event'
import { axe } from 'jest-axe'

import { render, screen, waitFor } from '@/utils/test-utils'

import { useSettings } from '@/features/settings/hooks/use-settings'
import { useTemplate } from '@/features/setup/hooks/use-template'
import { useSetupStore } from '@/features/setup/stores/setupStore'
import { SETUP_STEPS } from '@/features/setup/types/types'

import { SetupWizard } from '../setup-wizard'

// Mock all required hooks
jest.mock('@/features/settings/hooks/use-settings')
jest.mock('@/features/setup/hooks/use-template')
jest.mock('@/features/setup/stores/setupStore')

const mockRouter = { push: jest.fn(), refresh: jest.fn() }

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/setup',
  useSearchParams: () => new URLSearchParams()
}))

// Common mock functions
const mockUpdateSettings = jest.fn().mockResolvedValue(true)
const mockApplyTemplateChoice = jest.fn().mockResolvedValue(true)
const mockSetStep = jest.fn()
const mockMarkComplete = jest.fn()

const setupMocks = (
  options: {
    currentStep?: number
    isComplete?: boolean
    useDefaultSettings?: boolean
  } = {}
) => {
  const {
    currentStep = 0,
    isComplete = false,
    useDefaultSettings = false
  } = options

  jest.clearAllMocks()

  // Mock useSettings
  ;(useSettings as jest.Mock).mockReturnValue({
    settings: {},
    updateSettings: mockUpdateSettings,
    isLoading: false
  })

  // Mock useTemplate
  ;(useTemplate as jest.Mock).mockReturnValue({
    applyTemplateChoice: mockApplyTemplateChoice
  })

  let step = currentStep
  let isDefaultSettings = useDefaultSettings

  const createStoreImplementation = (
    currentStep: number,
    defaultSettings: boolean
  ) => ({
    currentStep,
    setStep: (newStep: number) => {
      step = newStep
      ;(useSetupStore as jest.Mock).mockImplementation(() =>
        createStoreImplementation(step, isDefaultSettings)
      )
    },
    markComplete: mockMarkComplete,
    isComplete,
    useDefaultSettings: isDefaultSettings,
    setUseDefaultSettings: (value: boolean) => {
      isDefaultSettings = value
      ;(useSetupStore as jest.Mock).mockImplementation(() =>
        createStoreImplementation(step, isDefaultSettings)
      )
    },
    setShouldUseTemplate: jest.fn(),
    setTemplateChoice: jest.fn()
  })

  // Mock useSetupStore
  ;(useSetupStore as jest.Mock).mockImplementation(() =>
    createStoreImplementation(step, isDefaultSettings)
  )
}

const renderComponent = () => {
  return render(<SetupWizard />)
}

// Helper function for template setup flow
const completeTemplateSetup = async (
  user: ReturnType<typeof userEvent.setup>,
  useTemplate: boolean
) => {
  const defaultSettingsButton = screen.getByText('Use default settings')
  await user.click(defaultSettingsButton)

  const templateCard = await screen.findByText('Initial Data Setup')
  expect(templateCard).toBeInTheDocument()

  const radioOption = screen.getByLabelText(
    useTemplate ? 'Use Template Data' : 'Start Fresh'
  )
  await user.click(radioOption)

  const completeButton = screen.getByRole('button', { name: /complete setup/i })
  await user.click(completeButton)
}

describe('SetupWizard', () => {
  beforeEach(() => {
    setupMocks()
  })

  it('setup wizard should render correctly', () => {
    renderComponent()

    expect(screen.getByText('Setup Wizard')).toBeInTheDocument()
    expect(screen.getByText(SETUP_STEPS[0].description)).toBeInTheDocument()
  })

  it('setup wizardshould be accessible', async () => {
    const { container } = renderComponent()
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe('Use default settings', () => {
  beforeEach(() => {
    setupMocks()
  })

  it('should allow submitting default settings with template data', async () => {
    const user = userEvent.setup()

    renderComponent()

    await completeTemplateSetup(user, true)

    expect(mockApplyTemplateChoice).toHaveBeenCalledWith(true)
    expect(mockUpdateSettings).toHaveBeenCalled()
  })

  it('should allow submitting default settings without template data', async () => {
    const user = userEvent.setup()

    renderComponent()

    await completeTemplateSetup(user, false)
    expect(mockApplyTemplateChoice).toHaveBeenCalledWith(false)
    expect(mockUpdateSettings).toHaveBeenCalled()
  })
})

describe('Configure step by step', () => {
  it.skip('should navigate through all steps and submit successfully', async () => {
    const user = userEvent.setup()
    setupMocks()
    renderComponent()

    // Click "Configure step by step"
    const configureButton = screen.getByText('Configure step by step')
    await user.click(configureButton)

    // Assuming the step update might be asynchronous, wait for the function to be called
    await waitFor(() => expect(mockSetStep).toHaveBeenCalledWith(1))

    // Retrieve the currentStep from the mocked useSetupStore
    const { currentStep } = useSetupStore()

    // Now, verify the step indicator text based on the updated step
    const expectedStepText = `Step ${currentStep + 1} of ${SETUP_STEPS.length}`
    const stepIndicator = await screen.findByText(expectedStepText)
    expect(stepIndicator).toBeInTheDocument()
  })

  it.skip('should prevent navigation if basic settings are invalid', async () => {
    const user = userEvent.setup()
    setupMocks({ currentStep: 1 })
    renderComponent()

    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton)

    expect(mockSetStep).not.toHaveBeenCalled()
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/description is required/i)).toBeInTheDocument()
  })

  it.skip('should allow going back to previous steps', async () => {
    const user = userEvent.setup()
    setupMocks({ currentStep: 2 })
    renderComponent()

    const backButton = screen.getByRole('button', { name: /back/i })
    await user.click(backButton)

    expect(mockSetStep).toHaveBeenCalledWith(1)
  })
})
