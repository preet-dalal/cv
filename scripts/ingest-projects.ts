import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectsDir = path.join(__dirname, '../projects')
const outputFile = path.join(__dirname, '../projectIndex.json')

interface Project {
  slug: string
  title: string
  summary: string
  content: string
  images: Record<string, string>
  previewImage: string
  date: string
}

function extractTeXMetadata(texContent: string): {
  title: string
  summary: string
  content: string
} {
  const titleMatch = texContent.match(/\\title\{\\textbf\{([^}]+)\}\}/)
  let title = titleMatch ? titleMatch[1] : 'Untitled'
  title = title.replace(/\$([^$]*)\$/g, (match) => match.slice(1, -1))

  const overviewMatch = texContent.match(/\\section\*?\{Overview\}([\s\S]*?)(?=\\section|\\begin\{figure\}|\\end\{document\})/i)
  let summary = ''
  if (overviewMatch) {
    summary = overviewMatch[1]
      .replace(/\\footnote\{[^}]*\}/g, '')
      .replace(/\\cite\{[^}]*\}/g, '')
      .replace(/\\\\/g, ' ')
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .join(' ')
      .substring(0, 300)
      .trim()
  }

  const documentMatch = texContent.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/)
  const content = documentMatch ? documentMatch[1]. trim() : texContent

  return { title, summary, content }
}

function extractImages(texContent: string, projectDir: string): Record<string, string> {
  const images:  Record<string, string> = {}
  const imgRegex = /\\includegraphics(?:  ?\[[^\]]*\])?\{([^}]+)\}/g

  let match
  while ((match = imgRegex.exec(texContent)) !== null) {
    let imagePath = match[1]
    
    if (imagePath.includes('/')) {
      imagePath = imagePath.split('/').pop() || imagePath
    }

    const fileName = path.basename(imagePath)
    const fullPath = path.join(projectDir, imagePath)
    const altPath = path.join(projectDir, fileName)

    if (fs.existsSync(fullPath)) {
      images[fileName] = `/assets/${path.basename(projectDir)}/${fileName}`
    } else if (fs.existsSync(altPath)) {
      images[fileName] = `/assets/${path.basename(projectDir)}/${fileName}`
    }
  }

  return images
}

function getPreviewImage(images: Record<string, string>, slug: string): string {
  // Map specific cover images to projects
  const coverImages: Record<string, string> = {
    'project-1': '/assets/project1-cover.jpg',
    'project-2': '/assets/project2-cover.jpg',
    'project-3': '/assets/project3-cover.jpg',
  }
  
  if (coverImages[slug]) {
    return coverImages[slug]
  }
  
  const imageFiles = Object.keys(images)
  if (imageFiles.length > 0) {
    return images[imageFiles[0]]
  }
  return '/assets/placeholder.svg'
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50)
}

async function ingestProjects() {
  const projects: Project[] = []

  if (!fs.existsSync(projectsDir)) {
    fs.mkdirSync(projectsDir, { recursive: true })
    console.log('Created projects directory.  Add your . tex files to /projects')
    fs.writeFileSync(outputFile, JSON. stringify([], null, 2))
    return
  }

  const projectFolders = fs.readdirSync(projectsDir).sort()

  for (const folder of projectFolders) {
    const projectPath = path.join(projectsDir, folder)
    const stat = fs.statSync(projectPath)

    if (! stat.isDirectory()) continue

    const files = fs.readdirSync(projectPath)
    const texFile = files.find((f) => f.endsWith('.tex'))

    if (!texFile) {
      console.warn(`⚠ No .tex file found in ${folder}`)
      continue
    }

    const texPath = path.join(projectPath, texFile)
    const texContent = fs.readFileSync(texPath, 'utf-8')

    const { title, summary, content } = extractTeXMetadata(texContent)
    const images = extractImages(texContent, projectPath)
    const slug = slugify(folder)
    const previewImage = getPreviewImage(images, slug)

    projects.push({
      slug,
      title,
      summary,
      content,
      images,
      previewImage,
      date: new Date().toISOString().split('T')[0],
    })

    console.log(`✓ Ingested:  ${title}`)
  }

  projects.sort((a, b) => a.slug.localeCompare(b. slug))

  fs.writeFileSync(outputFile, JSON.stringify(projects, null, 2))
  console.log(`\n✓ Generated projectIndex.json with ${projects.length} projects`)
}

ingestProjects().catch(console.error)