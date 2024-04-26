import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';


interface Certification {
  _id: string;
  name: string;
  issuedBy: string;
  issuedDate: { month: string; year: string };
  expirationDate: { month: string; year: string };
  url: string;
  isEditing?: boolean;
}

interface CertificationProps {
  Certifications: Certification[];
  onEdit: (id: string, data: { name: string; issuedBy: string; issuedDate: { month: string; year: string }; expirationDate: { month: string; year: string }; url: string }) => void;
  onDelete: (id: string) => void;
}

const CertificationSection: React.FC<CertificationProps> = ({ Certifications, onEdit, onDelete }) => {
  const [editData, setEditData] = useState<{ id: string; name: string; issuedBy: string; issuedDate: { month: string; year: string }; expirationDate: { month: string; year: string }; url: string } | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>(Certifications);
  const [newCertification, setNewCertification] = useState<Certification>({
    _id: '',
    name: '',
    issuedBy: '',
    issuedDate: { month: '', year: '' },
    expirationDate: { month: '', year: '' },
    url: '',
  });
  const [isAdding, setIsAdding] = useState(false);
  const { userID } = useParams();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const graduationYears = Array.from({ length: 57 }, (_, index) => (new Date()).getFullYear() + 7 - index);

  // useEffect(() => {
  //   const storedCertifications = JSON.parse(localStorage.getItem(`certifications_${userID}`) || '[]');
  //   setCertifications(storedCertifications);
  // }, []);
  
  useEffect(() => {
    fetchCertification();
  }, []);
  
  const fetchCertification = () => {
    fetch(`http://localhost:3001/api/userprofile/${userID}/certification`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch educations');
        }
        return response.json(); // Parse the response JSON
      })
      .then(data => {
        // console.log("Project data:",data)
        setCertifications(data); // Set projects state with the fetched data
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  };

  const handleEditClick = (
    id: string,
    name: string,
    issuedBy: string,
    issuedDate: { month: string; year: string },
    expirationDate: { month: string; year: string },
    url: string
  ) => {
    setEditData({ id, name, issuedBy, issuedDate, expirationDate, url });
  };
  

  

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, { name: editData.name, issuedBy: editData.issuedBy, issuedDate: editData.issuedDate, expirationDate: editData.expirationDate, url: editData.url });
      
      const updatedItems = certifications.map((certification) =>
        certification._id === editData.id
          ? { ...certification, name: editData.name, issuedBy: editData.issuedBy, issuedDate: editData.issuedDate, expirationDate: editData.expirationDate, url: editData.url }
          : certification
      );

      setCertifications(updatedItems);

      // localStorage.setItem(`certifications_${userID}`, JSON.stringify(updatedItems));
      
      setEditData(null);
    }
  };

  const handleSaveClick = () => {
    const formattedCertification = {
      ...newCertification,
      issuedDate: {
        month: newCertification.issuedDate.month,
        year: newCertification.issuedDate.year,
      },
      expirationDate: {
        month: newCertification.expirationDate.month,
        year: newCertification.expirationDate.year,
      },
    };

    // const storageKey = `certifications_${userID}`;
    axios.post(`http://localhost:3001/api/userprofile/${userID}/certification`, formattedCertification)
    .then((response) => {
      const newCertificationFromServer = response.data.certification;
      const newCertData = newCertificationFromServer[newCertificationFromServer.length-1]
        setCertifications([...certifications, newCertData]);
  
        const updatedCertifications = [...certifications, newCertData];
        // localStorage.setItem(storageKey, JSON.stringify(updatedCertifications));
        // Reset the newCertification state
        setNewCertification({
          _id: '',
          name: '',
          issuedBy: '',
          issuedDate: { month: '', year: '' },
          expirationDate: { month: '', year: '' },
          url: '',
        });
  
        // Set isAdding to false
        setIsAdding(false);
      })
      .catch((error) => {
        // Handle errors by logging them to the console
        console.error('Error saving certification:', error.message);
      });
  };
  

  const handleDelete = (id: string) => {
    axios.delete(`http://localhost:3001/api/userprofile/${userID}/certification/${id}`)
      .then((response) => {
        // Update the state to remove the deleted certification
        const updatedCertifications = certifications.filter((certification) => certification._id !== id);
        setCertifications(updatedCertifications);

        // Reset the editData state
        setEditData(null);
        // localStorage.setItem(`certifications_${userID}`, JSON.stringify(updatedCertifications));
      })
      .catch((error) => {
        console.error('Error deleting certification:', error.message);
      });
  };

  const handleAddClick = () => {
    setNewCertification({
      _id: '',
      name: '',
      issuedBy: '',
      issuedDate: { month: '', year: '' },
      expirationDate: { month: '', year: '' },
      url: '',
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
      className="container"
      style={{
        border: '2px solid #4CAF50',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 0 200px rgba(10, 0, 0, 0.5)'
      }}
    >
      <h4 style={{color: '#4CAF50', textAlign: 'left', marginBottom: '1rem', fontFamily: 'Timesquare'}}><b>Certifications</b></h4>
      {certifications.map((certification) => (
        <div key={certification._id} className="mb-3" style={{border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '1rem'}}>
          {editData && editData.id === certification._id ? (
            // Edit mode
            <div>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Certification Name"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                style={{borderRadius: '4px', border: '1px solid #ccc'}}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Issued By"
                value={editData.issuedBy}
                onChange={(e) => setEditData({ ...editData, issuedBy: e.target.value })}
                style={{borderRadius: '4px', border: '1px solid #ccc'}}
              />
              <div className="date-dropdowns">
                <label>Issued Date:</label>
                <div className="flex-container">
                  <select
                    className="form-control mb-2"
                    value={editData.issuedDate.month}
                    onChange={(e) => setEditData({ ...editData, issuedDate: { ...editData.issuedDate, month: e.target.value } })}
                    style={{borderRadius: '4px', border: '1px solid #ccc', marginRight: '0.5rem'}}
                  >
                    {!editData.issuedDate.month && (
                      <option value="" disabled>
                        Select Month
                      </option>
                    )}
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-control mb-2"
                    value={editData.issuedDate.year}
                    onChange={(e) => setEditData({ ...editData, issuedDate: { ...editData.issuedDate, year: e.target.value } })}
                    style={{borderRadius: '4px', border: '1px solid #ccc'}}
                  >
                    {!editData.issuedDate.year && (
                      <option value="" disabled>
                        Select Year
                      </option>
                    )}
                    {graduationYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="date-dropdowns">
                <label>Expiration Date:</label>
                <div className="flex-container">
                  <select
                    className="form-control mb-2"
                    value={editData.expirationDate.month}
                    onChange={(e) => setEditData({ ...editData, expirationDate: { ...editData.expirationDate, month: e.target.value } })}
                    style={{borderRadius: '4px', border: '1px solid #ccc', marginRight: '0.5rem'}}
                  >
                    {!editData.expirationDate.month && (
                      <option value="" disabled>
                        Select Month
                      </option>
                    )}
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-control mb-2"
                    value={editData.expirationDate.year}
                    onChange={(e) => setEditData({ ...editData, expirationDate: { ...editData.expirationDate, year: e.target.value } })}
                    style={{borderRadius: '4px', border: '1px solid #ccc'}}
                  >
                    {!editData.expirationDate.year && (
                      <option value="" disabled>
                        Select Year
                      </option>
                    )}
                    {graduationYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Certificate URL"
                value={editData.url}
                onChange={(e) => setEditData({ ...editData, url: e.target.value })}
                style={{borderRadius: '4px', border: '1px solid #ccc'}}
              />
              <button
                className="btn btn-primary me-2"
                onClick={handleUpdate}
                style={{borderRadius: '4px'}}
              >
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Update
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCancelEdit}
                style={{borderRadius: '4px'}}
              >
                Cancel
              </button>
            </div>
          ) : (
            // View mode
            <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '1rem' }}>
            <h3 style={{ color: '#007bff', fontFamily: 'Arial, sans-serif', marginBottom: '0.5rem', fontSize: '1rem' }}><b>{certification.name}</b></h3>
            <p style={{ fontFamily: 'Arial, sans-serif', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Issued By: {certification.issuedBy}</p>
            <p style={{ fontFamily: 'Arial, sans-serif', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Issued Date: {certification.issuedDate.month} {certification.issuedDate.year}</p>
            <p style={{ fontFamily: 'Arial, sans-serif', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Expiration Date: {certification.expirationDate.month} {certification.expirationDate.year}</p>
            <p style={{ fontFamily: 'Arial, sans-serif', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Certificate URL: {certification.url}</p>
            <div>
              <button
                className="btn btn-primary me-2"
                onClick={() => handleEditClick(certification._id, certification.name, certification.issuedBy, certification.issuedDate, certification.expirationDate, certification.url)}
                style={{
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: '1px solid #007bff',
                  padding: '0.3rem 0.6rem', // Adjusted padding
                  borderRadius: '4px',
                  transition: 'all 0.3s',
                  fontSize: '0.8rem', // Adjusted font size
                }}
              >
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(certification._id)}
                style={{
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  padding: '0.3rem 0.4rem',
                  border: '1px solid #dc3545',
                  borderRadius: '4px',
                  transition: 'all 0.3s',
                  fontSize: '0.8rem',
                }}
              >
                <FontAwesomeIcon icon={faTrash} className="me-2" />
                Delete
              </button>
            </div>
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
            style={{borderRadius: '4px', border: '1px solid #ccc'}}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Issued By"
            value={newCertification.issuedBy}
            onChange={(e) => setNewCertification({ ...newCertification, issuedBy: e.target.value })}
            style={{borderRadius: '4px', border: '1px solid #ccc'}}
          />
          <div className="date-dropdowns">
            <label>Issued Date:</label>
            <div className="flex-container">
              <select
                className="form-control mb-2"
                value={newCertification.issuedDate.month}
                onChange={(e) => setNewCertification({ ...newCertification, issuedDate: { ...newCertification.issuedDate, month: e.target.value } })}
                style={{borderRadius: '4px', border: '1px solid #ccc', marginRight: '0.5rem'}}
              >
                {!newCertification.issuedDate.month && (
                  <option value="" disabled>
                    Select Month
                  </option>
                )}
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className="form-control mb-2"
                value={newCertification.issuedDate.year}
                onChange={(e) => setNewCertification({ ...newCertification, issuedDate: { ...newCertification.issuedDate, year: e.target.value } })}
                style={{borderRadius: '4px', border: '1px solid #ccc'}}
              >
                {!newCertification.issuedDate.year && (
                  <option value="" disabled>
                    Select Year
                  </option>
                )}
                {graduationYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="date-dropdowns">
            <label>Expiration Date:</label>
            <div className="flex-container">
              <select
                className="form-control mb-2"
                value={newCertification.expirationDate.month}
                onChange={(e) => setNewCertification({ ...newCertification, expirationDate: { ...newCertification.expirationDate, month: e.target.value } })}
                style={{borderRadius: '4px', border: '1px solid #ccc', marginRight: '0.5rem'}}
              >
                {!newCertification.expirationDate.month && (
                  <option value="" disabled>
                    Select Month
                  </option>
                )}
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className="form-control mb-2"
                value={newCertification.expirationDate.year}
                onChange={(e) => setNewCertification({ ...newCertification, expirationDate: { ...newCertification.expirationDate, year: e.target.value } })}
                style={{borderRadius: '4px', border: '1px solid #ccc'}}
              >
                {!newCertification.expirationDate.year && (
                  <option value="" disabled>
                    Select Year
                  </option>
                )}
                {graduationYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Certificate URL"
            value={newCertification.url}
            onChange={(e) => setNewCertification({ ...newCertification, url: e.target.value })}
            style={{borderRadius: '4px', border: '1px solid #ccc'}}
          />
          <button
            className="btn btn-primary"
            onClick={handleSaveClick}
            style={{borderRadius: '4px'}}
          >
            <FontAwesomeIcon icon={faSave} className="me-2" />
            Save
          </button>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => setIsAdding(false)}
            style={{borderRadius: '4px'}}
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
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: '1px solid #007bff',
            padding: '0.3rem 0.6rem', // Adjusted padding
            borderRadius: '4px',
            transition: 'all 0.3s',
            fontSize: '0.8rem', // Adjusted font size
          }}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Certification
        </button>
      )}
    </div>
  );
  
}

export default CertificationSection;
