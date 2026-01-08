import React from 'react';
import { motion } from 'framer-motion';
import { Compass, PenTool, FileCheck, Anchor, ArrowRight, Layers } from 'lucide-react';
import type { FrontendService, FrontendHomeServicios } from '@/src/types/content';

interface ServicesProps {
  services: FrontendService[];
  data: FrontendHomeServicios;
}

// Icon mapping based on service ID/slug
const serviceIconMap: Record<string, React.ElementType> = {
  'steel': Anchor,           // Estructuras de Acero
  'design': Compass,         // Diseño Arquitectónico
  'structural': PenTool,     // Diseño Estructural
  'panels': Layers,          // Paneles / Otros
};

// Fallback icon if service ID doesn't match
const DEFAULT_ICON = FileCheck;

const Services: React.FC<ServicesProps> = ({ services, data }) => {
  return (
    <section id="services" className="py-32 relative bg-primary/5">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="mb-24 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6"
          >
            <span className="text-xs font-bold tracking-widest text-accent uppercase">
              {data?.pretitulo || 'LO QUE HACEMOS'}
            </span>
          </motion.div>

          <motion.h2
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="font-display text-4xl md:text-7xl text-white font-extrabold mb-6 tracking-wide"
          >
            {data?.titulo?.split(' ')?.[0] || 'Servicios'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">
              {data?.titulo?.split(' ')?.slice(1).join(' ') || 'Integrales'}
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg text-white/70 max-w-2xl"
          >
            {data?.subtitulo || 'Soluciones completas desde la conceptualización hasta el último detalle constructivo.'}
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            // Get icon based on service ID, fallback to default
            const IconComponent = serviceIconMap[service.id] || DEFAULT_ICON;
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ 
                  scale: 1.03, 
                  filter: "brightness(1.1)",
                  transition: { duration: 0.3 } 
                }}
                className="relative rounded-[2rem] border border-white/10 shadow-2xl hover:border-accent/50 hover:shadow-[0_20px_40px_-15px_rgba(184,144,38,0.4)] cursor-pointer group overflow-hidden h-[550px]"
              >
                {/* Background Image with Zoom Effect */}
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Requested Gradient Background - Liquid Glass Style */}
                <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-transparent to-accent/10 opacity-70 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                
                {/* Primary blur overlay for readability - Lighter on hover */}
                <div className="absolute inset-0 bg-primary/60 backdrop-blur-[6px] group-hover:backdrop-blur-[2px] transition-all duration-700" />
                
                {/* Gradient for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                  <div className="pt-2">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:border-accent group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(184,144,38,0.5)] transition-all duration-500">
                      <IconComponent className="text-white" size={28} strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl text-white font-bold mb-4 leading-tight tracking-wide group-hover:text-accent transition-colors duration-300 drop-shadow-md">
                      {service.title}
                    </h3>
                    
                    <div className="h-[1px] w-12 bg-white/30 mb-4 group-hover:w-full group-hover:bg-accent transition-all duration-500" />

                    <p className="text-white/80 leading-relaxed mb-6 group-hover:text-white transition-colors text-base font-medium">
                      {service.subtitle || service.description}
                    </p>

                    <div className="translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                       <button className="glass-btn !bg-accent/20 !border-accent/50 !backdrop-blur-md px-6 py-2.5 rounded-full text-xs font-bold text-white uppercase tracking-widest flex items-center gap-3 hover:!bg-accent hover:border-white">
                          Explorar <ArrowRight size={14} />
                       </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;