import React, { useEffect } from 'react';
import ProjectHero from './ProjectHero';
import ProjectSpecs from './ProjectSpecs';
import ProjectGallery from './ProjectGallery';
import NextProject from './NextProject';
import ProjectCTA from './ProjectCTA';

interface ProjectTemplateProps {
  data: any;
  nextProject: any;
  onNavigate: (page: string, id: string) => void;
  onBack: () => void;
}

const ProjectTemplate: React.FC<ProjectTemplateProps> = ({ data, nextProject, onNavigate, onBack }) => {
  
  // Scroll to top when data changes (new project loaded)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [data.id]);

  return (
    <div className="bg-white">
      <ProjectHero 
        title={data.title}
        category={data.category}
        image={data.heroImage}
        description={data.description}
        onBack={onBack}
      />
      
      <ProjectSpecs 
        client={data.specs.client}
        location={data.specs.location}
        year={data.specs.year}
        area={data.specs.area}
        description={data.description}
      />
      
      <ProjectGallery images={data.galleryImages} />
      
      <ProjectCTA />

      {nextProject && (
        <NextProject 
          nextProject={{
            id: nextProject.id,
            title: nextProject.title,
            image: nextProject.heroImage
          }}
          onNavigate={(id) => onNavigate('project-detail', id)}
        />
      )}
    </div>
  );
};

export default ProjectTemplate;