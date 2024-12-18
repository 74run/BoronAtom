export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  }
  
  export interface Education {
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }
  
  export interface Experience {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string[];
  }
  
  export interface Project {
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }
  
  export interface Skill {
    category: string;
    items: string[];
  }
  
  export interface ResumeData {
    personal: PersonalInfo;
    education: Education[];
    experience: Experience[];
    projects: Project[];
    skills: Skill[];
  }
  