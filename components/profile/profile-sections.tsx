"use client";

import { useProfileEditor } from "./editor/use-profile-editor";
import { ExperienceManager } from "./editor/experience-manager";
import { ProjectsManager } from "./editor/projects-manager";
import { GithubImportModal } from "./editor/github-import-modal";

export type { Role, Experience, Project, CompanyProject } from "./editor/types";

interface Props {
  initialExperiences?: string | null;
  initialProjects?: string | null;
  githubUrl?: string | null;
}

export function ProfileSections({
  initialExperiences,
  initialProjects,
  githubUrl,
}: Props) {
  const {
    experiences,
    projects,
    loadingGithub,
    githubRepos,
    showGithubModal,
    selectedRepos,
    setShowGithubModal,
    addExperience,
    removeExperience,
    updateExperience,
    addRole,
    removeRole,
    updateRole,
    calculateDuration,
    calculateTotalExperience,
    addCompanyProject,
    removeCompanyProject,
    updateCompanyProject,
    addProject,
    removeProject,
    updateProject,
    handleFetchGithub,
    toggleRepoSelection,
    confirmGithubImport,
  } = useProfileEditor({ initialExperiences, initialProjects, githubUrl });

  return (
    <div className="space-y-16">
      <ExperienceManager
        experiences={experiences}
        onAddExperience={addExperience}
        onRemoveExperience={removeExperience}
        onUpdateExperience={updateExperience}
        onAddRole={addRole}
        onRemoveRole={removeRole}
        onUpdateRole={updateRole}
        onAddCompanyProject={addCompanyProject}
        onRemoveCompanyProject={removeCompanyProject}
        onUpdateCompanyProject={updateCompanyProject}
        calculateDuration={calculateDuration}
        calculateTotalExperience={calculateTotalExperience}
      />

      <div className="h-px bg-border w-full" />

      <ProjectsManager
        projects={projects}
        loadingGithub={loadingGithub}
        onAddProject={addProject}
        onRemoveProject={removeProject}
        onUpdateProject={updateProject}
        onFetchGithub={handleFetchGithub}
      />

      <GithubImportModal
        isOpen={showGithubModal}
        onClose={() => setShowGithubModal(false)}
        githubUrl={githubUrl ?? null}
        githubRepos={githubRepos}
        selectedRepos={selectedRepos}
        onToggleRepo={toggleRepoSelection}
        onConfirm={confirmGithubImport}
      />
    </div>
  );
}
