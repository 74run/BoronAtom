import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faTimes, faToggleOn, faToggleOff, faMagic } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Involvement {
  _id: string;
  organization: string;
  role: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  description: string;
  includeInResume: boolean;
  isEditing?: boolean;
  isPresent?: boolean; // Add this field to track if the end date is 'Present'
}

interface InvolvementProps {
  Involvements: Involvement[];
  onEdit: (id: string, data: { organization: string; role: string; startDate: { month: string; year: string };
    endDate: { month: string; year: string }; description: string; includeInResume: boolean, isPresent: boolean }) => void;
  onDelete: (id: string) => void;
}

const InvolvementSection: React.FC<InvolvementProps> = ({ Involvements, onEdit, onDelete }) => {
  const [editData, setEditData] = useState<{ id: string; organization: string; role: string; startDate: { month: string; year: string };
    endDate: { month: string; year: string }; description: string; includeInResume: boolean, isPresent: boolean } | null>(null);
  const [involvements, setInvolvements] = useState<Involvement[]>(Involvements);
  const [newInvolvement, setNewInvolvement] = useState<Involvement>({
    _id: '',
    organization: '',
    role: '',
    startDate: { month: '', year: '' },
    endDate: { month: '', year: '' },
    description: '',
    includeInResume: true,
    isPresent: false, // Initialize as false
  });
  const [isAdding, setIsAdding] = useState(false);
  const { userID } = useParams();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const graduationYears = Array.from({ length: 57 }, (_, index) => (new Date()).getFullYear() + 7 - index);

  useEffect(() => {
    fetchInvolvement();
  }, []);

  const fetchInvolvement = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/involvement`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch involvements');
        }
        return response.json(); // Parse the response JSON
      })
      .then(data => {
        setInvolvements(data); // Set involvements state with the fetched data
      })
      .catch(error => {
        console.error('Error fetching involvements:', error);
      });
  };

  const handleEditClick = (id: string, organization: string, role: string, startDate: { month: string; year: string },
    endDate: { month: string; year: string }, description: string, includeInResume: boolean, isPresent: boolean) => {
    setEditData({ id, organization, role, startDate, endDate, description, includeInResume, isPresent });
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, {
        organization: editData.organization,
        role: editData.role,
        startDate: { ...editData.startDate },
        endDate: { ...editData.endDate },
        description: editData.description,
        includeInResume: editData.includeInResume,
        isPresent: editData.isPresent
      });

      const updatedItems = involvements.map((involvement) =>
        involvement._id === editData.id
          ? { ...involvement, organization: editData.organization, role: editData.role, startDate: { ...editData.startDate }, endDate: { ...editData.endDate }, description: editData.description, includeInResume: editData.includeInResume, isPresent: editData.isPresent }
          : involvement
      );

      setInvolvements(updatedItems);
      setEditData(null);
    }
  };

  const handleSaveClick = () => {
    const formattedInvolvement = {
      ...newInvolvement,
      startDate: {
        month: newInvolvement.startDate.month,
        year: newInvolvement.startDate.year,
      },
      endDate: {
        month: newInvolvement.endDate.month,
        year: newInvolvement.endDate.year,
      },
    };

    axios.post(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/involvement`, formattedInvolvement)
      .then((response) => {
        const newInvolvementFromServer = response.data.involvement;
        const newInvData = newInvolvementFromServer[newInvolvementFromServer.length - 1];
        setInvolvements([...involvements, newInvData]);

        // Reset the newInvolvement state
        setNewInvolvement({
          _id: '',
          organization: '',
          role: '',
          startDate: { month: '', year: '' },
          endDate: { month: '', year: '' },
          description: '',
          includeInResume: true,
          isPresent: false, // Reset to false
        });

        setIsAdding(false);
      })
      .catch((error) => {
        console.error('Error saving involvement:', error.message);
      });
  };

  const handleDelete = (id: string) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/involvement/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Update the state to remove the deleted involvement
        const updatedInvolvements = involvements.filter((involvement) => involvement._id !== id);
        setInvolvements(updatedInvolvements);
        setEditData(null);
      })
      .catch((error) => {
        console.error('Error deleting involvement:', error);
      });
  };

  const handleAddClick = () => {
    setNewInvolvement({
      _id: '',
      organization: '',
      role: '',
      startDate: { month: '', year: '' },
      endDate: { month: '', year: '' },
      description: '',
      includeInResume: true,
      isPresent: false, // Initialize as false
    });
    setIsAdding(true);
  };

  const handleToggleInclude = (id: string) => {
    const updatedInvolvements = involvements.map((involvement) =>
      involvement._id === id ? { ...involvement, includeInResume: !involvement.includeInResume } : involvement
    );
    setInvolvements(updatedInvolvements);

    const involvementToUpdate = updatedInvolvements.find(involvement => involvement._id === id);
    if (involvementToUpdate) {
      onEdit(id, {
        organization: involvementToUpdate.organization,
        role: involvementToUpdate.role,
        startDate: involvementToUpdate.startDate,
        endDate: involvementToUpdate.endDate,
        description: involvementToUpdate.description,
        includeInResume: involvementToUpdate.includeInResume,
        isPresent: involvementToUpdate.isPresent ?? false, // Use nullish coalescing operator to provide a default value
      });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    const lines = description.split('\n');

    if (lines.length > 0 && !lines[0].startsWith('*')) {
      lines[0] = '* ' + lines[0];
    }

    for (let i = 1; i < lines.length; i++) {
      if (lines[i] !== '' && !lines[i].startsWith('*')) {
        lines[i] = '* ' + lines[i];
      }
    }

    const newDescription = lines.join('\n');
    setNewInvolvement({ ...newInvolvement, description: newDescription });
  };

  const handleEditDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    const lines = description.split('\n');

    const linesWithAsterisks = lines.map(line => {
      if (line.trim() !== '' && !line.trim().startsWith('*')) {
        return `* ${line}`;
      } else {
        return line;
      }
    });

    const newDescription = linesWithAsterisks.join('\n');

    if (editData) {
      setEditData({
        ...editData,
        description: newDescription
      });
    }
  };

  const handleGenerateDescription = (organization: string, role: string) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/userprofile/generate-involvement-description/${userID}/${organization}/${role}`, {
        params: { organization, role },
      })
      .then((response) => {
        const generatedDescription = response.data.text;
        if (editData) {
          setEditData((prevData) => ({
            ...prevData!,
            description: generatedDescription,
          }));
        } else {
          setNewInvolvement((prevData) => ({
            ...prevData,
            description: generatedDescription,
          }));
        }
      })
      .catch((error) => {
        console.error('Error generating description:', error);
      });
  };

  const handleTogglePresent = () => {
    if (editData) {
      setEditData({ ...editData, isPresent: !editData.isPresent });
    } else {
      setNewInvolvement({ ...newInvolvement, isPresent: !newInvolvement.isPresent });
    }
  };

  return (
    <div
      style={{
        border: "none",
        borderRadius: "12px",
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
          color: "#4CAF50",
          textAlign: "left",
          marginBottom: "1.5rem",
          fontFamily: "'Roboto Slab', serif",
          fontWeight: 700,
          fontSize: "1.5rem",
        }}
      >
        Involvements
      </h4>
  
      {/* Map over Involvements */}
      {involvements.map((involvement) => (
        <div
          key={involvement._id}
          className="involvement-card"
          style={{
            border: "1px solid #333",
            borderRadius: "12px",
            padding: "14px",
            marginBottom: "1.5rem",
            backgroundColor: "#2d2d30",
            transition: "transform 0.3s, box-shadow 0.3s",
            cursor: "pointer",
            position: "relative",
          }}
        >
          {editData && editData.id === involvement._id ? (
            // Edit mode
            <div style={{
              border: "1px solid #333",
              borderRadius: "12px",
              padding: "14px",
              marginBottom: "1.5rem",
              backgroundColor: "#2d2d30",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
              position: "relative",
            }}>
              <input
                type="text"
                placeholder="Organization"
                value={editData.organization}
                onChange={(e) =>
                  setEditData({ ...editData, organization: e.target.value })
                }
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
                placeholder="Role"
                value={editData.role}
                onChange={(e) =>
                  setEditData({ ...editData, role: e.target.value })
                }
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
                  value={editData.startDate.month}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      startDate: {
                        ...editData.startDate,
                        month: e.target.value,
                      },
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
                  value={editData.startDate.year}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      startDate: {
                        ...editData.startDate,
                        year: e.target.value,
                      },
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
  
                <select
                  value={editData.endDate.month}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      endDate: {
                        ...editData.endDate,
                        month: e.target.value,
                      },
                    })
                  }
                  disabled={editData.isPresent}
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
                  value={editData.endDate.year}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      endDate: {
                        ...editData.endDate,
                        year: e.target.value,
                      },
                    })
                  }
                  disabled={editData.isPresent}
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
  
              <button
                className={`toggle-btn ${
                  editData.isPresent ? "present" : "not-present"
                }`}
                onClick={handleTogglePresent}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  marginTop: "10px",
                  marginBottom: "20px",
                  border: "none",
                  backgroundColor: editData.isPresent ? "#28a745" : "#dc3545",
                  color: "#fff",
                }}
              >
                <FontAwesomeIcon
                  icon={editData.isPresent ? faToggleOn : faToggleOff}
                  className="me-2"
                />
                {editData.isPresent ? "Present" : "Not Present"}
              </button>
  
              <textarea
                placeholder="Description"
                value={editData.description}
                onChange={handleEditDescriptionChange}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #444",
                  padding: "12px",
                  fontSize: "1rem",
                  marginBottom: "1rem",
                  width: "100%",
                  height: "200px",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                }}
              />
  
              {/* Action buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
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
                  <FontAwesomeIcon icon={faSave} />
                  Update
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
                >
                  Cancel
                </button>
  
                <button
                  onClick={() => handleGenerateDescription(editData.organization, editData.role)}
                  style={{
                    backgroundColor: "#17a2b8",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    flex: "1",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                >
                  <FontAwesomeIcon icon={faMagic} />
                  AI Description
                </button>
              </div>
            </div>
          ) : (
            // View mode
            <div
            style={{
              
              borderRadius: "8px",
              padding: "12px",
              backgroundColor: "#1c1c1e",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(0, 0, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 8px rgba(0, 0, 0, 0.1)";
            }}>
              <h5
                style={{
                  color: "#f5f5f5",
                  fontFamily: "'Roboto Slab', serif",
                  fontSize: "1.2rem",
                  marginBottom: "0.5rem",
                  fontWeight: 700,
                }}
              >
                {involvement.role}
              </h5>
  
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#bbb",
                }}
              >
                <strong>Start Date:</strong> {involvement.startDate.month}{" "}
                {involvement.startDate.year}
              </p>
  
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#bbb",
                }}
              >
                <strong>End Date:</strong>{" "}
                {involvement.isPresent
                  ? "Present"
                  : `${involvement.endDate.month} ${involvement.endDate.year}`}
              </p>
  
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#bbb",
                }}
              >
                <strong>Organization:</strong> {involvement.organization}
              </p>
  
              {involvement.description
                .split("*")
                .slice(1)
                .map((part, index) => (
                  <p key={index} style={{ color: "#aaa", fontSize: "0.9rem" }}>
                    {part}
                  </p>
                ))}
  
              {/* Action buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() =>
                    handleEditClick(
                      involvement._id,
                      involvement.organization,
                      involvement.role,
                      involvement.startDate,
                      involvement.endDate,
                      involvement.description,
                      involvement.includeInResume,
                      involvement.isPresent || false
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
                  onClick={() => handleDelete(involvement._id)}
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
                  onClick={() => handleToggleInclude(involvement._id)}
                  style={{
                    backgroundColor: involvement.includeInResume
                      ? "#28a745"
                      : "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    flex: "1",
                  }}
                >
                  <FontAwesomeIcon
                    icon={involvement.includeInResume ? faToggleOn : faToggleOff}
                  /> {involvement.includeInResume ? "Included" : "Excluded"}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
  
      {/* Add Involvement Form */}
       {isAdding && (
        // Add involvement entry
        <div>
          <input
            type="text"
           
            placeholder="Organization"
            value={newInvolvement.organization}
            onChange={(e) =>
              setNewInvolvement({
                ...newInvolvement,
                organization: e.target.value,
              })
            }
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
          
            placeholder="Role"
            value={newInvolvement.role}
            onChange={(e) =>
              setNewInvolvement({ ...newInvolvement, role: e.target.value })
            }
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
          <div className="date-dropdowns mb-3">
            <label>Start Date:</label>
            <div className="flex-container">
              <select
                className="form-control mb-2"
                value={newInvolvement.startDate.month}
                onChange={(e) =>
                  setNewInvolvement({
                    ...newInvolvement,
                    startDate: {
                      ...newInvolvement.startDate,
                      month: e.target.value,
                    },
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
                {!newInvolvement.startDate.month && (
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
                value={newInvolvement.startDate.year}
                onChange={(e) =>
                  setNewInvolvement({
                    ...newInvolvement,
                    startDate: {
                      ...newInvolvement.startDate,
                      year: e.target.value,
                    },
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
                {!newInvolvement.startDate.year && (
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
            <label>End Date:</label>
            <div className="flex-container">
              <select
                className="form-control mb-2"
                value={newInvolvement.endDate.month}
                onChange={(e) =>
                  setNewInvolvement({
                    ...newInvolvement,
                    endDate: {
                      ...newInvolvement.endDate,
                      month: e.target.value,
                    },
                  })
                }
                disabled={newInvolvement.isPresent}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #444",
                  padding: "10px",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                  flex: "1",
                }}
              >
                {!newInvolvement.endDate.month && (
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
                value={newInvolvement.endDate.year}
                onChange={(e) =>
                  setNewInvolvement({
                    ...newInvolvement,
                    endDate: {
                      ...newInvolvement.endDate,
                      year: e.target.value,
                    },
                  })
                }
                disabled={newInvolvement.isPresent}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #444",
                  padding: "10px",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                  flex: "1",
                }}
              >
                {!newInvolvement.endDate.year && (
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
              <button
                className="btn btn-outline-secondary ms-2"
                onClick={handleTogglePresent}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  marginTop: "10px",
                  border: "none",
                  backgroundColor: newInvolvement.isPresent ? "#28a745" : "#dc3545",
                  color: "#fff",
                }}
              >
                <FontAwesomeIcon
                  icon={newInvolvement.isPresent ? faToggleOn : faToggleOff}
                  className="me-2"
                />
                {newInvolvement.isPresent ? 'Present' : 'Not Present'}
              </button>
            </div>
          </div>
          <textarea
            
            placeholder="Description"
            value={newInvolvement.description}
            onChange={(e) => handleDescriptionChange(e)}
            style={{
              borderRadius: '8px',
              border: '1px solid #444',
              padding: '12px',
              fontSize: '1rem',
              width: "100%",
              marginBottom: '1rem',
              backgroundColor: "#1c1c1e",
              color: "#f5f5f5",
              height: '250px',
            }}
          />
  
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
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
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Involvement
        </button>
      )}
    </div>
  );
  
};

export default InvolvementSection;
