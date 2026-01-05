import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background with clearer image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop"
          alt="Modern Architecture"
          className="w-full h-full object-cover"
        />
        {/* Lighter gradient overlay for better visibility */}
        <div className="absolute inset-0 bg-primary/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        
        {/* Glass Capsule Pre-title - NO DOT */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl shadow-lg">
            <span className="text-sm font-bold tracking-widest text-white uppercase drop-shadow-md">
              Ingeniería que Trasciende
            </span>
          </div>
        </motion.div>

        {/* Main Title - Coolvetica */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="font-display text-6xl md:text-8xl lg:text-9xl text-white tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl font-extrabold"
        >
          INMEMSO
          <span className="block font-sans text-2xl md:text-4xl lg:text-5xl font-light text-white/90 mt-6 tracking-normal drop-shadow-lg">
            Arquitectura Integral & Ingeniería Industrializada
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg md:text-2xl text-white/95 font-medium max-w-2xl mx-auto leading-relaxed mb-12 drop-shadow-lg"
        >
          Creamos estructuras que desafían lo convencional. Precisión milimétrica en acero, diseño atemporal en concreto.
        </motion.p>

        {/* Buttons - Liquid Glass */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col md:flex-row justify-center gap-6"
        >
          <button className="glass-btn px-10 py-5 rounded-full text-white text-base font-bold tracking-tight">
            Ver Proyectos
          </button>
          
          <button className="glass-btn px-10 py-5 rounded-full text-white text-base font-bold tracking-tight">
            Contáctanos
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-accent to-transparent shadow-[0_0_10px_#b89026]"></div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="p-3 rounded-full bg-white/5 border border-white/20 backdrop-blur-md shadow-lg"
        >
          <ArrowDown size={24} className="text-accent drop-shadow-md" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;