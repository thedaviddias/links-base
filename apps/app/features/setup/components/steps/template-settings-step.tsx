import { useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@links-base/ui/card'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel
} from '@links-base/ui/form'
import { RadioGroup, RadioGroupItem } from '@links-base/ui/radio-group'

import { type StepProps } from '../../types/types'

interface TemplateSettingsStepProps extends StepProps {
  onChoiceSelect: (useTemplate: boolean) => void
  onStepChange: (step: number) => void
  useDefaultSettings?: boolean
  defaultChoice?: 'template' | 'empty'
}

export const TemplateSettingsStep = ({
  onChoiceSelect,
  defaultChoice = 'empty'
}: TemplateSettingsStepProps) => {
  const [choice, setChoice] = useState<'template' | 'empty'>(defaultChoice)

  const handleChoiceChange = (value: 'template' | 'empty') => {
    setChoice(value)
    onChoiceSelect(value === 'template')
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Initial Data Setup</CardTitle>
          <CardDescription>
            Choose how you want to start with your links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={choice}
            onValueChange={handleChoiceChange}
            className="space-y-4"
          >
            <FormItem>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="empty" id="empty" />
                  <FormLabel htmlFor="empty" className="text-base font-medium">
                    Start Fresh
                  </FormLabel>
                </div>
              </FormControl>
              <FormDescription className="pl-6">
                Begin with no links, categories, or tags. You&apos;ll need to
                add your own.
              </FormDescription>
            </FormItem>

            <FormItem>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="template" id="template" />
                  <FormLabel
                    htmlFor="template"
                    className="text-base font-medium"
                  >
                    Use Template Data
                  </FormLabel>
                </div>
              </FormControl>
              <FormDescription className="pl-6">
                Start with pre-configured example links, categories, and tags.
                Recommended for testing and demonstration purposes.
              </FormDescription>
            </FormItem>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  )
}
