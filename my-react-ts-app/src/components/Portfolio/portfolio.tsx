import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, faMoon, faLaptopCode, faCode, faChartLine,
  faDatabase, faBrain, faRobot, faChartPie, faCalculator,
  faTools, faToolbox,
  faSuperscript,
  faLanguage,
  faServer,
  faFlask,
  faCloud
} from '@fortawesome/free-solid-svg-icons';
import { 
  faReact, faNodeJs, faHtml5, faCss3Alt, faPython, 
  faDocker
} from '@fortawesome/free-brands-svg-icons';

// Interfaces (Keep your existing interfaces)

// Components
const Navigation: React.FC<{firstName: string; lastName: string}> = ({firstName, lastName}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');
  const userID = localStorage.getItem('UserID');

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/image`, { responseType: 'arraybuffer' });
        const base64Image = btoa(
          new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        const contentType = response.headers['content-type'];
        setProfileImage(`data:${contentType};base64,${base64Image}`);
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    if (userID) {
      fetchProfileImage();
    }
  }, [userID]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-900 shadow sticky top-0 z-50">
      <div className="container mx-auto py-4 px-4 lg:px-20">
        <nav className="flex justify-between items-center">
          <div className="flex items-center">
            
            <h1 className="text-2xl font-bold text-white">{firstName} {lastName}</h1>
          </div>
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu}
            className="lg:hidden text-white focus:outline-none p-2"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={faBars} className="text-2xl" />
          </button>

          {/* Navigation links - desktop */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <NavLinks />
          </div>

          {/* Navigation links - mobile */}
          <div className={`
            fixed top-0 right-0 h-full w-64 bg-gray-900 
            transform transition-transform duration-300 ease-in-out z-50
            lg:hidden
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}>
            <div className="p-6">
              <button 
                onClick={toggleMenu}
                className="absolute top-4 right-4 text-white"
                aria-label="Close menu"
              >
                <FontAwesomeIcon icon={faBars} className="text-2xl" />
              </button>
              <nav className="mt-8">
                <NavLinks mobile={true} onItemClick={() => setIsMenuOpen(false)} />
              </nav>
            </div>
          </div>

          {/* Overlay for mobile menu */}
          {isMenuOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
          )}
        </nav>
      </div>
    </header>
  );
};

// Separate component for nav links to avoid repetition
const NavLinks: React.FC<{mobile?: boolean; onItemClick?: () => void}> = ({mobile, onItemClick}) => {
  const [activeLink, setActiveLink] = useState<string>(window.location.hash || '#home');

  const linkClasses = `
    nav-link relative inline-block px-4 py-2 text-white
    transition-all duration-300 ease-in-out
    before:content-[''] before:absolute before:top-0 before:left-0 
    before:w-full before:h-0.5 before:bg-current
    before:transform before:scale-x-0 before:origin-right
    before:transition-transform before:duration-300 before:ease-in-out
    after:content-[''] after:absolute after:bottom-0 after:right-0
    after:w-full after:h-0.5 after:bg-current
    after:transform after:scale-x-0 after:origin-left
    after:transition-transform after:duration-300 after:ease-in-out
    hover:before:scale-x-100 hover:after:scale-x-100
    ${mobile ? 'block w-full' : ''}
  `;

  const links = [
    {href: "#home", text: "Home"},
    {href: "#about", text: "About"},
    {href: "#experience", text: "Experience"},
    {href: "#projects", text: "Projects"},
    {href: "#education", text: "Education"},
    {href: "#skills", text: "Skills"},
    {href: "#resume", text: "Resume"}
  ];

  const handleClick = (href: string) => {
    setActiveLink(href);
    if (onItemClick) onItemClick();
  };

  return (
    <ul className={`${mobile ? 'space-y-4' : 'flex items-center space-x-8'}`}>
      {links.map(link => (
        <li key={link.href}>
          <a 
            href={link.href} 
            className={`${linkClasses} ${activeLink === link.href ? 'active bg-gray-200 bg-opacity-20 rounded-lg' : ''}`}
            onClick={() => handleClick(link.href)}
          >
            {link.text}
          </a>
        </li>
      ))}
      <li>
        <button className={`${linkClasses} focus:outline-none`}>
          <FontAwesomeIcon icon={faMoon} />
        </button>
      </li>
    </ul>
  );
};

