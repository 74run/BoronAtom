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
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/certification`)
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
    axios.post(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/certification`, formattedCertification)
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
    axios.delete(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/certification/${id}`)
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
  //   fetch('${process.env.REACT_APP_API_URL}/api/certifications')
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
        border: 'none',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '30px',
        fontFamily: "'Roboto', sans-serif",
        color: '#333',
        backgroundColor: '#ffffff',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h4
        style={{
          color: '#4CAF50',
          textAlign: 'left',
          marginBottom: '1.5rem',
          fontFamily: "'Roboto Slab', serif",
          fontWeight: 700,
          fontSize: '1.5rem',
        }}
      >
        Certifications
      </h4>
      {certifications.map((certification) => (
        <div
          key={certification._id}
          className="mb-3"
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '1.5rem',
            backgroundColor: '#f8f9fa',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}
        >
          {editData && editData.id === certification._id ? (
            // Edit mode
            <div>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Certification Name"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '12px',
                  fontSize: '1rem',
                  marginBottom: '1rem',
                }}
              />
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Issued By"
                value={editData.issuedBy}
                onChange={(e) =>
                  setEditData({ ...editData, issuedBy: e.target.value })
                }
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '12px',
                  fontSize: '1rem',
                  marginBottom: '1rem',
                }}
              />
              <div className="date-dropdowns mb-3">
                <label>Issued Date:</label>
                <div className="flex-container">
                  <select
                    className="form-control mb-2"
                    value={editData.issuedDate.month}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        issuedDate: {
                          ...editData.issuedDate,
                          month: e.target.value,
                        },
                      })
                    }
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      padding: '10px',
                      marginRight: '0.5rem',
                    }}
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
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        issuedDate: {
                          ...editData.issuedDate,
                          year: e.target.value,
                        },
                      })
                    }
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      padding: '10px',
                    }}
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
              <div className="date-dropdowns mb-3">
                <label>Expiration Date:</label>
                <div className="flex-container">
                  <select
                    className="form-control mb-2"
                    value={editData.expirationDate.month}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        expirationDate: {
                          ...editData.expirationDate,
                          month: e.target.value,
                        },
                      })
                    }
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      padding: '10px',
                      marginRight: '0.5rem',
                    }}
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
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        expirationDate: {
                          ...editData.expirationDate,
                          year: e.target.value,
                        },
                      })
                    }
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      padding: '10px',
                    }}
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
                className="form-control mb-3"
                placeholder="Certificate URL"
                value={editData.url}
                onChange={(e) =>
                  setEditData({ ...editData, url: e.target.value })
                }
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '12px',
                  fontSize: '1rem',
                  marginBottom: '1rem',
                }}
              />
              <button
                className="btn btn-success me-2"
                onClick={handleUpdate}
                style={{
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '1rem',
                }}
              >
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Update
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCancelEdit}
                style={{
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '1rem',
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            // View mode
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: '#ffffff',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow =
                  '0 10px 30px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              <h5
                style={{
                  color: '#333',
                  fontFamily: "'Roboto Slab', serif",
                  fontSize: '1.2rem',
                  marginBottom: '0.5rem',
                  fontWeight: 700,
                }}
              >
                {certification.name}
              </h5>
              <div
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  color: '#555',
                }}
              >
                <strong>Issued By:</strong> {certification.issuedBy}
              </div>
              <div
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  color: '#555',
                }}
              >
                <strong>Issued Date:</strong> {certification.issuedDate.month}{' '}
                {certification.issuedDate.year}
              </div>
              <div
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  color: '#555',
                }}
              >
                <strong>Expiration Date:</strong> {certification.expirationDate.month}{' '}
                {certification.expirationDate.year}
              </div>
              <div
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  color: '#555',
                }}
              >
                <strong>Certificate URL:</strong> {certification.url}
              </div>
              <div>
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() =>
                    handleEditClick(
                      certification._id,
                      certification.name,
                      certification.issuedBy,
                      certification.issuedDate,
                      certification.expirationDate,
                      certification.url
                    )
                  }
                  style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '0.3rem 0.8rem',
                    fontSize: '0.9rem',
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                  Edit
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleDelete(certification._id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
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
            className="form-control mb-3"
            placeholder="Certification Name"
            value={newCertification.name}
            onChange={(e) =>
              setNewCertification({ ...newCertification, name: e.target.value })
            }
            style={{
              borderRadius: '8px',
              border: '1px solid #ddd',
              padding: '12px',
              fontSize: '1rem',
              marginBottom: '1rem',
            }}
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Issued By"
            value={newCertification.issuedBy}
            onChange={(e) =>
              setNewCertification({
                ...newCertification,
                issuedBy: e.target.value,
              })
            }
            style={{
              borderRadius: '8px',
              border: '1px solid #ddd',
              padding: '12px',
              fontSize: '1rem',
              marginBottom: '1rem',
            }}
          />
          <div className="date-dropdowns mb-3">
            <label>Issued Date:</label>
            <div className="flex-container">
              <select
                className="form-control mb-2"
                value={newCertification.issuedDate.month}
                onChange={(e) =>
                  setNewCertification({
                    ...newCertification,
                    issuedDate: {
                      ...newCertification.issuedDate,
                      month: e.target.value,
                    },
                  })
                }
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '10px',
                  marginRight: '0.5rem',
                }}
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
                onChange={(e) =>
                  setNewCertification({
                    ...newCertification,
                    issuedDate: {
                      ...newCertification.issuedDate,
                      year: e.target.value,
                    },
                  })
                }
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '10px',
                }}
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
          <div className="date-dropdowns mb-3">
            <label>Expiration Date:</label>
            <div className="flex-container">
              <select
                className="form-control mb-2"
                value={newCertification.expirationDate.month}
                onChange={(e) =>
                  setNewCertification({
                    ...newCertification,
                    expirationDate: {
                      ...newCertification.expirationDate,
                      month: e.target.value,
                    },
                  })
                }
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '10px',
                  marginRight: '0.5rem',
                }}
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
                onChange={(e) =>
                  setNewCertification({
                    ...newCertification,
                    expirationDate: {
                      ...newCertification.expirationDate,
                      year: e.target.value,
                    },
                  })
                }
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '10px',
                }}
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
            className="form-control mb-3"
            placeholder="Certificate URL"
            value={newCertification.url}
            onChange={(e) =>
              setNewCertification({ ...newCertification, url: e.target.value })
            }
            style={{
              borderRadius: '8px',
              border: '1px solid #ddd',
              padding: '12px',
              fontSize: '1rem',
              marginBottom: '1rem',
            }}
          />
          <button
            className="btn btn-success"
            onClick={handleSaveClick}
            style={{
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '1rem',
            }}
          >
            <FontAwesomeIcon icon={faSave} className="me-2" />
            Save
          </button>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => setIsAdding(false)}
            style={{
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '1rem',
            }}
          >
            Cancel
          </button>
        </div>
      )}
      {!isAdding && (
        // Show "Add Certification" button
        <button
          className="btn btn-outline-primary"
          onClick={handleAddClick}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: '1px solid #007bff',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '1rem',
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
