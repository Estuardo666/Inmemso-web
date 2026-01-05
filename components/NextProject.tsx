import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface NextProjectProps {
  nextProject: {
    id: string;
    title: string;
    image: string;
  };
  onNavigate: (id: string) => void;
}

const NextProject: React.FC<NextProjectProps> = ({ nextProject, onNavigate }) => {
  return (
    <section className="relative w-full h-[50vh] flex items-center overflow-hidden cursor-pointer group" onClick={() => onNavigate(nextProject.id)}>
      {/* Background */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={nextProject.image} 
          alt={nextProject.title} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-primary/80 group-hover:bg-primary/40 transition-colors duration-500 mix-blend-multiply" />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 flex items-center justify-between">
        <div>
          {/* Liquid Glass Pre-title */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 shadow-lg group-hover:bg-accent group-hover:border-accent transition-all duration-300">
             <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
             <span className="text-white text-xs font-bold tracking-widest uppercase">Siguiente Proyecto</span>
          </div>

          <h2 className="font-display text-5xl md:text-7xl text-white tracking-tighter group-hover:translate-x-4 transition-transform duration-500">
            {nextProject.title}
          </h2>
        </div>
        
        <motion.div 
          className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-md group-hover:bg-accent group-hover:border-accent transition-all duration-300"
          whileHover={{ scale: 1.1 }}
        >
          <ArrowRight className="text-white" size={32} />
        </motion.div>
      </div>
    </section>
  );
};

export default NextProject;