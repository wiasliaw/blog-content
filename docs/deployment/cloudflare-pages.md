# Cloudflare Pages Deployment

## Prerequisites

- [Cloudflare account](https://dash.cloudflare.com/sign-up)
- Git repository (GitHub or GitLab)

## Deploy via Git Integration

### 1. Connect Repository

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. Click **Create a project** > **Connect to Git**
3. Select your Git provider and authorize access
4. Choose your repository

### 2. Configure Build Settings

| Setting | Value |
|---------|-------|
| Framework preset | Astro |
| Build command | `pnpm build` |
| Build output directory | `dist` |

### 3. Environment Variables

Add the following environment variable:

| Variable | Value |
|----------|-------|
| `NODE_VERSION` | `20` (or your preferred LTS version) |

### 4. Deploy

Click **Save and Deploy**. Cloudflare will:

1. Clone your repository
2. Install dependencies
3. Run `pnpm build`
4. Deploy the `dist/` directory

## Update Site URL

After deployment, update `astro.config.mjs` with your Cloudflare Pages URL:

```js
export default defineConfig({
  site: 'https://your-project.pages.dev',
  // ...
});
```

Or use your custom domain if configured.

## Custom Domain

### Add Custom Domain

1. Go to your Pages project
2. Click **Custom domains** > **Set up a custom domain**
3. Enter your domain name
4. Follow DNS configuration instructions

### DNS Configuration

For apex domain (`example.com`):
- Add a `CNAME` record pointing to `your-project.pages.dev`
- Cloudflare handles CNAME flattening automatically

For subdomain (`blog.example.com`):
- Add a `CNAME` record pointing to `your-project.pages.dev`

## Manual Deployment (Wrangler CLI)

For deployments without Git integration:

### 1. Install Wrangler

```bash
pnpm add -g wrangler
```

### 2. Authenticate

```bash
wrangler login
```

### 3. Build and Deploy

```bash
pnpm build
wrangler pages deploy dist --project-name=your-project-name
```

## Build Settings Reference

| Setting | Value |
|---------|-------|
| Build command | `pnpm build` |
| Build output | `dist` |
| Root directory | `/` (default) |
| Node.js version | 20+ recommended |

## Troubleshooting

### Build Fails with Node Version Error

Ensure `NODE_VERSION` environment variable is set to a compatible version (18+).

### Search Not Working

The search index is generated during build (`pagefind --site dist`). Ensure the build completes successfully and the `dist/_pagefind/` directory exists.

### 404 on Direct Page Access

This is expected for a static site. Cloudflare Pages handles this correctly for paths that exist in `dist/`.
