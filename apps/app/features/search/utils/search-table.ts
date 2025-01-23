type SearchableObject = Record<string, any>

export function searchTable<T extends SearchableObject>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] {
  const normalizedTerm = searchTerm.toLowerCase().trim()

  if (!normalizedTerm) return items

  return items.filter(item =>
    searchFields.some(field => {
      const value = item[field]
      return String(value).toLowerCase().includes(normalizedTerm)
    })
  )
}
