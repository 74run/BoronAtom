import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

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
  Experiences: Experience[]; // Rename from Experiences to experiences
  onEdit: (id: string, data: { jobTitle: string; company: string; location: string; startDate: { month: string; year: string }; endDate: { month: string; year: string }; description: string }) => void;
  onDelete: (id: string) => void;
}

const ExperienceSection: React.FC<ExperienceProps> = ({ Experiences, onEdit, onDelete }) => {
  const [editData, setEditData] = useState<{ id: string; jobTitle: string; company: string; location: string; startDate: { month: string; year: string }; endDate: { month: string; year: string }; description: string} | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
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

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const graduationYears = Array.from({ length: 57 }, (_, index) => (new Date()).getFullYear() + 7 - index);


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
      
      setEditData(null);
    }
  };

  const handleSaveClick = () => {
    fetch('http://localhost:3001/api/experiences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newExperience),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((newExperienceFromServer) => {
        // Update the educations state with the new experience
        setExperiences([...experiences, newExperienceFromServer]);
  
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
    fetch(`http://localhost:3001/api/experiences/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        // Update the state to remove the deleted experience
        const updatedExperiences = experiences.filter((experience) => experience._id !== id);
        setExperiences(updatedExperiences);

        // Reset the editData state
        setEditData(null);
      })
      .catch((error) => {
        console.error('Error deleting experience:', error);
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

  return (
    <div
      style={{
        border: '2px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
      }}
    >
      <h2>Experience</h2>
      {experiences.map((experience) => (
        <div key={experience._id} className="mb-3">
          {editData && editData.id === experience._id ? (
            // Edit mode
            <div>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Job Title"
                value={editData.jobTitle}
                onChange={(e) =>
                  setEditData({ ...editData, jobTitle: e.target.value })
                }
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Company"
                value={editData.company}
                onChange={(e) =>
                  setEditData({ ...editData, company: e.target.value })
                }
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Location"
                value={editData.location}
                onChange={(e) =>
                  setEditData({ ...editData, location: e.target.value })
                }
              />
              <div className="date-dropdowns">
                <label>Start Date:</label>
                <div className="flex-container">
                  <select
                    className="form-control mb-2"
                    value={editData.startDate.month}
                    onChange={(e) => setEditData({ ...editData, startDate: { ...editData.startDate, month: e.target.value } })}
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
                    onChange={(e) => setEditData({ ...editData, startDate: { ...editData.startDate, year: e.target.value } })}
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
              <div className="date-dropdowns">
                <label>End Date:</label>
                <div className="flex-container">  
                  <select
                    className="form-control mb-2"
                    value={editData.endDate.month}
                    onChange={(e) => setEditData({ ...editData, endDate: { ...editData.endDate, month: e.target.value } })}
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
                    onChange={(e) => setEditData({ ...editData, endDate: { ...editData.endDate, year: e.target.value } })}
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
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Description"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              />
              <button
                className="btn btn-primary me-2"
                onClick={handleUpdate}
              >
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Update
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          ) : (
            // View mode
            <div>
              <h3>{experience.jobTitle}</h3>
              <p>{experience.company}</p>
              <p>{experience.location}</p>
              <p>Start Date: {experience.startDate.month} {experience.startDate.year}</p>
              <p>End Date: {experience.endDate.month} {experience.endDate.year}</p>
              <p>{experience.description}</p>
              <button
                className="btn btn-primary me-2"
                onClick={() => handleEditClick(experience._id, experience.jobTitle, experience.company, experience.location, experience.startDate, experience.endDate, experience.description)}
              >
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(experience._id)}
              >
                <FontAwesomeIcon icon={faTrash} className="me-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
      {isAdding && (
        // Add experience entry
        <div>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Job Title"
            value={newExperience.jobTitle}
            onChange={(e) =>
              setNewExperience({ ...newExperience, jobTitle: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Company"
            value={newExperience.company}
            onChange={(e) =>
              setNewExperience({ ...newExperience, company: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Location"
            value={newExperience.location}
            onChange={(e) =>
              setNewExperience({ ...newExperience, location: e.target.value })
            }
          />
          <div className="date-dropdowns">
            <label>Start Date:</label>
            <div className="flex-container">
              <select
                className="form-control mb-2"
                value={newExperience.startDate.month}
                onChange={(e) => setNewExperience({ ...newExperience, startDate: { ...newExperience.startDate, month: e.target.value } })}
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
                onChange={(e) => setNewExperience({ ...newExperience, startDate: { ...newExperience.startDate, year: e.target.value } })}
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
          <div className="date-dropdowns">
            <label>End Date:</label>
            <div className="flex-container">
              <select
                className="form-control mb-2"
                value={newExperience.endDate.month}
                onChange={(e) => setNewExperience({ ...newExperience, endDate: { ...newExperience.endDate, month: e.target.value } })}
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
                onChange={(e) => setNewExperience({ ...newExperience, endDate: { ...newExperience.endDate, year: e.target.value } })}
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
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Description"
            value={newExperience.description}
            onChange={(e) =>
              setNewExperience({ ...newExperience, description: e.target.value })
            }
          />
          <button
            className="btn btn-primary"
            onClick={handleSaveClick}
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
        // Show "Add Experience" button
        <button
          className="btn btn-primary"
          onClick={handleAddClick}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Experience
        </button>
      )}
    </div>
  );
}

export default ExperienceSection;
