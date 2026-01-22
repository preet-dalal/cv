import React, { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface Props {
  content: string
}

export default function LaTeXDocument({ content }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const rendered = convertLaTeXToHTML(content)
    containerRef.current.innerHTML = rendered

    // Render math after DOM update
    const mathElements = containerRef.current.querySelectorAll('[data-math]')
    mathElements.forEach((elem) => {
      const tex = elem.getAttribute('data-math')
      const isDisplay = elem.getAttribute('data-display') === 'true'
      try {
        katex.render(tex || '', elem as HTMLElement, {
          displayMode: isDisplay,
          throwOnError: false,
        })
      } catch (err) {
        console.error('KaTeX error:', err)
        elem.textContent = tex || ''
      }
    })
  }, [content])

  return <div ref={containerRef} className="prose-tex space-y-4" />
}

function convertLaTeXToHTML(texContent: string): string {
  let html = texContent

  // PHASE 1: Handle math environments FIRST (preserve these)
  const mathBlocks: { [key: string]: string } = {}
  let mathCounter = 0
  
  // Save display math: \[ ... \]
  html = html.replace(/\\\[([\s\S]*?)\\\]/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter++}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    return key
  })
  
  // Save display math: $$ ... $$
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter++}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    return key
  })
  
  // Save equation/align environments
  html = html.replace(/\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter++}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    return key
  })
  html = html.replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter++}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    return key
  })
  html = html.replace(/\\begin\{gather\*?\}([\s\S]*?)\\end\{gather\*?\}/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter++}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    return key
  })
  html = html.replace(/\\begin\{eqnarray\*?\}([\s\S]*?)\\end\{eqnarray\*?\}/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter++}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    return key
  })
  html = html.replace(/\\begin\{multline\*?\}([\s\S]*?)\\end\{multline\*?\}/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter++}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    return key
  })
  
  // Save inline math: $ ... $
  html = html.replace(/(?<!\$)\$(?!\$)((?:(?!\$).)*?)\$/g, (match, math) => {
    const key = `__MATH_INLINE_${mathCounter++}__`
    mathBlocks[key] = `<span data-math="${math.trim()}" data-display="false"></span>`
    return key
  })

  // PHASE 2: Remove preamble and document wrapper
  html = html.replace(/\\documentclass\{[^}]*\}/g, '')
  html = html.replace(/\\usepackage(?:\[[^\]]*\])?\{[^}]*\}/g, '')
  html = html.replace(/\\geometry\{[^}]*\}/g, '')
  html = html.replace(/\\pagestyle\{[^}]*\}/g, '')
  html = html.replace(/\\setcounter\{[^}]*\}\{[^}]*\}/g, '')
  html = html.replace(/\\renewcommand\{[^}]*\}\{[^}]*\}/g, '')
  html = html.replace(/\\begin\{document\}/g, '')
  html = html.replace(/\\end\{document\}/g, '')
  html = html.replace(/\\begin\{abstract\}[\s\S]*?\\end\{abstract\}/g, '')
  html = html.replace(/\\maketitle/g, '')
  
  // Remove table environments completely
  html = html.replace(/\\begin\{table\*?\}[\s\S]*?\\end\{table\*?\}/g, '')
  html = html.replace(/\\begin\{tabular\}[^}]*\}[\s\S]*?\\end\{tabular\}/g, '')
  
  // PHASE 3: Handle structural commands that produce output
  const titleMatch = html.match(/\\title\{([^}]+)\}/)
  const authorMatch = html.match(/\\author\{([^}]+)\}/)
  const dateMatch = html.match(/\\date\{([^}]+)\}/)
  
  let titleHtml = ''
  if (titleMatch) {
    titleHtml += `<h1 class="text-5xl font-bold mb-4 text-white">${titleMatch[1]}</h1>\n`
  }
  if (authorMatch) {
    titleHtml += `<p class="text-lg text-gray-400 mb-2">${authorMatch[1]}</p>\n`
  }
  if (dateMatch) {
    titleHtml += `<p class="text-sm text-gray-500 mb-8">${dateMatch[1]}</p>\n`
  }
  
  html = html.replace(/\\title\{([^}]+)\}/g, '')
  html = html.replace(/\\author\{([^}]+)\}/g, '')
  html = html.replace(/\\date\{([^}]+)\}/g, '')

  // Handle sections
  html = html.replace(/\\section\*?\{([^}]+)\}/g, '<h2 class="text-4xl font-bold mt-12 mb-6 text-white border-b-2 border-orange-500 pb-3">$1</h2>')
  html = html.replace(/\\subsection\*?\{([^}]+)\}/g, '<h3 class="text-3xl font-semibold mt-10 mb-5 text-gray-100">$1</h3>')
  html = html.replace(/\\subsubsection\*?\{([^}]+)\}/g, '<h4 class="text-2xl font-semibold mt-8 mb-4 text-gray-200">$1</h4>')
  html = html.replace(/\\paragraph\*?\{([^}]+)\}/g, '<h5 class="text-xl font-semibold mt-6 mb-3 text-gray-300">$1</h5>')

  // Handle text formatting
  html = html.replace(/\\textbf\{([^}]+)\}/g, '<strong class="font-bold">$1</strong>')
  html = html.replace(/\\textit\{([^}]+)\}/g, '<em class="italic">$1</em>')
  html = html.replace(/\\texttt\{([^}]+)\}/g, '<code class="bg-cosmic-800 px-2 py-1 rounded text-sm font-mono">$1</code>')
  html = html.replace(/\\textsl\{([^}]+)\}/g, '<em class="italic">$1</em>')
  html = html.replace(/\\textsc\{([^}]+)\}/g, '<span class="uppercase tracking-wide text-sm">$1</span>')
  html = html.replace(/\\textrm\{([^}]+)\}/g, '<span class="font-serif">$1</span>')
  html = html.replace(/\\textsf\{([^}]+)\}/g, '<span class="font-sans">$1</span>')
  html = html.replace(/\\emph\{([^}]+)\}/g, '<em class="italic">$1</em>')
  html = html.replace(/\\texorpdfstring\{([^}]*)\}\{([^}]*)\}/g, '$1')

  // Handle title, author, date
  const titleMatch = html.match(/\\title\{([^}]+)\}/)
  const authorMatch = html.match(/\\author\{([^}]+)\}/)
  const dateMatch = html.match(/\\date\{([^}]+)\}/)
  
  let titleHtml = ''
  if (titleMatch) {
    titleHtml += `<h1 class="text-5xl font-bold mb-4 text-white">${titleMatch[1]}</h1>\n`
  }
  if (authorMatch) {
    titleHtml += `<p class="text-lg text-gray-400 mb-2">${authorMatch[1]}</p>\n`
  }
  if (dateMatch) {
    titleHtml += `<p class="text-sm text-gray-500 mb-8">${dateMatch[1]}</p>\n`
  }
  
  html = html.replace(/\\title\{([^}]+)\}/g, '')
  html = html.replace(/\\author\{([^}]+)\}/g, '')
  html = html.replace(/\\date\{([^}]+)\}/g, '')

  // Handle \\ command (must be before other replacements)
  html = html.replace(/\\\\/g, '<br />')
  html = html.replace(/\\newline/g, '<br />')

  // Handle display math environments FIRST (longest matches)
  html = html.replace(/\\\[([\s\S]*?)\\\]/g, '<div class="my-6 overflow-x-auto" data-math="$1" data-display="true"></div>')
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, '<div class="my-6 overflow-x-auto" data-math="$1" data-display="true"></div>')
  html = html.replace(/\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g, '<div class="my-6 overflow-x-auto" data-math="$1" data-display="true"></div>')
  html = html.replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, '<div class="my-6 overflow-x-auto" data-math="$1" data-display="true"></div>')
  html = html.replace(/\\begin\{align\}([\s\S]*?)\\end\{align\}/g, '<div class="my-6 overflow-x-auto" data-math="$1" data-display="true"></div>')
  html = html.replace(/\\begin\{gather\*?\}([\s\S]*?)\\end\{gather\*?\}/g, '<div class="my-6 overflow-x-auto" data-math="$1" data-display="true"></div>')
  html = html.replace(/\\begin\{eqnarray\*?\}([\s\S]*?)\\end\{eqnarray\*?\}/g, '<div class="my-6 overflow-x-auto" data-math="$1" data-display="true"></div>')
  html = html.replace(/\\begin\{multline\*?\}([\s\S]*?)\\end\{multline\*?\}/g, '<div class="my-6 overflow-x-auto" data-math="$1" data-display="true"></div>')

  // Handle inline math: $ ... $ (must be after display math)
  html = html.replace(/(?<!\$)\$(?!\$)((?:(?!\$).)*?)\$/g, '<span data-math="$1" data-display="false"></span>')

  // Handle sections with proper styling
  html = html.replace(/\\section\*?\{([^}]+)\}/g, '<h2 class="text-4xl font-bold mt-12 mb-6 text-white border-b-2 border-orange-500 pb-3">$1</h2>')
  html = html.replace(/\\subsection\*?\{([^}]+)\}/g, '<h3 class="text-3xl font-semibold mt-10 mb-5 text-gray-100">$1</h3>')
  html = html.replace(/\\subsubsection\*?\{([^}]+)\}/g, '<h4 class="text-2xl font-semibold mt-8 mb-4 text-gray-200">$1</h4>')
  html = html.replace(/\\paragraph\*?\{([^}]+)\}/g, '<h5 class="text-xl font-semibold mt-6 mb-3 text-gray-300">$1</h5>')

  // Handle text formatting
  html = html.replace(/\\textbf\{([^}]+)\}/g, '<strong class="font-bold">$1</strong>')
  html = html.replace(/\\textit\{([^}]+)\}/g, '<em class="italic">$1</em>')
  html = html.replace(/\\texttt\{([^}]+)\}/g, '<code class="bg-cosmic-800 px-2 py-1 rounded text-sm font-mono">$1</code>')
  html = html.replace(/\\textsl\{([^}]+)\}/g, '<em class="italic">$1</em>')
  html = html.replace(/\\textsc\{([^}]+)\}/g, '<span class="uppercase tracking-wide text-sm">$1</span>')
  html = html.replace(/\\textrm\{([^}]+)\}/g, '<span class="font-serif">$1</span>')
  html = html.replace(/\\textsf\{([^}]+)\}/g, '<span class="font-sans">$1</span>')
  html = html.replace(/\\emph\{([^}]+)\}/g, '<em class="italic">$1</em>')
  html = html.replace(/\\textup\{([^}]+)\}/g, '<span class="not-italic">$1</span>')
  html = html.replace(/\\texorpdfstring\{([^}]*)\}\{([^}]*)\}/g, '$1')

  // Handle itemize
  html = html.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, items) => {
    const itemList = items.match(/\\item\s+([^\n]*?)(?=\\item|\\end)/g) || []
    const listItems = itemList
      .map((item: string) => {
        let text = item.replace(/\\item\s+/, '').trim()
        text = text.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
        text = text.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
        return `<li class="ml-4 mb-2 flex items-start"><span class="mr-3">•</span><span>${text}</span></li>`
      })
      .join('')
    return `<ul class="my-4">${listItems}</ul>`
  })

  // Handle enumerate
  html = html.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (match, items) => {
    const itemList = items.match(/\\item\s+([^\n]*?)(?=\\item|\\end)/g) || []
    const listItems = itemList
      .map((item: string, idx: number) => {
        let text = item.replace(/\\item\s+/, '').trim()
        text = text.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
        text = text.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
        return `<li class="ml-4 mb-2 flex items-start"><span class="mr-3">${idx + 1}.</span><span>${text}</span></li>`
      })
      .join('')
    return `<ol class="my-4">${listItems}</ol>`
  })

  // Handle footnotes, citations, references
  html = html.replace(/\\footnote\{([^}]*)\}/g, '<sup class="text-xs text-orange-400">[*]</sup>')
  html = html.replace(/\\cite\{([^}]*)\}/g, '<sup class="text-xs text-orange-400">[citation]</sup>')
  html = html.replace(/\\citep\{([^}]*)\}/g, '<sup class="text-xs text-orange-400">[citation]</sup>')
  html = html.replace(/\\citet\{([^}]*)\}/g, '<sup class="text-xs text-orange-400">[citation]</sup>')
  html = html.replace(/\\ref\{([^}]*)\}/g, '<a href="#$1" class="text-orange-500 hover:underline">Ref. $1</a>')
  html = html.replace(/\\eqref\{([^}]*)\}/g, '<a href="#$1" class="text-orange-500 hover:underline">($1)</a>')
  html = html.replace(/\\label\{([^}]*)\}/g, '<a id="$1"></a>')

  // Handle figures
  html = html.replace(/\\begin\{figure\*?\}[\s\S]*?\\caption\{([^}]*)\}[\s\S]*?\\end\{figure\*?\}/g, 
    (match, caption) => `<figure class="my-8"><figcaption class="text-sm text-gray-400 italic mt-2">${caption}</figcaption></figure>`
  )
  html = html.replace(/\\includegraphics(?:\s*\[[^\]]*\])?\s*\{([^}]+)\}/g, 
    (match, path) => `<img src="/assets/${path.split('/').pop()}" alt="figure" class="max-w-full h-auto rounded-lg my-4" loading="lazy" />`
  )

  // Handle verbatim
  html = html.replace(/\\begin\{verbatim\}([\s\S]*?)\\end\{verbatim\}/g, 
    (match, code) => `<pre class="bg-cosmic-800 p-4 rounded overflow-x-auto text-sm my-4"><code>${code.trim()}</code></pre>`
  )

  // Handle line breaks
  html = html.replace(/\\\\/g, '<br />')
  html = html.replace(/\\newline/g, '<br />')

  // Handle special text replacements
  html = html.replace(/\\textbackslash/g, '\\')
  html = html.replace(/\\\$/g, '$')
  html = html.replace(/\\%/g, '%')
  html = html.replace(/\\\{/g, '{')
  html = html.replace(/\\\}/g, '}')
  html = html.replace(/\\_/g, '_')
  html = html.replace(/---/g, '—')
  html = html.replace(/--/g, '–')
  html = html.replace(/``/g, '"')
  html = html.replace(/''/g, '"')

  // PHASE 4: Remove ALL remaining LaTeX commands aggressively
  // Remove commands with arguments: \command{...}
  html = html.replace(/\\[a-zA-Z]+\{[^}]*\}/g, '')
  // Remove commands without arguments: \command
  html = html.replace(/\\[a-zA-Z]+/g, '')
  // Remove backslash-symbol commands: \&, \$, etc.
  html = html.replace(/\\[^a-zA-Z]/g, '')

  // Split into paragraphs and wrap
  const paragraphs = html
    .split(/\n\n+/)
    .map((para) => {
      para = para.trim()
      if (!para) return ''
      
      // Don't wrap block elements
      if (/^<(h[1-6]|ul|ol|div|figure|img|table|blockquote|pre|br)/.test(para)) {
        return para
      }
      
      // Handle multiple lines within a paragraph (join them)
      if (para.includes('\n')) {
        para = para.replace(/\n/g, ' ').replace(/\s+/g, ' ')
      }
      
      return `<p class="mb-4 leading-relaxed text-gray-200">${para}</p>`
    })
    .filter((p) => p.length > 0)
    .join('')

  // PHASE 5: Restore math blocks
  let result = paragraphs
  for (const [key, value] of Object.entries(mathBlocks)) {
    result = result.replace(new RegExp(key, 'g'), value)
  }

  return titleHtml + result
}
