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
    <div className="modal-overlay">
      <style>
        {`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.75);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1050;
            backdrop-filter: blur(4px);
          }
  
          .modal-container {
            background-color: #1b1b2f;
            border: 1px solid #333;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }
  
          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid #333;
          }
  
          .modal-title {
            color: #63b3ed;
            font-size: 1.4rem;
            font-weight: 600;
            font-family: 'Roboto Slab', serif;
            margin: 0;
          }
  
          .close-button {
            background: none;
            border: none;
            color: #a0aec0;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            transition: color 0.2s ease;
          }
  
          .close-button:hover {
            color: #63b3ed;
          }
  
          .modal-body {
            padding: 1.5rem;
          }
  
          .form-group {
            margin-bottom: 1.5rem;
          }
  
          .form-label {
            display: block;
            color: #63b3ed;
            font-size: 0.95rem;
            margin-bottom: 0.5rem;
            font-weight: 500;
          }
  
          .form-input {
            width: 100%;
            padding: 0.75rem;
            background-color: #2d3748;
            border: 1px solid #4a5568;
            border-radius: 8px;
            color: #f5f5f5;
            font-size: 0.95rem;
            transition: all 0.2s ease;
          }
  
          .form-input:focus {
            outline: none;
            border-color: #63b3ed;
            box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.1);
          }
  
          .display-value {
            padding: 0.75rem;
            background-color: #2d3748;
            border-radius: 8px;
            color: #e2e8f0;
            font-size: 0.95rem;
          }
  
          .button-group {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
          }
  
          .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 25px;
            font-size: 0.95rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          }
  
          .btn-primary {
            background-color: #3182ce;
            color: white;
          }
  
          .btn-success {
            background-color: #38a169;
            color: white;
          }
  
          .btn-secondary {
            background-color: #4a5568;
            color: white;
          }
  
          .btn:hover {
            transform: translateY(-2px);
          }
  
          .btn-primary:hover {
            background-color: #4299e1;
          }
  
          .btn-success:hover {
            background-color: #48bb78;
          }
  
          .btn-secondary:hover {
            background-color: #718096;
          }
        `}
      </style>
  
      <div className="modal-container">
        <div className="modal-header">
          <h5 className="modal-title">{isEditing ? 'Edit Contact Details' : 'View Contact Details'}</h5>
          <button className="close-button" onClick={closeModal}>×</button>
        </div>
  
        <div className="modal-body">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-input"
                  value={editedContactDetails.name}
                  onChange={handleInputChange}
                  name="name"
                />
              ) : (
                <div className="display-value">{contactDetails?.name}</div>
              )}
            </div>
  
            <div className="form-group">
              <label className="form-label">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  className="form-input"
                  value={editedContactDetails.email}
                  onChange={handleInputChange}
                  name="email"
                />
              ) : (
                <div className="display-value">{contactDetails?.email}</div>
              )}
            </div>
  
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-input"
                  value={editedContactDetails.phoneNumber}
                  onChange={handleInputChange}
                  name="phoneNumber"
                />
              ) : (
                <div className="display-value">{contactDetails?.phoneNumber}</div>
              )}
            </div>
  
            <div className="form-group">
              <label className="form-label">LinkedIn Profile</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-input"
                  value={editedContactDetails.linkedIn}
                  onChange={handleInputChange}
                  name="linkedIn"
                />
              ) : (
                <div className="display-value">{contactDetails?.linkedIn}</div>
              )}
            </div>
  
            <div className="button-group">
              {isEditing ? (
                <>
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={handleSaveClick}
                  >
                    <FontAwesomeIcon icon={faSave} />
                    Save
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleCancelClick}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleEditClick}
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalContact;
