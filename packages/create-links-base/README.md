# Create Links Base

CLI tool to create and manage Links Base projects.

## Quick Start

```bash
pnpm dlx create-links-base my-links
```

## CLI Commands

### Create New Project

Create a new Links Base project using any of these commands:

```bash
pnpm dlx create-links-base [project-directory]
# or
npx create-links-base@latest [project-directory]
# or
yarn create-links-base [project-directory]
# or
bunx create-links-base [project-directory]
```

### Command Options

```bash
Usage: create-links-base [project-directory] [options]

Options:
  --skip-install      Skip package installation
  --help              Display help information
  --version           Display CLI version
```

### Update Existing Project

When inside a Links Base project directory:

```bash
# Basic update
pnpm dlx create-links-base update

# Update options
--force              Force update even with local changes
--dry-run           Preview changes without applying them
--skip-install      Skip package installation after update
```

Examples:

```bash
# Force update with local changes
pnpm dlx create-links-base update --force

# Preview update changes
pnpm dlx create-links-base update --dry-run

# Update without installing packages
pnpm dlx create-links-base update --skip-install
```

## Documentation

For more detailed documentation and examples, visit our [official documentation](https://github.com/thedaviddias/links-base).
