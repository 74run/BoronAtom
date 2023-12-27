import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

interface Certification {
  _id: string;
  name: string;
  issuedBy: string;
  issuedDate: string;
  expirationDate?: string;
  isEditing?: boolean;
}

interface CertificationProps {
  Certifications: Certification[];
  onEdit: (id: string, data: { name: string; issuedBy: string; issuedDate: string; expirationDate?: string }) => void;
  onDelete: (id: string) => void;
}

const CertificationSection: React.FC<CertificationProps> = ({ Certifications, onEdit, onDelete }) => {
  const [editData, setEditData] = useState<{ id: string; name: string; issuedBy: string; issuedDate: string; expirationDate?: string } | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [newCertification, setNewCertification] = useState<Certification>({
    _id: '',
    name: '',
    issuedBy: '',
    issuedDate: '',
    expirationDate: '',
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleEditClick = (id: string, name: string, issuedBy: string, issuedDate: string, expirationDate?: string) => {
    setEditData({ id, name, issuedBy, issuedDate, expirationDate });
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, { name: editData.name, issuedBy: editData.issuedBy, issuedDate: editData.issuedDate, expirationDate: editData.expirationDate });
      
      const updatedItems = certifications.map((certification) =>
        certification._id === editData.id
          ? { ...certification, name: editData.name, issuedBy: editData.issuedBy, issuedDate: editData.issuedDate, expirationDate: editData.expirationDate }
          : certification
      );

      setCertifications(updatedItems);
      
      setEditData(null);
    }
  };

  const handleSaveClick = () => {
    fetch('http://localhost:3001/api/certifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCertification),
    })
      .then((response) => response.json())
      .then((newCertificationFromServer: Certification) => {
        // Update the certifications state with the new certification
        setCertifications([...certifications, newCertificationFromServer]);

        // Reset the newCertification state
        setNewCertification({ _id: '', name: '', issuedBy: '', issuedDate: '', expirationDate: '' });

        // Set isAdding to false
        setIsAdding(false);
      })
      .catch((error) => {
        // Handle errors by logging them to the console
        console.error('Error saving certification:', error.message);
      });
  };

  const handleDelete = (id: string) => {
    fetch(`http://localhost:3001/api/certifications/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Update the state to remove the deleted certification
        const updatedCertifications = certifications.filter((certification) => certification._id !== id);
        setCertifications(updatedCertifications);

        // Reset the editData state
        setEditData(null);
      })
      .catch((error) => {
        console.error('Error deleting certification:', error);
      });
  };

  const handleAddClick = () => {
    setNewCertification({
      _id: '',
      name: '',
      issuedBy: '',
      issuedDate: '',
      expirationDate: '',
    });
    setIsAdding(true);
  };

  // useEffect(() => {
  //   fetch('http://localhost:3001/api/certifications')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setCertifications(data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching certifications:', error);
  //     });
  // }, []);

  return (
    <div
      style={{
        border: '2px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
      }}
    >
      <h2>Certifications</h2>
      {certifications.map((certification) => (
        <div key={certification._id} className="mb-3">
          {editData && editData.id === certification._id ? (
            // Edit mode
            <div>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Certification Name"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Issued By"
                value={editData.issuedBy}
                onChange={(e) => setEditData({ ...editData, issuedBy: e.target.value })}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Issued Date"
                value={editData.issuedDate}
                onChange={(e) => setEditData({ ...editData, issuedDate: e.target.value })}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Expiration Date (if applicable)"
                value={editData.expirationDate}
                onChange={(e) => setEditData({ ...editData, expirationDate: e.target.value })}
              />
              <button
                className="btn btn-primary me-2"
                onClick={handleUpdate}
              >
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Update
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          ) : (
            // View mode
            <div>
              <h3>{certification.name}</h3>
              <p>Issued By: {certification.issuedBy}</p>
              <p>Issued Date: {certification.issuedDate}</p>
              {certification.expirationDate && (
                <p>Expiration Date: {certification.expirationDate}</p>
              )}
              <button
                className="btn btn-primary me-2"
                onClick={() => handleEditClick(certification._id, certification.name, certification.issuedBy, certification.issuedDate, certification.expirationDate)}
              >
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(certification._id)}
              >
                <FontAwesomeIcon icon={faTrash} className="me-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
      {isAdding && (
        // Add certification entry
        <div>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Certification Name"
            value={newCertification.name}
            onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Issued By"
            value={newCertification.issuedBy}
            onChange={(e) => setNewCertification({ ...newCertification, issuedBy: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Issued Date"
            value={newCertification.issuedDate}
            onChange={(e) => setNewCertification({ ...newCertification, issuedDate: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Expiration Date (if applicable)"
            value={newCertification.expirationDate}
            onChange={(e) => setNewCertification({ ...newCertification, expirationDate: e.target.value })}
          />
          <button
            className="btn btn-primary"
            onClick={handleSaveClick}
          >
            <FontAwesomeIcon icon={faSave} className="me-2" />
            Save
          </button>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => setIsAdding(false)}
          >
            Cancel
          </button>
        </div>
      )}
      {!isAdding && (
        // Show "Add Certification" button
        <button
          className="btn btn-primary"
          onClick={handleAddClick}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Certification
        </button>
      )}
    </div>
  );
}

export default CertificationSection;
