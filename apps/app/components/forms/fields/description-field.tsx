'use client'

import { type UseFormReturn } from 'react-hook-form'

import { Loader2, Sparkles } from 'lucide-react'

import { useGenerateDescription } from '@/features/links/hooks/use-generate-description'

import { Button } from '@links-base/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@links-base/ui/form'
import { Textarea } from '@links-base/ui/textarea'

interface DescriptionFieldProps {
  form: UseFormReturn<any>
  maxLength?: number
  showGenerateButton?: boolean
  placeholder?: string
  generateFrom?: {
    fields: string[]
    validate?: (values: any[]) => boolean
  }
}

export const DescriptionField = ({
  form,
  maxLength = 80,
  showGenerateButton = true,
  placeholder = '',
  generateFrom
}: DescriptionFieldProps) => {
  const description = form.watch('description') || ''
  const remainingChars = maxLength - description.length

  const { generateDescription, isGenerating, error } = useGenerateDescription()

  const handleGenerateDescription = async () => {
    if (!generateFrom) return

    const values = generateFrom.fields.map(field => form.watch(field))

    if (generateFrom.validate && !generateFrom.validate(values)) return
    if (!generateFrom.validate && values.every(v => !v)) return

    const generatedDescription = await generateDescription(values)

    if (generatedDescription) {
      form.setValue('description', generatedDescription.slice(0, maxLength))
    }
  }

  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>Description</FormLabel>
            {showGenerateButton && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateDescription}
                disabled={isGenerating || !generateFrom}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Auto-generate
                  </>
                )}
              </Button>
            )}
          </div>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              maxLength={maxLength}
              {...field}
            />
          </FormControl>
          {error && (
            <FormDescription className="text-destructive">
              {error}
            </FormDescription>
          )}
          <FormDescription className="flex justify-end text-xs">
            {remainingChars} characters remaining
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
