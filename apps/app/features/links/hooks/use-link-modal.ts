import { useState } from 'react'

import { type LinksApp } from '../types/link.types'

interface UseLinkModalReturn {
  selectedLink: LinksApp | null
  handleOpenModal: (link: LinksApp) => void
  handleCloseModal: () => void
}

/** Hook to manage link modal state */
export const useLinkModal = (): UseLinkModalReturn => {
  const [selectedLink, setSelectedLink] = useState<LinksApp | null>(null)

  const handleOpenModal = (link: LinksApp) => {
    setSelectedLink(link)
  }

  const handleCloseModal = () => {
    setSelectedLink(null)
  }

  return {
    selectedLink,
    handleOpenModal,
    handleCloseModal
  }
}
