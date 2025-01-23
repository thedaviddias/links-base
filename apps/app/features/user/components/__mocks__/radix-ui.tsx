import React from 'react'

// Mock Radix UI's RadioGroup components
jest.mock('@radix-ui/react-radio-group', () => ({
  Root: ({ children, onValueChange, value }: any) => (
    <div
      data-testid="radio-group"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onValueChange?.(e.target.value)
      }
      data-value={value}
    >
      {children}
    </div>
  ),
  Item: ({ value, id }: any) => (
    <input
      type="radio"
      data-testid="radio-item"
      value={value}
      id={id}
      onChange={jest.fn()}
    />
  )
}))

// Mock Radix UI's Tooltip components
jest.mock('@radix-ui/react-tooltip', () => ({
  Root: ({ children }: any) => <div data-testid="tooltip-root">{children}</div>,
  Trigger: ({ children }: any) => (
    <div data-testid="tooltip-trigger">{children}</div>
  ),
  Content: ({ children }: any) => (
    <div data-testid="tooltip-content">{children}</div>
  ),
  Provider: ({ children }: any) => (
    <div data-testid="tooltip-provider">{children}</div>
  )
}))
