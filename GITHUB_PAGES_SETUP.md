# GitHub Pages Setup Guide

This guide explains how to deploy the Email Builder to GitHub Pages for online testing.

## Automatic Deployment

The repository is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` branch.

## Enabling GitHub Pages

To enable GitHub Pages for this repository:

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Pages**
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
4. Save the settings

The workflow will automatically:
- Build the project when changes are pushed to `main`
- Deploy the built application to GitHub Pages
- Make it available at: `https://rmadeiraneto.github.io/email-builder/`

## Manual Deployment

You can also manually trigger a deployment:

1. Go to the **Actions** tab in your GitHub repository
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select the branch (usually `main`)
5. Click "Run workflow"

## Local Testing

To test the production build locally before deploying:

```bash
# Build the project
pnpm run build

# Preview the production build
cd apps/dev
pnpm run preview
```

## Viewing Your Deployed Site

Once deployed, your Email Builder will be available at:
- **Production URL**: https://rmadeiraneto.github.io/email-builder/

The deployment typically takes 2-5 minutes after pushing to the `main` branch.

## Troubleshooting

### Build Fails
- Check the Actions tab for error logs
- Ensure all dependencies are properly listed in `package.json`
- Verify that the build works locally with `pnpm run build`

### 404 Error on GitHub Pages
- Verify that GitHub Pages is enabled in repository settings
- Check that the source is set to "GitHub Actions"
- Ensure the workflow completed successfully

### Assets Not Loading
- Check that the base path is correctly set in `vite.config.ts`
- The base path should be `/email-builder/` for this repository
- All asset references should be relative or use the base path

## Workflow Configuration

The deployment workflow is located at:
- `.github/workflows/deploy-gh-pages.yml`

The workflow:
1. Checks out the code
2. Sets up Node.js and pnpm
3. Installs dependencies
4. Builds design tokens
5. Builds all packages
6. Uploads the built files
7. Deploys to GitHub Pages

## Notes

- The production build uses the base path `/email-builder/`
- Local development continues to use `/` as the base path
- Only pushes to `main` trigger automatic deployment
- The deployment requires GitHub Pages to be enabled with "GitHub Actions" as the source
