'use client'

import { type UseFormReturn } from 'react-hook-form'

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { Wheel } from '@uiw/react-color'
import { GripVertical } from 'lucide-react'

import { type Environment } from '@/features/environment/types/environment.types'
import { type Settings } from '@/features/settings/types/settings.types'

import { Button } from '@links-base/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@links-base/ui/form'
import { Input } from '@links-base/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@links-base/ui/popover'
import { Switch } from '@links-base/ui/switch'

interface EnvironmentSettingsProps {
  form: UseFormReturn<Settings>
  environmentOrder: Environment[]
  onDragEnd: (result: any) => void
}

export const EnvironmentSettings = ({
  form,
  environmentOrder,
  onDragEnd
}: EnvironmentSettingsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Environment Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure and manage different deployment environments
        </p>
      </div>

      <div className="space-y-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="environments">
            {provided => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {environmentOrder.map((env, index) => (
                  <Draggable key={env} draggableId={env} index={index}>
                    {provided => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="mb-4 space-y-4 rounded-lg bg-card p-4"
                      >
                        <div className="flex items-center gap-2">
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <h3 className="font-medium">{env}</h3>
                        </div>

                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name={`environments.display.labels.${env}` as const}
                            render={({ field }) => (
                              <FormItem className="flex flex-col items-start md:grid md:grid-cols-12 md:gap-8">
                                <div className="mb-4 flex flex-col space-y-1.5 md:col-span-4 md:mb-0">
                                  <FormLabel>Display Label</FormLabel>
                                  <FormDescription>
                                    The label shown for this environment in the
                                    UI
                                  </FormDescription>
                                </div>
                                <div className="w-full md:col-span-8">
                                  <FormControl>
                                    <Input {...field} className="max-w-md" />
                                  </FormControl>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`environments.display.colors.${env}` as const}
                            render={({ field }) => (
                              <FormItem className="flex flex-col items-start md:grid md:grid-cols-12 md:gap-8">
                                <div className="mb-4 flex flex-col space-y-1.5 md:col-span-4 md:mb-0">
                                  <FormLabel>Environment Color</FormLabel>
                                  <FormDescription>
                                    The color used to identify this environment
                                  </FormDescription>
                                </div>
                                <div className="w-full md:col-span-8">
                                  <FormControl>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          className="w-[200px] justify-start"
                                        >
                                          <div
                                            className="mr-2 h-4 w-4 rounded"
                                            style={{
                                              backgroundColor:
                                                field.value as string
                                            }}
                                          />
                                          {field.value as string}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                      >
                                        <Wheel
                                          color={field.value as string}
                                          onChange={color =>
                                            field.onChange(color.hex)
                                          }
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </FormControl>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="environments.configuration.enabled"
                            render={({ field }) => (
                              <FormItem className="flex flex-col items-center md:grid md:grid-cols-12 md:gap-8">
                                <div className="mb-4 flex flex-col space-y-1.5 md:col-span-4 md:mb-0">
                                  <FormLabel>Environment Status</FormLabel>
                                  <FormDescription>
                                    Enable or disable this environment
                                  </FormDescription>
                                </div>
                                <div className="w-full md:col-span-8">
                                  <FormControl>
                                    <Switch
                                      checked={field.value.includes(env)}
                                      onCheckedChange={checked => {
                                        const newValue = checked
                                          ? [...field.value, env]
                                          : field.value.filter(e => e !== env)
                                        field.onChange(newValue)
                                      }}
                                      disabled={env === 'production'}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}
