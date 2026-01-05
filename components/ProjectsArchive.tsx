import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  heroImage: string;
  specs: { location: string; year: string };
}

interface ProjectsArchiveProps {
  projects: Project[];
  onNavigate: (page: string, id: string) => void;
}

const filters = ["Todos", "Residencial", "Corporativo", "Industrial", "Obra Civil"];

const ProjectsArchive: React.FC<ProjectsArchiveProps> = ({ projects, onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState("Todos");

  const filteredProjects = activeFilter === "Todos" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-white pt-40 pb-32 font-sans relative overflow-hidden">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

      {/* Header & Filter */}
      <div className="container mx-auto px-6 md:px-12 mb-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <span className="text-accent font-extrabold tracking-widest uppercase text-sm mb-4 block">Portafolio</span>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-primary font-extrabold tracking-tighter leading-[0.9]">
            Archivo de <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Proyectos</span>
          </h1>
        </motion.div>

        {/* Liquid Glass Filter Container - iOS 26 Style */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-start"
        >
            <div className="inline-flex flex-wrap gap-2 p-2 rounded-[2rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
            {filters.map((filter) => (
                <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 overflow-hidden ${
                    activeFilter === filter
                    ? 'text-white shadow-md'
                    : 'text-primary/60 hover:text-primary hover:bg-white/40'
                }`}
                >
                {activeFilter === filter && (
                    <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-primary z-0"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ borderRadius: 9999 }}
                    />
                )}
                {/* Refraction effect on active */}
                {activeFilter === filter && (
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none z-10" />
                )}
                <span className="relative z-10">{filter}</span>
                </button>
            ))}
            </div>
        </motion.div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-6 md:px-12">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                key={project.id}
                onClick={() => onNavigate('project-detail', project.id)}
                className="group cursor-pointer relative"
              >
                {/* Project Card */}
                <div className="relative h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-[0_30px_60px_rgba(12,58,99,0.2)] transition-shadow duration-500 bg-concrete/20">
                  
                  {/* Image with Parallax-like scale */}
                  <div className="absolute inset-0 overflow-hidden">
                      <img 
                        src={project.heroImage} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                      />
                  </div>
                  
                  {/* Liquid Glass Overlay - Reveals on Hover */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      {/* Dark Gradient for text readability at bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      
                      {/* Floating Info Card (Liquid Glass) */}
                      <div className="relative z-10 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
                         <div className="p-6 rounded-[2rem] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] overflow-hidden">
                             {/* Glossy Reflection */}
                             <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                             
                             <div className="relative z-10 flex items-end justify-between">
                                 <div>
                                     <div className="flex items-center gap-2 mb-3">
                                         <span className="px-3 py-1 rounded-full bg-accent/90 text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                             {project.category}
                                         </span>
                                         <span className="text-xs font-bold text-white/80">
                                             {project.specs.year}
                                         </span>
                                     </div>
                                     <h3 className="font-display text-3xl text-white font-extrabold leading-none mb-2">
                                         {project.title}
                                     </h3>
                                     <p className="text-white/70 text-sm font-medium">
                                         {project.specs.location}
                                     </p>
                                 </div>
                                 
                                 <motion.div 
                                    whileHover={{ scale: 1.1, rotate: 45 }}
                                    className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shadow-lg"
                                 >
                                     <ArrowUpRight size={24} strokeWidth={2.5} />
                                 </motion.div>
                             </div>
                         </div>
                      </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsArchive;