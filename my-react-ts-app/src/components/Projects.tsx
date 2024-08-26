import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faSave, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';


interface Project {
  _id: string;
  name: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  skills: string;
  description: string;
  isEditing?: boolean;
}

interface ProjectsSectionProps {
  Projects: Project[];
  onEdit: (id: string, data: { name: string; startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    skills: string; description: string }) => void;
  onDelete: (id: string) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ Projects, onEdit, onDelete }) => {
  const [editData, setEditData] = useState<{
   id: string; name: string; startDate: { month: string; year: string },
   endDate: { month: string; year: string },
   skills: string,  description: string 
} | null>(null);
  const [projects, setProjects] = useState<Project[]>(Projects);
  const [newProject, setNewProject] = useState<Project>({
    _id: '',
    name: '',
    startDate: { month: '', year: '' },
    endDate: { month: '', year: '' },
    skills: '',
    description: '',
  });
  const [isAdding, setIsAdding] = useState(false);
  const { userID } = useParams();

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
        return response.json(); // Parse the response JSON
      })
      .then(data => {
        // console.log("Project data:",data)
        setProjects(data); // Set projects state with the fetched data
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  };
  


  // useEffect(() => {
  //   const storedProjects = JSON.parse(localStorage.getItem(`projects_${userID}`) || '[]');
  //   setProjects(storedProjects);
  // }, []);
  

  const handleEditClick = (id: string, name: string,

    startDate: { month: string; year: string },
    endDate: { month: string; year: string },
    skills: string, 
    description: string) => {
    setEditData({ id, name, startDate,
    endDate,
    skills, description });
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, { name: editData.name, startDate: { ...editData.startDate }, endDate: { ...editData.endDate }, skills: editData.skills, description: editData.description });

      const updatedItems = projects.map((project) =>
        project._id === editData.id
          ? { ...project, name: editData.name,startDate: { ...editData.startDate }, endDate: { ...editData.endDate }, skills: editData.skills, description: editData.description }
          : project
      );

      setProjects(updatedItems);

      // localStorage.setItem(`projects_${userID}`, JSON.stringify(updatedItems));

      setEditData(null);
    }
  };

  const handleSaveClick = () => {

    const formattedExperience = {
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
  
    const storageKey = `projects_${userID}`;
  
    axios.post(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/project`, formattedExperience)
      .then((response) => {
        const newProjectFromServer = response.data.project;
        const newProData = newProjectFromServer[newProjectFromServer.length-1]
        // Update the projects state with the new project
        setProjects([...projects, newProData]);

        // Reset the newProject state
        setNewProject({ _id: '', name: '', startDate: { month: '', year: '' },
        endDate: { month: '', year: '' },
        skills: '', description: '' });


        const updatedProjects = [...projects, newProData];
        // localStorage.setItem(storageKey, JSON.stringify(updatedProjects));

        // Set isAdding to false
        setIsAdding(false);
      })
      .catch((error) => {
        // Handle errors by logging them to the console
        console.error('Error saving project:', error.message);
      });
  };

  const handleDelete = (id: string) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/project/${id}`)
    .then((response) => {
      // Update the state to remove the deleted certification
        const updatedProjects = projects.filter((project) => project._id !== id);
        setProjects(updatedProjects);

        // Reset the editData state
        setEditData(null);
        // localStorage.setItem(`projects_${userID}`, JSON.stringify(updatedProjects));
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
    });
    setIsAdding(true);
  };

  // useEffect(() => {
  //   fetch('${process.env.REACT_APP_API_URL}/api/projects')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setProjects(data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching projects:', error);
  //     });
  // }, []);


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
    setNewProject({ ...newProject, description: newDescription });
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
        Projects
      </h4>
      {projects.map((project) => (
        <div
          key={project._id}
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
          {editData && editData.id === project._id ? (
            // Edit mode
            <div>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Project Name"
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
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Skills Acquired"
                value={editData.skills}
                onChange={(e) =>
                  setEditData({ ...editData, skills: e.target.value })
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
                {project.name}
              </h5>
              <div
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  color: '#555',
                }}
              >
                <strong>Start Date:</strong> {project.startDate.month}{' '}
                {project.startDate.year}
              </div>
              <div
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  color: '#555',
                }}
              >
                <strong>End Date:</strong> {project.endDate.month}{' '}
                {project.endDate.year}
              </div>
              <div
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  color: '#555',
                }}
              >
                <strong>Skills:</strong> {project.skills}
              </div>
              {project.description
                .split('*')
                .slice(1)
                .map((part, index) => (
                  <p
                    key={index}
                    style={{
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem',
                      color: '#666',
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
                      project._id,
                      project.name,
                      project.startDate,
                      project.endDate,
                      project.skills,
                      project.description
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
                  onClick={() => handleDelete(project._id)}
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
        // Add project entry
        <div>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
            }
            style={{
              borderRadius: '8px',
              border: '1px solid #ddd',
              padding: '12px',
              fontSize: '1rem',
              marginBottom: '1rem',
            }}
          />
          <textarea
            className="form-control mb-3"
            placeholder="Description"
            value={newProject.description}
            onChange={(e) => handleDescriptionChange(e)}
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
            placeholder="Skills Acquired"
            value={newProject.skills}
            onChange={(e) =>
              setNewProject({ ...newProject, skills: e.target.value })
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
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '10px',
                  marginRight: '0.5rem',
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
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '10px',
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
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '10px',
                  marginRight: '0.5rem',
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
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '10px',
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
            </div>
          </div>
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
        // Show "Add Project" button
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
          Add Project
        </button>
      )}
    </div>
  );
  
  
  
};

export default ProjectsSection;
