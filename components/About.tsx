import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import type { FrontendHomeSeccion2 } from '../src/types/content';

interface AboutProps {
  data: FrontendHomeSeccion2
}

const About: React.FC<AboutProps> = ({ data }) => {
  const benefits = data?.items
    ? Object.values(data.items).filter((item) => typeof item === 'string' && item.trim())
    : [
        "Sin Intermediarios",
        "Cobertura Nacional",
        "Tecnología Sismorresistente",
        "Entrega Llave en Mano"
      ];

  if (typeof window !== 'undefined') {
    console.log('[About] Rendered with data:', data);
  }

  return (
    <section id="about" className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/5 border border-primary/10 mb-8"
            >
              <span className="text-xs font-bold tracking-widest text-primary uppercase">
                {data?.pretitulo || 'POR QUÉ ELEGIRNOS'}
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl lg:text-6xl text-primary font-extrabold mb-8 tracking-wide leading-tight"
            >
              {data?.titulo || 'Arquitectura Integral con Infraestructura Propia'}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6 text-lg text-secondary/80 leading-relaxed"
            >
              <p>
                {data?.parrafo || 'En un mercado saturado de intermediarios, Inmemso marca la diferencia. Somos una firma liderada por arquitectos que entiende la obra como un todo. No solo diseñamos visiones estéticas; poseemos la ingeniería industrial para materializarlas.'}
              </p>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.4 }}
               className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 mb-10"
            >
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="text-accent flex-shrink-0" size={24} />
                  <span className="font-semibold text-primary">{benefit}</span>
                </div>
              ))}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (data?.url_boton) {
                  window.location.href = data.url_boton;
                }
              }}
              className="glass-btn !bg-accent !border-accent flex items-center gap-3 px-8 py-4 rounded-full text-white font-bold text-sm tracking-wide shadow-xl hover:shadow-2xl transition-all"
            >
              {data?.texto_boton || 'CONOCER INFRAESTRUCTURA'}
              <ArrowRight size={18} />
            </motion.button>
          </div>

          {/* Image Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl h-[600px]">
              <img 
                src={data?.imagen || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2670&auto=format&fit=crop"} 
                alt="Construction Site" 
                className="w-full h-full object-cover"
              />
              
              {/* Floating Glass Card - DARK BLUE BACKGROUND */}
              <div className="absolute bottom-8 left-8 right-8 p-8 rounded-3xl bg-primary/90 backdrop-blur-xl border border-white/10 shadow-lg text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">{data?.imagen_pretitulo || 'Capacidad Industrial'}</span>
                </div>
                <p className="text-2xl font-display font-bold mb-1">{data?.imagen_titulo || '100% Control de Calidad'}</p>
                <p className="text-sm text-white/80">{data?.imagen_subtitulo || 'Desde la fábrica hasta el montaje final.'}</p>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -z-10 top-10 -right-10 w-full h-full bg-primary/5 rounded-[3rem]"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;