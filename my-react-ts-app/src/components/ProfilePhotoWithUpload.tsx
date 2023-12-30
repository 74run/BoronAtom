// ProfilePhoto.tsx
import React, { useRef , useState} from 'react';
import styled from 'styled-components';
import profileImage from './Gold.png';
import { Modal, Button } from 'react-bootstrap';

interface ProfilePhotoProps {
  imageUrl: string;
  onFileChange: (file: File | null) => void;
}

const ProfilePhotoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Photo = styled.img`
  
  width: 150px; /* Adjust the size as needed */
  height: 150px; /* Adjust the size as needed */
  cursor: pointer;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ imageUrl, onFileChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleViewPhotoClick = () => {
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  const handleUploadClick = () => {
    if (!isUploading) {
      const fileInput = document.getElementById('profilePhotoInput');
      fileInput?.click();
    }
  };

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    onFileChange(file);
  };

  return (
    <div 
    style={{
      position: 'absolute',
        
      left: '50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '50%',
      overflow: 'auto',
      width: '150px',
      height: '150px',
      border: '2px solid #fff',
      cursor: 'pointer',
    }}> 
      <input
        type="file"
        id="profilePhotoInput"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {isUploading ? (
        <div>Uploading...</div>
      ) : (
        <>
          <img
            src={imageUrl||profileImage}
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              overflow: 'auto',
            }}
            onClick={handleViewPhotoClick}
          />
        </>
      )}

      {/* Modal to view the full photo */}
      <Modal show={showModal} onHide={handleHideModal} class="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>View Full Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        

        <Photo style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              overflow: 'auto',
            }}
           src={ imageUrl ||profileImage} alt="Profile" onClick={handlePhotoClick} />
        <HiddenFileInput type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHideModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUploadClick}>
            Upload Photo
          </Button>
        </Modal.Footer>
      </Modal>
   </div>
  );
};

export default ProfilePhoto;
