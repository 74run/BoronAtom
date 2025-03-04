import React, { useRef, useState, useEffect } from "react";
import { Pencil } from "react-bootstrap-icons";
import Modal from "../profile-photo/Model";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MdEdit, MdPreview, MdUploadFile } from 'react-icons/md';
import ModalContact from "../profile-photo/ModalContact";
import PDFResume from '../profile-photo/MyPdfViewer';
import ProfilePictureModal from './ProfilePictureModal';
import UploadResume from './UploadResume';

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
  const [isUploadResumeModalOpen, setIsUploadResumeModalOpen] = useState(false);

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
        .get(`${process.env.REACT_APP_API_URL}/api/userprofile/image`, { 
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
        `${process.env.REACT_APP_API_URL}/api/userprofile/image`,
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
      axios.delete(`https://localhost:3001/api/userprofile/image`)
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
    <div className="bg-[#000308] bg-opacity-45 rounded-xl p-8 text-white shadow-lg">
      <div className="flex flex-col items-center text-center mb-10 relative">
        {isLoading ? (
          <div className="animate-pulse flex flex-col items-center w-full">
            <div className="w-24 h-24 bg-gray-700 rounded-full mb-4"></div>
            <div className="h-8 w-48 bg-gray-700 rounded mb-2"></div>
            <div className="h-6 w-32 bg-gray-700 rounded mb-4"></div>
          </div>
        ) : (
          <>
            <img 
              src={profileImage || avatarUrl.current}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-sky-400 transition-all duration-200 cursor-pointer hover:border-[#4facfe] hover:scale-105"
              onClick={() => setIsProfilePictureModalOpen(true)}
            />
            <h1 className="text-[#63b3ed] text-2xl font-semibold mb-2 tracking-tight">
              {(eduDetails?.contact?.[0]?.name || 
               (userDetails?.firstName && userDetails?.lastName && 
                `${userDetails.firstName} ${userDetails.lastName}`) || 
               'Add Your Name')}
            </h1>
            <p className="text-[#a0aec0] text-base mb-6">
              {eduDetails?.contact?.[0]?.email || 
               userDetails?.email || 
               'Add Your Email'}
            </p>
          </>
        )}

        <div className="flex gap-4 mb-8">
          {isLoading ? (
            <div className="animate-pulse flex gap-4">
              <div className="h-10 w-32 bg-gray-700 rounded"></div>
              <div className="h-10 w-32 bg-gray-700 rounded"></div>
              <div className="h-10 w-32 bg-gray-700 rounded"></div>
            </div>
          ) : (
            <>
              <button 
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#3182ce] to-[#4facfe] text-white text-sm font-medium shadow-md hover:-translate-y-0.5 transition-transform"
                onClick={openModal}
              >
                <MdEdit size={18} />
                Edit Profile
              </button>
              <button 
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#38a169] to-[#68d391] text-white text-sm font-medium shadow-md hover:-translate-y-0.5 transition-transform"
              >
                <MdPreview size={18} />
                Preview Resume
              </button>
              <button 
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#805ad5] to-[#b794f4] text-white text-sm font-medium shadow-md hover:-translate-y-0.5 transition-transform"
                onClick={() => setIsUploadResumeModalOpen(true)}
              >
                <MdUploadFile size={18} />
                Upload Resume
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {isLoading ? (
            <>
              <div className="animate-pulse">
                <div className="h-6 w-40 bg-gray-700 rounded mb-4"></div>
                <div className="h-8 w-full bg-gray-700 rounded"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-6 w-40 bg-gray-700 rounded mb-4"></div>
                <div className="h-8 w-full bg-gray-700 rounded"></div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-[#1a202c] rounded-xl p-6 border border-white/10 transition-transform hover:-translate-y-1">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                  <h2 className="text-[#63b3ed] text-lg font-semibold break-words flex-1 min-w-0">Profile Completion</h2>
                  <span className="text-white text-lg font-bold">{profileCompletion}%</span>
                </div>
                <div className="h-2 bg-[#2d3748] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#3182ce] to-[#4facfe] rounded-full transition-all duration-1500"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
                <p className="text-[#a0aec0] text-sm mt-4 leading-relaxed">
                  Complete your profile information to improve visibility and opportunities.
                </p>
              </div>

              <div className="bg-[#1a202c] rounded-xl p-6 border border-white/10 transition-transform hover:-translate-y-1">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                  <h2 className="text-[#63b3ed] text-lg font-semibold break-words flex-1 min-w-0">ATS Score</h2>
                  <span className="text-white text-lg font-bold">{atsScore}%</span>
                </div>
                <div className="h-2 bg-[#2d3748] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#38a169] to-[#68d391] rounded-full transition-all duration-1500"
                    style={{ width: `${atsScore}%` }}
                  ></div>
                </div>
                <p className="text-[#a0aec0] text-sm mt-4 leading-relaxed">
                  Your resume's compatibility score with Applicant Tracking Systems.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <ProfilePictureModal
        isOpen={isProfilePictureModalOpen}
        onClose={() => setIsProfilePictureModalOpen(false)}
        currentImage={profileImage || `https://avatar.iran.liara.run/public/boy?username=${userDetails?.username}`}
        onImageUpdate={handleProfilePictureUpdate}
        handleDelete={handleProfilePictureDelete}
      />

      {modalOpen && (
        <Modal
          updateAvatar={updateAvatar}
          closeModal={() => setModalOpen(false)}
          currentAvatar={avatarUrl.current}
        />
      )}

      <ModalContact isOpen={isModalOpen} closeModal={closeModal} />

      <UploadResume 
        userID={userID} 
        isOpen={isUploadResumeModalOpen}
        onClose={() => setIsUploadResumeModalOpen(false)}
      />
    </div>
  );

};

export default Profile;
