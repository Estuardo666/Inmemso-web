import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onNavigate?: (page: string, id?: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string, pageName: string, id?: string) => {
    if (pageName === 'Nosotros' && onNavigate) {
      onNavigate('about');
      window.scrollTo(0,0);
    } else if (pageName === 'Proyectos' && onNavigate) {
      onNavigate('projects'); // New navigation case
      window.scrollTo(0,0);
    } else if (pageName === 'ServiceDetail' && onNavigate && id) {
      onNavigate('service-detail', id);
      window.scrollTo(0,0);
    } else if (onNavigate) {
      onNavigate('home');
      if (href.startsWith('#')) {
         setTimeout(() => {
            const element = document.querySelector(href);
            element?.scrollIntoView({ behavior: 'smooth' });
         }, 100);
      }
    }
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  };

  const navLinks = [
    { name: 'Inicio', href: '#' },
    { name: 'Nosotros', href: '#about' },
    { name: 'Servicios', href: '#services', hasDropdown: true },
    { name: 'Proyectos', href: '#projects' }, // Acts as link to Archive
    { name: 'Blog', href: '#' },
  ];

  const servicesSubmenu = [
    { name: "Estructuras de Acero", id: "steel" },
    { name: "Diseño Arquitectónico", id: "design" },
    { name: "Diseño Estructural", id: "structural" },
    { name: "Paneles Prefabricados", id: "panels" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none`}
      >
        <div 
          className={`
            pointer-events-auto
            relative flex items-center justify-between px-6 py-4 transition-all duration-500 ease-in-out
            ${scrolled || mobileMenuOpen 
              ? 'w-full md:w-[90%] max-w-7xl bg-primary/60 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-2xl' 
              : 'w-full md:w-[95%] max-w-7xl bg-transparent border border-transparent backdrop-blur-[2px]'}
          `}
        >
          {/* Logo */}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); handleNavClick('#', 'Inicio'); }}
            className="flex items-center gap-2 group"
          >
            <img 
              src="https://inmemsoweb.fmmarketingdigital.com/wp-content/uploads/2025/12/Recurso-11.png" 
              alt="Inmemso Logo" 
              className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-2xl p-1.5 border border-white/10 shadow-inner">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group"
                   onMouseEnter={() => link.hasDropdown && setServicesDropdownOpen(true)}
                   onMouseLeave={() => link.hasDropdown && setServicesDropdownOpen(false)}
              >
                <a
                  href={link.href}
                  onClick={(e) => { 
                     if(link.name === 'Nosotros' || link.name === 'Proyectos' || link.hasDropdown) e.preventDefault();
                     if(!link.hasDropdown) handleNavClick(link.href, link.name); 
                  }}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1 transition-all duration-300 hover:shadow-lg ${servicesDropdownOpen && link.hasDropdown ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown size={14} className={`transition-transform duration-300 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />}
                </a>

                {/* Desktop Dropdown */}
                {link.hasDropdown && (
                  <AnimatePresence>
                    {servicesDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-64 p-2 bg-primary/90 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                      >
                         <div className="flex flex-col gap-1">
                           {servicesSubmenu.map((service) => (
                             <button
                               key={service.id}
                               onClick={() => handleNavClick('#', 'ServiceDetail', service.id)}
                               className="text-left px-4 py-3 rounded-xl hover:bg-white/10 text-white/90 hover:text-accent transition-colors text-sm font-medium group/item flex items-center justify-between"
                             >
                               {service.name}
                               <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                             </button>
                           ))}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* CTA - Gold Liquid Glass */}
          <div className="hidden md:block">
            <a
              href="#contact"
              onClick={() => handleNavClick('#contact', 'Contacto')}
              className="glass-btn gold px-8 py-3 text-sm font-bold shadow-lg hover:shadow-accent/40"
            >
              Cotizar
            </a>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-white p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 transition-colors backdrop-blur-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed inset-4 top-28 z-40 md:hidden bg-primary/95 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-start pt-12 gap-6 overflow-y-auto shadow-2xl"
          >
            {navLinks.map((link) => (
              <div key={link.name} className="flex flex-col items-center w-full px-8">
                 <a
                  href={link.href}
                  onClick={(e) => {
                      if(link.name === 'Nosotros' || link.name === 'Proyectos') { e.preventDefault(); handleNavClick(link.href, link.name); }
                      else if(link.hasDropdown) { e.preventDefault(); setServicesDropdownOpen(!servicesDropdownOpen); }
                      else { handleNavClick(link.href, link.name); }
                  }}
                  className="text-3xl font-display tracking-tight text-white hover:text-accent transition-all flex items-center gap-2"
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown size={24} className={`transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />}
                </a>
                
                {/* Mobile Submenu */}
                {link.hasDropdown && servicesDropdownOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="flex flex-col gap-4 mt-4 w-full items-center bg-white/5 rounded-2xl p-4"
                  >
                     {servicesSubmenu.map((service) => (
                       <button
                         key={service.id}
                         onClick={() => handleNavClick('#', 'ServiceDetail', service.id)}
                         className="text-lg text-white/80 font-medium hover:text-accent"
                       >
                         {service.name}
                       </button>
                     ))}
                  </motion.div>
                )}
              </div>
            ))}
            <a
              href="#contact"
              onClick={() => handleNavClick('#contact', 'Contacto')}
              className="mt-6 px-12 py-5 rounded-2xl bg-accent text-white font-bold text-xl shadow-xl shadow-accent/20"
            >
              Cotizar Proyecto
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;