import { cookies } from 'next/headers'

export const checkInitialSetup = () => {
  try {
    // Only check if setup has been completed via cookie
    const cookieStore = cookies()
    const setupComplete = cookieStore.get('setup-complete')

    return setupComplete?.value === 'true'
  } catch (error) {
    console.error('Error checking initial setup:', error)
    return false
  }
}
