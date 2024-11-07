import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faTimes, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Certification {
  _id: string;
  name: string;
  issuedBy: string;
  issuedDate: { month: string; year: string };
  expirationDate: { month: string; year: string };
  url: string;
  includeInResume: boolean;
  isEditing?: boolean;
}

interface CertificationProps {
  Certifications: Certification[];
  onEdit: (id: string, data: { name: string; issuedBy: string; issuedDate: { month: string; year: string }; expirationDate: { month: string; year: string }; url: string; includeInResume: boolean }) => void;
  onDelete: (id: string) => void;
}

const CertificationSection: React.FC<CertificationProps> = ({ Certifications, onEdit, onDelete }) => {
  const [editData, setEditData] = useState<{ id: string; name: string; issuedBy: string; issuedDate: { month: string; year: string }; expirationDate: { month: string; year: string }; url: string; includeInResume: boolean } | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>(Certifications);
  const [newCertification, setNewCertification] = useState<Certification>({
    _id: '',
    name: '',
    issuedBy: '',
    issuedDate: { month: '', year: '' },
    expirationDate: { month: '', year: '' },
    url: '',
    includeInResume: true,
  });
  const [isAdding, setIsAdding] = useState(false);
  const { userID } = useParams();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const graduationYears = Array.from({ length: 57 }, (_, index) => (new Date()).getFullYear() + 7 - index);

  useEffect(() => {
    fetchCertification();
  }, []);

  const fetchCertification = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/certification`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch certifications');
        }
        return response.json(); // Parse the response JSON
      })
      .then(data => {
        setCertifications(data); // Set certifications state with the fetched data
      })
      .catch(error => {
        console.error('Error fetching certifications:', error);
      });
  };

  const handleEditClick = (
    id: string,
    name: string,
    issuedBy: string,
    issuedDate: { month: string; year: string },
    expirationDate: { month: string; year: string },
    url: string,
    includeInResume: boolean
  ) => {
    setEditData({ id, name, issuedBy, issuedDate, expirationDate, url, includeInResume });
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, {
        name: editData.name,
        issuedBy: editData.issuedBy,
        issuedDate: editData.issuedDate,
        expirationDate: editData.expirationDate,
        url: editData.url,
        includeInResume: editData.includeInResume,
      });

      const updatedItems = certifications.map((certification) =>
        certification._id === editData.id
          ? {
              ...certification,
              name: editData.name,
              issuedBy: editData.issuedBy,
              issuedDate: editData.issuedDate,
              expirationDate: editData.expirationDate,
              url: editData.url,
              includeInResume: editData.includeInResume,
            }
          : certification
      );

      setCertifications(updatedItems);
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

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/certification`, formattedCertification)
      .then((response) => {
        const newCertificationFromServer = response.data.certification;
        const newCertData = newCertificationFromServer[newCertificationFromServer.length - 1];
        setCertifications([...certifications, newCertData]);

        setNewCertification({
          _id: '',
          name: '',
          issuedBy: '',
          issuedDate: { month: '', year: '' },
          expirationDate: { month: '', year: '' },
          url: '',
          includeInResume: true,
        });

        setIsAdding(false);
      })
      .catch((error) => {
        console.error('Error saving certification:', error.message);
      });
  };

  const handleDelete = (id: string) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/certification/${id}`)
      .then((response) => {
        const updatedCertifications = certifications.filter((certification) => certification._id !== id);
        setCertifications(updatedCertifications);
        setEditData(null);
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
      includeInResume: true,
    });
    setIsAdding(true);
  };

  const handleToggleInclude = (id: string) => {
    const updatedCertifications = certifications.map((certification) =>
      certification._id === id ? { ...certification, includeInResume: !certification.includeInResume } : certification
    );
    setCertifications(updatedCertifications);

    const certificationToUpdate = updatedCertifications.find((certification) => certification._id === id);
    if (certificationToUpdate) {
      onEdit(id, {
        name: certificationToUpdate.name,
        issuedBy: certificationToUpdate.issuedBy,
        issuedDate: certificationToUpdate.issuedDate,
        expirationDate: certificationToUpdate.expirationDate,
        url: certificationToUpdate.url,
        includeInResume: certificationToUpdate.includeInResume,
      });
    }
  };

  return (
    <div
    style={{
      border: "none",
      borderRadius: "0px",
      padding: "24px",
      marginBottom: "30px",
      fontFamily: "'Roboto', sans-serif",
      color: "#f5f5f5",
      backgroundColor: "#1c1c1e",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
    }}
    >
      <h4
        style={{
          color: "#00d084",
          textAlign: "left",
          marginBottom: "1.5rem",
          fontFamily: "'Roboto Slab', serif",
          fontWeight: 700,
          fontSize: "1.6rem",
        }}
      >
        Certifications
      </h4>
      {certifications.map((certification) => (
        <div
          key={certification._id}
          className="certification-card"
          style={{
            border: "1px solid #333",
            borderRadius: "12px",
            padding: "0px",
            marginBottom: "20px",
            backgroundColor: "#1b1b2f",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.3s, box-shadow 0.3s",
            cursor: "pointer",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
          }}
        >
          {editData && editData.id === certification._id ? (
            <div >
              <input
                type="text"
                placeholder="Certification Name"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #444",
                  padding: "12px",
                  fontSize: "1rem",
                  marginBottom: "1rem",
                  width: "100%",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                }}
              />
  
              <input
                type="text"
                placeholder="Issued By"
                value={editData.issuedBy}
                onChange={(e) => setEditData({ ...editData, issuedBy: e.target.value })}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #444",
                  padding: "12px",
                  fontSize: "1rem",
                  marginBottom: "1rem",
                  width: "100%",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                }}
              />
  
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap"  }}>
                <select
                  value={editData.issuedDate.month}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      issuedDate: { ...editData.issuedDate, month: e.target.value },
                    })
                  }
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #444",
                    padding: "10px",
                    backgroundColor: "#1c1c1e",
                    color: "#f5f5f5",
                    flex: "1",
                  }}
                >
                  <option value="" disabled>
                    Select Month
                  </option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
  
                <select
                  value={editData.issuedDate.year}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      issuedDate: { ...editData.issuedDate, year: e.target.value },
                    })
                  }
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #444",
                    padding: "10px",
                    backgroundColor: "#1c1c1e",
                    color: "#f5f5f5",
                    flex: "1",
                  }}
                >
                  <option value="" disabled>
                    Select Year
                  </option>
                  {graduationYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
  
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "1rem" }}>
                <select
                  value={editData.expirationDate.month}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      expirationDate: { ...editData.expirationDate, month: e.target.value },
                    })
                  }
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #444",
                    padding: "10px",
                    backgroundColor: "#1c1c1e",
                    color: "#f5f5f5",
                    flex: "1",
                  }}
                >
                  <option value="" disabled>
                    Select Month
                  </option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
  
                <select
                  value={editData.expirationDate.year}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      expirationDate: { ...editData.expirationDate, year: e.target.value },
                    })
                  }
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #444",
                    padding: "10px",
                    backgroundColor: "#1c1c1e",
                    color: "#f5f5f5",
                    flex: "1",
                  }}
                >
                  <option value="" disabled>
                    Select Year
                  </option>
                  {graduationYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
  
              <textarea
                placeholder="Certificate URL"
                value={editData.url}
                onChange={(e) => setEditData({ ...editData, url: e.target.value })}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #444",
                  padding: "12px",
                  fontSize: "1rem",
                  marginTop: "1rem",
                  width: "100%",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                }}
              />
  
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  onClick={handleUpdate}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    flex: "1",
                  }}
                >
                  <FontAwesomeIcon icon={faSave} /> Update
                </button>
  
                <button
                  onClick={handleCancelEdit}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    flex: "1",
                  }}
                > Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
            style={{
             
              borderRadius: "8px",
              padding: "20px",
             
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
              }}
            >
              <h5
               style={{
                color: "#00d084", // Light text for dark mode
                fontFamily: "'Roboto Slab', serif",
                fontSize: "1.4rem",
                marginBottom: "0.5rem",
                fontWeight: 700,
              }}
              >
                {certification.name}
              </h5>
  
              <p style={{ fontSize: "0.9rem", color: "#bbb" }}>
                <strong>Issued By:</strong> {certification.issuedBy}
              </p>
  
              <p style={{ fontSize: "0.9rem", color: "#bbb" }}>
                <strong>Issued Date:</strong> {certification.issuedDate.month}{" "}
                {certification.issuedDate.year}
              </p>
  
              <p style={{ fontSize: "0.9rem", color: "#bbb" }}>
                <strong>Expiration Date:</strong>{" "}
                {certification.expirationDate.month} {certification.expirationDate.year}
              </p>
  
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#bbb",
                  overflowWrap: "break-word",
                  wordBreak: "break-all",
                  whiteSpace: "normal",
                }}
              >
                <strong>Certificate URL:</strong> {certification.url}
              </p>
  
              <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                <button
                  onClick={() =>
                    handleEditClick(
                      certification._id,
                      certification.name,
                      certification.issuedBy,
                      certification.issuedDate,
                      certification.expirationDate,
                      certification.url,
                      certification.includeInResume
                    )
                  }
                  style={{
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    flex: "1",
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
  
                <button
                  onClick={() => handleDelete(certification._id)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    flex: "1",
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
  
                <button
                  onClick={() => handleToggleInclude(certification._id)}
                  style={{
                    backgroundColor: certification.includeInResume
                      ? "#28a745"
                      : "#dc3545",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    flex: "1",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                >
                  <FontAwesomeIcon
                    icon={certification.includeInResume ? faToggleOn : faToggleOff}
                  /> {certification.includeInResume ? "Included" : "Excluded"}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
  
      {isAdding && (
        <div>
          <input
            type="text"
            placeholder="Certification Name"
            value={newCertification.name}
            onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
            style={{
              borderRadius: "8px",
              border: "1px solid #444",
              padding: "12px",
              fontSize: "1rem",
              marginBottom: "1rem",
              width: "100%",
              backgroundColor: "#1c1c1e",
              color: "#f5f5f5",
            }}
          />
  
          <input
            type="text"
            placeholder="Issued By"
            value={newCertification.issuedBy}
            onChange={(e) => setNewCertification({ ...newCertification, issuedBy: e.target.value })}
            style={{
              borderRadius: "8px",
              border: "1px solid #444",
              padding: "12px",
              fontSize: "1rem",
              marginBottom: "1rem",
              width: "100%",
              backgroundColor: "#1c1c1e",
              color: "#f5f5f5",
            }}
          />
  
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
         
            <select
              value={newCertification.issuedDate.month}
              onChange={(e) =>
                setNewCertification({
                  ...newCertification,
                  issuedDate: { ...newCertification.issuedDate, month: e.target.value },
                })
              }
              style={{
                borderRadius: "8px",
                border: "1px solid #444",
                padding: "10px",
                backgroundColor: "#1c1c1e",
                color: "#f5f5f5",
                flex: "1",
              }}
            >
              <option value="" disabled>
                Select Month
              </option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
  
            <select
              value={newCertification.issuedDate.year}
              onChange={(e) =>
                setNewCertification({
                  ...newCertification,
                  issuedDate: { ...newCertification.issuedDate, year: e.target.value },
                })
              }
              style={{
                borderRadius: "8px",
                border: "1px solid #444",
                padding: "10px",
                backgroundColor: "#1c1c1e",
                color: "#f5f5f5",
                flex: "1",
              }}
            >
              <option value="" disabled>
                Select Year
              </option>
              {graduationYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
  
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "1rem" }}>
            <select
              value={newCertification.expirationDate.month}
              onChange={(e) =>
                setNewCertification({
                  ...newCertification,
                  expirationDate: { ...newCertification.expirationDate, month: e.target.value },
                })
              }
              style={{
                borderRadius: "8px",
                border: "1px solid #444",
                padding: "10px",
                backgroundColor: "#1c1c1e",
                color: "#f5f5f5",
                flex: "1",
              }}
            >
              <option value="" disabled>
                Select Month
              </option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
  
            <select
              value={newCertification.expirationDate.year}
              onChange={(e) =>
                setNewCertification({
                  ...newCertification,
                  expirationDate: { ...newCertification.expirationDate, year: e.target.value },
                })
              }
              style={{
                borderRadius: "8px",
                border: "1px solid #444",
                padding: "10px",
                backgroundColor: "#1c1c1e",
                color: "#f5f5f5",
                flex: "1",
              }}
            >
              <option value="" disabled>
                Select Year
              </option>
              {graduationYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
  
          <textarea
            placeholder="Certificate URL"
            value={newCertification.url}
            onChange={(e) => setNewCertification({ ...newCertification, url: e.target.value })}
            style={{
              borderRadius: "8px",
              border: "1px solid #444",
              padding: "12px",
              fontSize: "1rem",
              marginTop: "1rem",
              width: "100%",
              backgroundColor: "#1c1c1e",
              color: "#f5f5f5",
            }}
          />
  
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              onClick={handleSaveClick}
              style={{
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                flex: "1",
              }}
            >
              <FontAwesomeIcon icon={faSave} />
              Save
            </button>
  
            <button
              onClick={() => setIsAdding(false)}
              style={{
                backgroundColor: "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                flex: "1",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
  
      {!isAdding && (
        <button
          onClick={handleAddClick}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 20px",
            width: "100%",
            marginTop: "20px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Certification
        </button>
      )}
    </div>
  );
  
};

export default CertificationSection;
