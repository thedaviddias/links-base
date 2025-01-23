'use client'

import { useEffect, useState } from 'react'

import { type LinksApp } from '@/features/links/types/link.types'
import { deleteLink, getLinks } from '@/features/links/utils/manage-links'

export function LinksList() {
  const [links, setLinks] = useState<LinksApp[]>([])

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const fetchedLinks = await getLinks()
        setLinks(fetchedLinks)
      } catch (error) {
        console.error('Failed to fetch links:', error)
        setLinks([])
      }
    }

    void fetchLinks()
  }, [])

  const handleDelete = async (name: string) => {
    await deleteLink(name)
    setLinks(links.filter(link => link.name !== name))
  }

  return (
    <div>
      <h2>All Links</h2>
      <ul>
        {links.map(link => (
          <li key={link.name}>
            {link.name} - {link.environments?.production}
            <button onClick={() => handleDelete(link.name)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