const Hero: React.FC<{firstName: string; lastName: string}> = ({firstName, lastName}) => {
  const [profileImage, setProfileImage] = useState<string>('');
  const userID = localStorage.getItem('UserID');

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/image`, { responseType: 'arraybuffer' });
        const base64Image = btoa(
          new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        const contentType = response.headers['content-type'];
        setProfileImage(`data:${contentType};base64,${base64Image}`);
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    if (userID) {
      fetchProfileImage();
    }
  }, [userID]);

  return (

  <section 
    className="bg-cover bg-center h-screen relative fade-in" 
    id="home" 
    style={{backgroundImage: `url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBvcnRmb2xpbyUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D')`}}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-70"></div>
    <div className="container mx-auto h-full flex items-center justify-center relative z-10">
      <div className="text-center text-white">
        <div className="flex justify-center mb-8">
   

{profileImage && (
              <img 
                src={profileImage} 
                alt="Portrait of the developer" 
                className="rounded-full w-48 h-48 shadow-lg" 
              />
            )}
        </div>
        <h2 className="text-4xl md:text-6xl font-bold mb-4 typing">{firstName} {lastName}</h2>
        <p className="text-lg md:text-xl mb-8">Showcasing my work and skills</p>
        <a 
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-300" 
          href="#about"
        >
          Learn More
        </a>
      </div>
    </div>
  </section>
)};


