import appConfig from '@/config/app.config'

import { Card } from '@links-base/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@links-base/ui/tabs'

import { FullChangelog } from './_components/full-changelog'
import { getChangelogContent } from './_components/get-changelog'
import { VersionStatus } from './_components/version-status'
import { WhatsNew } from './_components/whats-new'

// Add error boundaries for static generation
export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

export default async function ChangelogPage() {
  let content = ''
  let latestVersion = ''

  try {
    const changelogData = await getChangelogContent()
    content = changelogData.content
    latestVersion = changelogData.latestVersion
  } catch (error) {
    // Provide fallback content for static generation
    content = '# Changelog\n\nNo changelog content available.'
    latestVersion = appConfig.version
  }

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">Changelog</h1>
      <p className="mt-2 text-muted-foreground">
        Track updates and changes to the application
      </p>

      <VersionStatus
        currentVersion={appConfig.version}
        latestVersion={latestVersion}
      />

      <Card className="p-6">
        <Tabs defaultValue="whats-new" className="space-y-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="whats-new">What&apos;s New</TabsTrigger>
            <TabsTrigger value="full">Full Changelog</TabsTrigger>
          </TabsList>

          <TabsContent value="whats-new">
            <WhatsNew content={content} currentVersion={appConfig.version} />
          </TabsContent>

          <TabsContent value="full">
            <FullChangelog content={content} />
          </TabsContent>
        </Tabs>
      </Card>
    </main>
  )
}
