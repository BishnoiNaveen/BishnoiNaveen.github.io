import React, { useState } from 'react';
import type { Project } from '../../types/project';
import { projects as allProjects } from '../../data/projects';
import ProjectEditorialRow from './ProjectEditorialRow';
import CaseStudyModal from './CaseStudyModal';

interface EditorialProjectsListProps {
  customProjects?: Project[];
}

export default function EditorialProjectsList({ customProjects }: EditorialProjectsListProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter for the 6 featured projects or custom projects
  const displayProjects = customProjects || allProjects.filter((p) => p.featured);

  return (
    <div className="w-full flex flex-col">
      {/* Editorial Rows */}
      <div className="flex flex-col w-full">
        {displayProjects.map((project, index) => (
          <ProjectEditorialRow
            key={project.id}
            project={project}
            index={index}
            onOpenCaseStudy={(proj) => setSelectedProject(proj)}
          />
        ))}
      </div>

      {/* Interactive Level 4 Case Study Modal Sheet */}
      <CaseStudyModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