const About: React.FC = () => {
    const [profileImage, setProfileImage] = useState<string>('');
    const userID = localStorage.getItem('UserID');
  
    useEffect(() => {
      const fetchProfileImage = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/image`, { responseType: 'arraybuffer' });
          const base64Image = btoa(
            new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          const contentType = response.headers['content-type'];
          setProfileImage(`data:${contentType};base64,${base64Image}`);
        } catch (error) {
          console.error('Error fetching profile image:', error);
        }
      };
  
      if (userID) {
        fetchProfileImage();
      }
    }, [userID]);
  
    return (
    <section className="py-16 bg-gray-200 fade-in px-4 lg:px-24" id="about">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">About Me</h2>
        <div className="flex flex-col md:flex-row items-center">
      

{profileImage && (
              <img 
                src={profileImage} 
                alt="Portrait of the developer" 
                className="rounded-full w-48 h-48 mb-8 md:mb-0 md:mr-8 shadow-lg" 
              />
            )}
          <p className="text-lg leading-relaxed">
            I am a passionate developer with experience in creating dynamic and responsive web applications. 
            I love to learn new technologies and improve my skills continuously. My expertise spans across 
            data analysis, data science, and full stack development, making me a versatile asset in any tech team.
          </p>
        </div>
      </div>
    </section>
  )};
  
  // Timeline components for Experience and Education sections
  interface TimelineItemProps {
    side: 'left' | 'right';
    date: string;
    title: string;
    subtitle: string;
    description: string;
    logo: string;
    logoAlt: string;
  }
  
  const TimelineItem: React.FC<TimelineItemProps> = ({
    side,
    date,
    title,
    subtitle,
    description,
    logo,
    logoAlt
  }) => {
    const isRight = side === 'right';
    
    return (
      <div className="mb-8 flex flex-col md:flex-row items-center w-full">
        {!isRight && (
          <div className="order-1 w-full md:w-5/12 px-4 py-4 bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/4 flex justify-center mb-4 md:mb-0">
              <img src={logo} alt={logoAlt} className="w-16 h-16 rounded-full shadow-md" />
            </div>
            <div className="w-full md:w-3/4 text-center md:text-left">
              <p className="mb-2 text-teal-500">{date}</p>
              <h3 className="font-bold text-lg mb-1">{title}</h3>
              <p className="font-semibold mb-2">{subtitle}</p>
              <p>{description}</p>
            </div>
          </div>
        )}
        
        {isRight && (
          <>
            <div className="order-1 w-full md:w-5/12 hidden md:block"></div>
            <div className="order-1 w-full md:w-5/12 md:ml-auto px-4 py-4 bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/4 flex justify-center mb-4 md:mb-0">
                <img src={logo} alt={logoAlt} className="w-16 h-16 rounded-full shadow-md" />
              </div>
              <div className="w-full md:w-3/4 text-center md:text-left">
                <p className="mb-2 text-teal-500">{date}</p>
                <h3 className="font-bold text-lg mb-1">{title}</h3>
                <p className="font-semibold mb-2">{subtitle}</p>
                <p>{description}</p>
              </div>
            </div>
          </>
        )}
        
        {!isRight && <div className="order-1 w-full md:w-5/12 hidden md:block"></div>}
      </div>
    );
  };
  
  // Project Card Component
  interface ProjectCardProps {
    image: string;
    title: string;
    description: string;
    link: string;
  }
  
  const ProjectCard: React.FC<ProjectCardProps> = ({ image, title, description, link }) => (
    <div className="w-full md:w-1/2 lg:w-1/3 p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl hover:rotate-1">
        <img className="w-full h-48 object-cover" src={image} alt={title} />
        <div className="p-6">
          <h3 className="font-bold text-xl mb-2">{title}</h3>
          <p className="text-gray-700 mb-4">{description}</p>
          <a href={link} className="text-teal-500 font-semibold hover:text-teal-600 transition">
            View Project
          </a>
        </div>
      </div>
    </div>
  );
  
  // Skill Circle Component
  interface SkillProps {
    icon: any;
    mainSkill: string;
    relatedSkills: Array<{ icon?: any; name: string; }>;
  }
  
  const SkillCircle: React.FC<SkillProps> = ({ icon, mainSkill, relatedSkills }) => {
    const [isExpanded, setIsExpanded] = useState(false);
  
    return (
      <div className="w-full md:w-1/2 lg:w-1/4 p-4 flex justify-center">
        <div 
          className="skill-circle flex flex-col items-center justify-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="icon">
            <FontAwesomeIcon icon={icon} />
          </div>
          <span className="main-skill">{mainSkill}</span>
          <div className={`related-skills ${isExpanded ? '' : 'hidden'}`}>
            {relatedSkills.map((skill, index) => (
              <span key={index}>
                {skill.icon && <FontAwesomeIcon icon={skill.icon} className="mr-2" />}
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  
  
  // Resume Section
  const Resume: React.FC = () => (
    <section className="py-16 bg-gray-200 fade-in px-4 lg:px-20" id="resume">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-8 text-gray-900">Resume</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg mb-4">
            View or download my resume to learn more about my professional journey.
          </p>
          
          <div className="mb-6">
            <iframe 
              src="Tarun_Janapati_Resume.pdf" 
              width="100%" 
              height="600px" 
              className="rounded-lg shadow-lg" 
              title="Resume Preview"
            />
          </div>
  
          <a 
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full shadow-lg btn"
            href="./Tarun_Janapati_Resume.pdf" 
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            Download Resume
          </a>
        </div>
      </div>
    </section>
  );

  

// Interfaces
interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

interface DateRange {
  month: string;
  year: string;
}

interface Education {
  _id: string;
  university: string;
  cgpa: string;
  degree: string;
  major: string;
  startDate: DateRange;
  endDate: DateRange;
  includeInResume: boolean;
  isPresent?: boolean;
}

interface Experience {
  _id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: DateRange;
  endDate: DateRange;
  description: string;
  includeInResume: boolean;
  isPresent?: boolean;
}

interface Project {
  _id: string;
  name: string;
  startDate: DateRange;
  endDate: DateRange;
  skills: string;
  description: string;
  includeInResume: boolean;
  isPresent?: boolean;
}

interface Involvement {
  _id: string;
  organization: string;
  role: string;
  startDate: DateRange;
  endDate: DateRange;
  description: string;
  includeInResume: boolean;
  isPresent?: boolean;
}

interface Certification {
  _id: string;
  name: string;
  issuedBy: string;
  issuedDate: DateRange;
  expirationDate: DateRange;
  url: string;
  includeInResume: boolean;
}

interface Skill {
  _id: string;
  domain: string;
  name: string;
  includeInResume: boolean;
}

interface SkillProps {
  icon: any;
  mainSkill: string;
  relatedSkills: Array<{ icon?: any; name: string; }>;
  isActive?: boolean;
  onClick?: () => void;
}

interface Summary {
  _id: string;
  content: string;
}

interface ContactDetails {
  name: string;
  email: string;
  phoneNumber: string;
  linkedIn: string;
}

interface EduDetails {
  education: Education[];
  experience: Experience[];
  summary: Summary[];
  project: Project[];
  involvement: Involvement[];
  certification: Certification[];
  skills: Skill[];
  contact: ContactDetails[];
}

interface UserResponse {
    success: boolean;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      username: string;
    };
  }
  
  interface EduDetailsResponse {
    success: boolean;
    user: {
      education: Education[];
      experience: Experience[];
      involvement: Involvement[];
      certification: Certification[];
      project: Project[];
      summary: Summary[];
      skills: Skill[];
      contact: ContactDetails[];
    };
  }
  

// Utility Functions
const formatDate = (date: DateRange, isPresent?: boolean): string => {
  if (isPresent) return 'Present';
  return `${date.month} ${date.year}`;
};

// Components
const Header: React.FC<{ contact: ContactDetails; summary: Summary[] }> = ({ contact, summary }) => (
  <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold">{contact.name}</h1>
      <div className="mt-4 space-y-2">
        <p>{contact.email} | {contact.phoneNumber}</p>
        <p>
          <a 
            href={contact.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-200"
          >
            LinkedIn Profile
          </a>
        </p>
      </div>
      {summary.map(item => (
        <p key={item._id} className="mt-6 text-lg">{item.content}</p>
      ))}
    </div>
  </header>
);

const Experience: React.FC<{ experiences: Experience[] }> = ({ experiences }) => (
  <section className="py-8">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Professional Experience</h2>
      <div className="space-y-8">
        {experiences.filter(exp => exp.includeInResume).map((exp) => (
          <div key={exp._id} className="border-l-4 border-blue-600 pl-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{exp.jobTitle}</h3>
                <p className="text-lg">{exp.company} - {exp.location}</p>
              </div>
              <p className="text-gray-600">
                {formatDate(exp.startDate)} - {formatDate(exp.endDate, exp.isPresent)}
              </p>
            </div>
            <p className="mt-2 text-gray-700 whitespace-pre-line">{exp.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Education: React.FC<{ educations: Education[] }> = ({ educations }) => (
  <section className="bg-gray-50 py-8">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Education</h2>
      <div className="space-y-6">
        {educations.filter(edu => edu.includeInResume).map((edu) => (
          <div key={edu._id} className="border-l-4 border-blue-600 pl-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{edu.university}</h3>
                <p className="text-lg">{edu.degree} in {edu.major}</p>
                <p className="text-gray-600">CGPA: {edu.cgpa}</p>
              </div>
              <p className="text-gray-600">
                {formatDate(edu.startDate)} - {formatDate(edu.endDate, edu.isPresent)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Projects: React.FC<{ projects: Project[] }> = ({ projects }) => (
  <section className="py-8">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Projects</h2>
      <div className="space-y-8">
        {projects.filter(proj => proj.includeInResume).map((project) => (
          <div key={project._id} className="border-l-4 border-blue-600 pl-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{project.name}</h3>
                <p className="text-blue-600">{project.skills}</p>
              </div>
              <p className="text-gray-600">
                {formatDate(project.startDate)} - {formatDate(project.endDate, project.isPresent)}
              </p>
            </div>
            <p className="mt-2 text-gray-700 whitespace-pre-line">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Skills: React.FC<{ skills: Skill[] }> = ({ skills }) => {
  const skillCircleRef = useRef<HTMLDivElement>(null);
  
  const groupedSkills = skills
    .filter(skill => skill.includeInResume)
    .reduce((acc, skill) => {
      if (!acc[skill.domain]) {
        acc[skill.domain] = [];
      }
      acc[skill.domain].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);

  const handleSkillClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    // Remove active class from other skill circles
    const skillCircles = document.querySelectorAll('.skill-circle');
    skillCircles.forEach((circle) => {
      if (circle !== element) {
        circle.classList.remove('active');
      }
    });
    
    // Toggle active class on clicked skill circle
    element.classList.toggle('active');
  };

  return (
    <section className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Skills</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {Object.entries(groupedSkills).map(([domain, skills]) => (
            <div
              key={domain}
              ref={skillCircleRef}
              className="skill-circle"
              onClick={handleSkillClick}
            >
              <div className="main-skill">
                <div className="icon">
                  <FontAwesomeIcon 
                    icon={
                      domain === "Frontend" ? faCode :
                      domain === "Backend" ? faServer :
                      domain === "Database" ? faDatabase :
                      domain === "Cloud" ? faCloud :
                      faLaptopCode
                    } 
                  />
                </div>
                <span>{domain}</span>
              </div>
              <div className="related-skills">
                {skills.map((skill) => (
                  <span key={skill._id}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Certifications: React.FC<{ certifications: Certification[] }> = ({ certifications }) => (
  <section className="py-8">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Certifications</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {certifications.filter(cert => cert.includeInResume).map((cert) => (
          <div key={cert._id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold">{cert.name}</h3>
            <p className="text-gray-600">{cert.issuedBy}</p>
            <p className="text-sm text-gray-500">
              Issued: {formatDate(cert.issuedDate)}
              {cert.expirationDate && ` - Expires: ${formatDate(cert.expirationDate)}`}
            </p>
            {cert.url && (
              <a 
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-blue-600 hover:text-blue-800"
              >
                View Certificate
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);


const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-400 py-8 px-4 lg:px-20">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h2 className="text-2xl font-bold text-white">My Portfolio</h2>
        </div>
        
        <div className="flex space-x-6 text-center">
          <a href="#about" className="hover:text-teal-400">About</a>
          <a href="#experience" className="hover:text-teal-400">Experience</a>
          <a href="#projects" className="hover:text-teal-400">Projects</a>
          <a href="#skills" className="hover:text-teal-400">Skills</a>
          <a href="#education" className="hover:text-teal-400">Education</a>
        </div>

        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          <a 
            href="https://github.com/74run" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-teal-400 transition"
            aria-label="GitHub"
          >
            <i className="fab fa-github fa-2x"></i>
          </a>
          <a 
            href="https://linkedin.com/in/tarun-Janapati" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-teal-400 transition"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin fa-2x"></i>
          </a>
          <a 
            href="mailto:tarunsai.janapati@slu.edu" 
            className="text-gray-400 hover:text-teal-400 transition"
            aria-label="Email"
          >
            <i className="fas fa-envelope fa-2x"></i>
          </a>
        </div>
      </div>

      <div className="text-center mt-8 border-t border-gray-800 pt-6">
        <p className="text-sm">&copy; {new Date().getFullYear()} Tarun Janapati. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const skillIconMap: Record<string, any> = {
    // Web Development
    'React': faReact,
    'Node.js': faNodeJs,
    'HTML': faHtml5,
    'CSS': faCss3Alt,
    'Express': faServer,
    'Flask': faFlask,
    
    // Programming Languages
    'Python': faPython,
    'JavaScript': faCode,
    'SQL': faDatabase,
    'R': faSuperscript,
    
    // Data Science & Analytics
    'TensorFlow': faBrain,
    'Keras': faBrain,
    'PyTorch': faBrain,
    'NLTK': faLanguage,
    'Pandas': faDatabase,
    'NumPy': faCalculator,
    
    // Tools & Technologies
    'Docker': faDocker,
    'Git': faCode,
  };

const domainIconMap: Record<string, any> = {
    'Web Development': faLaptopCode,
    'Programming Languages': faCode,
    'Data Analysis': faChartLine,
    'Database Management': faDatabase,
    'Data Science': faBrain,
    'Machine Learning': faRobot,
    'Data Visualization': faChartPie,
    'Quantitative Analysis': faCalculator
  };


const formatSkills = (skills: Skill[]) => {
    // Group skills by domain
    const groupedSkills = skills
      .filter(skill => skill.includeInResume)
      .reduce((acc, skill) => {
        if (!acc[skill.domain]) {
          acc[skill.domain] = [];
        }
        acc[skill.domain].push(skill);
        return acc;
      }, {} as Record<string, Skill[]>);
  
    // Convert grouped skills to the format expected by SkillCircle
    return Object.entries(groupedSkills).map(([domain, skills]) => ({
      icon: domainIconMap[domain] || faCode, // Default to faCode if no icon found
      mainSkill: domain,
      relatedSkills: skills.map(skill => ({
        icon: skillIconMap[skill.name], // Will be undefined if no icon mapped
        name: skill.name
      }))
    }));
  };
  
  // components/Skills.tsx
  interface SkillSectionProps {
    skills: Skill[];
  }
  
  const SkillsSection: React.FC<SkillSectionProps> = ({ skills }) => {
    const formattedSkills = formatSkills(skills);
    const [activeSkill, setActiveSkill] = useState<number | null>(null);

    const handleSkillClick = (index: number) => {
      setActiveSkill(activeSkill === index ? null : index);
    };
  
    return (
      <section className="py-16 bg-gray-100 px-4 lg:px-24" id="skills">
        <style>
          {`
            .skill-circle {
              position: relative;
              width: 150px;
              height: 150px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #4a5568;
              color: white;
              font-weight: bold;
              text-align: center;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              transition: all 0.3s ease;
            }
            .skill-circle:hover {
              transform: scale(1.1);
              box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            }
            .skill-circle.active {
              width: 250px;
              height: 250px;
            }
            .skill-circle.active .main-skill {
              display: none;
            }
            .skill-circle.active .icon {
              display: none;
            }
            .icon {
              font-size: 1.5rem;
              color: #38b2ac;
              margin-bottom: 12px;
            }
            .related-skills {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              flex-direction: column;
              align-items: center;
              opacity: 0;
              transition: opacity 0.3s ease;
            }
            .skill-circle.active .related-skills {
              display: flex;
              opacity: 1;
            }
            .related-skills span {
              background-color: #38b2ac;
              color: #ffffff;
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 0.9rem;
              text-align: center;
            }
          `}
        </style>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">Skills</h2>
          <div className="flex flex-wrap justify-center">
            {formattedSkills.map((skill, index) => (
              <SkillCircle
                key={index}
                icon={skill.icon}
                mainSkill={skill.mainSkill}
                relatedSkills={skill.relatedSkills}
                isActive={activeSkill === index}
                onClick={() => handleSkillClick(index)}
              />
            ))}
          </div>
        </div>
      </section>
    );
  };



const formatExperienceItems = (experiences: Experience[]) => {
    return experiences
      .filter(exp => exp.includeInResume)
      .map((exp, index) => ({
        side: index % 2 === 0 ? 'right' as const : 'left' as const,
        date: `${formatDate(exp.startDate)} – ${formatDate(exp.endDate, exp.isPresent)}`,
        title: exp.company,
        subtitle: exp.jobTitle,
        description: exp.description.replace(/\*\*/g, '').split('*')[1].trim(),
        location: exp.location,
        logo: `https://logo.clearbit.com/havenofgracestl.org`,
        logoAlt: `${exp.company} Logo`
      }));
  };
  
  const formatEducationItems = (education: Education[]) => {
    return education
      .filter(edu => edu.includeInResume)
      .map((edu, index) => ({
        side: index % 2 === 0 ? 'right' as const : 'left' as const,
        date: `${formatDate(edu.startDate)} – ${formatDate(edu.endDate, edu.isPresent)}`,
        title: edu.university,
        subtitle: `${edu.degree} in ${edu.major}`,
        description: `CGPA: ${edu.cgpa}`,
        logo: `https://logo.clearbit.com/slu.edu`,
        logoAlt: `${edu.university} Logo`
      }));
  };
  
  const formatProjects = (projects: Project[]) => {
    return projects
      .filter(proj => proj.includeInResume)
      .map(proj => ({
        image: `https://picsum.photos/seed/${proj.name}/400/300`,
        title: proj.name,
        description: proj.description.replace(/\*\*/g, '').split('*')[1].trim(),
        skills: proj.skills,
        date: `${formatDate(proj.startDate)} – ${formatDate(proj.endDate, proj.isPresent)}`,
        link: '#' // You might want to add a URL field to your Project interface if needed
      }));
  };

