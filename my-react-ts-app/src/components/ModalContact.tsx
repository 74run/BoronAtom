import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface ContactDetails {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  linkedIn: string;
}

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const ModalContact: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);
  const [editedContactDetails, setEditedContactDetails] = useState<ContactDetails>({
    _id: '',
    name: '',
    email: '',
    phoneNumber: '',
    linkedIn: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const { userID } = useParams();

  useEffect(() => {
    if (isOpen) {
      fetchContactDetails();
    }
  }, [isOpen]);

  const fetchContactDetails = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/contact`)
      .then((response) => {
        const fetchedContactDetails = response.data[0];
        setContactDetails(
          fetchedContactDetails || {
            _id: '',
            name: '',
            email: '',
            phoneNumber: '',
            linkedIn: '',
          }
        );
        if (!fetchedContactDetails) {
          setIsEditing(true);
        }
      })
      .catch((error) => {
        console.error('Error fetching contact details:', error);
      });
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedContactDetails({ ...contactDetails! });
  };

  const handleSaveClick = () => {
    const method = contactDetails?._id ? 'PUT' : 'POST';
    const url = contactDetails?._id
      ? `${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/contact/${contactDetails._id}`
      : `${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/contact`;

    axios({
      method,
      url,
      data: editedContactDetails,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        setContactDetails(editedContactDetails);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error saving contact details:', error);
      });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedContactDetails(contactDetails!);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedContactDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ backgroundColor: '#2d2d30', color: '#f5f5f5', borderRadius: '12px' }}>
          <div className="modal-header" style={{ borderBottom: '1px solid #444' }}>
            <h5 className="modal-title">{isEditing ? 'Edit Contact Details' : 'View Contact Details'}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeModal}
              style={{ backgroundColor: '#444', color: '#f5f5f5' }}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={editedContactDetails.name}
                    onChange={handleInputChange}
                    style={{ backgroundColor: '#1c1c1e', color: '#f5f5f5', border: '1px solid #444' }}
                  />
                ) : (
                  <div>{contactDetails?.name}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={editedContactDetails.email}
                    onChange={handleInputChange}
                    style={{ backgroundColor: '#1c1c1e', color: '#f5f5f5', border: '1px solid #444' }}
                  />
                ) : (
                  <div>{contactDetails?.email}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={editedContactDetails.phoneNumber}
                    onChange={handleInputChange}
                    style={{ backgroundColor: '#1c1c1e', color: '#f5f5f5', border: '1px solid #444' }}
                  />
                ) : (
                  <div>{contactDetails?.phoneNumber}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="linkedIn" className="form-label">
                  LinkedIn Profile
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    id="linkedIn"
                    name="linkedIn"
                    value={editedContactDetails.linkedIn}
                    onChange={handleInputChange}
                    style={{ backgroundColor: '#1c1c1e', color: '#f5f5f5', border: '1px solid #444' }}
                  />
                ) : (
                  <div>{contactDetails?.linkedIn}</div>
                )}
              </div>
              {isEditing ? (
                <div className="d-flex">
                  <button
                    type="button"
                    className="btn btn-success me-2"
                    onClick={handleSaveClick}
                    style={{
                      backgroundColor: '#4CAF50',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      transition: 'background-color 0.3s',
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancelClick}
                    style={{
                      backgroundColor: '#6c757d',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      transition: 'background-color 0.3s',
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} className="me-2" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEditClick}
                  style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    transition: 'background-color 0.3s',
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                  Edit
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalContact;
