import React, { useRef, useState, useEffect } from "react";
import { Border, Pencil } from "react-bootstrap-icons";
import Modal from "./Model";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MdEdit } from 'react-icons/md';

import { PersonFill } from 'react-bootstrap-icons';

import ModalContact from "./ModalContact";
import { Left } from "react-bootstrap/lib/Media";

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  // Add other fields as needed
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
  const [contactDetails, setContactDetails] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  
  const avatarUrl = useRef<string>(
    "https://avatarfiles.alphacoders.com/161/161002.jpg"
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [fullImageModalOpen, setFullImageModalOpen] = useState<boolean>(false);
  
  const { userID } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null); 

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateContactDetails = (updatedDetails: {
    name: string;
    email: string;
    phoneNumber: string;
  }) => {
    setContactDetails(updatedDetails);
  };


  const updateAvatar = (imgSrc: string) => {
    avatarUrl.current = imgSrc;
  };

  useEffect(() => {
    // Make an HTTP request to fetch user details based on the user ID
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
    <div className="container mt-3">
    <div className="d-flex flex-column align-items-center pt-0">
    
    <div className="position-relative">
        {/* Add onClick handler to the image */}
        <img
          src={avatarUrl.current}
          alt="Avatar"
          className="rounded-circle border border-secondary"
          style={{ width: "150px", height: "150px", cursor: "pointer"}}
          onClick={() => setFullImageModalOpen(true)}
        />
        <button
          className="position-absolute bottom-0 start-50 translate-middle p-1 rounded-circle bg-dark border border-dark"
          title="Change photo"
          onClick={() => setModalOpen(true)}
        >
          <Pencil size={50} style={{width: "20px", height: "20px"}} className="text-light" />
        </button>
      </div>
     

<PersonFill
    style={{
      position: "relative",
      top: '20',
      color: "black",
      fontSize: "1.5rem",
      cursor: "pointer",
    }}
    onClick={openModal}
  /> <h4 className="text-black font-weight-bold mt-4" style={{ marginBottom: '0.2rem' }}>
  {contactDetails && contactDetails.name ? contactDetails.name : (userDetails && `${userDetails.firstName} ${userDetails.lastName}`)}
</h4>




      <p style={{ fontFamily: 'Arial, sans-serif', marginBottom: '0.6rem', fontSize: '0.8rem' }} className="text-secondary text-sm mt-2">{contactDetails && contactDetails.email ? contactDetails.email :(userDetails && `${userDetails.email}`)}
</p>

<div style={{ position: "relative" }}>
  
  <ModalContact
    isOpen={isModalOpen}
    closeModal={closeModal} 
  />
</div>


      {/* Edit Avatar Modal */}
      {modalOpen && (
        <Modal
          updateAvatar={updateAvatar}
          closeModal={() => setModalOpen(false)}
          currentAvatar={avatarUrl.current}  
        />
      )}
       
        {/* PDF Download and Preview Buttons */}
        

        
      </div>
    </div>
  );
};

export default Profile;
