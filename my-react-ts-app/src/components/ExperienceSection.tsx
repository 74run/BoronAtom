import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faToggleOn, faToggleOff, faMagic } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';

interface Experience {
  _id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  description: string;
  includeInResume: boolean;
  isPresent?: boolean; // Add this field to track if the end date is 'Present'
  isEditing?: boolean;
}

interface ExperienceProps {
  Experiences: Experience[];
  onEdit: (id: string, data: {
    jobTitle: string;
    company: string;
    location: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string;
    includeInResume: boolean;
    isPresent: boolean;
  }) => void;
  onDelete: (id: string) => void;
}

const ExperienceSection: React.FC<ExperienceProps> = ({ Experiences, onEdit, onDelete }) => {
  const [editData, setEditData] = useState<{
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string;
    includeInResume: boolean;
    isPresent: boolean;
  } | null>(null);

  const [experiences, setExperiences] = useState<Experience[]>(Experiences);
  const [newExperience, setNewExperience] = useState<Experience>({
    _id: '',
    jobTitle: '',
    company: '',
    location: '',
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
    fetchExperience();
  }, []);

  const fetchExperience = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/experience`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch experiences');
        }
        return response.json();
      })
      .then(data => {
        setExperiences(data);
      })
      .catch(error => {
        console.error('Error fetching experiences:', error);
      });
  };

  const handleGenerateDescription = (jobTitle: string) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/userprofile/generate-job-description/${userID}/${jobTitle}`, {
        params: { jobTitle },
      })
      .then((response) => {
        const generatedDescription = response.data.text;
        if (editData) {
          setEditData((prevData) => ({
            ...prevData!,
            description: generatedDescription,
          }));
        } else {
          setNewExperience((prevExperience) => ({
            ...prevExperience,
            description: generatedDescription,
          }));
        }
      })
      .catch((error) => {
        console.error('Error generating description:', error);
      });
  };

  const handleEditClick = (
    id: string,
    jobTitle: string,
    company: string,
    location: string,
    startDate: { month: string; year: string },
    endDate: { month: string; year: string },
    description: string,
    includeInResume: boolean,
    isPresent: boolean
  ) => {
    setEditData({ id, jobTitle, company, location, startDate, endDate, description, includeInResume, isPresent });
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, {
        jobTitle: editData.jobTitle,
        company: editData.company,
        location: editData.location,
        startDate: { ...editData.startDate },
        endDate: { ...editData.endDate },
        description: editData.description,
        includeInResume: editData.includeInResume,
        isPresent: editData.isPresent,
      });

      const updatedItems = experiences.map((experience) =>
        experience._id === editData.id
          ? { ...experience, jobTitle: editData.jobTitle, company: editData.company, location: editData.location, startDate: { ...editData.startDate }, endDate: { ...editData.endDate }, description: editData.description, includeInResume: editData.includeInResume, isPresent: editData.isPresent }
          : experience
      );

      setExperiences(updatedItems);
      setEditData(null);
    }
  };

  const handleSaveClick = () => {
    const formattedExperience = {
      ...newExperience,
      startDate: {
        month: newExperience.startDate.month,
        year: newExperience.startDate.year,
      },
      endDate: {
        month: newExperience.endDate.month,
        year: newExperience.endDate.year,
      },
    };

    axios.post(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/experience`, formattedExperience)
      .then((response) => {
        const newExperienceFromServer = response.data.experience;
        const newExpData = newExperienceFromServer[newExperienceFromServer.length - 1];
        setExperiences([...experiences, newExpData]);

        setNewExperience({
          _id: '',
          jobTitle: '',
          company: '',
          location: '',
          startDate: { month: '', year: '' },
          endDate: { month: '', year: '' },
          description: '',
          includeInResume: true,
          isPresent: false, // Reset to false
        });

        setIsAdding(false);
      })
      .catch((error) => {
        console.error('Error saving experience:', error.message);
      });
  };

  const handleDelete = (id: string) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/experience/${id}`)
      .then(() => {
        const updatedExperiences = experiences.filter((experience) => experience._id !== id);
        setExperiences(updatedExperiences);
        setEditData(null);
      })
      .catch((error) => {
        console.error('Error deleting experience:', error.message);
      });
  };

  const handleAddClick = () => {
    setNewExperience({
      _id: '',
      jobTitle: '',
      company: '',
      location: '',
      startDate: { month: '', year: '' },
      endDate: { month: '', year: '' },
      description: '',
      includeInResume: true,
      isPresent: false, // Initialize as false
    });
    setIsAdding(true);
  };

  const handleToggleInclude = (id: string) => {
    const updatedExperiences = experiences.map((experience) =>
      experience._id === id ? { ...experience, includeInResume: !experience.includeInResume } : experience
    );
    setExperiences(updatedExperiences);

    const experienceToUpdate = updatedExperiences.find(exp => exp._id === id);
    if (experienceToUpdate) {
      onEdit(id, {
        jobTitle: experienceToUpdate.jobTitle,
        company: experienceToUpdate.company,
        location: experienceToUpdate.location,
        startDate: experienceToUpdate.startDate,
        endDate: experienceToUpdate.endDate,
        description: experienceToUpdate.description,
        includeInResume: experienceToUpdate.includeInResume,
        isPresent: experienceToUpdate.isPresent ?? false, // Provide default value if undefined
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
    setNewExperience({ ...newExperience, description: newDescription });
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

  const handleTogglePresent = () => {
    if (editData) {
      setEditData({ ...editData, isPresent: !editData.isPresent });
    } else {
      setNewExperience({ ...newExperience, isPresent: !newExperience.isPresent });
    }
  };

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
        Experience
      </h4>
      {experiences.map((experience) => (
        <div
          key={experience._id}
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
          {editData && editData.id === experience._id ? (
            // Edit mode
            <div>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Job Title"
                value={editData.jobTitle}
                onChange={(e) =>
                  setEditData({ ...editData, jobTitle: e.target.value })
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
                placeholder="Company"
                value={editData.company}
                onChange={(e) =>
                  setEditData({ ...editData, company: e.target.value })
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
                placeholder="Location"
                value={editData.location}
                onChange={(e) =>
                  setEditData({ ...editData, location: e.target.value })
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
                <label>Start Date:</label>
                <div className="flex-container">
                  <select
                    className="form-control mb-2"
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
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      padding: '10px',
                      marginRight: '0.5rem',
                    }}
                  >
                    {!editData.startDate.month && (
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
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      padding: '10px',
                    }}
                  >
                    {!editData.startDate.year && (
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
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      padding: '10px',
                      marginRight: '0.5rem',
                    }}
                  >
                    {!editData.endDate.month && (
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
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      padding: '10px',
                    }}
                  >
                    {!editData.endDate.year && (
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
                <button
                  className="btn btn-outline-secondary ms-2"
                  onClick={handleTogglePresent}
                  style={{
                    padding: '0.3rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    borderColor: editData.isPresent ? '#28a745' : '#dc3545',
                    color: editData.isPresent ? '#28a745' : '#dc3545',
                  }}
                >
                  <FontAwesomeIcon
                    icon={editData.isPresent ? faToggleOn : faToggleOff}
                    className="me-2"
                  />
                  {editData.isPresent ? 'Present' : 'Not Present'}
                </button>
              </div>
              <textarea
                className="form-control mb-3"
                placeholder="Description"
                value={editData.description}
                onChange={handleEditDescriptionChange}
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '12px',
                  fontSize: '1rem',
                  marginBottom: '1rem',
                  height: '250px',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
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
             <button
             onClick={() => handleGenerateDescription(editData.jobTitle)}
             className="btn btn-info me-2"
             style={{
              backgroundColor: '#17a2b8',
              color: '#fff',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '1rem',
              transition: 'all 0.3s',
             }}
           >
             <FontAwesomeIcon icon={faMagic} className="me-2" />
             AI Description
           </button>
           </div>
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
                {experience.jobTitle}
              </h5>
              <p
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#555',
                }}
              >
                <strong>Company: </strong>
                {experience.company}
              </p>
              <p
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#555',
                }}
              >
                <strong>Location: </strong>
                {experience.location}
              </p>
              <p
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#555',
                }}
              >
                <strong>Start Date:</strong>{' '}
                {experience.startDate &&
                  `${experience.startDate.month} ${experience.startDate.year}`}
              </p>
              <p
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#555',
                }}
              >
                <strong>End Date:</strong>{' '}
                {experience.isPresent
                  ? 'Present'
                  : experience.endDate &&
                    `${experience.endDate.month} ${experience.endDate.year}`}
              </p>
              {experience.description
                .split('*')
                .slice(1)
                .map((part, index) => (
                  <p
                    key={index}
                    style={{
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem',
                      color: '#555',
                    }}
                  >
                    {part}
                  </p>
                ))}

              <div>
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() =>
                    handleEditClick(
                      experience._id,
                      experience.jobTitle,
                      experience.company,
                      experience.location,
                      experience.startDate,
                      experience.endDate,
                      experience.description,
                      experience.includeInResume,
                      experience.isPresent || false
                    )
                  }
                  style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: '1px solid #007bff',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                  Edit
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleDelete(experience._id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    padding: '0.3rem 0.8rem',
                    border: '1px solid #dc3545',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                  Delete
                </button>
                <button
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => handleToggleInclude(experience._id)}
                  style={{
                    padding: '0.3rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    borderColor: experience.includeInResume ? '#28a745' : '#dc3545',
                    color: experience.includeInResume ? '#28a745' : '#dc3545',
                  }}
                >
                  <FontAwesomeIcon
                    icon={experience.includeInResume ? faToggleOn : faToggleOff}
                    className="me-2"
                  />
                  {experience.includeInResume ? 'Included' : 'Excluded'}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      {isAdding && (
        // Add experience entry
        <div>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Job Title"
            value={newExperience.jobTitle}
            onChange={(e) =>
              setNewExperience({ ...newExperience, jobTitle: e.target.value })
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
            placeholder="Company"
            value={newExperience.company}
            onChange={(e) =>
              setNewExperience({ ...newExperience, company: e.target.value })
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
            placeholder="Location"
            value={newExperience.location}
            onChange={(e) =>
              setNewExperience({ ...newExperience, location: e.target.value })
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
            <label>Start Date:</label>
            <div className="flex-container">
              <select
                className="form-control mb-2"
                value={newExperience.startDate.month}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    startDate: {
                      ...newExperience.startDate,
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
                {!newExperience.startDate.month && (
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
                value={newExperience.startDate.year}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    startDate: {
                      ...newExperience.startDate,
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
                {!newExperience.startDate.year && (
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
                value={newExperience.endDate.month}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    endDate: {
                      ...newExperience.endDate,
                      month: e.target.value,
                    },
                  })
                }
                disabled={newExperience.isPresent}
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '10px',
                  marginRight: '0.5rem',
                }}
              >
                {!newExperience.endDate.month && (
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
                value={newExperience.endDate.year}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    endDate: {
                      ...newExperience.endDate,
                      year: e.target.value,
                    },
                  })
                }
                disabled={newExperience.isPresent}
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '10px',
                }}
              >
                {!newExperience.endDate.year && (
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
                  padding: '0.3rem 0.8rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  borderColor: newExperience.isPresent ? '#28a745' : '#dc3545',
                  color: newExperience.isPresent ? '#28a745' : '#dc3545',
                }}
              >
                <FontAwesomeIcon
                  icon={newExperience.isPresent ? faToggleOn : faToggleOff}
                  className="me-2"
                />
                {newExperience.isPresent ? 'Present' : 'Not Present'}
              </button>
            </div>
          </div>
          <textarea
            className="form-control mb-3"
            placeholder="Description"
            value={newExperience.description}
            onChange={(e) => handleDescriptionChange(e)}
            style={{
              borderRadius: '8px',
              border: '1px solid #ddd',
              padding: '12px',
              fontSize: '1rem',
              marginBottom: '1rem',
              height: '250px'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
         

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


</div>
            </div>
      )}
      {!isAdding && (
        // Show "Add Experience" button
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
          Add Experience
        </button>
      )}
    </div>
  );
};

export default ExperienceSection;
