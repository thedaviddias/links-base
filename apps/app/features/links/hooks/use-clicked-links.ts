import { useLocalStorage } from 'usehooks-ts'

import { type LinksApp } from '../types/link.types'

interface UseClickedLinksReturn {
  clickedLinks: string[]
  handleLinkClick: (link: LinksApp) => void
}

/** Hook to manage clicked links state */
export const useClickedLinks = (): UseClickedLinksReturn => {
  const [clickedLinks, setClickedLinks] = useLocalStorage<string[]>(
    'clickedLinks',
    []
  )

  const handleLinkClick = (link: LinksApp) => {
    setClickedLinks(prevClickedLinks => {
      if (!prevClickedLinks.includes(link.name)) {
        return [...prevClickedLinks, link.name]
      }
      return prevClickedLinks
    })
  }

  return {
    clickedLinks,
    handleLinkClick
  }
}
