import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import profileImage from './Gold.png';

interface ProfilePhotoWithUploadProps {
  onUpload: (file: File) => void;
}

const ProfilePhotoWithUpload: React.FC<ProfilePhotoWithUploadProps> = ({ onUpload }) => {
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      const selectedFile = files[0];
      onUpload(selectedFile);
    }
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
      }}
    >
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
            src={profileImage}
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
          <img
            src={profileImage}
            alt="Full Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              overflow: 'auto',
            }}
          />
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

export default ProfilePhotoWithUpload;
