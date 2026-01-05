import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface ProjectHeroProps {
  title: string;
  category: string;
  image: string;
  description: string;
  onBack: () => void;
}

const ProjectHero: React.FC<ProjectHeroProps> = ({ title, category, image, description, onBack }) => {
  const ref = useRef(null);
  
  // Parallax Setup
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  // Parallax movement: Background moves slower (to 40%) than foreground
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Extract first sentence or roughly first 150 chars for the hero summary
  const shortSummary = description.split('.')[0] + '.';

  return (
    <section ref={ref} className="relative w-full h-[95vh] flex items-end overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 w-full h-[120%] z-0 top-0" // Height > 100% to prevent gaps during parallax
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-transparent to-transparent" />
      </motion.div>

      {/* Navigation Back - Floating Glass Button */}
      <div className="absolute top-24 left-6 md:left-12 z-20">
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-primary transition-all duration-300 shadow-lg"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-bold tracking-[0.2em] uppercase">Volver</span>
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl"
        >
          {/* Liquid Glass Pre-title */}
          <div className="inline-flex items-center gap-3 px-6 py-2 mb-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_10px_#b89026]" />
            <span className="text-xs font-bold text-white uppercase tracking-[0.25em]">
              {category}
            </span>
          </div>
          
          {/* Massive Title - WHITE, BOLDER, TIGHTER KERNING */}
          <h1 className="font-display text-7xl md:text-9xl text-white font-extrabold tracking-[-0.05em] leading-[0.9] mb-8 drop-shadow-2xl">
            {title}
          </h1>

          {/* Short Hero Paragraph */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-xl md:text-3xl text-white/90 font-light max-w-2xl leading-relaxed drop-shadow-lg border-l-2 border-accent/50 pl-6"
          >
            {shortSummary}
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-12 hidden md:flex items-center gap-4"
      >
        <span className="text-xs font-bold tracking-widest text-white/50 uppercase">Scroll</span>
        <div className="w-12 h-[1px] bg-white/30" />
      </motion.div>
    </section>
  );
};

export default ProjectHero;