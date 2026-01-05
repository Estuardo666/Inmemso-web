import React from 'react';
import { motion } from 'framer-motion';

const StorySection: React.FC = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2">
             <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-6xl text-primary mb-8 tracking-tighter"
            >
              Más que constructores, <br/>
              <span className="text-accent">Arquitectos de Realidades.</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6 text-lg text-secondary/70 leading-relaxed font-medium"
            >
              <p>
                Inmemso nace de una inquietud fundamental: la desconexión existente entre la visión del arquitecto y la ejecución del constructor. 
                Cansados de ver cómo los detalles se perdían en la traducción, decidimos integrar ambos mundos.
              </p>
              <p>
                Somos una firma liderada por arquitectos que decidieron no solo diseñar, sino construir con sus propias manos y tecnología. 
                Eliminamos la brecha entre el plano y la obra mediante una infraestructura industrial propia que garantiza que lo que se dibuja, se edifica con precisión milimétrica.
              </p>
            </motion.div>
          </div>

          {/* Collage Images */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
            <motion.div 
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="space-y-4 mt-8"
            >
              <img src="https://images.unsplash.com/photo-1621252179027-94459d27d3ee?q=80&w=2670&auto=format&fit=crop" alt="Architectural Plan" className="rounded-[2rem] shadow-xl w-full h-64 object-cover" />
              <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2670&auto=format&fit=crop" alt="Steel Structure" className="rounded-[2rem] shadow-xl w-full h-48 object-cover" />
            </motion.div>
            <motion.div 
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="space-y-4"
            >
              <img src="https://images.unsplash.com/photo-1531834685032-c34bf0d84c7c?q=80&w=2597&auto=format&fit=crop" alt="Construction Site" className="rounded-[2rem] shadow-xl w-full h-48 object-cover" />
              <img src="https://images.unsplash.com/photo-1481253127861-534498168948?q=80&w=2573&auto=format&fit=crop" alt="Modern Building" className="rounded-[2rem] shadow-xl w-full h-64 object-cover" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default StorySection;