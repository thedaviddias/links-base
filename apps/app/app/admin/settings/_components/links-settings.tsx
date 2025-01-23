'use client'

import { type UseFormReturn } from 'react-hook-form'

import { Wheel } from '@uiw/react-color'

import { type Settings } from '@/features/settings/types/settings.types'

import { Button } from '@links-base/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@links-base/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@links-base/ui/popover'

interface LinksSettingsProps {
  form: UseFormReturn<Settings>
}

export const LinksSettings = ({ form }: LinksSettingsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Links Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure how links are displayed and managed
        </p>
      </div>

      <div className="space-y-8">
        <FormField
          control={form.control}
          name="links.appearance.defaultBrandColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Default Brand Color</FormLabel>
              <FormDescription>
                The default color used for new links
              </FormDescription>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[200px] justify-start"
                    >
                      <div
                        className="mr-2 h-4 w-4 rounded"
                        style={{ backgroundColor: field.value }}
                      />
                      {field.value}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Wheel
                      color={field.value}
                      onChange={color => field.onChange(color.hex)}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
