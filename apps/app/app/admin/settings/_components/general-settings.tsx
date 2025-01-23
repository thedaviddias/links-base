'use client'

import { type UseFormReturn } from 'react-hook-form'

import { type Settings } from '@/features/settings/types/settings.types'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@links-base/ui/form'
import { Input } from '@links-base/ui/input'

interface GeneralSettingsProps {
  form: UseFormReturn<Settings>
  hideBannerField?: boolean
}

export const GeneralSettings = ({
  form,
  hideBannerField
}: GeneralSettingsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">General Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your application&apos;s general settings
        </p>
      </div>

      <div className="space-y-8">
        <FormField
          control={form.control}
          name="general.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Application Name</FormLabel>
              <FormDescription>
                The name of your application as it appears throughout the
                interface. This will be used in the header, footer, and other
                places.
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  className="max-w-md"
                  placeholder="eg: Links Base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!hideBannerField && (
          <FormField
            control={form.control}
            name="general.bannerText"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Banner Text</FormLabel>
                <FormDescription>
                  Optional text to display in a banner at the top of the
                  application
                </FormDescription>
                <FormControl>
                  <Input {...field} className="max-w-md" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  )
}
