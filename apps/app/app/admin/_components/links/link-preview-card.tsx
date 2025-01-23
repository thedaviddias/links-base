import { LinkDetails } from '@/features/links/components/link-details'
import { type LinksApp } from '@/features/links/types/link.types'

type LinkPreviewCardProps = {
  link: LinksApp
}

/**
 * Displays a preview card with detailed information about a link
 */
export const LinkPreviewCard = ({ link }: LinkPreviewCardProps) => {
  return <LinkDetails link={link} variant="preview" />
}
