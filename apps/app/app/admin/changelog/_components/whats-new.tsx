'use client'

import { type FC } from 'react'

import { ReleaseCard } from '@/app/admin/changelog/_components/release-card'

export interface WhatsNewProps {
  content: string
  currentVersion: string
}

interface Release {
  version: string
  date: string
  changes: string
}

function compareVersions(v1: string, v2: string): number {
  const normalize = (version: string) => {
    const [major = 0, minor = 0, patch = 0] = version.split('.').map(Number)
    return [major, minor, patch]
  }

  const [major1, minor1, patch1] = normalize(v1)
  const [major2, minor2, patch2] = normalize(v2)

  if (major1 !== major2) return major1 - major2
  if (minor1 !== minor2) return minor1 - minor2
  return patch1 - patch2
}

export const WhatsNew: FC<WhatsNewProps> = ({ content, currentVersion }) => {
  if (!content || !currentVersion) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        No changelog content available.
      </div>
    )
  }

  try {
    const releases = parseChangelog(content)
    const newReleases = releases.filter(release => {
      const comparison = compareVersions(release.version, currentVersion)
      return comparison > 0
    })

    if (newReleases.length === 0) {
      return (
        <div className="py-6 text-center text-muted-foreground">
          You&apos;re up to date! No new changes available.
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {newReleases.map(release => (
            <ReleaseCard
              key={release.version}
              version={release.version}
              date={release.date}
              changes={release.changes}
            />
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in WhatsNew component:', error)
    return (
      <div className="py-6 text-center text-muted-foreground">
        Error loading changelog.
      </div>
    )
  }
}

function parseChangelog(content: string): Release[] {
  try {
    const releases: Release[] = []
    // Split by version headers (## [x.x.x] or ## x.x.x)
    const sections = content.split(/(?=## (?:\[?)[\d.]+(?:\]?))/g)

    sections.forEach(section => {
      // Match version number with or without brackets, and optional date
      const versionMatch = /## (?:\[?)([\d.]+)(?:\]?)\s*(?:\((.*?)\))?/.exec(
        section
      )
      if (versionMatch) {
        const [, version, date] = versionMatch
        // Get everything after the version header
        const changes = section
          .replace(/## (?:\[?)[\d.]+(?:\]?)\s*(?:\(.*?\))?/, '')
          .trim()

        if (version && changes) {
          releases.push({
            version,
            date: date || new Date().toISOString().split('T')[0],
            changes
          })
        }
      }
    })

    // Sort releases by version number (newest first)
    return releases.sort((a, b) => compareVersions(b.version, a.version))
  } catch (error) {
    console.error('Error parsing changelog:', error)
    return []
  }
}
