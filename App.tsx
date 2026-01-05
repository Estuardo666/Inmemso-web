'use client';

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

import type { FrontendProject, FrontendService } from './src/types/content';

type AppProps = {
  services: FrontendService[]
  projects: FrontendProject[]
}

const App: React.FC<AppProps> = ({ services, projects }) => {
  const [activePage, setActivePage] = useState<'home' | 'about' | 'service-detail' | 'projects' | 'project-detail'>('home');
  const [activeServiceId, setActiveServiceId] = useState<string>('steel');
  const [activeProjectId, setActiveProjectId] = useState<string>('residencia-altura');

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

  // Get current service and project data - Memoized
  const currentService = useMemo(() => {
    return services.find((s) => s.id === activeServiceId) || services[0];
  }, [services, activeServiceId]);

  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) || projects[0];
  }, [projects, activeProjectId]);

  const currentProjectIndex = useMemo(() => {
    return projects.findIndex((p) => p.id === activeProjectId);
  }, [projects, activeProjectId]);

  const nextProject = useMemo(() => {
    if (!projects.length) return null;
    return projects[(currentProjectIndex + 1) % projects.length];
  }, [projects, currentProjectIndex]);

  return (
    <div className="relative w-full min-h-screen bg-primary overflow-hidden font-sans selection:bg-accent selection:text-white">

      {/* Nota: El fallback a mocks se resuelve server-side; evitamos overlays de error/loader intrusivos. */}

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
