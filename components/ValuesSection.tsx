import React from 'react';
import { Ruler, Factory, Lightbulb, ShieldCheck } from 'lucide-react';

const values = [
  { icon: Ruler, title: "Precisión", desc: "Tolerancia cero al error. Nuestra ingeniería de detalle asegura un ensamblaje perfecto." },
  { icon: Factory, title: "Autonomía", desc: "Fábrica propia de acero y prefabricados. No dependemos de terceros." },
  { icon: Lightbulb, title: "Innovación", desc: "Investigación constante en nuevos materiales y sistemas constructivos ligeros." },
  { icon: ShieldCheck, title: "Transparencia", desc: "Procesos claros, presupuestos cerrados y tiempos de entrega garantizados." },
];

const ValuesSection: React.FC = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="mb-12">
          <span className="text-sm font-bold tracking-widest text-primary uppercase block mb-2">Nuestro ADN</span>
          <h2 className="font-display text-4xl text-primary tracking-tighter">Pilares Fundamentales</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, index) => (
            <div 
              key={index}
              className="p-8 rounded-[2rem] bg-concrete/20 border border-primary/5 hover:border-accent/30 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <val.icon className="text-accent" size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl text-primary mb-3">{val.title}</h3>
              <p className="text-sm text-secondary/70 leading-relaxed font-medium">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;