// Updated Portfolio component
const Portfolio: React.FC = () => {
    const { userID } = useParams<{ userID: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserResponse['user'] | null>(null);
    const [portfolioData, setPortfolioData] = useState<EduDetailsResponse['user'] | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
  
          const [userResponse, eduDetailsResponse] = await Promise.all([
            axios.get<UserResponse>(`${process.env.REACT_APP_API_URL}/api/userprofile/details/${userID}`),
            axios.get<EduDetailsResponse>(`${process.env.REACT_APP_API_URL}/api/userprofile/EduDetails/${userID}`)
          ]);
  
          if (!userResponse.data.success || !eduDetailsResponse.data.success) {
            throw new Error('Failed to fetch profile data');
          }
  
          setUserData(userResponse.data.user);
          setPortfolioData(eduDetailsResponse.data.user);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load profile data');
        } finally {
          setLoading(false);
        }
      };
  
      if (userID) {
        fetchData();
      }
    }, [userID]);
  
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      );
    }
  
    if (error || !userData || !portfolioData) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-600 text-center">
            <p className="text-xl">{error || 'Something went wrong'}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
  
    // Transform API data into component props
    const experienceItems = formatExperienceItems(portfolioData.experience);
    const educationItems = formatEducationItems(portfolioData.education);
    const projectItems = formatProjects(portfolioData.project);
  
    return (
      <div className="min-h-screen bg-white">
        <Navigation firstName={userData.firstName} lastName={userData.lastName} />
        <Hero firstName={userData.firstName} lastName={userData.lastName} />
        <About />
        <section className="py-16 bg-gray-300 px-4 lg:px-16" id="experience">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">Experience</h2>
            <div className="relative">
              <div className="border-l-4 border-teal-500 absolute h-full left-1/2 transform -translate-x-1/2 hidden md:block"></div>
              {experienceItems.map((item, index) => (
                <TimelineItem key={index} {...item} />
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 bg-gray-200 px-4 lg:px-20" id="projects">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">Projects</h2>
            <div className="flex flex-wrap -mx-4">
              {projectItems.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 bg-gray-300 fade-in px-4 lg:px-20" id="education">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">Education</h2>
            <div className="relative">
              <div className="border-l-4 border-teal-500 absolute h-full left-1/2 transform -translate-x-1/2 hidden md:block"></div>
              {educationItems.map((item, index) => (
                <TimelineItem key={index} {...item} />
              ))}
            </div>
          </div>
        </section>

        <SkillsSection skills={portfolioData.skills} />
     
        <Resume />
        <Footer />
      </div>
    );
  };
  
  export default Portfolio;

  
   