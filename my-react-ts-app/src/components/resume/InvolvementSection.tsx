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
  const [isLoading, setIsLoading] = useState(false);
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

  const handleGenerateDescription = async (organization: string, role: string) => {
    try {
      // Set loading state for the description generation process
      setIsLoading(true);
  
      // Make the API request
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/userprofile/generate-involvement-description/${userID}/${organization}/${role}`,
        {
          params: { organization, role },
        }
      );
  
      const generatedDescription = response.data.text;
  
      // Update the description in the appropriate form state (edit or new involvement)
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
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Error generating description:", error);
  
      // Optional: Show a user-friendly error message
      alert("Failed to generate description. Please try again later.");
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };
  
  const handleTogglePresent = () => {
    if (editData) {
      setEditData({ ...editData, isPresent: !editData.isPresent });
    } else {
      setNewInvolvement({ ...newInvolvement, isPresent: !newInvolvement.isPresent });
    }
  };

  return (
    <div className="involvements-container">
      <style>
        {`
          .involvements-container {
            background-color: #2d3748;
            border-radius: 12px;
            padding: 1.5rem;
            color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .section-header {
            color: #63b3ed;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
          }

          .involvement-card {
            background-color: #1a202c;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            border: 1px solid #4a5568;
            transition: all 0.2s ease;
          }

          .involvement-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .role-title {
            color: #63b3ed;
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
          }

          .organization-info {
            color: #a0aec0;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
          }

          .date-info {
            color: #a0aec0;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
          }

          .description-box {
            background-color: #2d3748;
            border-radius: 6px;
            padding: 1rem;
            margin: 1rem 0;
            border: 1px solid #4a5568;
            color: #e2e8f0;
            font-size: 0.95rem;
            line-height: 1.6;
            white-space: pre-wrap;
          }

          .input-field {
            width: 100%;
            padding: 0.75rem;
            border-radius: 6px;
            background-color: #2d3748;
            border: 1px solid #4a5568;
            color: white;
            font-size: 0.95rem;
            margin-bottom: 1rem;
          }

          .input-field:focus {
            outline: none;
            border-color: #63b3ed;
          }

          .date-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1rem;
          }

          .date-label {
            color: #a0aec0;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
          }

          .select-field {
            padding: 0.75rem;
            border-radius: 6px;
            background-color: #2d3748;
            border: 1px solid #4a5568;
            color: white;
            font-size: 0.95rem;
            width: 100%;
          }

          .btn-group {
            display: flex;
            gap: 0.75rem;
            margin-top: 1rem;
            flex-wrap: wrap;
          }

          .btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .btn:hover {
            transform: translateY(-1px);
          }

          .btn-primary {
            background: linear-gradient(to right, #3182ce, #4facfe);
            color: white;
          }

          .btn-success {
            background: linear-gradient(to right, #38a169, #68d391);
            color: white;
          }

          .btn-danger {
            background: linear-gradient(to right, #e53e3e, #fc8181);
            color: white;
          }

          .btn-secondary {
            background-color: #4a5568;
            color: white;
          }

          .btn-ai {
            background: linear-gradient(to right, #17a2b8, #4fc3f7);
            color: white;
          }

          .present-toggle {
            width: 100%;
            padding: 0.75rem;
            border-radius: 6px;
            font-size: 0.95rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: all 0.2s ease;
          }

          .present-toggle.active {
            background: linear-gradient(to right, #38a169, #68d391);
            color: white;
          }

          .present-toggle.inactive {
            background: linear-gradient(to right, #e53e3e, #fc8181);
            color: white;
          }

          .include-toggle {
            background: none;
            border: none;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .include-toggle.included {
            background: linear-gradient(to right, #38a169, #68d391);
            color: white;
          }

          .include-toggle.excluded {
            background: linear-gradient(to right, #e53e3e, #fc8181);
            color: white;
          }

          .loading-dots {
            display: flex;
            gap: 4px;
          }

          .dot {
            width: 6px;
            height: 6px;
            background-color: white;
            border-radius: 50%;
            animation: dot-flashing 1s infinite linear alternate;
          }

          .dot:nth-child(2) { animation-delay: 0.2s; }
          .dot:nth-child(3) { animation-delay: 0.4s; }

          @keyframes dot-flashing {
            0% { opacity: 0.2; }
            100% { opacity: 1; }
          }

          @media (max-width: 640px) {
            .btn-group {
              flex-direction: column;
            }
            
            .btn {
              width: 100%;
            }
          }

          .bold-text {
            color: #63b3ed;
            font-weight: 600;
          }
        `}
      </style>

      <h2 className="section-header">Involvements</h2>

      {involvements.map((involvement) => (
        <div key={involvement._id} className="involvement-card">
          {editData && editData.id === involvement._id ? (
            <div className="form-group">
              <input
                type="text"
                className="input-field"
                placeholder="Organization"
                value={editData.organization}
                onChange={(e) => setEditData({ ...editData, organization: e.target.value })}
              />

              <input
                type="text"
                className="input-field"
                placeholder="Role"
                value={editData.role}
                onChange={(e) => setEditData({ ...editData, role: e.target.value })}
              />

              <div className="date-grid">
                <div>
                  <div className="date-label">Start Date</div>
                  <select
                    className="select-field"
                    value={editData.startDate.month}
                    onChange={(e) => setEditData({
                      ...editData,
                      startDate: { ...editData.startDate, month: e.target.value }
                    })}
                  >
                    <option value="" disabled>Select Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="date-label">&nbsp;</div>
                  <select
                    className="select-field"
                    value={editData.startDate.year}
                    onChange={(e) => setEditData({
                      ...editData,
                      startDate: { ...editData.startDate, year: e.target.value }
                    })}
                  >
                    <option value="" disabled>Select Year</option>
                    {graduationYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {!editData.isPresent && (
                <div className="date-grid">
                  <div>
                    <div className="date-label">End Date</div>
                    <select
                      className="select-field"
                      value={editData.endDate.month}
                      onChange={(e) => setEditData({
                        ...editData,
                        endDate: { ...editData.endDate, month: e.target.value }
                      })}
                    >
                      <option value="" disabled>Select Month</option>
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="date-label">&nbsp;</div>
                    <select
                      className="select-field"
                      value={editData.endDate.year}
                      onChange={(e) => setEditData({
                        ...editData,
                        endDate: { ...editData.endDate, year: e.target.value }
                      })}
                    >
                      <option value="" disabled>Select Year</option>
                      {graduationYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button 
                className={`present-toggle ${editData.isPresent ? 'active' : 'inactive'}`}
                onClick={handleTogglePresent}
              >
                <FontAwesomeIcon icon={editData.isPresent ? faToggleOn : faToggleOff} />
                {editData.isPresent ? "Currently Involved" : "Not Currently Involved"}
              </button>

              <textarea
                className="input-field"
                placeholder="Description"
                value={editData.description}
                onChange={handleEditDescriptionChange}
                style={{ minHeight: "150px" }}
              />

              <div className="btn-group">
                <button 
                  className="btn btn-ai"
                  onClick={() => handleGenerateDescription(editData.organization, editData.role)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loading-dots">
                      <div className="dot" />
                      <div className="dot" />
                      <div className="dot" />
                    </div>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faMagic} />
                      AI Description
                    </>
                  )}
                </button>

                <button 
                  className="btn btn-success"
                  onClick={handleUpdate}
                >
                  <FontAwesomeIcon icon={faSave} />
                  Save Changes
                </button>

                <button 
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="role-title">{involvement.role}</h3>
              <div className="organization-info">
                <strong>Organization:</strong> {involvement.organization}
              </div>
              <div className="date-info">
                <strong>Duration:</strong> {involvement.startDate.month} {involvement.startDate.year} - 
                {involvement.isPresent ? " Present" : ` ${involvement.endDate.month} ${involvement.endDate.year}`}
              </div>

              <div className="description-box">
                {involvement.description.split("**").map((part, index) =>
                  index % 2 === 1 ? (
                    <b key={index} style={{ color: "#00d084", fontWeight: 600 }}>{part}</b>
                  ) : (
                    <span key={index}>{part}</span>
                  )
                )}
              </div>

              <div className="btn-group">
                <button 
                  className="btn btn-primary"
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
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Edit
                </button>

                <button 
                  className={`include-toggle ${involvement.includeInResume ? 'included' : 'excluded'}`}
                  onClick={() => handleToggleInclude(involvement._id)}
                >
                  <FontAwesomeIcon icon={involvement.includeInResume ? faToggleOn : faToggleOff} />
                  {involvement.includeInResume ? "Included" : "Excluded"}
                </button>

                <button 
                  className="btn btn-danger"
                  onClick={() => handleDelete(involvement._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Add Involvement Form */}
      {isAdding && (
        <div className="involvement-card">
          <div className="form-group">
            <input
              type="text"
              className="input-field"
              placeholder="Organization"
              value={newInvolvement.organization}
              onChange={(e) => setNewInvolvement({ ...newInvolvement, organization: e.target.value })}
            />

            <input
              type="text"
              className="input-field"
              placeholder="Role"
              value={newInvolvement.role}
              onChange={(e) => setNewInvolvement({ ...newInvolvement, role: e.target.value })}
            />

            <div className="date-grid">
              <div>
                <div className="date-label">Start Date</div>
                <select
                  className="select-field"
                  value={newInvolvement.startDate.month}
                  onChange={(e) => setNewInvolvement({
                    ...newInvolvement,
                    startDate: { ...newInvolvement.startDate, month: e.target.value }
                  })}
                >
                  <option value="" disabled>Select Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="date-label">&nbsp;</div>
                <select
                  className="select-field"
                  value={newInvolvement.startDate.year}
                  onChange={(e) => setNewInvolvement({
                    ...newInvolvement,
                    startDate: { ...newInvolvement.startDate, year: e.target.value }
                  })}
                >
                  <option value="" disabled>Select Year</option>
                  {graduationYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {!newInvolvement.isPresent && (
              <div className="date-grid">
                <div>
                  <div className="date-label">End Date</div>
                  <select
                    className="select-field"
                    value={newInvolvement.endDate.month}
                    onChange={(e) => setNewInvolvement({
                      ...newInvolvement,
                      endDate: { ...newInvolvement.endDate, month: e.target.value }
                    })}
                    disabled={newInvolvement.isPresent}
                  >
                    <option value="" disabled>Select Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="date-label">&nbsp;</div>
                  <select
                    className="select-field"
                    value={newInvolvement.endDate.year}
                    onChange={(e) => setNewInvolvement({
                      ...newInvolvement,
                      endDate: { ...newInvolvement.endDate, year: e.target.value }
                    })}
                    disabled={newInvolvement.isPresent}
                  >
                    <option value="" disabled>Select Year</option>
                    {graduationYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button 
              className={`present-toggle ${newInvolvement.isPresent ? 'active' : 'inactive'}`}
              onClick={handleTogglePresent}
            >
              <FontAwesomeIcon icon={newInvolvement.isPresent ? faToggleOn : faToggleOff} />
              {newInvolvement.isPresent ? "Currently Involved" : "Not Currently Involved"}
            </button>

            <textarea
              className="input-field"
              placeholder="Involvement Description"
              value={newInvolvement.description}
              onChange={(e) => handleDescriptionChange(e)}
              style={{ minHeight: "150px" }}
            />

            <div className="btn-group">
              <button 
                className="btn btn-ai"
                onClick={() => handleGenerateDescription(newInvolvement.organization, newInvolvement.role)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-dots">
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                  </div>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faMagic} />
                    AI Description
                  </>
                )}
              </button>

              <button 
                className="btn btn-success"
                onClick={handleSaveClick}
              >
                <FontAwesomeIcon icon={faSave} />
                Save
              </button>

              <button 
                className="btn btn-secondary"
                onClick={() => setIsAdding(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {!isAdding && (
        <button 
          className="btn btn-primary"
          onClick={handleAddClick}
          style={{ 
            width: '100%',
            marginTop: involvements.length > 0 ? '1rem' : '0',
            background: 'linear-gradient(to right, #3182ce, #4facfe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '1rem'
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
