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

interface RequestsSettingsProps {
  form: UseFormReturn<Settings>
}

export const RequestsSettings = ({ form }: RequestsSettingsProps) => {
  const isEmailEnabled = form.watch('requests.email.enabled')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Request Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure how users can request new links
        </p>
      </div>

      <div className="space-y-8">
        <FormField
          control={form.control}
          name="requests.email.enabled"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base">Email Notifications</FormLabel>
              <FormDescription>
                Send email notifications when new link requests are submitted
              </FormDescription>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {isEmailEnabled && (
          <>
            <FormField
              control={form.control}
              name="requests.email.address"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base">
                    Notification Email
                  </FormLabel>
                  <FormDescription>
                    Email address where link request notifications will be sent
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      className="max-w-md"
                      disabled={!isEmailEnabled}
                      required={isEmailEnabled}
                    />
                  </FormControl>
                  {field.value && <FormMessage />}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requests.email.subject"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base">Email Subject</FormLabel>
                  <FormDescription>
                    Subject line for link request notification emails
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      className="max-w-md"
                      disabled={!isEmailEnabled}
                      required={isEmailEnabled}
                    />
                  </FormControl>
                  {field.value && <FormMessage />}
                </FormItem>
              )}
            />
          </>
        )}
      </div>
    </div>
  )
}
