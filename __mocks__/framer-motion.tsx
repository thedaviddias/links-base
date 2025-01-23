import React from 'react'

const createMockComponent = (name: string) => {
  const Component = React.forwardRef(
    ({ children, ...props }: any, ref: any) => {
      return React.createElement(
        name as keyof JSX.IntrinsicElements,
        { ...props, ref },
        children
      )
    }
  )
  Component.displayName = `Motion${name.charAt(0).toUpperCase()}${name.slice(1)}`
  return Component
}

export const motion = {
  div: createMockComponent('div'),
  button: createMockComponent('button'),
  li: createMockComponent('li'),
  ul: createMockComponent('ul'),
  svg: createMockComponent('svg'),
  path: createMockComponent('path'),
  g: createMockComponent('g'),
  span: createMockComponent('span')
}

export const AnimatePresence = ({
  children
}: { children: React.ReactNode }) => <>{children}</>
