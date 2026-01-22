# Project Configuration

This file documents the configuration used in this portfolio.

## Build Configuration

### Vite Configuration (`vite.config.ts`)
- Base URL: `/` (update for subdirectories)
- Development port: `5173`
- Build output: `dist/`
- Source maps: Disabled for production
- Minification: Enabled via Terser

### PostCSS Configuration (`postcss.config.js`)
- Tailwind CSS processing
- Autoprefixer for browser compatibility

### TypeScript Configuration
- Target: ES2020
- Module: ESNext
- Strict mode enabled
- JSX: React 18

## Project Configuration

### File Structure
```
root/
├── .github/workflows/deploy.yml      # GitHub Actions
├── .gitignore                        # Git ignore rules
├── .env.example                      # Environment template
├── vite.config.ts                    # Vite configuration
├── tsconfig.json                     # TypeScript config
├── tsconfig.node.json                # Node TS config
├── postcss.config.js                 # PostCSS config
├── tailwind.config.js                # Tailwind config
├── package.json                      # Dependencies
├── index.html                        # HTML entry point
├── vite-env.d.ts                     # Vite types
│
├── public/
│   ├── assets/                       # Project images (auto-populated)
│   ├── projectIndex.json             # Auto-generated index
│   └── CNAME                         # Custom domain (optional)
│
├── src/
│   ├── App.tsx                       # Router configuration
│   ├── main.tsx                      # React entry point
│   ├── index.css                     # Global styles
│   ├── types.ts                      # TypeScript types
│   ├── pages/
│   │   ├── Home.tsx                  # Project listing page
│   │   └── ProjectPage.tsx           # Individual project page
│   └── components/
│       └── TeXRenderer.tsx           # LaTeX renderer
│
├── scripts/
│   ├── ingest-projects.ts            # Parse projects
│   ├── copy-assets.ts                # Copy images
│   └── generate-placeholders.ts      # Generate placeholders
│
├── projects/                         # User projects (add here)
│   ├── Project-1/
│   │   └── Project_1.tex
│   ├── Project-2/
│   │   └── Project_2.tex
│   └── Project-3/
│       ├── Project_3.tex
│       └── images/
│
├── README.md                         # Main documentation
├── SETUP_GUIDE.md                    # Deployment guide
├── DEPLOYMENT_CHECKLIST.md           # Pre-launch checklist
└── EXAMPLE_PROJECT.tex               # Template project
```

## Build Process

### Development (`npm run dev`)
1. Copy assets from projects to public/assets
2. Start Vite dev server on localhost:5173
3. Hot reload on file changes

### Production Build (`npm run build`)
1. Copy assets: `copy-assets.ts`
2. Ingest projects: `ingest-projects.ts`
3. Generate `projectIndex.json`
4. Build with Vite
5. Output to `dist/` folder

### Deployment (`npm run deploy`)
1. Build as above
2. Deploy to GitHub Pages using `gh-pages`
3. Create/update `gh-pages` branch
4. Site live in 1-2 minutes

## Environment Variables

Location: `.env` (copy from `.env.example`)

```
VITE_BASE_URL=/
```

For subdirectory deployment (e.g., `github.io/my-repo`):
```
VITE_BASE_URL=/my-repo/
```

Then update `vite.config.ts`:
```typescript
base: process.env.VITE_BASE_URL || '/',
```

## Dependencies

### Core Framework
- **React 18**: UI framework
- **React Router v6**: Client-side routing
- **Vite**: Build tool and dev server

### Styling
- **Tailwind CSS**: Utility-first CSS
- **PostCSS**: CSS processing
- **Autoprefixer**: Browser compatibility

### Content Rendering
- **KaTeX**: Mathematical equation rendering
- **Framer Motion**: Smooth animations

### Deployment
- **gh-pages**: GitHub Pages deployment
- **tsx**: TypeScript execution

### Development
- **TypeScript**: Type safety
- **Vite Plugin React**: Fast refresh

## GitHub Pages Configuration

### Automatic Deployment (GitHub Actions)

File: `.github/workflows/deploy.yml`

Triggers:
- Push to `main` branch
- Manual workflow dispatch

Process:
1. Install dependencies
2. Run build process
3. Deploy to `gh-pages` branch
4. GitHub Pages serves from `gh-pages` branch

### Custom Domain

1. Add domain to `public/CNAME`
2. Update `.github/workflows/deploy.yml` with domain
3. Configure DNS with domain provider
4. Wait for DNS propagation

## Performance Metrics

Target metrics:
- **Build size**: < 200KB gzipped
- **First paint**: < 1.5s
- **Interactive**: < 2.5s
- **Largest contentful paint**: < 2.5s

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

Features:
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance
- Alt text for images
- Responsive design

## Security

Measures:
- No external script execution
- Content Security Policy friendly
- No sensitive data in code
- Environment variables for secrets
- Regular dependency updates

## Maintenance

### Regular Tasks
- Update dependencies: `npm update`
- Check security: `npm audit`
- Monitor bundle size: `npm run build`
- Test on multiple browsers
- Check performance metrics

### Monitoring
- GitHub Actions logs
- Browser console for errors
- GitHub Pages settings
- DNS propagation (for custom domain)

## Troubleshooting Resources

1. **README.md** - Features and quick start
2. **SETUP_GUIDE.md** - Detailed setup instructions
3. **DEPLOYMENT_CHECKLIST.md** - Pre-deployment verification
4. **EXAMPLE_PROJECT.tex** - Template for new projects
5. **.github/workflows/deploy.yml** - Deployment configuration

---

**Version:** 1.0.0
**Last Updated:** January 2026
