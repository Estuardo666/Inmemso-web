import React from 'react';
import { motion } from 'framer-motion';

interface ProjectGalleryProps {
  images: string[];
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ images }) => {
  return (
    <section className="py-24 bg-white relative z-10 pb-40">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-20 max-w-3xl">
            {/* Liquid Glass Pre-title */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-md mb-8">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_12px_#b89026]"></span>
                <span className="text-xs font-bold tracking-widest text-primary uppercase">
                  Galería Visual
                </span>
            </div>
            
            <h2 className="font-display text-5xl md:text-7xl text-primary font-extrabold tracking-[-0.05em] leading-[0.9]">
                Detalles <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Constructivos</span>
            </h2>
        </div>

        {/* Masonry Layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-[2rem] overflow-hidden group break-inside-avoid bg-concrete/20 transform-gpu"
            >
              <img 
                src={img} 
                alt={`Project detail ${index + 1}`} 
                className="w-full h-auto object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
              />
              
              {/* Liquid Glass Overlay with Blur */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
                  <div className="absolute inset-0 bg-primary/20 backdrop-blur-[4px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              </div>
              
              {/* Border Shine Effect */}
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-[2rem] transition-colors duration-500 z-20 pointer-events-none" />
              
              {/* Optional Icon Reveal */}
              <div className="absolute bottom-6 left-6 z-30 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest">
                      Ver Detalle
                  </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectGallery;