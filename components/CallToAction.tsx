import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CallToAction: React.FC = () => {
  return (
    <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img 
        src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2531&auto=format&fit=crop" 
        alt="Construction Site" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Blue Gradient Overlay */}
      <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/70 to-transparent" />

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="flex flex-col items-center"
        >
             {/* Pre-title */}
             <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_#b89026]"></span>
                <span className="text-sm font-bold tracking-widest text-white uppercase">
                  Comienza Ahora
                </span>
             </div>

             <h2 className="font-display text-6xl md:text-8xl text-white mb-8 tracking-tighter font-extrabold drop-shadow-xl">
               ¿Listo para <span className="text-accent">construir?</span>
             </h2>
             
             <p className="text-xl md:text-3xl text-white/90 max-w-3xl mb-12 font-light leading-relaxed">
               Convierte tu visión en una estructura tangible con la precisión y tecnología de Inmemso.
             </p>
             
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="glass-btn gold px-12 py-6 text-xl font-bold flex items-center gap-4 shadow-2xl tracking-tight"
             >
               INICIAR PROYECTO
               <ArrowRight strokeWidth={2.5} />
             </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;