/**
 * Generates a favicon URL for a given domain using Google's favicon service
 */
export const getFaviconUrl = (url: string): string => {
  return `https://www.google.com/s2/favicons?sz=32&domain_url=${encodeURIComponent(url)}`
}
