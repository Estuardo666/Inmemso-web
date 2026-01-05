import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  heightClass: string;
}

const projects: Project[] = [
  { id: 1, title: "Residencia Altura", category: "Residencial", image: "https://picsum.photos/id/15/800/1000", heightClass: "h-[600px]" },
  { id: 2, title: "Corporativo Nova", category: "Corporativo", image: "https://picsum.photos/id/48/800/600", heightClass: "h-[400px]" },
  { id: 3, title: "Loft Industrial", category: "Vivienda", image: "https://picsum.photos/id/593/800/800", heightClass: "h-[500px]" },
  { id: 4, title: "Pabellón Acero", category: "Eventos", image: "https://picsum.photos/id/238/800/1000", heightClass: "h-[600px]" },
  { id: 5, title: "Centro Logístico", category: "Industrial", image: "https://picsum.photos/id/221/800/600", heightClass: "h-[400px]" },
  { id: 6, title: "Casa del Lago", category: "Residencial", image: "https://picsum.photos/id/192/800/900", heightClass: "h-[550px]" },
  { id: 7, title: "Torre Central", category: "Comercial", image: "https://picsum.photos/id/180/800/800", heightClass: "h-[450px]" },
];

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-32 bg-white relative">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="mb-24 max-w-4xl">
           <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6"
          >
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              PORTAFOLIO
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-6xl text-primary font-extrabold mb-6 tracking-wide"
          >
            Proyectos <span className="text-accent">Destacados</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl text-secondary/70 leading-relaxed max-w-2xl"
          >
            Una colección curada de obras donde la precisión de la ingeniería y la visión arquitectónica convergen.
          </motion.p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
              className={`relative group rounded-[2.5rem] overflow-hidden cursor-pointer break-inside-avoid ${project.heightClass}`}
            >
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              
              {/* Overlay Gradient - Reveal on Hover */}
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Info Card with Smooth Reveal */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                 <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                    <div className="flex justify-between items-start mb-4">
                       <span className="inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                         {project.category}
                       </span>
                       <div className="p-2 rounded-full bg-white/10 text-white hover:bg-accent hover:text-white transition-colors">
                          <ArrowUpRight size={20} />
                       </div>
                    </div>
                    <h3 className="font-display text-3xl text-white font-extrabold tracking-wide leading-tight">{project.title}</h3>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Projects;