import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Box, Hammer, Building2 } from 'lucide-react';
import type { FrontendHomeSoluciones } from '@/src/types/content';

const techFeatures = [
  {
    id: 0,
    title: "Paneles Prefabricados",
    icon: Box,
    description: "Venta e instalación de sistemas modulares. Reducimos el tiempo de obra en un 40% con acabados perfectos desde fábrica.",
    image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: 1,
    title: "Armado de Vigas IPE",
    icon: Hammer,
    description: "Ingeniería de detalle en acero. Cortes, perforaciones y soldaduras certificadas para estructuras de grandes luces.",
    image: "https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f?q=80&w=2564&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Construcción Completa",
    icon: Building2,
    description: "Servicio llave en mano. Desde la cimentación profunda hasta los acabados finales, bajo una sola supervisión experta.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2531&auto=format&fit=crop"
  }
];

interface TechShowcaseProps { data: FrontendHomeSoluciones }

const TechShowcase: React.FC<TechShowcaseProps> = ({ data }) => {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section id="technology" className="py-32 relative bg-secondary/20">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="mb-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6"
          >
            <span className="text-xs font-bold tracking-widest text-accent uppercase">
              {data?.pretitulo || 'Innovación'}
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-6xl text-white font-extrabold mb-6 tracking-wide"
          >
            {(data?.titulo || 'Soluciones Especializadas').split(' ').slice(0,1).join(' ')}{' '}
            <span className="text-accent">{(data?.titulo || 'Soluciones Especializadas').split(' ').slice(1).join(' ')}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/70 leading-relaxed"
          >
            {data?.parrafo || 'Nuestra metodología constructiva integra tecnología de punta con procesos artesanales refinados. Cada componente es tratado con rigor industrial para garantizar durabilidad y estética superior.'}
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 h-auto lg:h-[600px]">
          
          {/* Left Column: Menu */}
          <div className="w-full lg:w-1/3 flex flex-col justify-center gap-4">
            {techFeatures.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(index)}
                className={`w-full text-left p-6 rounded-[2rem] transition-all duration-500 border flex items-center justify-between group backdrop-blur-md ${
                  activeFeature === index 
                    ? 'bg-accent border-accent shadow-[0_0_30px_rgba(184,144,38,0.3)] scale-105' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${activeFeature === index ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                    <feature.icon size={24} className={activeFeature === index ? 'text-white' : 'text-white/50 group-hover:text-white'} />
                  </div>
                  <span className={`text-lg font-bold tracking-tight ${activeFeature === index ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                    {feature.title}
                  </span>
                </div>
                {activeFeature === index && (
                  <ArrowRight className="text-white animate-pulse" size={20} />
                )}
              </button>
            ))}
          </div>

          {/* Right Column: Image Display */}
          <div className="w-full lg:w-2/3 relative rounded-[2.5rem] overflow-hidden border border-white/20 shadow-2xl bg-white/5 backdrop-blur-xl p-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full h-full rounded-[2rem] overflow-hidden relative"
              >
                <img 
                  src={techFeatures[activeFeature].image} 
                  alt={techFeatures[activeFeature].title} 
                  className="w-full h-full object-cover"
                />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent p-12 flex flex-col justify-end">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="font-display text-4xl text-white font-bold mb-4 tracking-wide">{techFeatures[activeFeature].title}</h3>
                    <p className="text-xl text-white/80 max-w-xl leading-relaxed">{techFeatures[activeFeature].description}</p>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TechShowcase;