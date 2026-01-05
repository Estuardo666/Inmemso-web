import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ServiceCTA: React.FC = () => {
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl md:text-6xl text-white mb-6 tracking-tighter font-extrabold">
            ¿Necesitas este servicio <br /> para tu proyecto?
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
            Agenda una consultoría técnica gratuita con nuestros especialistas y recibe un presupuesto preliminar en 48 horas.
          </p>
          
          <button className="glass-btn gold px-10 py-5 text-lg font-bold flex items-center gap-3 mx-auto shadow-xl hover:shadow-accent/40 tracking-tight">
            SOLICITAR COTIZACIÓN
            <ArrowRight strokeWidth={2.5} size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceCTA;