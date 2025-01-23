import { render, screen } from '@testing-library/react'

import LinkForm from '../form'
import LinkFormPage, { generateStaticParams } from '../page'

// Mock the LinkForm component
jest.mock('../form', () => {
  return jest.fn(() => <div data-testid="mock-link-form">Mock Link Form</div>)
})

describe('LinkFormPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render LinkForm component with valid action', () => {
    render(<LinkFormPage params={{ action: 'add' }} />)

    expect(screen.getByTestId('mock-link-form')).toBeInTheDocument()
    expect(LinkForm).toHaveBeenCalledWith(
      { params: { action: 'add' } },
      expect.any(Object)
    )
  })

  it('should render LinkForm component with edit action', () => {
    render(<LinkFormPage params={{ action: 'edit' }} />)

    expect(screen.getByTestId('mock-link-form')).toBeInTheDocument()
    expect(LinkForm).toHaveBeenCalledWith(
      { params: { action: 'edit' } },
      expect.any(Object)
    )
  })

  it('should return null for invalid action', () => {
    const { container } = render(
      <LinkFormPage params={{ action: 'invalid' }} />
    )

    expect(container).toBeEmptyDOMElement()
    expect(LinkForm).not.toHaveBeenCalled()
  })

  describe('generateStaticParams', () => {
    it('should return correct static params for all allowed actions', () => {
      const params = generateStaticParams()

      expect(params).toEqual([{ action: 'add' }, { action: 'edit' }])
    })
  })
})
