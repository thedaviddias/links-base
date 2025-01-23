import { useEffect } from 'react'

export function useKeyboardShortcuts(callback: (index: number) => void) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Only check for Alt/Option + number
      if (event.altKey && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
        const num = parseInt(event.key)
        if (!isNaN(num) && num >= 1 && num <= 9) {
          event.preventDefault() // Prevent any default browser behavior
          callback(num - 1) // Convert to 0-based index
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [callback])
}
