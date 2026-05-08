export interface Role {
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface CompanyProject {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
}

export interface Experience {
  company: string;
  location?: string;
  roles: Role[];
  projects: CompanyProject[];
}

export interface Project {
  title: string;
  description: string;
  deployUrl: string;
  githubUrl: string;
  technologies: string[];
  imageUrl: string;
}
