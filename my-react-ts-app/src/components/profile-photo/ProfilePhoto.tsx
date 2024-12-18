import React, { useRef, useState, useEffect } from "react";
import { Pencil } from "react-bootstrap-icons";
import Modal from "../profile-photo/Model";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MdEdit, MdPreview } from 'react-icons/md';
import ModalContact from "../profile-photo/ModalContact";
import PDFResume from '../profile-photo/MyPdfViewer';

import ReactSpeedometer, { Transition } from "react-d3-speedometer"; // Import React Speedometer


interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

interface EduDetails {
  education: Array<{
    university: string;
    cgpa: string;
    degree: string;
    major: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    includeInResume: boolean;
    isPresent?: boolean;
  }>;
  experience: Array<{
    jobTitle: string;
    company: string;
    location: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string;
    includeInResume: boolean;
    isPresent?: boolean;
  }>;
  summary: Array<{
    content: string;
  }>;
  project: Array<{
    name: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    skills: string;
    description: string;
    includeInResume: boolean;
    isPresent?: boolean;
  }>;
  involvement: Array<{
    organization: string;
    role: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string;
    includeInResume: boolean;
    isPresent?: boolean;
  }>;
  certification: Array<{
    name: string;
    issuedBy: string;
    issuedDate: { month: string; year: string };
    expirationDate: { month: string; year: string };
    url: string;
    includeInResume: boolean;
  }>;
  skills: Array<{
    domain: string;
    name: string;
    includeInResume: boolean;
  }>;
  contact: Array<{
    name: string;
    email: string;
    phoneNumber: string;
    linkedIn: string;
  }>;
}

interface ContactDetails {
  name: string;
  email: string;
  phoneNumber: string;
}

interface ProfileProps {
  UserDetail: UserDetails | null;
  ContactDetail: ContactDetails | null;
}

