import React, { useRef, useState, useEffect } from "react";
import { Pencil } from "react-bootstrap-icons";
import Modal from "./Model";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MdEdit } from 'react-icons/md';
import ModalContact from "./ModalContact";
import PDFResume from './MyPdfViewer';
import UploadResume from './UploadResume';
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
    <div
      className="container mt-5"
      style={{
        fontFamily: "'Roboto', sans-serif",
        color: "#f5f5f5",
        background: "linear-gradient(145deg, #1e1e2f, #222232)",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7)",
      }}
    >
      {/* Profile Header Section */}
      <div
        className="profile-header"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div style={{ flex: "1", textAlign: "center" }}>
          <h4 style={{ fontSize: "1.8rem", fontWeight: "600" }}>
            {eduDetails?.contact?.[0]?.name || `${userDetails?.firstName} ${userDetails?.lastName}`}
          </h4>
          <p style={{ color: "#ccc", fontSize: "1rem", marginBottom: "1rem" }}>
            {eduDetails?.contact?.[0]?.email || userDetails?.email}
          </p>
          <button
            onClick={openModal}
            style={{
              padding: "0.7rem 1.5rem",
              background: "linear-gradient(to right, #4caf50, #81c784)",
              color: "#fff",
              border: "none",
              borderRadius: "25px",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "1rem",
              transition: "0.3s ease",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          >
            <MdEdit size={20} style={{ marginRight: "8px" }} />
            Edit Contact Info
          </button>
        </div>
      </div>

      {/* Speedometers Section */}
      <div
        className="speedometers"
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "space-around",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h5 style={{ textAlign: "center", marginBottom: "1rem", color: "#f5f5f5" }}>Profile Completion</h5>
          <ReactSpeedometer
            value={profileCompletion}
            minValue={0}
            maxValue={100}
            needleColor="#f44336"
            startColor="#f44336"
            endColor="#4caf50"
            segments={7}
            needleTransition={Transition.easeElastic}
            needleTransitionDuration={3000}
            width={250}
            height={160}
          />
        </div>

        <div>
          <h5 style={{ textAlign: "center", marginBottom: "1rem", color: "#f5f5f5" }}>ATS Score</h5>
          <ReactSpeedometer
            value={atsScore}
            minValue={0}
            maxValue={100}
            needleColor="#2196f3"
            startColor="#f44336"
            endColor="#4caf50"
            segments={7}
            needleTransition={Transition.easeElastic}
            needleTransitionDuration={3000}
            width={250}
            height={160}
          />
        </div>
      </div>

      {/* Upload Resume */}
      {/* <UploadResume userID={userID} /> */}

      {/* Edit Avatar Modal */}
      {modalOpen && (
        <Modal
          updateAvatar={updateAvatar}
          closeModal={() => setModalOpen(false)}
          currentAvatar={avatarUrl.current}
        />
      )}

      {/* Edit Contact Modal */}
      <ModalContact isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};

export default Profile;
