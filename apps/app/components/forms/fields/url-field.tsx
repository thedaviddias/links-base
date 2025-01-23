'use client'

import { useEffect, useRef, useState } from 'react'
import { type UseFormReturn } from 'react-hook-form'

import Image from 'next/image'

import { ImageOff } from 'lucide-react'

import { extractColorFromImageUrl } from '@/utils/image'
import { debouncedValidateUrl } from '@/utils/url'

import { DEFAULT_COLOR } from '@/constants'
import { getFaviconUrl } from '@/features/links/utils/favicon'
import { type InferSettingsSchema } from '@/features/settings/schemas/settings.schema'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@links-base/ui/form'
import { Input } from '@links-base/ui/input'

interface UrlFieldProps {
  form: UseFormReturn<any>
  showMultipleEnvs?: boolean
  initialValues?: any
  settings?: InferSettingsSchema
  showIcon?: boolean
  mode?: 'add' | 'edit' | 'request'
  onUrlChange?: (url: string) => void
}

export const UrlField = ({
  form,
  showMultipleEnvs = false,
  initialValues,
  settings,
  showIcon = true,
  mode = 'add',
  onUrlChange
}: UrlFieldProps) => {
  const [imgError, setImgError] = useState(false)
  const [isValidUrl, setIsValidUrl] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const previousValidUrl = useRef<string | null>(null)

  const urlFieldPath = mode === 'request' ? 'url' : 'environments.production'
  const productionUrl = form.watch(urlFieldPath)

  const getUrlLabel = () => {
    if (mode === 'request') return 'URL'
    if (!settings?.environments.configuration.enabled.length) return 'URL'
    if (
      settings.environments.configuration.enabled.length === 1 &&
      settings.environments.configuration.enabled[0] === 'production'
    )
      return 'URL'
    return settings.environments.display.labels.production
  }

  const handleImageLoad = async (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!isValidUrl || isValidating) return

    try {
      const initialUrl = initialValues?.environments?.production
      const currentUrl = form.getValues('environments.production')

      if (initialUrl && initialUrl === currentUrl) {
        return
      }

      const color = await extractColorFromImageUrl(
        e.currentTarget.src,
        settings?.services?.imageProxy
      )

      if (color) {
        form.setValue('color', color)
      }
    } catch (error) {
      console.error('Error in color extraction:', error)
    }
  }

  useEffect(() => {
    const validateUrl = async () => {
      if (!productionUrl) {
        setIsValidUrl(false)
        setImgError(false)
        return
      }

      const hasValidDomain =
        /^https?:\/\/[^.]+\.[a-zA-Z]{2,}(?:[/?#][^.]*)?$/.test(productionUrl)

      if (!hasValidDomain) {
        setIsValidUrl(false)
        setImgError(false)
        return
      }

      setIsValidating(true)
      try {
        const isValid = await debouncedValidateUrl(productionUrl)
        setIsValidUrl(isValid)
        if (!isValid) {
          setImgError(false)
        }
        if (
          isValid &&
          onUrlChange &&
          productionUrl !== previousValidUrl.current
        ) {
          previousValidUrl.current = productionUrl
          onUrlChange(productionUrl)
        }
      } catch (error) {
        console.error('URL validation error:', error)
        setIsValidUrl(false)
      } finally {
        setIsValidating(false)
      }
    }

    void validateUrl()
  }, [productionUrl, onUrlChange])

  return (
    <FormField
      control={form.control}
      name={urlFieldPath}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{getUrlLabel()}</FormLabel>
          <FormControl>
            <div className="flex items-center gap-2">
              {showIcon && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
                  {isValidUrl && !isValidating ? (
                    imgError ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-muted">
                        <ImageOff className="text-muted-foreground" size={16} />
                      </div>
                    ) : (
                      <Image
                        alt="Favicon"
                        className="rounded-sm"
                        height={30}
                        width={30}
                        src={getFaviconUrl(productionUrl)}
                        onError={() => setImgError(true)}
                        onLoad={handleImageLoad}
                        style={{
                          aspectRatio: '30/30',
                          objectFit: 'cover'
                        }}
                      />
                    )
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-muted">
                      <ImageOff className="text-muted-foreground" size={16} />
                    </div>
                  )}
                </div>
              )}
              <Input
                placeholder={
                  showMultipleEnvs
                    ? 'https://prod.example.com'
                    : 'https://example.com'
                }
                {...field}
                onChange={e => {
                  field.onChange(e)
                  if (!e.target.value && showIcon) {
                    if (!initialValues?.color) {
                      form.setValue('color', DEFAULT_COLOR)
                    } else {
                      form.setValue('color', initialValues.color)
                    }
                    setImgError(false)
                  }
                  onUrlChange?.(e.target.value)
                }}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
