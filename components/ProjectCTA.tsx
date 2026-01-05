import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ProjectCTA: React.FC = () => {
  return (
    <section className="py-24 bg-white flex justify-center items-center">
      <div className="container mx-auto px-6 text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="max-w-3xl mx-auto flex flex-col items-center"
        >
          {/* Liquid Glass Pre-title (Light Version) */}
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-md mb-8">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              Hablemos
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-6xl text-primary mb-6 tracking-tighter font-extrabold">
            ¿Tienes un proyecto <br/> <span className="text-accent">similar en mente?</span>
          </h2>

          <p className="text-lg text-secondary/60 mb-10 max-w-xl font-medium leading-relaxed">
            Nuestro equipo de ingeniería y arquitectura está listo para evaluar la viabilidad de tu próxima obra.
          </p>

          <button className="glass-btn gold px-10 py-5 text-base font-bold text-white flex items-center gap-3 shadow-xl hover:shadow-accent/40 hover:-translate-y-1 transition-all duration-300 tracking-tight">
            COTIZAR AHORA
            <ArrowRight size={20} strokeWidth={2.5} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectCTA;