'use client'

import { type UseFormReturn } from 'react-hook-form'

import { type Environment } from '@/features/environment/types/environment.types'
import { SETTINGS_TABS } from '@/features/settings/constants/settings'
import { type Settings } from '@/features/settings/types/settings.types'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@links-base/ui/tabs'

import { DangerZone } from './danger-zone'
import { EnvironmentSettings } from './environment-settings'
import { GeneralSettings } from './general-settings'
import { HelpSettings } from './help-settings'
import { LinksSettings } from './links-settings'
import { RequestsSettings } from './requests-settings'
import { ServicesSettings } from './services-settings'

interface SettingsTabsProps {
  form: UseFormReturn<Settings>
  environmentOrder: Environment[]
  onDragEnd: (result: any) => void
}

export const SettingsTabs = ({
  form,
  environmentOrder,
  onDragEnd
}: SettingsTabsProps) => {
  return (
    <Tabs defaultValue="general" className="space-y-4">
      <div className="border-b">
        <TabsList>
          {SETTINGS_TABS.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="general" className="mt-6">
        <GeneralSettings form={form} />
      </TabsContent>
      <TabsContent value="links" className="mt-6">
        <div className="space-y-10">
          <LinksSettings form={form} />
          <div className="border-t pt-6">
            <EnvironmentSettings
              form={form}
              environmentOrder={environmentOrder}
              onDragEnd={onDragEnd}
            />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="requests" className="mt-6">
        <RequestsSettings form={form} />
      </TabsContent>
      <TabsContent value="help" className="mt-6">
        <HelpSettings form={form} />
      </TabsContent>
      <TabsContent value="services" className="mt-6">
        <ServicesSettings form={form} />
      </TabsContent>
      <TabsContent value="danger">
        <DangerZone />
      </TabsContent>
    </Tabs>
  )
}
