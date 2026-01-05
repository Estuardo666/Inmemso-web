import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const FactorySection: React.FC = () => {
  return (
    <section className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img 
        src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2669&auto=format&fit=crop" 
        alt="Steel Factory" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/90 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="max-w-4xl mx-auto"
        >
          <h2 className="font-display text-5xl md:text-7xl text-white mb-8 tracking-tight drop-shadow-2xl">
            Donde nace la <span className="text-accent">solidez</span>
          </h2>
          
          <button className="group relative px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold tracking-wide overflow-hidden transition-all hover:bg-white/20 hover:scale-105 hover:shadow-[0_0_40px_rgba(184,144,38,0.4)]">
             <span className="relative z-10 flex items-center gap-3">
               VER TECNOLOGÍA
               <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
             </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FactorySection;