import { useState } from 'react'

export const useGenerateDescription = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateDescription = async (values: string[]): Promise<string> => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/anthropic/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: values[0],
          name: values[1]
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate description')
      }

      const data = await response.text()
      return data
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate description'
      )
      return ''
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    generateDescription,
    isGenerating,
    error
  }
}
