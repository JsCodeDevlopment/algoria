"use client";

import { useState, useEffect } from "react";
import { getGithubProjectsAction } from "@/app/profile/github-actions";
import type { Experience, Project, Role, CompanyProject } from "./types";

interface UseProfileEditorProps {
  initialExperiences?: string | null;
  initialProjects?: string | null;
  githubUrl?: string | null;
}

export function useProfileEditor({
  initialExperiences,
  initialProjects,
  githubUrl,
}: UseProfileEditorProps) {


  const [experiences, setExperiences] = useState<Experience[]>(() => {
    try {
      if (!initialExperiences) return [];
      const parsed = JSON.parse(initialExperiences);
      return parsed.map((exp: any) => ({
        company: exp.company || "",
        location: exp.location || "",
        roles: (exp.roles || []).map((role: any) => ({
          title: role.title || "",
          startDate: role.startDate || "",
          endDate: role.endDate || "",
          current: role.current || false,
          description: role.description || "",
        })),
        projects: exp.projects || [],
      }));
    } catch {
      return [];
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      if (!initialProjects) return [];
      const parsed = JSON.parse(initialProjects);
      return parsed.map((p: any) => ({
        title: p.title || "",
        description: p.description || "",
        deployUrl:
          p.deployUrl ||
          (p.link && !p.link.includes("github.com") ? p.link : ""),
        githubUrl:
          p.githubUrl ||
          (p.link && p.link.includes("github.com") ? p.link : ""),
        technologies: p.technologies || [],
        imageUrl: p.imageUrl || "",
      }));
    } catch {
      return [];
    }
  });

  const [loadingGithub, setLoadingGithub] = useState(false);
  const [githubRepos, setGithubRepos] = useState<Project[]>([]);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState<Set<number>>(new Set());

  // --- EXPERIENCES LOGIC ---
  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        company: "",
        location: "",
        roles: [
          {
            title: "",
            startDate: "",
            endDate: "",
            current: false,
            description: "",
          },
        ],
        projects: [],
      },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: any,
  ) => {
    const newExp = [...experiences];
    (newExp[index] as any)[field] = value;
    setExperiences(newExp);
  };

  const addRole = (expIndex: number) => {
    const newExp = [...experiences];
    newExp[expIndex].roles.push({
      title: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
    setExperiences(newExp);
  };

  const removeRole = (expIndex: number, roleIndex: number) => {
    const newExp = [...experiences];
    newExp[expIndex].roles = newExp[expIndex].roles.filter(
      (_, i) => i !== roleIndex,
    );
    setExperiences(newExp);
  };

  const updateRole = (
    expIndex: number,
    roleIndex: number,
    field: keyof Role,
    value: string | boolean,
  ) => {
    const newExp = [...experiences];
    (newExp[expIndex].roles[roleIndex] as any)[field] = value;
    setExperiences(newExp);
  };

  const calculateDuration = (start: string, end: string, current: boolean) => {
    if (!start) return "";
    const startDate = new Date(start);
    const endDate = current ? new Date() : end ? new Date(end) : null;

    if (!endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime()))
      return "";

    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months += endDate.getMonth() - startDate.getMonth();
    months += 1;

    if (months <= 0) return "";

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    const parts = [];
    if (years > 0) parts.push(`${years} ${years === 1 ? "ano" : "anos"}`);
    if (remainingMonths > 0)
      parts.push(
        `${remainingMonths} ${remainingMonths === 1 ? "mês" : "meses"}`,
      );

    return parts.join(" e ");
  };

  const calculateTotalExperience = (exp: Experience) => {
    if (!exp.roles.length) return "";

    let minDate: Date | null = null;
    let maxDate: Date | null = null;
    let hasCurrent = false;

    for (const role of exp.roles) {
      if (role.startDate) {
        const d = new Date(role.startDate);
        if (!minDate || d < minDate) minDate = d;
      }
      if (role.current) {
        hasCurrent = true;
      } else if (role.endDate) {
        const d = new Date(role.endDate);
        if (!maxDate || d > maxDate) maxDate = d;
      }
    }

    if (!minDate) return "";
    const finalMaxDate = hasCurrent ? new Date() : maxDate || new Date();

    return calculateDuration(
      minDate.toISOString().split("T")[0],
      finalMaxDate.toISOString().split("T")[0],
      hasCurrent,
    );
  };

  const addCompanyProject = (expIndex: number) => {
    const newExp = [...experiences];
    newExp[expIndex].projects.push({
      title: "",
      description: "",
      link: "",
      imageUrl: "",
    });
    setExperiences(newExp);
  };

  const removeCompanyProject = (expIndex: number, projIndex: number) => {
    const newExp = [...experiences];
    newExp[expIndex].projects = newExp[expIndex].projects.filter(
      (_, i) => i !== projIndex,
    );
    setExperiences(newExp);
  };

  const updateCompanyProject = (
    expIndex: number,
    projIndex: number,
    field: keyof CompanyProject,
    value: string,
  ) => {
    const newExp = [...experiences];
    newExp[expIndex].projects[projIndex][field] = value;
    setExperiences(newExp);
  };

  // --- GLOBAL PROJECTS LOGIC ---
  const addProject = () => {
    setProjects([
      ...projects,
      {
        title: "",
        description: "",
        deployUrl: "",
        githubUrl: "",
        technologies: [],
        imageUrl: "",
      },
    ]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const newProj = [...projects];
    (newProj[index] as any)[field] = value;
    setProjects(newProj);
  };

  const handleFetchGithub = async () => {
    if (!githubUrl) {
      alert("Por favor, guarda o teu URL do GitHub primeiro.");
      return;
    }
    setLoadingGithub(true);
    try {
      const imported = await getGithubProjectsAction(githubUrl);
      setGithubRepos(imported);
      setShowGithubModal(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingGithub(false);
    }
  };

  const toggleRepoSelection = (idx: number) => {
    const next = new Set(selectedRepos);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setSelectedRepos(next);
  };

  const confirmGithubImport = () => {
    const toAdd = githubRepos.filter((_, idx) => selectedRepos.has(idx));
    const existingGithubLinks = new Set(projects.map((p) => p.githubUrl));
    const filtered = toAdd.filter((p) => !existingGithubLinks.has(p.githubUrl));

    setProjects([...projects, ...filtered]);
    setShowGithubModal(false);
    setSelectedRepos(new Set());
  };

  return {
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
  };
}
