import React from 'react';
import { Instagram, Linkedin, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-[#020f1a] pt-24 pb-12 border-t border-white/5 text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="flex flex-col items-start">
            <img 
              src="https://inmemsoweb.fmmarketingdigital.com/wp-content/uploads/2025/12/Recurso-11.png" 
              alt="Inmemso" 
              className="h-24 w-auto mb-6 object-contain"
            />
            <p className="text-white/70 text-sm leading-relaxed mb-8 font-medium max-w-xs">
              Arquitectura integral e ingeniería industrializada que redefine los estándares de precisión.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/inmemso" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl glass-btn flex items-center justify-center hover:bg-accent hover:border-accent text-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl glass-btn flex items-center justify-center hover:bg-accent hover:border-accent text-white transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl glass-btn flex items-center justify-center hover:bg-accent hover:border-accent text-white transition-all">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-display text-xl text-accent mb-8 tracking-wide font-bold">SERVICIOS</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm font-medium text-white/80 hover:text-white hover:translate-x-1 transition-all block">Diseño Arquitectónico</a></li>
              <li><a href="#" className="text-sm font-medium text-white/80 hover:text-white hover:translate-x-1 transition-all block">Cálculo Estructural</a></li>
              <li><a href="#" className="text-sm font-medium text-white/80 hover:text-white hover:translate-x-1 transition-all block">Paneles Prefabricados</a></li>
              <li><a href="#" className="text-sm font-medium text-white/80 hover:text-white hover:translate-x-1 transition-all block">Construcción en Acero</a></li>
              <li><a href="#" className="text-sm font-medium text-white/80 hover:text-white hover:translate-x-1 transition-all block">Consultoría BIM</a></li>
            </ul>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-display text-xl text-accent mb-8 tracking-wide font-bold">EXPLORAR</h4>
            <ul className="space-y-4">
              <li><a href="#about" className="text-sm font-medium text-white/80 hover:text-white hover:translate-x-1 transition-all block">Nosotros</a></li>
              <li><a href="#projects" className="text-sm font-medium text-white/80 hover:text-white hover:translate-x-1 transition-all block">Portafolio</a></li>
              <li><a href="#technology" className="text-sm font-medium text-white/80 hover:text-white hover:translate-x-1 transition-all block">Tecnología</a></li>
              <li><a href="#experience" className="text-sm font-medium text-white/80 hover:text-white hover:translate-x-1 transition-all block">Trayectoria</a></li>
              <li><a href="#" className="text-sm font-medium text-white/80 hover:text-white hover:translate-x-1 transition-all block">Blog</a></li>
            </ul>
          </div>

           {/* Contact Column */}
           <div>
            <h4 className="font-display text-xl text-accent mb-8 tracking-wide font-bold">CONTACTO</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="mt-1 p-1.5 rounded-lg bg-white/5 border border-white/10">
                   <MapPin className="text-accent" size={18} />
                </div>
                <div>
                   <span className="block text-white font-bold text-lg">Parque Industrial</span>
                   <span className="block text-white/70 text-sm font-light">California y Toronto, Loja, EC</span>
                </div>
              </li>
              <li className="flex items-center gap-4">
                 <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                    <Phone className="text-accent" size={18} />
                 </div>
                <span className="text-white font-bold text-lg tracking-wide">099 597 6683</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                    <Mail className="text-accent" size={18} />
                </div>
                <a href="mailto:patriciosotomayor1@hotmail.com" className="text-white font-bold text-base hover:text-accent transition-colors break-all">
                  patriciosotomayor1@hotmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 font-medium">
          <p>&copy; {new Date().getFullYear()} Inmemso Construcciones. Todos los derechos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;