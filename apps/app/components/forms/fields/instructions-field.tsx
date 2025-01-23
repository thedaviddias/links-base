import { type UseFormReturn } from 'react-hook-form'

import {
  CreateLink,
  ListsToggle,
  MDXEditor,
  UndoRedo,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  thematicBreakPlugin,
  toolbarPlugin
} from '@mdxeditor/editor'

import { type LinksApp } from '@/features/links/types/link.types'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@links-base/ui/form'

import '@mdxeditor/editor/style.css'

interface FieldProps {
  form: UseFormReturn<LinksApp>
}

/**
 * Form field component for link access instructions with markdown support
 */
export const InstructionsField = ({ form }: FieldProps) => {
  return (
    <FormField
      control={form.control}
      name="instructions"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Access Instructions</FormLabel>
          <FormDescription>
            Provide instructions on how to access this resource. Supports
            markdown formatting.
          </FormDescription>
          <FormControl>
            <MDXEditor
              markdown={field.value || ''}
              onChange={field.onChange}
              plugins={[
                listsPlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                toolbarPlugin({
                  toolbarContents: () => (
                    <>
                      <UndoRedo />
                      <CreateLink />
                      <ListsToggle />
                    </>
                  )
                })
              ]}
              contentEditableClassName="min-h-[200px] p-3 prose prose-sm max-w-none"
              className="w-full rounded-md border bg-background"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
