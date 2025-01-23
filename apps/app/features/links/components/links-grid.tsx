'use client'

import { motion } from 'motion/react'

import { LINKS_GRID_CLASSES } from '@/constants'
import { type LinksApp } from '@/features/links/types/link.types'

import { LinkCard } from './link-card'

export interface LinksGridProps {
  links: LinksApp[]
  handleLinkClick: (link: LinksApp) => void
  clickedLinks: string[]
  handleAddToFavorites: (link: LinksApp) => void
  isFavourite: (name: string) => boolean
  isArchived: (name: string) => boolean
  onArchiveToggle: (name: string) => void
  withAnimation?: boolean
  showManageOptions?: boolean
}

export function LinksGrid({
  links,
  handleLinkClick,
  clickedLinks,
  handleAddToFavorites,
  isFavourite,
  isArchived,
  onArchiveToggle,
  withAnimation = true,
  showManageOptions = true
}: LinksGridProps) {
  return (
    <div className="@container">
      <ul className={LINKS_GRID_CLASSES}>
        {links.map((link, index) => {
          const LinkWrapper = withAnimation ? motion.li : 'li'
          const motionProps = withAnimation
            ? {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -20 },
                transition: { delay: index * 0.1 },
                className: 'h-full'
              }
            : { className: 'h-full' }

          return (
            <LinkWrapper key={link.name} {...motionProps}>
              <LinkCard
                className="h-full"
                app={link}
                handleLinkClick={() => handleLinkClick(link)}
                clickedLinks={clickedLinks}
                handleAddToFavorites={() => handleAddToFavorites(link)}
                isFavourite={isFavourite(link.name)}
                isArchived={isArchived(link.name)}
                onArchiveToggle={() => onArchiveToggle(link.name)}
                showManageOptions={showManageOptions}
              />
            </LinkWrapper>
          )
        })}
      </ul>
    </div>
  )
}
