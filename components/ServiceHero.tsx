import React from 'react';
import { motion } from 'framer-motion';

interface ServiceHeroProps {
  title: string;
  subtitle: string;
  image: string;
}

const ServiceHero: React.FC<ServiceHeroProps> = ({ title, subtitle, image }) => {
  return (
    <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Deep Blue Overlay - Reduced opacity so image is more visible */}
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
        {/* Gradient for text readability at the bottom, transparent at the top */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Glass Capsule */}
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 shadow-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-white uppercase">
              {subtitle}
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-9xl text-white tracking-tighter mb-6 drop-shadow-2xl font-extrabold">
            {title}
          </h1>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceHero;