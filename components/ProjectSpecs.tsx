import React from 'react';
import { motion } from 'framer-motion';

interface ProjectSpecsProps {
  client: string;
  location: string;
  year: string;
  area: string;
  description: string;
}

const ProjectSpecs: React.FC<ProjectSpecsProps> = ({ client, location, year, area, description }) => {
  return (
    <section className="py-24 bg-white relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* Narrative - Left */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-3/5"
          >
            <h2 className="font-display text-5xl md:text-6xl text-primary font-bold mb-12 tracking-tighter">
              La Narrativa
            </h2>
            <div className="space-y-8">
              <p className="text-2xl md:text-3xl text-primary font-medium leading-tight">
                {description.split('.')[0]}.
              </p>
              <div className="text-xl md:text-2xl text-secondary/70 font-light leading-relaxed space-y-6">
                <p>
                  {description.substring(description.indexOf('.') + 1)}
                </p>
                <p>
                  Cada detalle constructivo fue pensado para dialogar con el entorno. La luz natural esculpe los espacios interiores, mientras que la estructura se manifiesta con honestidad material, reflejando nuestra filosofía de ingeniería visible y estética funcional.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Liquid Glass Specs Card - Right (Floating - Dark Blue Variant) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-2/5 lg:pt-12"
          >
            <div className="relative overflow-hidden rounded-[2.5rem] bg-primary text-white border border-white/10 shadow-[0_30px_60px_rgba(12,58,99,0.3)] p-10 group hover:shadow-[0_30px_70px_rgba(184,144,38,0.2)] transition-all duration-500">
               
               {/* Decorative Gradient Overlay */}
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
               <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/20 rounded-full blur-[80px]" />

               <div className="relative z-10">
                 <h3 className="font-display text-3xl text-white mb-10 tracking-tight flex items-center gap-3">
                   <span className="w-2 h-8 bg-accent rounded-full" />
                   Ficha Técnica
                 </h3>
                 
                 <div className="grid grid-cols-1 gap-8">
                   <div className="relative pb-6 border-b border-white/10 group-hover:border-accent/50 transition-colors">
                     <p className="text-xs text-accent font-bold uppercase tracking-[0.2em] mb-2">Cliente</p>
                     <p className="text-2xl text-white font-medium tracking-tight">{client}</p>
                   </div>
                   
                   <div className="relative pb-6 border-b border-white/10 group-hover:border-accent/50 transition-colors">
                     <p className="text-xs text-accent font-bold uppercase tracking-[0.2em] mb-2">Ubicación</p>
                     <p className="text-2xl text-white font-medium tracking-tight">{location}</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-8">
                     <div>
                       <p className="text-xs text-accent font-bold uppercase tracking-[0.2em] mb-2">Año</p>
                       <p className="text-2xl text-white font-medium tracking-tight">{year}</p>
                     </div>
                     <div>
                       <p className="text-xs text-accent font-bold uppercase tracking-[0.2em] mb-2">Área</p>
                       <p className="text-2xl text-white font-medium tracking-tight">{area}</p>
                     </div>
                   </div>
                 </div>

                 {/* Decorative barcode-like element */}
                 <div className="mt-10 flex gap-1 opacity-20">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className={`h-4 bg-white rounded-full ${Math.random() > 0.5 ? 'w-1' : 'w-2'}`} />
                    ))}
                 </div>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ProjectSpecs;