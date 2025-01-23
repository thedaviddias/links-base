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
import { Switch } from '@links-base/ui/switch'

interface HelpSettingsProps {
  form: UseFormReturn<Settings>
}

export const HelpSettings = ({ form }: HelpSettingsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Help Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure help documentation and support resources
        </p>
      </div>

      <div className="space-y-8">
        <FormField
          control={form.control}
          name="help.links.enabled"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">
                Enable Help Documentation
              </FormLabel>
              <FormDescription>
                Show help documentation links in the application
              </FormDescription>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="help.featureRequests.enabled"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">
                Enable Feature Requests
              </FormLabel>
              <FormDescription>
                Allow users to submit feature requests
              </FormDescription>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
