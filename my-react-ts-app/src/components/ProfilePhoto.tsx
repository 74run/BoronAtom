import React, { useRef, useState, useEffect } from "react";
import { Pencil, X } from "react-bootstrap-icons";
import Modal from "./Model";
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  // Add other fields as needed
}

interface ProfileProps {
  UserDetail: UserDetails | null;
}


const Profile: React.FC<ProfileProps> = (UserDetail) => {

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const avatarUrl = useRef<string>(
    "https://avatarfiles.alphacoders.com/161/161002.jpg"
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [fullImageModalOpen, setFullImageModalOpen] = useState<boolean>(false);


  const { username,userID } = useParams();
  const updateAvatar = (imgSrc: string) => {
    avatarUrl.current = imgSrc;
  };


  useEffect(() => {
    // Make an HTTP request to fetch user details based on the user ID
    axios.get(`http://localhost:3001/api/userprofile/details/${userID}`)
        .then(response => {
            setUserDetails(response.data.user);
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
        });
}, [userID]);



  return (
    <div className="container mt-(-3)">
      <div className="d-flex flex-column align-items-center pt-0">
        <div className="position-relative">
          {/* Add onClick handler to the image */}
          <img
            src={avatarUrl.current}
            alt="Avatar"
            className="rounded-circle border border-secondary"
            style={{ width: "150px", height: "150px", cursor: "pointer" }}
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
        <h2 className="text-black font-weight-bold mt-4">{userDetails && `${userDetails.firstName} ${userDetails.lastName}`}
</h2>
        <p className="text-secondary text-sm mt-2">{userDetails && `${userDetails.email}`}
</p>

        {/* Edit Avatar Modal */}
        {modalOpen && (
          <Modal
            updateAvatar={updateAvatar}
            closeModal={() => setModalOpen(false)}
            currentAvatar={avatarUrl.current}  
          />
        )}
         
        


      </div>
    </div>
  );
};

export default Profile;
