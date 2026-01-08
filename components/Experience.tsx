import React from 'react';
import { motion } from 'framer-motion';
import type { FrontendHomeTrayectoria } from '@/src/types/content';
interface ExperienceProps { data: FrontendHomeTrayectoria }

const Experience: React.FC<ExperienceProps> = ({ data }) => {
  const items = data?.items || [];

  return (
    <section id="experience" className="py-32 bg-white relative border-t border-gray-100">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6"
          >
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              {data?.pretitulo || 'TRAYECTORIA'}
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-6xl text-primary font-extrabold tracking-wide"
          >
            {(data?.titulo || 'Nuestra Experiencia').split(' ').slice(0,1).join(' ')}{' '}
            <span className="text-accent">{(data?.titulo || 'Nuestra Experiencia').split(' ').slice(1).join(' ')}</span>
          </motion.h2>
        </div>

        {/* Items Grid from CMS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="relative h-[500px] rounded-[2.5rem] overflow-hidden group shadow-2xl"
            >
              {/* Background Image */}
              <img 
                src={item.imagen || ''} 
                alt={item.titulo || ''} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-primary/30 group-hover:bg-primary/10 transition-colors duration-500" />
              
              {/* Content Panel */}
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/90 via-primary/60 to-transparent flex flex-col justify-end p-8">
                <div className="p-6 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                   <h4 className="text-xl font-bold text-white mb-1">{item.titulo}</h4>
                   {item.subtitulo ? (
                     <p className="text-sm text-white/80 mb-1">{item.subtitulo}</p>
                   ) : null}
                   <p className="text-sm text-white/90 leading-relaxed font-medium">{item.parrafo}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Experience;