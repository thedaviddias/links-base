import { promises as fs } from 'fs'
import path from 'path'

export async function getChangelogContent() {
  try {
    const changelogPath = path.join(process.cwd(), 'CHANGELOG.md')
    const content = await fs.readFile(changelogPath, 'utf8')

    // Extract latest version from changelog content
    const versionMatch = /## \[?([\d.]+)]?/.exec(content)
    const latestVersion = versionMatch ? versionMatch[1] : '0.0.0'

    return {
      content,
      latestVersion
    }
  } catch (error) {
    // Return default values for static generation
    return {
      content: '# Changelog\n\nNo changelog content available.',
      latestVersion: '0.0.0'
    }
  }
}
