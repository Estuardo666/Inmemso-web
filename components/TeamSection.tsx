import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

const team: TeamMember[] = [
  {
    name: "Arq. Patricio Sotomayor",
    role: "Director General",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2544&auto=format&fit=crop",
    bio: "Visionario con más de 20 años redefiniendo la arquitectura industrial en la región sur del país."
  },
  {
    name: "Ing. Roberto M.",
    role: "Director de Ingeniería",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop",
    bio: "Especialista en cálculo estructural y sismorresistencia. La mente maestra detrás de la seguridad de Inmemso."
  },
  {
    name: "Arq. Sofia L.",
    role: "Jefa de Planificación",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop",
    bio: "Diseñadora senior encargada de fusionar la estética minimalista con la funcionalidad de cada espacio."
  }
];

const TeamSection: React.FC = () => {
  return (
    <section className="py-24 bg-concrete/30 relative">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-6xl text-primary mb-4 tracking-tighter">
            Mentes <span className="text-accent">Maestras</span>
          </h2>
          <p className="text-secondary/60 text-lg max-w-2xl mx-auto">
            El equipo multidisciplinario detrás de cada línea y cada viga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group relative h-[600px] w-full rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl bg-white"
            >
              {/* Image with Grayscale to Color Interaction */}
              <img 
                src={member.image} 
                alt={member.name} 
                className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 ease-in-out group-hover:grayscale-0 group-hover:scale-110"
              />

              {/* Liquid Glass Info Card - Floating Reveal */}
              <div className="absolute inset-x-4 bottom-4 translate-y-[80px] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
                <div className="relative overflow-hidden rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/40 p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                  
                  {/* Glossy Reflection */}
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                  <div className="relative z-10">
                    <h3 className="font-display text-2xl text-white mb-1 tracking-wide drop-shadow-md">
                      {member.name}
                    </h3>
                    <p className="text-accent font-bold text-sm uppercase tracking-widest mb-4">
                      {member.role}
                    </p>
                    
                    {/* Hidden Content Revealed on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <p className="text-white/90 text-sm leading-relaxed mb-6 font-medium">
                        {member.bio}
                      </p>
                      
                      <div className="flex gap-3">
                        <button className="p-2 rounded-xl bg-white/20 hover:bg-white text-white hover:text-primary transition-colors backdrop-blur-md border border-white/20">
                          <Linkedin size={18} />
                        </button>
                        <button className="p-2 rounded-xl bg-white/20 hover:bg-white text-white hover:text-primary transition-colors backdrop-blur-md border border-white/20">
                          <Mail size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TeamSection;