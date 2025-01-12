import React, { useRef, useState, useEffect } from "react";
import { Pencil } from "react-bootstrap-icons";
import Modal from "../profile-photo/Model";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MdEdit, MdPreview } from 'react-icons/md';
import ModalContact from "../profile-photo/ModalContact";
import PDFResume from '../profile-photo/MyPdfViewer';
import ProfilePictureModal from './ProfilePictureModal';

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
  const [profileImage, setProfileImage] = useState<string>('');
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [eduDetails, setEduDetails] = useState<EduDetails | null>(null);
  const avatarUrl = useRef<string>(`https://avatar.iran.liara.run/public/boy?username=${userDetails?.username}`);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { userID } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [profileCompletion, setProfileCompletion] = useState(0); // Profile completion percentage
  const [atsScore, setAtsScore] = useState(0); // ATS score

  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateAvatar = (imgSrc: string) => {
    avatarUrl.current = imgSrc;
  };

  useEffect(() => {
    const userID = localStorage.getItem('UserID');
    if (userID) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/image`, { 
          responseType: 'arraybuffer' 
        })
        .then((response) => {
          const base64Image = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte), 
              ''
            )
          );
          const contentType = response.headers['content-type'];
          setProfileImage(`data:${contentType};base64,${base64Image}`);
        })
        .catch((error) => {
          console.error('Error fetching profile image:', error);
        });
    }
  }, []);

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

  const handleProfilePictureUpdate = (newImage: string) => {
    setProfileImage(newImage);
    const userID = localStorage.getItem('UserID');
    if (userID) {
      axios.post(
        `${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/image`,
        { imageData: newImage },  // Send the base64 string directly
        { headers: { 'Content-Type': 'application/json' } }
      ).catch((error) => {
        console.error('Error updating profile image:', error);
      });
    }
  };



  const handleProfilePictureDelete = () => {
    const userID = localStorage.getItem('UserID');
    if (userID) {
      axios.delete(`https://localhost:3001/api/userprofile/${userID}/image`)
        .then(() => {
          // Reset the profile image in your state
          setProfileImage(`https://avatar.iran.liara.run/public/boy?username=${userDetails?.username}`); // or set to a default image URL
        })
        .catch((error) => {
          console.error('Error deleting profile image:', error);
        });
    }
  };

// Helper function to convert base64 to file
const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
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
    setIsLoading(true);

    const userDetailsPromise = axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/details/${userID}`)
      .then(response => setUserDetails(response.data.user))
      .catch(error => {
        console.error('Error fetching user details:', error);
      });

    const eduDetailsPromise = axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/EduDetails/${userID}`)
      .then(eduResponse => {
        const fetchedEduDetails = eduResponse.data.user;
        setEduDetails(fetchedEduDetails);
        setProfileCompletion(calculateProfileCompletion(fetchedEduDetails));
      })
      .catch(error => {
        console.error('Error fetching education details:', error);
      });

    const imagePromise = axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/image`, { responseType: 'arraybuffer' })
      .then(response => {
        const base64Image = btoa(
          new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        const contentType = response.headers['content-type'];
        avatarUrl.current = `data:${contentType};base64,${base64Image}`;
      })
      .catch(error => {
        console.error('Error fetching image:', error);
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

         // Ensure loading state is only set to false when all requests are completed
    Promise.allSettled([userDetailsPromise, eduDetailsPromise, imagePromise]).then(() => {
      setIsLoading(false);
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
  

          .profile-pic-profile {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover; /* This ensures the image fills the circle properly */
  margin-bottom: 1rem;
  border: 5px solid skyblue;
  transition: all 0.2s ease;
  cursor: pointer;
}

.profile-pic-profile:hover {
  border-color: #4facfe;
  transform: scale(1.05);
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
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            letter-spacing: -0.5px;
          }
  
          .profile-email {
            color: #a0aec0;
            font-size: 1rem;
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
            font-size: 0.7rem;
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
            gap: 10px;

            flex-wrap: wrap;
          }
 .metric-title {
    color: #63b3ed;
    font-size: 1.1rem; /* Slightly larger for better readability */
    font-weight: 600;
    margin: 0; /* Removes extra margins */
    word-break: break-word; /* Ensures long words wrap */
    flex: 1; /* Allows title to take available space */
    min-width: 0; /* Prevents title from overflowing */
      flex-wrap: wrap;

}

.metric-value {
    color: white;
    font-size: 1.1rem; /* Match size with title for consistency */
    font-weight: 700; /* Slightly bolder for emphasis */
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
            font-size: 0.7rem;
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
        {isLoading ? (
          <div className="animate-pulse flex flex-col items-center w-full">
            <div className="w-24 h-24 bg-gray-700 rounded-full mb-4"></div>
           
          </div>
        ) : (
          <img 
            src={profileImage || avatarUrl.current}
            alt="Profile"
            className="profile-pic-profile"
            onClick={() => setIsProfilePictureModalOpen(true)}
          />
        )}

<ProfilePictureModal
  isOpen={isProfilePictureModalOpen}
  onClose={() => setIsProfilePictureModalOpen(false)}
  currentImage={profileImage || `https://avatar.iran.liara.run/public/boy?username=${userDetails?.username}`}
  onImageUpdate={handleProfilePictureUpdate}
  handleDelete={handleProfilePictureDelete}
