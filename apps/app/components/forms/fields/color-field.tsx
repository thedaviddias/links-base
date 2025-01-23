import { type UseFormReturn } from 'react-hook-form'

import { DEFAULT_COLOR } from '@/constants'
import { type LinksApp } from '@/features/links/types/link.types'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@links-base/ui/form'
import { Input } from '@links-base/ui/input'

interface FieldProps {
  form: UseFormReturn<LinksApp>
}

/**
 * Form field component for selecting link brand color
 */
export const ColorField = ({ form }: FieldProps) => {
  return (
    <FormField
      control={form.control}
      name="color"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Brand Color</FormLabel>
          <div className="flex items-center gap-2">
            <FormControl>
              <Input
                type="color"
                {...field}
                value={field.value || DEFAULT_COLOR}
                className="h-8 w-12 p-1"
                onChange={e => {
                  field.onChange(e.target.value)
                }}
              />
            </FormControl>
            <Input
              {...field}
              value={field.value || DEFAULT_COLOR}
              onChange={e => {
                field.onChange(e.target.value)
              }}
              placeholder="#000000"
              className="font-mono"
            />
          </div>
          <FormDescription className="text-xs">
            Color is automatically extracted from the favicon, but you can
            override it manually.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
