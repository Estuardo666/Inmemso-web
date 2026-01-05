import React from 'react';
import { motion } from 'framer-motion';

const images = [
  "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531834685032-c34bf0d84c7c?q=80&w=2597&auto=format&fit=crop"
];

const ServiceGallery: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-12">
            <span className="text-sm font-bold tracking-widest text-primary uppercase block mb-2">Galería Visual</span>
            <h2 className="font-display text-4xl text-primary tracking-tighter">Detalles en Ejecución</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
          {/* Main Large Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 h-[400px] md:h-full rounded-[2.5rem] overflow-hidden relative group"
          >
            <img 
              src={images[0]} 
              alt="Main Project" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          {/* Side Stacked Images */}
          <div className="flex flex-col gap-6 h-full">
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="h-[300px] md:h-1/2 rounded-[2.5rem] overflow-hidden relative group"
            >
              <img 
                src={images[1]} 
                alt="Detail 1" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="h-[300px] md:h-1/2 rounded-[2.5rem] overflow-hidden relative group"
            >
              <img 
                src={images[2]} 
                alt="Detail 2" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceGallery;