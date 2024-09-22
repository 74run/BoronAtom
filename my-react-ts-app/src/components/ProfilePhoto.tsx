import React, { useRef, useState, useEffect } from "react";
import { Pencil } from "react-bootstrap-icons";
import Modal from "./Model";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MdEdit } from 'react-icons/md';
import ModalContact from "./ModalContact";
import PDFResume from './MyPdfViewer';
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
  }>
  summary: Array<{
      content: string;
    
  }>
  project: Array<{
    name: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    skills: string;
    description: string;
    includeInResume: boolean;
    isPresent?: boolean;
  }>
  involvement: Array<{
  organization: string;
  role: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  description: string;
  includeInResume: boolean;
  isPresent?: boolean;
  }>
  certification: Array<{
  name: string;
  issuedBy: string;
  issuedDate: { month: string; year: string };
  expirationDate: { month: string; year: string };
  url: string;
  includeInResume: boolean;
  }>
  skills: Array<{
    domain: string;
    name: string;
    includeInResume: boolean;
  }>
  contact: Array<{
    name: string;
    email: string;
    phoneNumber: string;
    linkedIn: string;
  }>
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
    // Fetch user details
    axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/details/${userID}`)
      .then(response => {
        setUserDetails(response.data.user);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
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

  }, [userID]);


  return (
    <div
      className="container mt-5"
      style={{
        fontFamily: "'Roboto', sans-serif",
        color: "#f5f5f5",
        backgroundColor: "#1c1c1e",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
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
          textAlign: "center", // Center text by default on smaller screens
        }}
      >

        {/* User Details and Edit Contact Info */}
        <div style={{ flex: "1", textAlign: "center", marginTop: "10px" }}>
          <h4
            style={{
              fontWeight: "bold",
              fontSize: "1.7rem",
              color: "#f5f5f5",
              marginBottom: "0.5rem",
            }}
          >
            {contactDetails?.name || `${userDetails?.firstName} ${userDetails?.lastName}`}
          </h4>
          <p
            style={{
              fontSize: "1rem",
              color: "#bbb",
              marginBottom: "1.5rem",
            }}
          >
            {contactDetails?.email || userDetails?.email}
          </p>

          <button
            onClick={openModal}
            style={{
              padding: "0.6rem 1.5rem",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "25px",
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s",
              marginBottom: "20px",
            }}
          >
            <MdEdit size={20} style={{ marginRight: "8px" }} />
            Edit Contact Info
          </button>

          <PDFResume userDetails={userDetails} eduDetails={eduDetails} />
        </div>

   
    

      {/* Upload Resume Section */}
      <UploadResume userID={userID} />
      </div>

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
