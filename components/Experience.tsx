import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

const Counter = ({ value }: { value: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Parse number and non-numeric suffix
  const numericValue = parseInt(value.replace(/,/g, '').match(/\d+/)?.[0] || "0", 10);
  const suffix = value.replace(/[0-9,]/g, '') || "";
  const prefix = value.match(/^[^\d]+/)?.[0] || "";

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
    duration: 2
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(numericValue);
    }
  }, [isInView, numericValue, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toLocaleString();
      }
    });
    return () => unsubscribe();
  }, [springValue]);

  return (
    <span className="flex items-center">
      {prefix}
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
};

const Experience: React.FC = () => {
  const stats = [
    {
      value: "15+",
      label: "Años Construyendo",
      desc: "Experiencia ininterrumpida en el sector industrial y residencial.",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2670&auto=format&fit=crop"
    },
    {
      value: "100+",
      label: "Hogares Creados",
      desc: "Espacios diseñados para perdurar y elevar la calidad de vida.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop"
    },
    {
      value: "50+",
      label: "Proyectos Entregados",
      desc: "Cumplimiento estricto de plazos y estándares de calidad.",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2670&auto=format&fit=crop"
    }
  ];

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
              TRAYECTORIA
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-6xl text-primary font-extrabold tracking-wide"
          >
            Nuestra <span className="text-accent">Experiencia</span>
          </motion.h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
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
                src={stat.image} 
                alt={stat.label} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-primary/30 group-hover:bg-primary/10 transition-colors duration-500" />
              
              {/* Content Panel */}
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/90 via-primary/60 to-transparent flex flex-col justify-end p-8">
                <div className="p-6 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                   <h3 className="text-5xl font-extrabold text-accent mb-2 flex">
                     <Counter value={stat.value} />
                   </h3>
                   <h4 className="text-xl font-bold text-white mb-2">{stat.label}</h4>
                   <p className="text-sm text-white/90 leading-relaxed font-medium">{stat.desc}</p>
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