import { type LinksApp } from '@/features/links/types/link.types'

/**
 * Reorders elements in a list by moving the element at startIndex to endIndex.
 *
 * @param {any[]} list - The list of elements.
 * @param {number} startIndex - The index of the element to move.
 * @param {number} endIndex - The index where the element should be moved to.
 * @returns {any[]} A new list with the element reordered.
 *
 * @example
 * const list = ['a', 'b', 'c', 'd', 'e'];
 * const result = reorder(list, 2, 4);
 * console.log(result); // ['a', 'b', 'd', 'e', 'c']
 */
export const reorder = (
  list: LinksApp[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list)

  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}
