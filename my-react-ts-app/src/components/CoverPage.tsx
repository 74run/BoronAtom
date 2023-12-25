import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import coverImage from './3.png';
interface CoverPageProps {
  onUpload: (file: File) => void;
}

const CoverPage: React.FC<CoverPageProps> = ({ onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleViewPhotoClick = () => {
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  const handleUploadClick = () => {
    // Trigger file input when the user clicks on the upload button
    if (!isUploading) {
      const fileInput = document.getElementById('coverPhotoInput');
      fileInput?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      const selectedFile = files[0];
      // You can perform additional validation or processing here if needed
      onUpload(selectedFile);
    }
  };
  

  return (
    <>
      <input
        type="file"
        id="coverPhotoInput"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {isUploading ? (
        <div>Uploading...</div>
      ) : (
        <>
          <img
            src={coverImage}
            alt="Cover"
            style={{
              width: '100%',
              height: '200px', // Adjust the height as needed
              
              objectFit: 'cover',
              cursor: 'pointer', // Set cursor to pointer
              border: '2px solid black'
            }}
            onClick={handleViewPhotoClick}
          />
        </>
      )}

      {/* Modal to view full photo */}
      <Modal show={showModal} onHide={handleHideModal}>
        <Modal.Header closeButton>
          <Modal.Title>View Full Cover</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={coverImage}
            alt="Full Cover"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              overflow: 'auto',
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHideModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUploadClick}>
            Upload Cover
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CoverPage;
