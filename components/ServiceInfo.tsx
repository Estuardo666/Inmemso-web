import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';

interface Feature {
  text: string;
  image: string;
}

interface ServiceInfoProps {
  description: string;
  features: Feature[];
}

const ServiceInfo: React.FC<ServiceInfoProps> = ({ description, features }) => {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Main Description - Full Width */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mb-24"
        >
          <h2 className="font-display text-5xl md:text-6xl text-primary mb-8 tracking-tighter font-extrabold">
            Excelencia Técnica y <br/>
            <span className="text-accent">Precisión Estructural</span>
          </h2>
          
          <div className="prose prose-lg text-secondary/70 leading-relaxed font-medium">
            <p className="mb-6 text-2xl text-primary/80 font-bold leading-tight">
              {description}
            </p>
            <div className="columns-1 md:columns-2 gap-12 text-lg">
                <p className="mb-6">
                  En Inmemso, entendemos que este servicio no es solo un proceso constructivo, sino el esqueleto fundamental de su inversión. Utilizamos tecnología BIM de última generación para anticipar conflictos y optimizar recursos antes de tocar el suelo.
                </p>
                <p>
                  Nuestro equipo de ingenieros y arquitectos supervisa cada etapa, garantizando que la estética del diseño no se sacrifique por la funcionalidad, sino que ambas coexistan en perfecta armonía.
                </p>
            </div>
          </div>
        </motion.div>

        {/* Features Grid - Moved Down */}
        <div className="relative">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="flex items-center gap-3 mb-10"
             >
                <div className="p-2 bg-primary/5 rounded-xl border border-primary/10">
                  <Zap className="text-accent" size={24} />
                </div>
                <h3 className="text-3xl font-display font-bold text-primary">Características Clave</h3>
             </motion.div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative h-[320px] rounded-[2rem] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
                  >
                     {/* Background Image */}
                     <img 
                       src={feature.image} 
                       alt={feature.text} 
                       className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                     />
                     
                     {/* Overlay */}
                     <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/20 transition-colors duration-500 mix-blend-multiply" />
                     <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-90 group-hover:opacity-100" />
                     
                     {/* Content */}
                     <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center mb-4 scale-0 group-hover:scale-100 transition-transform duration-300 origin-bottom-left">
                            <Check size={16} className="text-white" strokeWidth={3} />
                        </div>
                        <p className="text-xl font-bold text-white leading-tight transform group-hover:-translate-y-2 transition-transform duration-300">
                           {feature.text}
                        </p>
                        <div className="h-1 w-0 bg-accent mt-4 group-hover:w-12 transition-all duration-500 delay-100" />
                     </div>
                  </motion.div>
                ))}
             </div>
        </div>

      </div>
    </section>
  );
};

export default ServiceInfo;