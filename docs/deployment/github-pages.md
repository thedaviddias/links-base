# Deploying to GitHub Pages

This guide will help you deploy your Links Base instance to GitHub Pages.

## 1. Setup GitHub Repository

1. Create a new repository on GitHub
2. Push your code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repository-url>
   git push -u origin main
   ```

## 2. Configure GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" in the sidebar
3. Under "Build and deployment":
   - Source: Select "GitHub Actions"

## 3. Add GitHub Workflow

1. Create a `.github/workflows` directory in your project:
   ```bash
   mkdir -p .github/workflows
   ```

2. Create a new file `.github/workflows/deploy.yml` with the following content:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: "pages"
     cancel-in-progress: true

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4

         - name: Setup Node
           uses: actions/setup-node@v4
           with:
             node-version: 20

         - name: Setup pnpm
           uses: pnpm/action-setup@v3
           with:
             version: 8

         - name: Install dependencies
           run: pnpm install

         - name: Build
           run: pnpm build

         - name: Setup Pages
           uses: actions/configure-pages@v4

         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: ./out

     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

## 4. Push and Deploy

1. Add the workflow file to git:
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add deployment workflow"
   git push
   ```

2. The workflow will automatically run when you push to the main branch.
3. You can monitor the deployment in the "Actions" tab of your repository.
4. Once complete, your site will be available at `https://<username>.github.io/<repository-name>`

## Troubleshooting

- If the deployment fails, check the workflow run logs in the "Actions" tab
- Ensure your repository has GitHub Pages enabled in the settings
- Make sure you have the correct permissions set for GitHub Pages deployment
