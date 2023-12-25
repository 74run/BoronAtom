import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

interface Certification {
  id: number;
  name: string;
  issuedBy: string;
  issuedDate: string;
  expirationDate?: string;
  isEditing?: boolean;
}

function CertificationSection() {
  const [certifications, setCertifications] = useState<Certification[]>([
    { id: 1, name: 'Certification Name', issuedBy: 'Certification Authority', issuedDate: 'January 2021', expirationDate: 'January 2023 (if applicable)' },
    // Add more certification entries as needed
  ]);

  const [newCertification, setNewCertification] = useState<Certification>({
    id: 0,
    name: '',
    issuedBy: '',
    issuedDate: '',
    expirationDate: '',
  });

  const [isAdding, setIsAdding] = useState(false);

  const handleEditClick = (id: number) => {
    setCertifications((prevCertifications) =>
      prevCertifications.map((certification) =>
        certification.id === id ? { ...certification, isEditing: true } : certification
      )
    );
  };

  const handleSaveClick = (id?: number) => {
    if (id !== undefined) {
      // Editing an existing certification entry
      setCertifications((prevCertifications) =>
        prevCertifications.map((cert) => (cert.id === id ? { ...cert, isEditing: false } : cert))
      );
    } else {
      // Adding a new certification entry
      setNewCertification((prevCertification) => ({
        ...prevCertification,
        id: Date.now(), // Use a timestamp as a unique identifier
      }));
      setCertifications((prevCertifications) => [...prevCertifications, newCertification]);
      setNewCertification({ id: 0, name: '', issuedBy: '', issuedDate: '', expirationDate: '' });
      setIsAdding(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    // Deleting a certification entry
    setCertifications((prevCertifications) => prevCertifications.filter((cert) => cert.id !== id));
  };

  const handleAddClick = () => {
    setNewCertification({ id: 0, name: '', issuedBy: '', issuedDate: '', expirationDate: '' });
    setIsAdding(true);
  };

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
        <div key={certification.id} className="mb-3">
          {certification.isEditing ? (
            // Edit mode
            <div>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Certification Name"
                value={certification.name}
                onChange={(e) =>
                  setCertifications((prevCertifications) =>
                    prevCertifications.map((cert) =>
                      cert.id === certification.id ? { ...cert, name: e.target.value } : cert
                    )
                  )
                }
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Issued By"
                value={certification.issuedBy}
                onChange={(e) =>
                  setCertifications((prevCertifications) =>
                    prevCertifications.map((cert) =>
                      cert.id === certification.id ? { ...cert, issuedBy: e.target.value } : cert
                    )
                  )
                }
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Issued Date"
                value={certification.issuedDate}
                onChange={(e) =>
                  setCertifications((prevCertifications) =>
                    prevCertifications.map((cert) =>
                      cert.id === certification.id ? { ...cert, issuedDate: e.target.value } : cert
                    )
                  )
                }
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Expiration Date (if applicable)"
                value={certification.expirationDate}
                onChange={(e) =>
                  setCertifications((prevCertifications) =>
                    prevCertifications.map((cert) =>
                      cert.id === certification.id ? { ...cert, expirationDate: e.target.value } : cert
                    )
                  )
                }
              />
              <button
                className="btn btn-primary me-2"
                onClick={() => handleSaveClick(certification.id)}
              >
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  setCertifications((prevCertifications) =>
                    prevCertifications.map((cert) =>
                      cert.id === certification.id ? { ...cert, isEditing: false } : cert
                    )
                  )
                }
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
                onClick={() => handleEditClick(certification.id)}
              >
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteClick(certification.id)}
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
            onClick={() => handleSaveClick()}
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
