import React, { useState, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import TechShowcase from './components/TechShowcase';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Clients from './components/Clients';
import CallToAction from './components/CallToAction';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';

// Internal Page Components
import AboutHero from './components/AboutHero';
import StorySection from './components/StorySection';
import TeamSection from './components/TeamSection';
import ValuesSection from './components/ValuesSection';
import FactorySection from './components/FactorySection';

// Service Page Components
import ServiceHero from './components/ServiceHero';
import ServiceInfo from './components/ServiceInfo';
import ServiceGallery from './components/ServiceGallery';
import RelatedServices from './components/RelatedServices';
import ServiceCTA from './components/ServiceCTA';

// Project Page Components
import ProjectsArchive from './components/ProjectsArchive';
import ProjectTemplate from './components/ProjectTemplate';

// Payload CMS Hooks
import { useServices, useProjects } from './src/hooks/usePayloadData';

// --- DATA MOCKUPS (for fallback when Payload CMS is not configured) ---
const SERVICES_DATA: Record<string, any> = {
  steel: {
    title: "Estructuras de Acero",
    subtitle: "Ingeniería Industrializada",
    image: "https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f?q=80&w=2600&auto=format&fit=crop",
    description: "La columna vertebral de la construcción moderna. Nos especializamos en la fabricación y montaje de estructuras de acero de alta complejidad, desde naves industriales hasta edificios corporativos de gran altura.",
    features: [
      { text: "Vigas IPE y HEA de alta resistencia", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop" },
      { text: "Soldadura certificada AWS", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9af12?q=80&w=800&auto=format&fit=crop" },
      { text: "Montaje 40% más rápido", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop" },
      { text: "Grandes luces sin columnas", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" }
    ]
  },
  design: {
    title: "Diseño Arquitectónico",
    subtitle: "Visión & Estética",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2600&auto=format&fit=crop",
    description: "Transformamos conceptos abstractos en espacios habitables y funcionales. Nuestro enfoque arquitectónico prioriza la luz natural, la eficiencia energética y la integración con el entorno.",
    features: [
      { text: "Modelado 3D fotorrealista", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop" },
      { text: "Planificación bioclimática", image: "https://images.unsplash.com/photo-1470723710355-95304d8aece4?q=80&w=800&auto=format&fit=crop" },
      { text: "Diseño de interiores", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop" },
      { text: "Paisajismo integrado", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=800&auto=format&fit=crop" }
    ]
  },
  structural: {
    title: "Diseño Estructural",
    subtitle: "Seguridad & Cálculo",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2600&auto=format&fit=crop",
    description: "Cálculo avanzado para garantizar la sismorresistencia y longevidad de su edificación. Optimizamos materiales para reducir costos sin comprometer la seguridad.",
    features: [
      { text: "Análisis sísmico espectral", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop" },
      { text: "Optimización de secciones", image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop" },
      { text: "Memorias de cálculo", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86d50?q=80&w=800&auto=format&fit=crop" },
      { text: "Cumplimiento NEC-15 / ACI", image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=800&auto=format&fit=crop" }
    ]
  },
  panels: {
    title: "Paneles Prefabricados",
    subtitle: "Construcción Modular",
    image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=2670&auto=format&fit=crop",
    description: "Sistemas modulares que revolucionan los tiempos de obra. Aislamiento térmico y acústico superior con acabados de fábrica listos para instalar.",
    features: [
      { text: "Aislamiento térmico EPS/PIR", image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=800&auto=format&fit=crop" },
      { text: "Montaje seco y limpio", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop" },
      { text: "Resistencia al fuego", image: "https://images.unsplash.com/photo-1517581177697-a0e85f559843?q=80&w=800&auto=format&fit=crop" },
      { text: "Ideal para fachadas", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=800&auto=format&fit=crop" }
    ]
  }
};

const PROJECTS_DATA = [
  {
    id: "residencia-altura",
    title: "Residencia Altura",
    category: "Residencial",
    heroImage: "https://images.unsplash.com/photo-1600596542815-2a4d04774c13?q=80&w=2675&auto=format&fit=crop",
    description: "Ubicada en las laderas de Cumbayá, Residencia Altura desafía la gravedad con voladizos de acero de 6 metros. La estructura principal, completamente metálica, permite ventanales de piso a techo que integran el paisaje andino con el interior minimalista. El desafío principal fue cimentar en terreno inclinado sin alterar la topografía natural.",
    specs: { client: "Familia R.", location: "Cumbayá, Quito", year: "2023", area: "850 m²" },
    galleryImages: [
       "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2670&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2574&auto=format&fit=crop"
    ]
  },
  {
    id: "corporativo-nova",
    title: "Torre Corporativa Nova",
    category: "Corporativo",
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop",
    description: "Un hito de sostenibilidad y eficiencia. Torre Nova utiliza una piel de vidrio inteligente y una estructura híbrida de acero y concreto para maximizar el espacio útil. Sus plantas libres de columnas intermedias ofrecen flexibilidad total para las oficinas modernas.",
    specs: { client: "Grupo Nova", location: "Av. 12 de Octubre, Quito", year: "2024", area: "12,000 m²" },
    galleryImages: [
       "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2670&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2670&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2670&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=2670&auto=format&fit=crop"
    ]
  },
  {
    id: "nave-industrial-p1",
    title: "Centro Logístico P1",
    category: "Industrial",
    heroImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2670&auto=format&fit=crop",
    description: "Ingeniería de gran escala para el sector logístico. Esta nave industrial cuenta con luces libres de 40 metros, permitiendo una maniobrabilidad excepcional. El uso de paneles térmicos prefabricados garantiza un control de temperatura eficiente para productos sensibles.",
    specs: { client: "Logística Andina", location: "Yaguachi, Guayas", year: "2022", area: "5,000 m²" },
    galleryImages: [
       "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2669&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2670&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1504328345606-18bbc8c9af12?q=80&w=2670&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=2670&auto=format&fit=crop"
    ]
  },
  {
    id: "loft-industrial",
    title: "Loft Industrial 90",
    category: "Residencial",
    heroImage: "https://images.unsplash.com/photo-1595524362625-f76156e52c80?q=80&w=2670&auto=format&fit=crop",
    description: "Rehabilitación de un antiguo almacén convertido en vivienda de lujo. Se preservaron las vigas originales de acero remachado, integrándolas con acabados de madera y vidrio. Un ejemplo de cómo el pasado industrial puede convivir con el confort contemporáneo.",
    specs: { client: "Privado", location: "Centro Histórico, Cuenca", year: "2023", area: "320 m²" },
    galleryImages: [
       "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=2544&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1534349762913-961f7776530f?q=80&w=2670&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2670&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2670&auto=format&fit=crop"
    ]
  },
  {
    id: "puente-peatonal",
    title: "Puente El Sauce",
    category: "Obra Civil",
    heroImage: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=2670&auto=format&fit=crop",
    description: "Conectando comunidades. Este puente peatonal de estructura metálica atirantada no solo cumple una función vital de movilidad, sino que se convierte en una escultura urbana. Su diseño ligero minimiza el impacto visual sobre el río.",
    specs: { client: "GAD Municipal", location: "Loja", year: "2023", area: "120 ml" },
    galleryImages: [
       "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2670&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2744&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1559632490-6da466989489?q=80&w=2671&auto=format&crop",
       "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=2670&auto=format&fit=crop"
    ]
  }
];

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<'home' | 'about' | 'service-detail' | 'projects' | 'project-detail'>('home');
  const [activeServiceId, setActiveServiceId] = useState<string>('steel');
  const [activeProjectId, setActiveProjectId] = useState<string>('residencia-altura');

  // Payload CMS hooks
  const { services: payloadServices, loading: servicesLoading, error: servicesError, getServiceById } = useServices();
  const { projects: payloadProjects, loading: projectsLoading, error: projectsError, getProjectById } = useProjects();

  // Memoized navigation handler
  const handleNavigation = useCallback((page: string, id?: string) => {
    if (page === 'service-detail' && id) {
      setActiveServiceId(id);
    }
    if (page === 'project-detail' && id) {
      setActiveProjectId(id);
    }
    setActivePage(page as any);
  }, []);

  // Memoized data selection - CRITICAL FIX: Prevents infinite re-renders
  const isPayloadAvailable = useMemo(() => {
    return !!import.meta.env.VITE_PAYLOAD_API_URL;
  }, []);

  const services = useMemo(() => {
    return isPayloadAvailable ? payloadServices : Object.values(SERVICES_DATA);
  }, [isPayloadAvailable, payloadServices]);

  const projects = useMemo(() => {
    return isPayloadAvailable ? payloadProjects : PROJECTS_DATA;
  }, [isPayloadAvailable, payloadProjects]);

  // Get current service and project data - Memoized
  const currentService = useMemo(() => {
    if (isPayloadAvailable && getServiceById) {
      // This will be async, so we handle it in the component
      return null;
    }
    return SERVICES_DATA[activeServiceId] || SERVICES_DATA['steel'];
  }, [isPayloadAvailable, getServiceById, activeServiceId]);

  const currentProject = useMemo(() => {
    if (isPayloadAvailable && getProjectById) {
      // This will be async, so we handle it in the component
      return null;
    }
    return PROJECTS_DATA.find(p => p.id === activeProjectId) || PROJECTS_DATA[0];
  }, [isPayloadAvailable, getProjectById, activeProjectId]);

  const currentProjectIndex = useMemo(() => {
    return PROJECTS_DATA.findIndex(p => p.id === activeProjectId);
  }, [activeProjectId]);

  const nextProject = useMemo(() => {
    return PROJECTS_DATA[(currentProjectIndex + 1) % PROJECTS_DATA.length];
  }, [currentProjectIndex]);

  // Loading and error states
  const isLoading = useMemo(() => {
    return servicesLoading || projectsLoading;
  }, [servicesLoading, projectsLoading]);

  const hasErrors = useMemo(() => {
    return servicesError || projectsError;
  }, [servicesError, projectsError]);

  return (
    <div className="relative w-full min-h-screen bg-primary overflow-hidden font-sans selection:bg-accent selection:text-white">
      {/* Error state */}
      {hasErrors && (
        <div className="fixed inset-0 bg-red-900/95 z-50 flex items-center justify-center">
          <div className="bg-white text-red-900 p-8 rounded-lg max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Error de Conexión</h2>
            <p className="mb-4">
              No se pudo cargar el contenido desde Payload CMS. 
              Por favor, verifica la configuración de tu API o inténtalo de nuevo más tarde.
            </p>
            <p className="text-sm text-red-600 mb-4">
              {hasErrors}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Recargar Página
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="fixed inset-0 bg-primary/95 z-40 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-white mb-2">Cargando...</h2>
            <p className="text-gray-300">Conectando con Payload CMS</p>
          </div>
        </div>
      )}

      {/* Ambient background glow for dark sections */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00d2ff]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <Navbar onNavigate={handleNavigation} />
        
        <main>
          {activePage === 'home' && (
            <>
              <Hero />
              <About />
              <Services />
              <TechShowcase />
              <Experience />
              <Projects />
              <Clients />
              <CallToAction />
            </>
          )}

          {activePage === 'about' && (
            <>
              <AboutHero />
              <StorySection />
              <ValuesSection />
              <TeamSection />
              <FactorySection />
              <CallToAction />
            </>
          )}

          {activePage === 'projects' && (
            <ProjectsArchive 
              projects={projects}
              onNavigate={handleNavigation}
            />
          )}

          {activePage === 'project-detail' && currentProject && (
            <ProjectTemplate 
              data={currentProject}
              nextProject={nextProject}
              onNavigate={handleNavigation}
              onBack={() => handleNavigation('projects')}
            />
          )}

          {activePage === 'service-detail' && currentService && (
            <>
              <ServiceHero 
                title={currentService.title} 
                subtitle={currentService.subtitle} 
                image={currentService.image} 
              />
              <ServiceInfo 
                description={currentService.description}
                features={currentService.features}
              />
              <ServiceGallery />
              <RelatedServices 
                currentServiceId={activeServiceId}
                onNavigate={handleNavigation}
              />
              <ServiceCTA />
            </>
          )}
        </main>
        
        <Footer />
        <WhatsAppButton />
      </div>
    </div>
  );
};

export default App;
