import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Box, Compass, PenTool } from 'lucide-react';

interface RelatedServicesProps {
  currentServiceId: string;
  onNavigate: (page: string, id: string) => void;
}

const services = [
  { id: 'steel', title: "Estructuras de Acero", icon: Box },
  { id: 'design', title: "Diseño Arquitectónico", icon: Compass },
  { id: 'structural', title: "Diseño Estructural", icon: PenTool },
];

const RelatedServices: React.FC<RelatedServicesProps> = ({ currentServiceId, onNavigate }) => {
  // Filter out current service
  const otherServices = services.filter(s => s.id !== currentServiceId);

  return (
    <section className="py-24 bg-concrete/20">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="font-display text-3xl md:text-4xl text-primary font-bold mb-12 tracking-tighter text-center">
          Soluciones <span className="text-accent">Complementarias</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {otherServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-2xl border border-transparent hover:border-accent/20 transition-all duration-300 group cursor-pointer"
              onClick={() => onNavigate('service-detail', service.id)}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                <service.icon className="text-primary group-hover:text-white" size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl text-primary font-bold mb-6">{service.title}</h3>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <button className="glass-btn !bg-primary/5 !border-primary/10 px-5 py-2 text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-2 group-hover:bg-primary group-hover:text-white transition-colors">
                    Ver Servicio <ArrowRight size={14} />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedServices;