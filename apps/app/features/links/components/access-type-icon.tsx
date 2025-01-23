import Image from 'next/image'

import { Lock } from 'lucide-react'

import { type AccessType } from '../constants/access-types'
import { getAccessTypeIconUrl } from '../utils/access-icons'

interface AccessTypeIconProps {
  type: AccessType
  size?: number
  className?: string
}

export const AccessTypeIcon = ({
  type,
  size = 16,
  className
}: AccessTypeIconProps) => {
  return (
    <div className="relative">
      <Image
        src={getAccessTypeIconUrl(type)}
        alt={`${type} authentication`}
        width={size}
        height={size}
        className={className}
      />
      <Lock
        className={`fallback absolute left-0 top-0 hidden ${className}`}
        size={size}
      />
    </div>
  )
}
