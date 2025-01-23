export type ImportResult = {
  success: {
    added: Array<{ name: string; url: string }>
    updated: Array<{ name: string; url: string }>
  }
  failed: Array<{
    name: string
    url: string
    reason: 'duplicate' | 'invalid' | 'error'
  }>
  categories: {
    new: string[]
    existing: string[]
  }
}