const Profile: React.FC<ProfileProps> = () => {
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [eduDetails, setEduDetails] = useState<EduDetails | null>(null);
  const avatarUrl = useRef<string>(`https://avatar.iran.liara.run/public/boy?username=${userDetails?.username}`);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { userID } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [profileCompletion, setProfileCompletion] = useState(0); // Profile completion percentage
  const [atsScore, setAtsScore] = useState(0); // ATS score

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateAvatar = (imgSrc: string) => {
    avatarUrl.current = imgSrc;
  };

  const calculateProfileCompletion = (eduDetails: EduDetails | null): number => {
    if (!eduDetails) return 0;

    const totalSections = 6; // Adjust based on the number of profile sections
    let completedSections = 0;

    if (eduDetails.education?.length > 0) completedSections++;
    if (eduDetails.experience?.length > 0) completedSections++;
    if (eduDetails.project?.length > 0) completedSections++;
    if (eduDetails.skills?.length > 0) completedSections++;
    if (eduDetails.certification?.length > 0) completedSections++;
    if (eduDetails.summary?.length > 0) completedSections++;

    return Math.round((completedSections / totalSections) * 100);
  };

  const fetchAtsScore = () => {
    // Example API call to fetch ATS score
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/userprofile/ats-score/${userID}`)
      .then((response) => {
        setAtsScore(response.data.atsScore || 0);
      })
      .catch((error) => {
        console.error("Error fetching ATS score:", error);
      });
  };

  useEffect(() => {
    // Fetch user details
    axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/details/${userID}`)
      .then(response => {
        setUserDetails(response.data.user);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });

    // Fetch education details
    axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/EduDetails/${userID}`)
      .then(eduResponse => {
        const fetchedEduDetails = eduResponse.data.user;
        setEduDetails(fetchedEduDetails);
        const completion = calculateProfileCompletion(fetchedEduDetails);
        setProfileCompletion(completion); // Update profile completion
      })
      .catch(error => {
        console.error('Error fetching education details:', error);
      });

    // Fetch the profile image
    axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/image`, { responseType: 'arraybuffer' })
      .then(response => {
        const base64Image = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        const contentType = response.headers['content-type'];
        avatarUrl.current = `data:${contentType};base64,${base64Image}`;
      })
      .catch(error => {
        console.error('Error fetching image:', error);
      });

    // Fetch ATS score
    fetchAtsScore();
  }, [userID]);

  return (
    <div className="profile-container">
      <style>
        {`
          .profile-container {
            background-color:rgba(0, 3, 8, 0.45);
            border-radius: 12px;
            padding: 2rem;
            color: white;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          }
  
          .profile-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin-bottom: 2.5rem;
            position: relative;
          }
  
          .profile-name {
            color: #63b3ed;
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            letter-spacing: -0.5px;
          }
  
          .profile-email {
            color: #a0aec0;
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
          }
  
          .buttons-container {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
          }
  
          .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-size: 0.95rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
  
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
          }
  
          .btn-primary {
            background: linear-gradient(135deg, #3182ce, #4facfe);
            color: white;
          }
  
          .btn-secondary {
            background: linear-gradient(135deg, #38a169, #68d391);
            color: white;
          }
  
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
            margin: 2.5rem 0;
          }
  
          .metric-card {
            background-color: #1a202c;
            border-radius: 12px;
            padding: 2rem;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: transform 0.2s ease;
          }
  
          .metric-card:hover {
            transform: translateY(-4px);
          }
  
          .metric-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
          }
  
          .metric-title {
            color: #63b3ed;
            font-size: 1.1rem;
            font-weight: 500;
          }
  
          .metric-value {
            color: white;
            font-size: 1.5rem;
            font-weight: 600;
          }
  
          .progress-bar {
            height: 8px;
            background-color: #2d3748;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
          }
  
          .progress-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 1.5s ease-out;
          }
  
          .progress-fill.completion {
            background: linear-gradient(to right, #3182ce, #4facfe);
          }
  
          .progress-fill.ats {
            background: linear-gradient(to right, #38a169, #68d391);
          }
  
          .metric-details {
            margin-top: 1rem;
            color: #a0aec0;
            font-size: 0.9rem;
            line-height: 1.5;
          }
  
          .pdf-preview {
            width: 100%;
            max-width: 800px;
            margin: 2rem auto;
            background: #1a202c;
            border-radius: 12px;
            padding: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
  
          @media (max-width: 768px) {
            .profile-container {
              padding: 1.5rem;
            }
  
            .buttons-container {
              flex-direction: column;
              width: 100%;
            }
  
            .btn {
              width: 100%;
              justify-content: center;
            }
  
            .metrics-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
  
      <div className="profile-header">
        <h1 className="profile-name">
          {eduDetails?.contact?.[0]?.name || `${userDetails?.firstName} ${userDetails?.lastName}`}
        </h1>
        <p className="profile-email">
          {eduDetails?.contact?.[0]?.email || userDetails?.email}
        </p>
        
        <div className="buttons-container">
          <button className="btn btn-primary" onClick={openModal}>
            <MdEdit size={18} />
            Edit Profile
          </button>
          <button className="btn btn-secondary">
            <MdPreview size={18} />
            Preview Resume
          </button>
        </div>
      </div>
  
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <h2 className="metric-title">Profile Completion</h2>
            <span className="metric-value">{profileCompletion}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill completion" 
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <div className="metric-details">
            Complete your profile information to improve visibility and opportunities.
          </div>
        </div>
  
        <div className="metric-card">
          <div className="metric-header">
            <h2 className="metric-title">ATS Score</h2>
            <span className="metric-value">{atsScore}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill ats" 
              style={{ width: `${atsScore}%` }}
            />
          </div>
          <div className="metric-details">
            Your resume's compatibility score with Applicant Tracking Systems.
          </div>
        </div>
      </div>
  
      <div className="pdf-preview">
        <PDFResume userDetails={userDetails} eduDetails={eduDetails} />
      </div>
  
      {modalOpen && (
        <Modal
          updateAvatar={updateAvatar}
          closeModal={() => setModalOpen(false)}
          currentAvatar={avatarUrl.current}
        />
      )}
  
      <ModalContact isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );

};

export default Profile;
