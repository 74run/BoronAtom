import React, { useRef, useState, useEffect } from "react";
import { Pencil } from "react-bootstrap-icons";
import Modal from "./Model";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MdEdit } from 'react-icons/md';
import ModalContact from "./ModalContact";

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
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
  
  const avatarUrl = useRef<string>("https://avatarfiles.alphacoders.com/161/161002.jpg");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [fullImageModalOpen, setFullImageModalOpen] = useState<boolean>(false);
  
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
    axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/details/${userID}`)
      .then(response => {
        setUserDetails(response.data.user);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });
  }, [userID]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/contact`);
        setContactDetails(response.data[0]);
      } catch (error) {
        console.error('Error fetching contact details:', error);
      }
    };
    fetchData();
  }, [userID]);

  return (
    <div className="container mt-5">
      {/* Profile Header Section */}
      <div
        className="profile-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        {/* Profile Photo */}
        <div
          className="profile-photo"
          style={{ position: "relative", marginBottom: "1.5rem" }}
        >
          <img
            src={avatarUrl.current}
            alt="Avatar"
            className="rounded-circle"
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              border: "4px solid #fff",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              objectFit: "cover",
            }}
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
              padding: "8px",
              cursor: "pointer",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
            }}
            title="Change photo"
          >
            <Pencil size={20} />
          </button>
        </div>
  
        {/* User Details and Edit Contact Info */}
        <div style={{ flex: 1, marginLeft: "20px" }}>
          <h4 style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#333" }}>
            {contactDetails?.name ||
              `${userDetails?.firstName} ${userDetails?.lastName}`}
          </h4>
          <p style={{ fontSize: "1rem", color: "#777", marginBottom: "1.5rem" }}>
            {contactDetails?.email || userDetails?.email}
          </p>

          <button
          onClick={openModal}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "25px",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            marginLeft: "auto", // Push the button to the far right
          }}
        >
          <MdEdit size={20} style={{ marginRight: "8px" }} />
          Edit Contact Info
        </button>
        </div>
  
        {/* Edit Contact Info Button */}
        
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
