import { exec } from 'child_process'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { promisify } from 'util'
import { CORE_PACKAGES, PACKAGE_NAME_MAP } from '../constants/packages.js'
import type { PackageJson } from '../types/init.types.js'

const execAsync = promisify(exec)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Helper function to determine if we're in development mode
const isDevelopment = () => process.env.NODE_ENV === 'development'

// Helper to get project root directory
const getProjectRoot = () => {
  // Go up 4 levels from dist/utils to reach project root
  return path.join(__dirname, '../../..')
}

export async function copyFiles(targetDir: string): Promise<void> {
  if (isDevelopment()) {
    await copyLocalFiles(targetDir)
  } else {
    await downloadRemoteFiles(targetDir)
  }
}

async function copyLocalFiles(targetDir: string): Promise<void> {
  const projectRoot = getProjectRoot()

  // Copy app files
  const appDir = path.join(projectRoot, 'apps/app')
  const excludeDirs = [
    'node_modules',
    '.next',
    'out',
    '.turbo',
    'coverage',
    '.git',
    'dist',
    '.cache',
    '.vercel',
    '.env*'
  ]
  await copyDir(appDir, targetDir, excludeDirs)

  // Copy package files
  const packagesDir = path.join(projectRoot, 'packages')
  await copyPackages(packagesDir, targetDir)

  // Copy root config files
  await copyRootFiles(projectRoot, targetDir)
}

async function copyRootFiles(
  projectRoot: string,
  targetDir: string
): Promise<void> {
  const rootFiles = [
    '.gitignore',
    '.editorconfig',
    '.npmrc',
    '.nvmrc',
    'LICENCE'
  ]

  // Copy basic root files from project root
  for (const file of rootFiles) {
    const srcPath = path.join(projectRoot, file)
    const destPath = path.join(targetDir, file)
    try {
      await fs.copyFile(srcPath, destPath)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.warn(`Warning: Could not copy ${file}: ${error.message}`)
      } else {
        console.warn(`Warning: Could not copy ${file}: Unknown error occurred`)
      }
    }
  }
}

export async function downloadRemoteFiles(targetDir: string): Promise<void> {
  // Download the template package
  await execAsync(`npx degit thedaviddias/links-base/apps/app ${targetDir}`)

  // Create and download to packages directory
  const packagesDir = path.join(targetDir, 'packages')
  await fs.mkdir(packagesDir, { recursive: true })

  for (const pkg of CORE_PACKAGES) {
    const pkgName = pkg.split('/')[1]
    await execAsync(
      `npx degit thedaviddias/links-base/packages/${pkgName} ${packagesDir}/${pkgName}`
    )
  }
}

// Rest of the helper functions remain the same
async function copyPackages(
  packagesDir: string,
  targetDir: string
): Promise<void> {
  for (const pkg of CORE_PACKAGES) {
    const pkgName = pkg.split('/')[1]
    const folderName = PACKAGE_NAME_MAP[pkgName] || pkgName
    const srcDir = path.join(packagesDir, folderName)
    const destDir = path.join(targetDir, 'packages', pkgName)

    await fs.mkdir(destDir, { recursive: true })
    await copyPackageJson(srcDir, destDir)
    await copyDir(srcDir, destDir, [
      'node_modules',
      '.turbo',
      'dist',
      'coverage',
      '.git',
      '.cache',
      '.env*',
      '.vercel',
      'codecov.yml'
    ])
  }
}

async function copyDir(
  src: string,
  dest: string,
  excludeDirs: string[] = []
): Promise<void> {
  const entries = await fs.readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (excludeDirs.includes(entry.name)) continue

    if (entry.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true })
      await copyDir(srcPath, destPath, excludeDirs)
    } else {
      await fs.copyFile(srcPath, destPath)
    }
  }
}

async function copyPackageJson(srcDir: string, destDir: string): Promise<void> {
  const srcPackageJson = path.join(srcDir, 'package.json')
  const destPackageJson = path.join(destDir, 'package.json')
  const pkgContent = JSON.parse(await fs.readFile(srcPackageJson, 'utf8'))

  updateWorkspaceDependencies(pkgContent)
  await fs.writeFile(destPackageJson, JSON.stringify(pkgContent, null, 2))
}

function updateWorkspaceDependencies(pkgContent: PackageJson): void {
  ;['dependencies', 'devDependencies'].forEach(depType => {
    const deps = pkgContent[depType as keyof PackageJson] as Record<
      string,
      string
    >
    if (deps) {
      Object.keys(deps).forEach(dep => {
        if (dep.startsWith('@links-base/')) {
          deps[dep] = 'workspace:*'
        }
      })
    }
  })
}
