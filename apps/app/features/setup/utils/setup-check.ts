const SETUP_CHECK_KEY = 'setup_completed'
const SETUP_CHECK_EXPIRY = 1000 * 60 * 60 * 24 // 24 hours

/**
 * Checks if all required data files exist and are not empty
 */
export const checkRequiredFiles = async () => {
  // Check localStorage first
  const cached = localStorage.getItem(SETUP_CHECK_KEY)
  if (cached) {
    const { value, timestamp } = JSON.parse(cached)
    const isValid = Date.now() - timestamp < SETUP_CHECK_EXPIRY
    if (isValid) return value
  }

  try {
    const response = await fetch('/api/json')
    const data = await response.json()

    // Cache the result
    localStorage.setItem(
      SETUP_CHECK_KEY,
      JSON.stringify({
        value: data.hasRequiredFiles,
        timestamp: Date.now()
      })
    )

    return data.hasRequiredFiles
  } catch (error) {
    return false
  }
}
