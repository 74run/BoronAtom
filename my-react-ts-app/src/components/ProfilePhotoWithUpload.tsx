// ProfilePhoto.tsx
import React, { useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import profileImage from './Gold.png';
interface ProfilePhotoProps {
  imageUrl: string;
  onFileChange: (file: File | null) => void;
  onDelete: () => void; // Function to handle image deletion
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ imageUrl, onFileChange, onDelete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUploadButton, setShowUploadButton] = useState(false);

  const handleViewPhotoClick = () => {
    setShowUploadButton(false);
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  const handleUploadClick = () => {
    if (!isUploading && selectedFile) {
      setIsUploading(true);
      // Simulate upload process (replace with your actual upload logic)
      setTimeout(() => {
        onFileChange(selectedFile);
        setIsUploading(false);
        setShowModal(false);
      }, 2000);
    }
  };

  const handleCancelClick = () => {
    setSelectedFile(null);
    setShowModal(false);
    setShowUploadButton(false);
  };

  const handleEditImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file);
  };

  const handleDeleteClick = () => {
    // Simulate server-side deletion (replace with your actual deletion logic)
    setIsUploading(true);
    setTimeout(() => {
      onDelete();
      setIsUploading(false);
      setShowModal(false);
    }, 2000);
  };

  return (
    <div style={{ position: 'absolute', top: '150px', left: '50%', transform: 'translateX(-50%)' }}>
      <div className="position-relative" style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', cursor: 'pointer' }}>
        <input
          type="file"
          id="profilePhotoInput"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <img
          src={imageUrl || profileImage}
          alt="Profile"
          onClick={handleViewPhotoClick}
          className="img-fluid"
        />
      </div>

      {/* Modal to view and change the photo */}
      <Modal show={showModal} onHide={handleHideModal} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>View Full Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={selectedFile ? URL.createObjectURL(selectedFile) : imageUrl || profileImage}
            alt="Profile"
            onClick={handleEditImageClick}
            className="img-fluid"
          />
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelClick}>
            Cancel
          </Button>
          {selectedFile && (
            <Button variant="primary" onClick={handleUploadClick}>
              {isUploading ? 'Uploading...' : 'Upload Photo'}
            </Button>
          )}
          <Button variant="secondary" onClick={handleEditImageClick}>
            Edit Image
          </Button>
          <Button variant="danger" onClick={handleDeleteClick}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfilePhoto;