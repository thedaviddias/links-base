import { type UseFormReturn } from 'react-hook-form'

import { ACCESS_TYPES } from '@/features/links/constants/access-types'
import { type LinksApp } from '@/features/links/types/link.types'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@links-base/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@links-base/ui/select'

interface FieldProps {
  form: UseFormReturn<LinksApp>
}

/**
 * Form field component for selecting link access type
 */
export const AccessTypeField = ({ form }: FieldProps) => {
  return (
    <FormField
      control={form.control}
      name="accessType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Access Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select access type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {ACCESS_TYPES.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
