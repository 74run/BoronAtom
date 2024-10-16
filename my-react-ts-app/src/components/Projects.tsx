import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash, faEdit, faSave, faPlus, faToggleOn, faToggleOff, faMagic, faArrowUp, faArrowDown, faBold 
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Project {
  _id: string;
  name: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  skills: string;
  description: string;
  includeInResume: boolean;
  isEditing?: boolean;
  isPresent?: boolean; // Add this field to track if the end date is 'Present'
}

interface ProjectsSectionProps {
  Projects: Project[];
  onEdit: (id: string, data: { name: string; startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    skills: string; description: string; includeInResume: boolean, isPresent: boolean }) => void;
  onDelete: (id: string) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ Projects, onEdit, onDelete }) => {
  const [editData, setEditData] = useState<{
    id: string; name: string; startDate: { month: string; year: string },
    endDate: { month: string; year: string },
    skills: string; description: string; includeInResume: boolean, isPresent: boolean
  } | null>(null);
  const [projects, setProjects] = useState<Project[]>(Projects);
  const [newProject, setNewProject] = useState<Project>({
    _id: '',
    name: '',
    startDate: { month: '', year: '' },
    endDate: { month: '', year: '' },
    skills: '',
    description: '',
    includeInResume: true,
    isPresent: false, // Initialize as false
  });
  const [isAdding, setIsAdding] = useState(false);
  const { userID } = useParams();
  const [showBoldButton, setShowBoldButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const newTextareaRef = useRef<HTMLTextAreaElement>(null);
  



  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const graduationYears = Array.from({ length: 57 }, (_, index) => (new Date()).getFullYear() + 7 - index);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/project`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        return response.json();  // Parse the response JSON
      })
      .then(data => {
        setProjects(data);  // Set projects state with the fetched data
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  };
  
  const handleEditClick = (id: string, name: string,
    startDate: { month: string; year: string },
    endDate: { month: string; year: string },
    skills: string, 
    description: string, includeInResume: boolean, isPresent: boolean) => {
    setEditData({ id, name, startDate, endDate, skills, description, includeInResume, isPresent });
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, { 
        name: editData.name, 
        startDate: { ...editData.startDate }, 
        endDate: { ...editData.endDate }, 
        skills: editData.skills, 
        description: editData.description, 
        includeInResume: editData.includeInResume, 
        isPresent: editData.isPresent 
      });

      const updatedItems = projects.map((project) =>
        project._id === editData.id
          ? { ...project, name: editData.name, startDate: { ...editData.startDate }, endDate: { ...editData.endDate }, skills: editData.skills, description: editData.description, includeInResume: editData.includeInResume, isPresent: editData.isPresent }
          : project
      );

      setProjects(updatedItems);
      setEditData(null);
    }
  };

  const handleSaveClick = () => {
    const formattedProject = {
      ...newProject,
      startDate: {
        month: newProject.startDate.month,
        year: newProject.startDate.year,
      },
      endDate: {
        month: newProject.endDate.month,
        year: newProject.endDate.year,
      },
    };

    axios.post(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/project`, formattedProject)
      .then((response) => {
        const newProjectFromServer = response.data.project;
        const newProData = newProjectFromServer[newProjectFromServer.length - 1];
        // Update the projects state with the new project
        setProjects([...projects, newProData]);

        // Reset the newProject state
        setNewProject({
          _id: '',
          name: '',
          startDate: { month: '', year: '' },
          endDate: { month: '', year: '' },
          skills: '',
          description: '',
          includeInResume: true,
          isPresent: false, // Reset to false
        });

        // Set isAdding to false
        setIsAdding(false);
      })
      .catch((error) => {
        console.error('Error saving project:', error.message);
      });
  };

  const handleDelete = (id: string) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/project/${id}`)
      .then((response) => {
        // Update the state to remove the deleted project
        const updatedProjects = projects.filter((project) => project._id !== id);
        setProjects(updatedProjects);

        // Reset the editData state
        setEditData(null);
      })
      .catch((error) => {
        console.error('Error deleting project:', error.message);
      });
  };

  const handleAddClick = () => {
    setNewProject({
      _id: '',
      name: '',
      startDate: { month: '', year: '' },
      endDate: { month: '', year: '' },
      skills: '',
      description: '',
      includeInResume: true,
      isPresent: false, // Initialize as false
    });
    setIsAdding(true);
  };

  const handleToggleInclude = (id: string) => {
    const updatedProjects = projects.map((project) =>
      project._id === id ? { ...project, includeInResume: !project.includeInResume } : project
    );
    setProjects(updatedProjects);

    const projectToUpdate = updatedProjects.find(project => project._id === id);
    if (projectToUpdate) {
      onEdit(id, {
        name: projectToUpdate.name,
        startDate: projectToUpdate.startDate,
        endDate: projectToUpdate.endDate,
        skills: projectToUpdate.skills,
        description: projectToUpdate.description,
        includeInResume: projectToUpdate.includeInResume,
        isPresent: projectToUpdate.isPresent ?? false, // Use nullish coalescing operator to provide a default value
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
    setNewProject({ ...newProject, description: newDescription });
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

  const handleGenerateDescription = (projectName: string) => {
    let jobdescription = localStorage.getItem('jobDescription');
    
    // If jobdescription is null or undefined, set it to an empty string
    if (!jobdescription) {
      jobdescription = '';
    }

    // Check if userID is defined
    if (!userID) {
      console.error('Error: userID is undefined.');
      return;
    }
  
    // Send a POST request with the job description in the request body
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/userprofile/generate-project-description/${userID}/${projectName}`, 
      { jobdescription }) // Send jobdescription (even if it's an empty string)
      .then((response) => {
        const generatedDescription = response.data.text;
        if (editData) {
          setEditData((prevData) => ({
            ...prevData!,
            description: generatedDescription,
          }));
        } else {
          setNewProject((prevProject) => ({
            ...prevProject,
            description: generatedDescription,
          }));
        }
      })
      .catch((error) => {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
        } else if (error.request) {
          // Request was made but no response received
          console.error('Error request:', error.request);
        } else {
          // Something else happened while setting up the request
          console.error('Error message:', error.message);
        }
      });
};


  const moveProjectUp = (index: number) => {
    if (index > 0) {
      const newProjects = [...projects];
      const temp = newProjects[index - 1];
      newProjects[index - 1] = newProjects[index];
      newProjects[index] = temp;
      setProjects(newProjects);
  
      // Save the new order to the server
      saveProjectOrder(newProjects);
    }
  };
  
  const moveProjectDown = (index: number) => {
    if (index < projects.length - 1) {
      const newProjects = [...projects];
      const temp = newProjects[index + 1];
      newProjects[index + 1] = newProjects[index];
      newProjects[index] = temp;
      setProjects(newProjects);
  
      // Save the new order to the server
      saveProjectOrder(newProjects);
    }
  };

  const saveProjectOrder = (updatedProjects: Project[]) => {
    console.log("Saving updated projects order:", updatedProjects);  // Add a log to check the payload
  
    axios
      .put(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/projects/reorder`, {
        projects: updatedProjects,  // Send the reordered list
      })
      .then((response) => {
        console.log('Project order updated successfully');
      })
      .catch((error) => {
        console.error('Error updating project order:', error);
      });
  };
  
  
  

  const handleTogglePresent = () => {
    if (editData) {
      setEditData({ ...editData, isPresent: !editData.isPresent });
    } else {
      setNewProject({ ...newProject, isPresent: !newProject.isPresent });
    }
  };

  // Detect text selection and show the Bold button
  const handleSelection = (isEditing: boolean) => {
    const textarea = isEditing ? editTextareaRef.current : newTextareaRef.current;
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
  

  const applyBold = (isEditing: boolean) => {
  // Choose the correct textarea ref based on the mode
  const textarea = isEditing ? editTextareaRef.current : newTextareaRef.current;
  if (!textarea) return;

  const { selectionStart, selectionEnd } = textarea;
  const selectedText = textarea.value.substring(selectionStart, selectionEnd);

  if (isEditing && editData) {
    const beforeText = editData.description.substring(0, selectionStart);
    const afterText = editData.description.substring(selectionEnd);

    const newDescription = `${beforeText}**${selectedText}**${afterText}`;

    setEditData({ ...editData, description: newDescription });
  } else {
    const beforeText = newProject.description.substring(0, selectionStart);
    const afterText = newProject.description.substring(selectionEnd);

    const newDescription = `${beforeText}**${selectedText}**${afterText}`;

    setNewProject({ ...newProject, description: newDescription });
  }

  setShowBoldButton(false); // Hide the bold button after applying bold
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
        Projects
      </h4>

      {/* Map over Projects */}
      {projects.map((project, index) => (
        <div
          key={project._id}
          className="project-card"
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
          {editData && editData.id === project._id ? (
            // Edit mode
            <div>
              <input
                type="text"
                placeholder="Project Name"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
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
                placeholder="Organization"
                value={editData.skills}
                onChange={(e) =>
                  setEditData({ ...editData, skills: e.target.value })
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
  ref={editTextareaRef}
  placeholder="Edit Description"
  value={editData.description}
  onChange={handleEditDescriptionChange}
  onMouseUp={() => handleSelection(true)} // Detect selection in edit mode
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
    onClick={() => applyBold(!!editData)} // Pass 'true' if in edit mode, otherwise 'false'
    style={{
      position: "absolute",
      top: buttonPosition.top,
      left: buttonPosition.left,
      backgroundColor: "#444",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      padding: "4px 8px",
      cursor: "pointer",
      fontSize: "0.8rem",
      zIndex: 1000,
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
                  onClick={() => handleGenerateDescription(editData.name)}
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
              }}
            >
              <h5
                style={{
                  color: "#f5f5f5",
                  fontFamily: "'Roboto Slab', serif",
                  fontSize: "1.2rem",
                  marginBottom: "0.5rem",
                  fontWeight: 700,
                }}
              >
                {project.name}
              </h5>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#bbb",
                }}
              >
                <strong>Start Date:</strong> {project.startDate.month}{" "}
                {project.startDate.year}
              </p>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#bbb",
                }}
              >
                <strong>End Date:</strong>{" "}
                {project.isPresent
                  ? "Present"
                  : `${project.endDate.month} ${project.endDate.year}`}
              </p>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#bbb",
                }}
              >
                <strong>Organization:</strong> {project.skills}
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
  {project.description.split("**").map((part, index) =>
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
                      project._id,
                      project.name,
                      project.startDate,
                      project.endDate,
                      project.skills,
                      project.description,
                      project.includeInResume,
                      project.isPresent || false
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
                  onClick={() => handleDelete(project._id)}
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
                  onClick={() => handleToggleInclude(project._id)}
                  style={{
                    backgroundColor: project.includeInResume
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
                    icon={project.includeInResume ? faToggleOn : faToggleOff}
                  />
                  {project.includeInResume ? "Included" : "Excluded"}
                </button>

                <div style={{ position: 'absolute', right: '10px', top: '10px' }}>
            <button onClick={() => moveProjectUp(index)} disabled={index === 0}>
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
            <button onClick={() => moveProjectDown(index)} disabled={index === projects.length - 1}>
              <FontAwesomeIcon icon={faArrowDown} />
            </button>
          </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Project Form */}
      {isAdding && (
        <div>
          <input
            type="text"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
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
            placeholder="Organization"
            value={newProject.skills}
            onChange={(e) =>
              setNewProject({ ...newProject, skills: e.target.value })
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
                value={newProject.startDate.month}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    startDate: {
                      ...newProject.startDate,
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
                {!newProject.startDate.month && (
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
                value={newProject.startDate.year}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    startDate: {
                      ...newProject.startDate,
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
                {!newProject.startDate.year && (
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
                value={newProject.endDate.month}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    endDate: {
                      ...newProject.endDate,
                      month: e.target.value,
                    },
                  })
                }
                disabled={newProject.isPresent}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #444",
                  padding: "10px",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                  flex: "1",
                }}
              >
                {!newProject.endDate.month && (
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
                value={newProject.endDate.year}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    endDate: {
                      ...newProject.endDate,
                      year: e.target.value,
                    },
                  })
                }
                disabled={newProject.isPresent}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #444",
                  padding: "10px",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                  flex: "1",
                }}
              >
                {!newProject.endDate.year && (
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
                  backgroundColor: newProject.isPresent ? "#28a745" : "#dc3545",
                  color: "#fff",
                }}
              >
                <FontAwesomeIcon
                  icon={newProject.isPresent ? faToggleOn : faToggleOff}
                  className="me-2"
                />
                {newProject.isPresent ? "Present" : "Not Present"}
              </button>
            </div>
          </div>

        <textarea
  ref={newTextareaRef} // Attach ref for new project
  placeholder="Description"
  value={newProject.description}
  onChange={(e) => handleDescriptionChange(e)}
  onMouseUp={() => handleSelection(false)} // Detect selection for new project
  style={{
    borderRadius: "8px",
    border: "1px solid #444",
    padding: "12px",
    fontSize: "1rem",
    width: "100%",
    marginBottom: "1rem",
    backgroundColor: "#1c1c1e",
    height: "250px",
    color: "#f5f5f5",
  }}
/>

{showBoldButton && (
  <button
    onClick={() => applyBold(!!editData)} // Pass 'true' if in edit mode, otherwise 'false'
    style={{
      position: "absolute",
      top: buttonPosition.top,
      left: buttonPosition.left,
      backgroundColor: "#444",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      padding: "4px 8px",
      cursor: "pointer",
      fontSize: "0.8rem",
      zIndex: 1000,
    }}
  >
    <FontAwesomeIcon icon={faBold} />
  </button>
)}




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
          Add Project
        </button>
      )}
    </div>
  );

};

export default ProjectsSection;
