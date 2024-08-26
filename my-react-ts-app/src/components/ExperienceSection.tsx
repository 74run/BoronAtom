import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

import { useParams } from 'react-router-dom';


interface Experience {
  _id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  description: string;
  isEditing?: boolean;
}

interface ExperienceProps {
  Experiences: Experience[]; 
  onEdit: (id: string, data: { jobTitle: string; company: string; location: string; startDate: { month: string; year: string }; endDate: { month: string; year: string }; description: string }) => void;
  onDelete: (id: string) => void;
}

const ExperienceSection: React.FC<ExperienceProps> = ({ Experiences, onEdit, onDelete }) => {
  const [editData, setEditData] = useState<{ id: string; jobTitle: string; company: string; location: string; startDate: { month: string; year: string }; endDate: { month: string; year: string }; description: string} | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>(Experiences);
  const [newExperience, setNewExperience] = useState<Experience>({
    _id: '',
    jobTitle: '',
    company: '',
    location: '',
    startDate: { month: '', year: '' },
    endDate: { month: '', year: '' },
    description: '',
  });
  const [isAdding, setIsAdding] = useState(false);

  const { userID } = useParams();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const graduationYears = Array.from({ length: 57 }, (_, index) => (new Date()).getFullYear() + 7 - index);

// useEffect(() => {
//   const storedExperiences = JSON.parse(localStorage.getItem(`experiences_${userID}`) || '[]');
//   setExperiences(storedExperiences);
// }, []);

useEffect(() => {
  fetchExperience();
}, []);

const fetchExperience = () => {
  fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/experience`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch educations');
      }
      return response.json(); // Parse the response JSON
    })
    .then(data => {
      // console.log("Project data:",data)
      setExperiences(data); // Set projects state with the fetched data
    })
    .catch(error => {
      console.error('Error fetching projects:', error);
    });
};
  


  const handleEditClick = (id: string, jobTitle: string, company: string, location: string, startDate: { month: string; year: string }, endDate: { month: string; year: string }, description: string) => {
    setEditData({ id, jobTitle, company, location, startDate, endDate, description });
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, { jobTitle: editData.jobTitle, company: editData.company, location: editData.location, startDate: { ...editData.startDate },
        endDate: { ...editData.endDate }, description: editData.description});
       
      
      const updatedItems = experiences.map((experience) =>
      experience._id === editData.id
        ? { ...experience, jobTitle: editData.jobTitle, company: editData.company, location: editData.location, startDate: { ...editData.startDate }, endDate: { ...editData.endDate }, description: editData.description }
        : experience
    );

    setExperiences(updatedItems);

    // localStorage.setItem(`experiences_${userID}`, JSON.stringify(updatedItems));
      
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

    // const storageKey = `experiences_${userID}`;
 
    axios.post(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/experience`, formattedExperience)
      .then((response) => {
        const newExperienceFromServer = response.data.experience;
        const newExpData = newExperienceFromServer[newExperienceFromServer.length-1]
        setExperiences([...experiences, newExpData]);

        const updatedExperiences = [...experiences, newExpData];
        // localStorage.setItem(storageKey, JSON.stringify(updatedExperiences));
        // Reset the newExperience state
        setNewExperience({ _id: '', jobTitle: '', company: '', location: '', startDate: { month: '', year: '' },
        endDate: { month: '', year: '' }, description:'' });
  
        // Set isAdding to false
        setIsAdding(false);
      })
      .catch((error) => {
        // Handle errors by logging them to the console
        console.error('Error saving experience:', error.message);
      });
  };
  

  const handleDelete = (id: string) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/experience/${id}`)
      .then((response) => {
        const updatedExperiences = experiences.filter((experience) => experience._id !== id);
        setExperiences(updatedExperiences);
  
        // Reset the editData state
        setEditData(null);
        // localStorage.setItem(`experiences_${userID}`, JSON.stringify(updatedExperiences));
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
    });
    setIsAdding(true);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    const lines = description.split('\n');
  
    // Check if the first line already starts with a star, if not, prepend a star
    if (lines.length > 0 && !lines[0].startsWith('*')) {
      lines[0] = '* ' + lines[0];
    }
  
    // Add a star to the beginning of each new line
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] !== '' && !lines[i].startsWith('*')) {
        lines[i] = '* ' + lines[i];
      }
    }
  
    // Join the lines back together with newlines
    const newDescription = lines.join('\n');
  
    // Update the state
    setNewExperience({ ...newExperience, description: newDescription });
  };


  const handleEditDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    const lines = description.split('\n');
    
    // Add asterisk at the beginning of each line
    const linesWithAsterisks = lines.map(line => {
      // Check if the line is not empty and doesn't start with an asterisk
      if (line.trim() !== '' && !line.trim().startsWith('*')) {
        return `* ${line}`;
      } else {
        return line;
      }
    });
    
    // Join the lines back together with newlines
    const newDescription = linesWithAsterisks.join('\n');
    
    // Ensure editData is not null before updating
    if (editData) {
      setEditData({ 
        ...editData, 
        description: newDescription
      });
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
                {experience.endDate &&
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
                      experience.description
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
  
  
  
}

export default ExperienceSection;
