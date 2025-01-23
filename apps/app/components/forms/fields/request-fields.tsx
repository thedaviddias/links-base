'use client'

import { type UseFormReturn } from 'react-hook-form'

import { type GetAvailableRequestMethods } from '@/features/request-link/constants/request-methods'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@links-base/ui/form'
import { Input } from '@links-base/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@links-base/ui/select'

interface RequestMethodFieldProps {
  form: UseFormReturn<any>
  availableMethods: ReturnType<GetAvailableRequestMethods>
}

export const RequestMethodField = ({
  form,
  availableMethods
}: RequestMethodFieldProps) => (
  <FormField
    control={form.control}
    name="method"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Request Method</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {availableMethods.map(
              method =>
                method && (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                )
            )}
          </SelectContent>
        </Select>
        <FormDescription>
          Choose how you want to submit your request
        </FormDescription>
      </FormItem>
    )}
  />
)

export const RequesterNameField = ({ form }: { form: UseFormReturn<any> }) => (
  <FormField
    control={form.control}
    name="requesterName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Your Name</FormLabel>
        <FormControl>
          <Input placeholder="Enter your name" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)

export const RequesterEmailField = ({ form }: { form: UseFormReturn<any> }) => (
  <FormField
    control={form.control}
    name="requesterEmail"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Your Email</FormLabel>
        <FormControl>
          <Input type="email" placeholder="Enter your email" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)

export const SuggestedCategoryField = ({
  form
}: { form: UseFormReturn<any> }) => (
  <FormField
    control={form.control}
    name="suggestedCategory"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Suggest New Category</FormLabel>
        <FormControl>
          <Input placeholder="Enter your category suggestion" {...field} />
        </FormControl>
        <FormDescription>Suggest a new category for your link</FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
)
