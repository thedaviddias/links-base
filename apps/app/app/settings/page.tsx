import { LayoutPublic } from '@/components/layout/layout-public'
import { PageHeader } from '@/components/layout/page-header'

import { StorageConfig } from '@/features/storage/components/storage-config'

const SettingsPage = () => {
  return (
    <LayoutPublic>
      <div className="mb-10 flex items-center justify-between">
        <PageHeader
          pageData={{
            pageTitle: 'User Settings',
            description: 'Manage your user settings'
          }}
        />
      </div>
      <StorageConfig />
    </LayoutPublic>
  )
}

export default SettingsPage
