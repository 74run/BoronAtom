
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CoverPage from './components/CoverPage';
import Projects from './components/Projects';
import Skills from './components/Skills';
import EducationSection from './components/Education';
import ExperienceSection from './components/ExperienceSection';
import CertificationSection from './components/CertificationSection';
import InvolvementSection from './components/InvolvementSection';
import SummarySection from './components/SummarySection';
import ProfilePhotoWithUpload from './components/ProfilePhotoWithUpload';
import NavigationBar from './components/NavigationBar';
import SectionWrapper from './components/SectionWrapper';

import './index.css';
import './App.css';

import React, { useEffect, useState } from 'react';

interface Education {
  _id: string;
  university: string;
  degree: string;
  major: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
}

interface Experience {
  _id: string;
  jobTitle: string;
  company: string;
  location: string;
  duration: string;
  description: string;
}

interface Involvement {
  _id: string;
  organization: string;
  role: string;
  duration: string;
  description: string;
 
}

interface Certification {
  _id: string;
  name: string;
  issuedBy: string;
  issuedDate: string;
  expirationDate?: string;
  
}

interface Project {
  _id: string;
  name: string;
  description: string;
}


const Profile: React.FC = () => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [involvements, setInvolvements] = useState<Involvement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch('/api/items')
      .then((res) => res.json())
      .then((data) => setEducations(data));
  }, []);

  const handleEditEdu = (id: string, data: { university: string; degree: string; startDate: { month: string; year: string };
    endDate: { month: string; year: string }}) => {
    fetch(`http://localhost:3001/api/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = educations.map((education) =>
          education._id === id ? { ...education, ...data } : education
        );
        setEducations(updatedItems);
      });
  };

  const handleEditExp = (id: string, data: {  jobTitle: string; company: string; location: string; duration: string; description: string }) => {
    fetch(`http://localhost:3001/api/experiences/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = experiences.map((experience) =>
          experience._id === id ? { ...experience, ...data } : experience
        );
        setExperiences(updatedItems);
      });
  };

  const handleEditCert = (id: string, data: {  name: string;
    issuedBy: string;
    issuedDate: string;
    expirationDate?: string; }) => {
    fetch(`http://localhost:3001/api/certifications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = certifications.map((certification) =>
          certification._id === id ? { ...certification, ...data } : certification
        );
        setCertifications(updatedItems);
      });
  };

  const handleEditInv = (id: string, data: {    organization: string;
    role: string;
    duration: string;
    description: string; }) => {
    fetch(`http://localhost:3001/api/involvements/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = involvements.map((involvement) =>
          involvement._id === id ? { ...involvement, ...data } : involvement
        );
        setInvolvements(updatedItems);
      });
  };

  const handleEditPro = (id: string, data: {     name: string;
    description: string; }) => {
    fetch(`http://localhost:3001/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = projects.map((project) =>
          project._id === id ? { ...project, ...data } : project
        );
        setProjects(updatedItems);
      });
  };
  
  // Update onDelete in App.tsx or where you render ItemList
  const handleDeleteEdu = (id: string) => {
    fetch(`http://localhost:3001/api/items/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = educations.filter((education) => education._id !== id);
        setEducations(updatedItems);
      });
  };
  
  const handleDeleteExp = (id: string) => {
    fetch(`http://localhost:3001/api/experiences/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = experiences.filter((experience) => experience._id !== id);
        setExperiences(updatedItems);
      });
  };
  

  const handleDeleteCert = (id: string) => {
    fetch(`http://localhost:3001/api/certifications/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = certifications.filter((certification) => certification._id !== id);
        setCertifications(updatedItems);
      });
  };

  const handleDeleteInv = (id: string) => {
    fetch(`http://localhost:3001/api/involvements/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = involvements.filter((involvement) => involvement._id !== id);
        setInvolvements(updatedItems);
      });
  };

  const handleDeletePro = (id: string) => {
    fetch(`http://localhost:3001/api/projects/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = projects.filter((project) => project._id !== id);
        setProjects(updatedItems);
      });
  };
  
  

  return (
    <>
      <Router >
        {/* NavigationBar is used outside the Switch to ensure it's always rendered */}
        <NavigationBar 
        
    
        />
      </Router>

      {/* Three Sections Layout */}
      <div style={{ display: 'flex', height: '100vh', position: 'relative',  }}>
        {/* Left Section (20%) */}
        <div  style={{ flex: '0 0 20%'}}>
          {/* Add content for the left section */}
          {/* For example: */}
        </div>

        {/* Middle Section (60%) */}
        <div style={{ flex: '0 0 60%', backgroundColor: '#ffffff', position: 'relative' }}>
          {/* Content for the middle section goes here */}
          <CoverPage onUpload={(file: File): void => { } 
           } />
           <div>
          <ProfilePhotoWithUpload   onUpload={(file: File): void => { } 
          }  /></div>
          <SectionWrapper>
            <div style={{ marginTop: '150px' }} />
            <SummarySection />
            
            <Projects Projects={projects} onEdit={handleEditPro}
              onDelete= {handleDeletePro} />
            <Skills />
            <EducationSection Educations={educations} onEdit={handleEditEdu}
              onDelete= {handleDeleteEdu}  />
            <ExperienceSection Experiences={experiences} onEdit={handleEditExp}
              onDelete= {handleDeleteExp}/>
            <CertificationSection Certifications={certifications} onEdit={handleEditCert}
              onDelete= {handleDeleteCert}/>
            <InvolvementSection Involvements={involvements} onEdit={handleEditInv}
              onDelete= {handleDeleteInv} />
          </SectionWrapper>
        </div>

        {/* Right Section (20%) */}
        <div style={{ flex: '0 0 20%' ,position: 'relative'}}>
          {/* Add content for the right section */}
          {/* For example: */}
        </div>
      </div>
    </>
  );
};

export default Profile;
