'use client'

import { type UseFormReturn } from 'react-hook-form'

import { useCategories } from '@/features/category/hooks/use-categories'

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

interface CategoryFieldProps {
  form: UseFormReturn<any>
  mode?: 'add' | 'edit' | 'request'
}

export const CategoryField = ({ form, mode = 'add' }: CategoryFieldProps) => {
  const { categories } = useCategories()

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category {mode === 'request' && '(Optional)'}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {mode === 'request' && <SelectItem value="none">None</SelectItem>}
              {categories?.map(category => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
              {mode === 'request' && (
                <SelectItem value="other">
                  Other (Suggest new category)
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
