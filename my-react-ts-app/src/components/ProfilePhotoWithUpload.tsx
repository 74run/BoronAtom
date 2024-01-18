import React, { useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import profileImage from './Gold.png';

interface ProfilePhotoProps {
  imageUrl: string;
  onFileChange: (file: File | null) => void;
  onDelete: () => void;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ imageUrl, onFileChange, onDelete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleViewPhotoClick = () => setShowModal(true);

  const handleHideModal = () => {
    setSelectedFile(null);
    setShowModal(false);
  };

  const handleUploadClick = () => {
    if (!isUploading && selectedFile) {
      setIsUploading(true);
      setTimeout(() => {
        onFileChange(selectedFile);
        setIsUploading(false);
        setShowModal(false);
      }, 2000);
    }
  };

  const handleCancelClick = () => handleHideModal();

  const handleEditImageClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
    setSelectedFile(file);
  };
  

  const handleDeleteClick = () => {
    setIsUploading(true);
    setTimeout(() => {
      onDelete();
      setIsUploading(false);
      handleHideModal();
    }, 2000);
  };

  return (
    <div>
      <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', cursor: 'pointer' }}>
        <input
          type="file"
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

      <Modal show={showModal} onHide={handleHideModal} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>View Full Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!selectedFile && (
            <img
              src={imageUrl || profileImage}
              alt="Profile"
              onClick={handleEditImageClick}
              className="img-fluid"
            />
          )}
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
