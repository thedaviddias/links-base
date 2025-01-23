'use client'

import { AnimatePresence } from 'motion/react'

import { type LinksApp } from '@/features/links/types/link.types'

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal
} from '@links-base/ui/dialog'

import { LinkDetails } from './link-details'

interface LinkDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  link: LinksApp
}

export const LinkDetailsModal = ({
  isOpen,
  onClose,
  link
}: LinkDetailsModalProps) => {
  if (!link?.instructions && !link?.environments && !link?.description)
    return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogPortal forceMount>
            <DialogOverlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-gray-900/50" />
            <DialogContent>
              <LinkDetails link={link} variant="modal" />
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
