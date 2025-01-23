import Image from 'next/image'

import { type LinksApp } from '@/features/links/types/link.types'

import { getFaviconUrl } from '../features/links/utils/favicon'

export const ImageError = ({ app }: { app: LinksApp }) => {
  // const [imgError, setImgError] = useState(false);

  return (
    // <>{imgError ? (
    //   <div className="bg-gray-200 rounded h-8 w-8 flex items-center justify-center">
    //     <ImageOff className="text-slate-500" size={23} />
    //   </div>
    // ) : (
    <Image
      alt="Favicon"
      className="rounded"
      height="32"
      src={getFaviconUrl(app.environments?.production || '')}
      style={{
        aspectRatio: '32/32',
        objectFit: 'cover'
      }}
      width="32"
    />
    // )}</>
  )
}
