import React, { useRef, useState, useEffect } from "react";
import { Pencil } from "react-bootstrap-icons";
import Modal from "./Model";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MdEdit } from 'react-icons/md';
import ModalContact from "./ModalContact";
import { AiOutlineFileAdd } from "react-icons/ai";

import PDFResume from './MyPdfViewer';

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

interface ParsedData {
  name?: string;
  contact?: {
    email?: string;
    phone?: string;
    linkedin?: string;
  };
  summary?: string;
  skills?: string[];
  education?: string[];
  experience?: string[];
  projects?: string[];
  certifications?: string[];
  involvements?: string[];
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [eduDetails, setEduDetails] = useState<EduDetails | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  
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
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/details/${userID}`);
        setUserDetails(userResponse.data.user);

        const eduResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/EduDetails/${userID}`);
        setEduDetails(eduResponse.data.user)


        const contactsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/contact`);
        const fetchedContacts = contactsResponse.data.contact;
        setContactDetails(fetchedContacts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userID]);


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


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);

    setUploading(true);
    setMessage(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/userprofile/upload-resume`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage('File uploaded successfully!');
      setParsedData(response.data.parsedData);
    } catch (error) {
      setMessage('Failed to upload file. Please try again.');
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  
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
        {/* Profile Photo */}
        <div
          className="profile-photo"
          style={{
            position: "relative",
            marginBottom: "1.5rem",
            margin: "0 auto", // Center the photo
          }}
        >
          <img
          onClick={() => setModalOpen(true)}
            src={avatarUrl.current}
            alt="Avatar"
            className="rounded-circle"
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              border: "4px solid #2d2d30",
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.5)",
              objectFit: "cover",
              cursor: "pointer",
            }}
            loading="lazy"
          />
          <button
            onClick={() => setModalOpen(true)}
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              padding: "10px",
              cursor: "pointer",
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
              transition: "background-color 0.3s",
            }}
            title="Change photo"
          >
            <Pencil size={20} />
          </button>
        </div>
  
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
            {contactDetails?.name ||
              `${userDetails?.firstName} ${userDetails?.lastName}`}
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
        <div
          style={{
            flex: "1",
            marginLeft: "20px",
            marginTop: "10px",
            maxWidth: "100%",
            backgroundColor: "#2d2d30",
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
            textAlign: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1.5rem",
                color: "#4CAF50",
                fontFamily: "'Roboto Slab', serif",
              }}
            >
              Upload Your Resume
            </h2>
            <div
              style={{
                display: "inline-block",
                width: "100%",
                padding: "15px",
                border: "2px dashed #4A90E2",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <input
                type="file"
                id="fileInput"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
              />
              <label
                htmlFor="fileInput"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  color: "#fff",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
              >
                <AiOutlineFileAdd style={{ fontSize: "2rem", color: "#4A90E2" }} />
                <span style={{ marginTop: "10px", color: "#bbb", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                  {selectedFile ? selectedFile.name : "Upload file"}
                </span>
              </label>
            </div>
            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  backgroundColor: uploading ? "#6c757d" : "#4CAF50",
                  color: "#fff",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            )}
            {message && (
              <p
                style={{
                  marginTop: "15px",
                  color: "#4CAF50",
                  fontSize: "1rem",
                }}
              >
                {message}
              </p>
            )}
          </div>
        </div>
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
