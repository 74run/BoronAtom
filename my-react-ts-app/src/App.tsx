
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




const Profile: React.FC = () => {


  return (
    <>
      <Router>
        {/* NavigationBar is used outside the Switch to ensure it's always rendered */}
        <NavigationBar
    
        />
      </Router>

      {/* Three Sections Layout */}
      <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>
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
            
            <Projects />
            <Skills />
            <EducationSection />
            <ExperienceSection />
            <CertificationSection />
            <InvolvementSection />
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
