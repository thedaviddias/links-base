'use client'

import { memo } from 'react'
import { type UseFormReturn } from 'react-hook-form'

import { Loader2 } from 'lucide-react'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@links-base/ui/form'
import { Input } from '@links-base/ui/input'

interface NameFieldProps {
  form: UseFormReturn<any>
  autoPopulated?: boolean
  isLoading?: boolean
}

/** Form field for link name */
const NameFieldComponent = ({
  form,
  autoPopulated,
  isLoading
}: NameFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>Link Name</FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                placeholder="Link Name"
                autoComplete="off"
                className={autoPopulated || isLoading ? 'pr-8' : ''}
                disabled={isLoading}
                {...field}
              />
            </FormControl>
          </div>
          <FormDescription className="text-xs">
            {isLoading
              ? 'Fetching page title...'
              : 'Name will auto-populate from the URL'}
          </FormDescription>
          {isLoading && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

NameFieldComponent.displayName = 'NameField'

export const NameField = memo(NameFieldComponent)
