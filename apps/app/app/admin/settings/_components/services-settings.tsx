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
import { Switch } from '@links-base/ui/switch'

interface ServicesSettingsProps {
  form: UseFormReturn<Settings>
}

export const ServicesSettings = ({ form }: ServicesSettingsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Services Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure external services and integrations
        </p>
      </div>

      <div className="space-y-8">
        <FormField
          control={form.control}
          name="services.imageProxy.enabled"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Enable Image Proxy</FormLabel>
              <FormDescription>
                Use proxy services for loading favicons securely
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
          name="services.imageProxy.primary"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Primary Proxy Service</FormLabel>
              <FormDescription>
                The main proxy service URL for loading favicons
              </FormDescription>
              <FormControl>
                <Input {...field} className="max-w-md" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="services.imageProxy.fallback"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">
                Fallback Proxy Service
              </FormLabel>
              <FormDescription>
                Backup proxy service URL used when the primary service fails
              </FormDescription>
              <FormControl>
                <Input {...field} className="max-w-md" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
