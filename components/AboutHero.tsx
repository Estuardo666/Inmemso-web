import React from 'react';
import { motion } from 'framer-motion';

const AboutHero: React.FC = () => {
  return (
    <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2600&auto=format&fit=crop"
          alt="Abstract Architecture"
          className="w-full h-full object-cover attachment-fixed"
        />
        {/* Deep Blue Overlay */}
        <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
            <span className="text-xs font-bold tracking-widest text-accent uppercase">
              QUIÉNES SOMOS
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-tighter mb-6 drop-shadow-2xl font-extrabold">
            Fusión de Arte <span className="text-accent">&</span> Ingeniería
          </h1>

          <p className="text-xl md:text-2xl text-white/80 font-light max-w-3xl mx-auto leading-relaxed">
            La historia de cómo transformamos la construcción en Ecuador, elevando cada estructura a la categoría de obra maestra.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;