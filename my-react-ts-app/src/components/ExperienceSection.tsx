import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faToggleOn, faToggleOff, faMagic, faArrowUp, faArrowDown, faBold  } from '@fortawesome/free-solid-svg-icons';
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
  const [showBoldButton, setShowBoldButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);



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

  const moveExperienceUp = (index: number) => {
    if (index > 0) {
      const updatedExperiences = [...experiences];
      [updatedExperiences[index - 1], updatedExperiences[index]] = 
        [updatedExperiences[index], updatedExperiences[index - 1]];
      setExperiences(updatedExperiences);
      saveExperienceOrder(updatedExperiences);
    }
  };

  const moveExperienceDown = (index: number) => {
    if (index < experiences.length - 1) {
      const updatedExperiences = [...experiences];
      [updatedExperiences[index + 1], updatedExperiences[index]] = 
        [updatedExperiences[index], updatedExperiences[index + 1]];
      setExperiences(updatedExperiences);
      saveExperienceOrder(updatedExperiences);
    }
  };

  const saveExperienceOrder = (updatedExperiences: Experience[]) => {
    axios.put(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/experiences/reorder`, { experiences: updatedExperiences })
      .then(() => console.log('Experience order updated'))
      .catch(error => console.error('Error updating order:', error));
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

   // Detect text selection and show the Bold button
  const handleSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;

    if (selectionStart !== selectionEnd) {
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect(); // Get selected text's position

      if (rect) {
        const top = rect.top + window.scrollY - 30; // Position above the selected text
        const left = rect.left + window.scrollX; // Align to the left of the selection

        setButtonPosition({ top, left });
        setShowBoldButton(true);
      }
    } else {
      setShowBoldButton(false); // Hide button if no text is selected
    }
  };

  const applyBold = () => {
    const textarea = textareaRef.current;
    if (!textarea || !editData) return;

    const { selectionStart, selectionEnd } = textarea;
    const beforeText = editData.description.substring(0, selectionStart);
    const selectedText = editData.description.substring(selectionStart, selectionEnd);
    const afterText = editData.description.substring(selectionEnd);

    const newDescription = `${beforeText}**${selectedText}**${afterText}`;

    setEditData({ ...editData, description: newDescription });
    setShowBoldButton(false); // Hide button after applying bold
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
        Experience
      </h4>

      {/* Map over Experiences */}
      {experiences.map((experience, index) => (
        <div
          key={experience._id}
          className="experience-card"
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
          {editData && editData.id === experience._id ? (
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
                placeholder="Job Title"
                value={editData.jobTitle}
                onChange={(e) =>
                  setEditData({ ...editData, jobTitle: e.target.value })
                }
                style={{
                  borderRadius: "8px",
                  border: "1px solid #444",
                  padding: "12px",
                  fontSize: "1rem",
                  marginBottom: "1rem",
                  width: "100%",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5", // Light input text color
                }}
              />

              <input
                type="text"
                placeholder="Company"
                value={editData.company}
                onChange={(e) =>
                  setEditData({ ...editData, company: e.target.value })
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
                placeholder="Location"
                value={editData.location}
                onChange={(e) =>
                  setEditData({ ...editData, location: e.target.value })
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
                ref={textareaRef}
                placeholder="Edit Description"
                value={editData.description}
                onChange={handleEditDescriptionChange}
                onMouseUp={handleSelection} // Detect selection
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

              {showBoldButton && (
                <button
                  onClick={applyBold}
                  style={{
                    position: "relative",
                    top: buttonPosition.top,
                    left: buttonPosition.left,
                    backgroundColor: "#444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    zIndex: 1000, // Ensure it appears above everything
                  }}
                >
                  <FontAwesomeIcon icon={faBold} />
                </button>

                 )}


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
                  onClick={() => handleGenerateDescription(editData.jobTitle)}
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
                  color: "#f5f5f5", // Light text for dark mode
                  fontFamily: "'Roboto Slab', serif",
                  fontSize: "1.2rem",
                  marginBottom: "0.5rem",
                  fontWeight: 700,
                }}
              >
                {experience.jobTitle}
              </h5>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#bbb", // Muted text color
                }}
              >
                <strong>Company: </strong>
                {experience.company}
              </p>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#bbb",
                }}
              >
                <strong>Location: </strong>
                {experience.location}
              </p>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#bbb",
                }}
              >
                <strong>Start Date:</strong>{" "}
                {experience.startDate &&
                  `${experience.startDate.month} ${experience.startDate.year}`}
              </p>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#bbb",
                }}
              >
                <strong>End Date:</strong>{" "}
                {experience.isPresent
                  ? "Present"
                  : experience.endDate &&
                    `${experience.endDate.month} ${experience.endDate.year}`}
              </p>

              <div
  style={{
    marginTop: "20px",
    marginBottom: "20px",
    color: "#f5f5f5", // A softer white for better readability
    whiteSpace: "pre-wrap", // Maintain whitespace and newlines
    lineHeight: "1.6", // Increase line spacing for better readability
    fontSize: "1rem", // Adjust font size
    fontFamily: "'Roboto', sans-serif", // Set a consistent font family
    backgroundColor: "#2c2c2e", // Slightly different background for contrast
    padding: "12px", // Add padding around the text
    borderRadius: "8px", // Rounded corners for a modern look
    border: "1px solid #444", // Subtle border for separation
  }}
>
  {experience.description.split("**").map((part, index) =>
    index % 2 === 1 ? (
      <b key={index} style={{ fontWeight: 600 }}>{part}</b> // Bold content
    ) : (
      <span key={index}>{part}</span> // Regular content
    )
  )}
</div>

              

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
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    flex: "1",
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(experience._id)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    flex: "1",
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Delete
                </button>

                <button
                  onClick={() => handleToggleInclude(experience._id)}
                  style={{
                    backgroundColor: experience.includeInResume
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
                    icon={experience.includeInResume ? faToggleOn : faToggleOff}
                  />
                  {experience.includeInResume ? "Included" : "Excluded"}
                </button>

                <div style={{ position: 'absolute', right: '10px', top: '10px' }}>
            <button onClick={() => moveExperienceUp(index)} disabled={index === 0}>
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
            <button onClick={() => moveExperienceDown(index)} disabled={index === experiences.length - 1}>
              <FontAwesomeIcon icon={faArrowDown} />
            </button>
          </div>

                
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Experience Form */}
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
            className="form-control mb-3"
            placeholder="Company"
            value={newExperience.company}
            onChange={(e) =>
              setNewExperience({ ...newExperience, company: e.target.value })
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
            className="form-control mb-3"
            placeholder="Location"
            value={newExperience.location}
            onChange={(e) =>
              setNewExperience({ ...newExperience, location: e.target.value })
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
                  borderRadius: "8px",
                  border: "1px solid #444",
                  padding: "10px",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                  flex: "0.265",
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
                  borderRadius: "8px",
                  border: "1px solid #444",
                  padding: "10px",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                  flex: "0.27",
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
                  borderRadius: "8px",
                  border: "1px solid #444",
                  padding: "10px",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                  flex: "0.3",
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
                  borderRadius: "8px",
                  border: "1px solid #444",
                  padding: "10px",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                  flex: "0.3",
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
                  padding: "0.3rem 0.7rem",
                  borderRadius: "80px",
                  fontSize: "1rem",
                  maxWidth: '150px',
                  maxHeight: '50px',
                  marginTop: "0px",
                  border: "none",
                  backgroundColor: newExperience.isPresent ? "#28a745" : "#dc3545",
                  color: "#fff",
                  flex: "0.3",
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
          Add Experience
        </button>
      )}
    </div>
  );
};

export default ExperienceSection;
