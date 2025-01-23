'use client'

import { type UseFormReturn } from 'react-hook-form'

import { useTags } from '@/features/links/hooks/tags/use-tags'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@links-base/ui/form'
import {
  MultiSelect,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger
} from '@links-base/ui/multi-select'

interface TagsFieldProps {
  form: UseFormReturn<any>
}

export const TagsField = ({ form }: TagsFieldProps) => {
  const { tags } = useTags()

  return (
    <FormField
      control={form.control}
      name="tags"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <FormDescription>Select up to 3 tags for this link.</FormDescription>
          <FormControl>
            <MultiSelect
              onValuesChange={values => {
                field.onChange(values.slice(0, 3))
              }}
              values={field.value}
            >
              <MultiSelectorTrigger>
                <MultiSelectorInput
                  placeholder={
                    field.value.length >= 3
                      ? 'Maximum tags reached'
                      : 'Select your tags'
                  }
                  disabled={field.value.length >= 3}
                />
              </MultiSelectorTrigger>
              <MultiSelectorContent>
                <MultiSelectorList>
                  {tags.map(tag => (
                    <MultiSelectorItem
                      key={tag.name}
                      value={tag.name}
                      disabled={
                        field.value.length >= 3 &&
                        !field.value.includes(tag.name)
                      }
                    >
                      {tag.name}
                    </MultiSelectorItem>
                  ))}
                </MultiSelectorList>
              </MultiSelectorContent>
            </MultiSelect>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
