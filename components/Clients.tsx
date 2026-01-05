import React from 'react';
import { motion } from 'framer-motion';
import { Building, Landmark, Briefcase } from 'lucide-react';

const clients = [
  { name: "Municipio de Quito", icon: Landmark },
  { name: "Consejo Provincial", icon: Landmark },
  { name: "Constructora Vial", icon: Briefcase },
  { name: "Inmobiliaria Futuro", icon: Building },
  { name: "Municipio de Guayaquil", icon: Landmark },
  { name: "Constructora Andes", icon: Briefcase },
  { name: "Gobierno Local", icon: Landmark },
];

const Clients: React.FC = () => {
  return (
    <section className="py-20 border-t border-gray-100 bg-white overflow-hidden">
      <div className="container mx-auto px-6 mb-12 text-center">
        <span className="text-primary text-sm font-bold tracking-[0.3em] uppercase">Confían en Nosotros</span>
      </div>

      <div className="relative flex w-full overflow-hidden">
        {/* Gradient Masks - White */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 z-10 bg-gradient-to-r from-white to-transparent"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 z-10 bg-gradient-to-l from-white to-transparent"></div>

        <motion.div
          className="flex gap-16 items-center whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            duration: 30,
            ease: "linear",
          }}
        >
          {[...clients, ...clients, ...clients].map((client, index) => (
            <div key={index} className="flex items-center gap-4 text-primary/60 hover:text-primary transition-colors duration-300 group cursor-pointer">
              <div className="p-3 rounded-xl border border-primary/10 bg-primary/5 group-hover:border-accent/30 group-hover:bg-accent/10 transition-colors">
                <client.icon size={32} />
              </div>
              <span className="text-xl font-medium tracking-tight">{client.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Clients;