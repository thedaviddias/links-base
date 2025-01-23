'use client'

import { useEffect } from 'react'

import { Button } from '@links-base/ui/button'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <main className="container relative mx-auto flex flex-col items-center justify-center px-4">
      <div className="mx-auto flex h-screen flex-col items-center justify-center">
        <div className="flex h-full flex-col items-center justify-center">
          <span className="not-found rounded-md px-3.5 py-1 text-sm font-medium dark:text-neutral-50">
            Error
          </span>
          <h1 className="mt-5 text-3xl font-bold dark:text-neutral-50 md:text-5xl">
            Something went wrong!
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-center text-base font-medium text-neutral-400">
            An unexpected error occurred. Please try again later.
          </p>
          <Button onClick={reset} className="mt-8">
            Try again
          </Button>
        </div>
      </div>
    </main>
  )
}