/>
{isLoading ? (
  <div className="animate-pulse">
 <div className="h-8 w-48 bg-gray-700 rounded mb-2"></div>
 <div className="h-6 w-32 bg-gray-700 rounded mb-4"></div>
  </div>
) : (
  <>
    <h1 className="profile-name">
      {(eduDetails?.contact?.[0]?.name || 
       (userDetails?.firstName && userDetails?.lastName && 
        `${userDetails.firstName} ${userDetails.lastName}`) || 
       'Add Your Name')}
    </h1>
    <p className="profile-email">
      {eduDetails?.contact?.[0]?.email || 
       userDetails?.email || 
       'Add Your Email'}
    </p>
  </>
)}
        
        <div className="buttons-container">
          {isLoading ? (
            <div className="animate-pulse flex gap-4">
              <div className="h-10 w-32 bg-gray-700 rounded"></div>
              <div className="h-10 w-32 bg-gray-700 rounded"></div>
            </div>
          ) : (
            <>
              <button className="btn btn-primary" onClick={openModal}>
                <MdEdit size={18} />
                Edit Profile
              </button>
              <button className="btn btn-secondary">
                <MdPreview size={18} />
                Preview Resume
              </button>
            </>
          )}
        </div>
      </div>


      <div className="metrics-grid">
        {isLoading ? (
          <>
            <div className="metric-card animate-pulse">
              <div className="h-6 w-40 bg-gray-700 rounded mb-4"></div>
              <div className="h-8 w-full bg-gray-700 rounded"></div>
            </div>
            <div className="metric-card animate-pulse">
              <div className="h-6 w-40 bg-gray-700 rounded mb-4"></div>
              <div className="h-8 w-full bg-gray-700 rounded"></div>
            </div>
          </>
        ) : (
          <>
            <div className="metric-card">
              <div className="metric-header">
                <h2 className="metric-title">Profile Completion</h2>
                <span className="metric-value">{profileCompletion}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill completion" style={{ width: `${profileCompletion}%` }} />
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
                <div className="progress-fill ats" style={{ width: `${atsScore}%` }} />
              </div>
              <div className="metric-details">
            Your resume's compatibility score with Applicant Tracking Systems.
          </div>
            </div>
          </>
        )}
      </div>

      {/* <div className="pdf-preview">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-96 bg-gray-700 rounded"></div>
          </div>
        ) : (
          <PDFResume userDetails={userDetails} eduDetails={eduDetails} />
        )}
      </div> */}


  
     
  
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
