import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import LaTeXDocument from '../components/LaTeXDocument'
import type { Project } from '../types'

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [mainContent, setMainContent] = useState<string>('')

  useEffect(() => {
    Promise.all([
      fetch('/projectIndex.json')
        .then((res) => res.json())
        .catch(() => []),
      fetch('/main.tex')
        .then((res) => res.text())
        .catch(() => ''),
    ])
      .then(([projectsData, mainTexData]) => {
        setProjects(Array.isArray(projectsData) ? projectsData : [])
        setMainContent(mainTexData || '')
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load content:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cosmic-900">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cosmic-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <header className="pt-16 pb-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-gradient text-6xl md:text-7xl font-bold mb-2 leading-tight">
              Preet Dalal
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-light">
              Physics Research & Academic Portfolio
            </p>
          </motion.div>
        </header>

        <main className="max-w-4xl mx-auto px-4 pb-20 space-y-16">
          {/* About Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-orange-500 pb-3">About</h2>
            <div className="glass-card p-8 rounded-xl">
              <p className="text-gray-200 text-lg leading-relaxed mb-4">
                Welcome to my academic portfolio. I am a physics researcher with a passion for understanding the fundamental laws of the universe. My work spans theoretical physics, cosmology, and computational methods.
              </p>
              <p className="text-gray-300 text-base leading-relaxed">
                This portfolio showcases my research projects, academic work, and computational contributions to the field of physics.
              </p>
            </div>
          </motion.section>

          {/* Education Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-orange-500 pb-3">Education</h2>
            <div className="space-y-4">
              <div className="glass-card p-6 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">Ph.D. in Physics</h3>
                  <span className="text-sm text-orange-400">In Progress</span>
                </div>
                <p className="text-gray-400 mb-2">University / Institution</p>
                <p className="text-gray-300 text-sm">Specialization in theoretical physics and cosmology</p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">B.S. in Physics</h3>
                  <span className="text-sm text-orange-400">Completed</span>
                </div>
                <p className="text-gray-400">University / Institution</p>
              </div>
            </div>
          </motion.section>

          {/* Research Interests */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-orange-500 pb-3">Research Interests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-bold text-orange-400 mb-2">Theoretical Physics</h3>
                <p className="text-gray-300 text-sm">General relativity, quantum mechanics, and field theory</p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-bold text-orange-400 mb-2">Cosmology</h3>
                <p className="text-gray-300 text-sm">Universe expansion, dark matter, and large-scale structure</p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-bold text-orange-400 mb-2">Computational Methods</h3>
                <p className="text-gray-300 text-sm">Numerical simulations and data analysis techniques</p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-bold text-orange-400 mb-2">Astrophysics</h3>
                <p className="text-gray-300 text-sm">Black holes, gravitational waves, and stellar evolution</p>
              </div>
            </div>
          </motion.section>

          {/* Main Research Content */}
          {mainContent && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-orange-500 pb-3">Featured Research</h2>
              <article className="glass-card p-8 rounded-xl">
                <LaTeXDocument content={mainContent} />
              </article>
            </motion.section>
          )}

          {/* Projects Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 border-b-2 border-orange-500 pb-3">Research Projects</h2>
            {projects.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-xl">No projects found. Add .tex files to /projects to get started.</p>
              </div>
            ) : (
              <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-max">
                {projects.map((project, idx) => (
                  <motion.div
                    key={project.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <Link to={`/project/${project.slug}`}>
                      <div className="glass-card group cursor-pointer h-full overflow-hidden flex flex-col shadow-2xl hover:shadow-orange-500/20 transition-all duration-300">
                        <div className="relative overflow-hidden bg-cosmic-800 aspect-video">
                          <img
                            src={project.previewImage}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 200%22%3E%3Crect fill=%22%231a1f3a%22 width=%22400%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23999%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3ENo Image%3C/text%3E%3C/svg%3E'
                            }}
                          />
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                            {project.title}
                          </h3>
                          <p className="text-gray-400 text-sm leading-relaxed flex-grow line-clamp-3">
                            {project.summary}
                          </p>
                          <div className="mt-4 flex items-center text-orange-500 group-hover:text-orange-400 transition-colors">
                            <span className="text-sm font-medium">Read More →</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        </main>
      </div>
    </div>
  )
}
