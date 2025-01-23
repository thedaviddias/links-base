import fs from 'fs/promises'
import path from 'path'

import { CORE_PACKAGES } from '../constants/packages'
import type { PackageJson } from '../types/init.types'

/**
 * Updates the package.json file in the target directory
 */
export async function updatePackageJson(targetDir: string): Promise<void> {
  const pkgPath = path.join(targetDir, 'package.json')
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8')) as PackageJson

  removeUnwantedDependencies(pkg)
  updateWorkspaceReferences(pkg)
  await writePackageFiles(targetDir, pkg)
}

function removeUnwantedDependencies(pkg: PackageJson): void {
  delete pkg.dependencies['@links-base/web']
  delete pkg.dependencies['@links-base/e2e']
  delete pkg.dependencies['@links-base/keystatic']
  delete pkg.workspaces
}

function updateWorkspaceReferences(pkg: PackageJson): void {
  for (const pkgName of CORE_PACKAGES) {
    if (pkg.dependencies?.[pkgName]) {
      pkg.dependencies[pkgName] = 'workspace:*'
    }
  }
}

async function writePackageFiles(
  targetDir: string,
  pkg: PackageJson
): Promise<void> {
  const pkgPath = path.join(targetDir, 'package.json')
  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2))

  const workspaceConfig = `packages:
  - 'packages/*'
`
  await fs.writeFile(
    path.join(targetDir, 'pnpm-workspace.yaml'),
    workspaceConfig
  )
}
