# Physics Research Portfolio

A fully functional, static site portfolio for physics research projects with automatic LaTeX rendering and GitHub Pages deployment.

## ✨ Features

- **LaTeX Rendering**: Automatic KaTeX rendering for all mathematical equations
- **Responsive Design**: Beautiful, modern UI with Tailwind CSS and Framer Motion animations
- **GitHub Pages Ready**: One-command deployment to GitHub Pages
- **Automatic Project Ingestion**: Add `.tex` files to `/projects` folder and they're automatically indexed
- **Asset Management**: Automatic image copying and optimization
- **Dark Theme**: Optimized dark theme with cosmic gradient accents

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
# → Opens http://localhost:5173
```

### Building

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Deployment to GitHub Pages

#### Option 1: Using GitHub Actions (Recommended)

1. Push your code to the `main` branch
2. GitHub Actions will automatically build and deploy on every push
3. Your site will be available at `https://yourusername.github.io/repository-name`

#### Option 2: Manual Deployment

```bash
# Build and deploy in one command
npm run deploy
```

**Note**: For `npm run deploy` to work, you need to:
1. Have `gh-pages` installed (already in dependencies)
2. Configure git with your GitHub credentials
3. The repository must be set as your remote

## 📁 Project Structure

```
.
├── projects/                 # Add your .tex files here
│   ├── Project-1/
│   │   └── Project_1.tex
│   ├── Project-2/
│   │   └── Project_2.tex
│   └── Project-3/
│       ├── Project_3.tex
│       └── images/          # Project images go here
├── public/
│   ├── assets/             # Automatically populated with project assets
│   └── projectIndex.json   # Auto-generated project index
├── src/
│   ├── pages/             # React pages (Home, ProjectPage)
│   ├── components/        # React components (TeXRenderer)
│   └── styles/            # CSS files
├── scripts/
│   ├── ingest-projects.ts     # Parses .tex files and generates index
│   └── copy-assets.ts         # Copies project images to public
└── package.json
```

## 📝 Adding Projects

1. Create a folder under `/projects/` with your project name
2. Add your `.tex` file to that folder
3. Add any images to the same folder
4. Run `npm run build` or `npm run dev` - projects are automatically indexed

### Supported LaTeX Elements

The renderer supports:
- All equation environments (`equation`, `align`, `gather`, etc.)
- Text formatting (`\textbf{}`, `\textit{}`, `\texttt{}`)
- Sections and subsections
- Lists (itemize, enumerate)
- Figures with captions
- Images via `\includegraphics`
- Citations and references

## ⚙️ Configuration

### GitHub Pages Base URL

If deploying to a subdirectory (not your main GitHub Pages site), update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

### Custom Domain

To use a custom domain:
1. Add your domain to `.github/workflows/deploy.yml` in the `cname:` field
2. Add a `CNAME` file to `/public/` with your domain name

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run ingest` | Re-generate project index |
| `npm run copy-assets` | Copy project assets to public folder |
| `npm run deploy` | Build and deploy to GitHub Pages |

## 📦 Dependencies

- **React 18** - UI framework
- **React Router** - Client-side routing
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **KaTeX** - LaTeX math rendering
- **Framer Motion** - Animation library
- **gh-pages** - GitHub Pages deployment

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and enhancement requests.

---

**Built with ❤️ for showcasing physics research**
