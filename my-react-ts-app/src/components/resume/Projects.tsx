import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash, faEdit, faSave, faPlus, faToggleOn, faToggleOff, faMagic, faArrowUp, faArrowDown, faBold, 
  faTimes
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
  isPresent?: boolean; 
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
  const [isLoading, setIsLoading] = useState(false);
  



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


  const handleGenerateDescription = (itemName: string) => {
    console.log("Attempting to generate description for:", itemName);
    setIsLoading(true);
  
    // Check if it's a new project or editing
    const name = editData ? editData.name : newProject.name;
    console.log("Using name for API call:", name);
  
    let jobdescription = localStorage.getItem('jobDescription');
    if (!jobdescription) {
      jobdescription = '';
    }
  
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/userprofile/generate-project-description/${userID}/${encodeURIComponent(name)}`,
        { jobdescription }
      )
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
        console.error("Error generating description:", error);
        console.error("Error details:", error.response?.data);
      })
      .finally(() => {
        setIsLoading(false);
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

  const BoldButton = ({ onClick, style }: { onClick: () => void; style: React.CSSProperties }) => (
  <button className="bold-button" onClick={onClick} style={style}>
    <FontAwesomeIcon icon={faBold} /> Bold
  </button>
);

  // Detect text selection and show the Bold button
  const handleSelection = (isEditing: boolean) => {
    const textarea = isEditing ? editTextareaRef.current : newTextareaRef.current;
    if (!textarea) return;
  
    const { selectionStart, selectionEnd } = textarea;
  
    if (selectionStart !== selectionEnd) {
      // Get selected text
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
  
      // Get the range of selected text
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
  
      if (rect) {
        // Calculate position relative to viewport and add scroll offset
        const top = rect.top + window.pageYOffset - 40; // 40px above selection
        const left = rect.left + window.pageXOffset;
  
        setButtonPosition({ top, left });
        setShowBoldButton(true);
      }
    } else {
      setShowBoldButton(false);
    }
  };


  const applyBold = (isEditing: boolean) => {
    const textarea = isEditing ? editTextareaRef.current : newTextareaRef.current;
    if (!textarea) return;
  
    const { selectionStart, selectionEnd } = textarea;
    const selectedText = textarea.value.substring(selectionStart, selectionEnd);
    
    // Don't apply bold if no text is selected
    if (!selectedText.trim()) {
      setShowBoldButton(false);
      return;
    }
  
    if (isEditing && editData) {
      const beforeText = editData.description.substring(0, selectionStart);
      const afterText = editData.description.substring(selectionEnd);
      
      // Check if text is already bold
      const isBold = selectedText.startsWith('**') && selectedText.endsWith('**');
      const newDescription = isBold
        ? `${beforeText}${selectedText.slice(2, -2)}${afterText}`
        : `${beforeText}**${selectedText}**${afterText}`;
  
      setEditData({ ...editData, description: newDescription });
    } else {
      const beforeText = newProject.description.substring(0, selectionStart);
      const afterText = newProject.description.substring(selectionEnd);
      
      // Check if text is already bold
      const isBold = selectedText.startsWith('**') && selectedText.endsWith('**');
      const newDescription = isBold
        ? `${beforeText}${selectedText.slice(2, -2)}${afterText}`
        : `${beforeText}**${selectedText}**${afterText}`;
  
      setNewProject({ ...newProject, description: newDescription });
    }
  
    setShowBoldButton(false);
    textarea.focus();
  };


  const LoadingProjectCard = () => (
    <div className="project-card animate-pulse">
      <div className="h-6 w-48 bg-gray-700 rounded mb-4"></div>
      <div className="h-4 w-32 bg-gray-700 rounded mb-2"></div>
      <div className="h-4 w-40 bg-gray-700 rounded mb-4"></div>
      <div className="description-box">
        <div className="h-4 w-3/4 bg-gray-700 rounded mb-2"></div>
        <div className="h-4 w-2/3 bg-gray-700 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
      </div>
      <div className="btn-group">
        <div className="h-10 w-24 bg-gray-700 rounded"></div>
        <div className="h-10 w-24 bg-gray-700 rounded"></div>
        <div className="h-10 w-24 bg-gray-700 rounded"></div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="projects-container">
        <h2 className="section-header-1">Projects</h2>
        <LoadingProjectCard />
        <LoadingProjectCard />
      </div>
    );
  }

return (
  <div className="projects-container">
    <style>
      {`
        .projects-container {
          background-color: rgba(0, 3, 8, 0.45);
          border-radius: 12px;
          padding: 1.5rem;
          color: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          
        }

        .section-header-1 {
          color: #63b3ed;
          font-size: 0.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          
        }

        .project-card {
          background-color: #1a202c;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          border: 1px solid #4a5568;
          transition: all 0.2s ease;
     
        }

        .project-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .project-title {
          color: #63b3ed;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .project-meta {
          color: #a0aec0;
          font-size: 0.75rem;
          margin-bottom: 0.5rem;
        }

       

        .description-box {
  background-color: #2d3748;
  border-radius: 6px;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid #4a5568;
  color: #e2e8f0;
  font-size: 0.75rem;
  line-height: 1.6;
  white-space: pre-wrap;
}

        .form-group {
          margin-bottom: 1rem;
        }

       .input-field {
            width: 100%;
            padding: 0.75rem;
            border-radius: 6px;
            background-color: #2d3748;
            border: 1px solid #4a5568;
            color: white;
            font-size: 0.75rem;
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
            font-size: 0.75rem;
            margin-bottom: 0.5rem;
          }

        .select-field {
          padding: 0.75rem;
          border-radius: 6px;
          background-color: #2d3748;
          border: 1px solid #4a5568;
          color: white;
          font-size: 0.75rem;
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
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
}

.btn:hover {
 transform: translateY(-1px);
}

.btn:active {
  transform: scale(1);
}

   .btn-primary {
            background: linear-gradient(to right, #3182ce, #4facfe);
            color: white;
          }

      .btn-danger {
            background: linear-gradient(to right, #e53e3e, #fc8181);
            color: white;
          }


.btn-success {
  background: linear-gradient(to right, #38a169, #68d391);
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
            font-size: 0.75rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition:  background-color 0.2s ease;
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
            font-size: 0.75rem;
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
          }de-toggle:hover {
  transform: scale(1.05);
  opacity: 0.9;
}



        .toggle-btn {
          width: 100%;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .toggle-btn.active {
          background-color: #38a169;
          color: white;
        }

        .toggle-btn.inactive {
          background-color: #4a5568;
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

          

      
         



  ./* Button container for view mode */
.actions-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
  justify-content: flex-start;
}

@media (max-width: 640px) {
  .actions-group {
    flex-direction: column;
  }
  
  .actions-group button {
    width: 100%;
  }
}

/* AI loading button style */
.btn-ai {
  background: linear-gradient(to right, #17a2b8, #4fc3f7);
  color: white;
}

/* Move buttons style */
.move-buttons {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
}

.move-btn {
  padding: 0.5rem;
  border-radius: 5px;
  background: linear-gradient(to right, #007bff, #4facfe);
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: 0.3s ease;
}

.move-btn:disabled {
  background: linear-gradient(to right, #d3d3d3, #e0e0e0);
  cursor: not-allowed;
  box-shadow: none;
}

.move-btn:not(:disabled):hover {
  transform: scale(1.05);
}

.bold-button {
  position: absolute; /* Change from fixed to absolute */
  background: linear-gradient(to right, #3182ce, #4facfe);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.bold-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
      `}
    </style>

   

    {projects.map((project, index) => (
      <div key={project._id} className="project-card">
        {editData && editData.id === project._id ? (
          <div className="form-group">
            <input
              type="text"
              className="input-field"
              placeholder="Project Name"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />

            <input
              type="text"
              className="input-field"
              placeholder="Organization"
              value={editData.skills}
              onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
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
                  <option value="" disabled>Select Start Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <h6>&nbsp;</h6>
                <select
                  className="select-field"
                  value={editData.startDate.year}
                  onChange={(e) => setEditData({
                    ...editData,
                    startDate: { ...editData.startDate, year: e.target.value }
                  })}
                >
                  <option value="" disabled>Select Start Year</option>
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
                    <option value="" disabled>Select End Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <h6>&nbsp;</h6>
                  <select
                    className="select-field"
                    value={editData.endDate.year}
                    onChange={(e) => setEditData({
                      ...editData,
                      endDate: { ...editData.endDate, year: e.target.value }
                    })}
                  >
                    <option value="" disabled>Select End Year</option>
                    {graduationYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button 
              className={`toggle-btn ${editData.isPresent ? 'active' : 'inactive'}`}
              onClick={handleTogglePresent}
            >
              <FontAwesomeIcon icon={editData.isPresent ? faToggleOn : faToggleOff} />
              {editData.isPresent ? "Currently Working" : "Project Completed"}
            </button>

            <textarea
              ref={editTextareaRef}
              className="input-field"
              placeholder="Project Description"
              value={editData.description}
              onChange={handleEditDescriptionChange}
              style={{ minHeight: "150px" }}
              onSelect={() => handleSelection(true)}
            />

            <div className="btn-group">
              <button 
                className="btn btn-primary"
                onClick={() => handleGenerateDescription(editData.name)}
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
                Update
              </button>
              <button 
                className="btn btn-secondary"
                onClick={handleCancelEdit}
              >
                <FontAwesomeIcon icon={faTimes} />
                Cancel
              </button>
              {showBoldButton && (
  <BoldButton
    onClick={() => applyBold(editData !== null)}
    style={{
      top: buttonPosition.top,
      left: buttonPosition.left,
    }}
  />
)}
            </div>
          
          </div>
        ) : (
          <>
            <h3 className="project-title">{project.name}</h3>
            <div className="project-meta">
              <strong>Organization:</strong> {project.skills}
            </div>
            <div className="project-meta">
              <strong>Duration:</strong> {project.startDate.month} {project.startDate.year} - 
              {project.isPresent ? " Present" : ` ${project.endDate.month} ${project.endDate.year}`}
            </div>
            <div className="description-box"> {project.description.split("**").map((part, index) =>
    index % 2 === 1 ? (
      <b key={index} style={{ color: "#00d084", fontWeight: 600 }}>{part}</b> // Bold content
    ) : (
      <span key={index}>{part}</span> // Regular content
    )
  )}</div>
            
            <div className="btn-group">
              <button 
                className="btn btn-primary"
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
                  )}
              >
                <FontAwesomeIcon icon={faEdit} />
                Edit
              </button>
              <button 
        className={`include-toggle ${project.includeInResume ? 'included' : 'excluded'}`}
        onClick={() => handleToggleInclude(project._id)}
      >
        <FontAwesomeIcon icon={project.includeInResume ? faToggleOn : faToggleOff} />
        {project.includeInResume ? "Included" : "Excluded"}
      </button>

              <button 
                className="btn btn-danger"
                onClick={() => handleDelete(project._id)}
              >
                <FontAwesomeIcon icon={faTrash} />
                Delete
              </button>
            </div>

            <div className="move-buttons">
              <button 
                className="move-btn"
                onClick={() => moveProjectUp(index)}
                disabled={index === 0}
              >
                <FontAwesomeIcon icon={faArrowUp} />
              </button>
              <button 
                className="move-btn"
                onClick={() => moveProjectDown(index)}
                disabled={index === projects.length - 1}
              >
                <FontAwesomeIcon icon={faArrowDown} />
              </button>
            </div>
          </>
        )}
      </div>
    ))}

{isAdding && (
        <div className="project-card">
          <div className="form-group">
            <input
              type="text"
              className="input-field"
              placeholder="Project Name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />

            <input
              type="text"
              className="input-field"
              placeholder="Organization"
              value={newProject.skills}
              onChange={(e) => setNewProject({ ...newProject, skills: e.target.value })}
            />

            <div className="date-grid">
              <div>
              <div className="date-label">Start Date</div>
                <select
                  className="select-field"
                  value={newProject.startDate.month}
                  onChange={(e) => setNewProject({
                    ...newProject,
                    startDate: { ...newProject.startDate, month: e.target.value }
                  })}
                >
                  <option value="" disabled>Select Start Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <h6>&nbsp;</h6>
                <select
                  className="select-field"
                  value={newProject.startDate.year}
                  onChange={(e) => setNewProject({
                    ...newProject,
                    startDate: { ...newProject.startDate, year: e.target.value }
                  })}
                >
                  <option value="" disabled>Select Start Year</option>
                  {graduationYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {!newProject.isPresent && (
              <div className="date-grid">
                <div>
                <div className="date-label">End Date</div>
                  <select
                    className="select-field"
                    value={newProject.endDate.month}
                    onChange={(e) => setNewProject({
                      ...newProject,
                      endDate: { ...newProject.endDate, month: e.target.value }
                    })}
                  >
                    <option value="" disabled>Select End Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <h6>&nbsp;</h6>
                  <select
                    className="select-field"
                    value={newProject.endDate.year}
                    onChange={(e) => setNewProject({
                      ...newProject,
                      endDate: { ...newProject.endDate, year: e.target.value }
                    })}
                  >
                    <option value="" disabled>Select End Year</option>
                    {graduationYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button 
              className={`toggle-btn ${newProject.isPresent ? 'active' : 'inactive'}`}
              onClick={() => setNewProject({ ...newProject, isPresent: !newProject.isPresent })}
            >
              <FontAwesomeIcon icon={newProject.isPresent ? faToggleOn : faToggleOff} />
              {newProject.isPresent ? "Currently Working" : "Project Completed"}
            </button>

            <textarea
              ref={newTextareaRef}
              className="input-field"
              placeholder="Project Description"
              value={newProject.description}
              onChange={handleDescriptionChange}
              onSelect={() => handleSelection(false)}
              style={{ minHeight: "150px" }}
            />
            

            <div className="btn-group">
              <button 
                className="btn btn-primary"
                onClick={() => handleGenerateDescription(newProject.name)}
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

              {showBoldButton && (
  <BoldButton
    onClick={() => applyBold(editData !== null)}
    style={{
      top: buttonPosition.top,
      left: buttonPosition.left,
    }}
  />
)}

            </div>
          </div>
        </div>
      )}

      {/* Add button at the bottom if not currently adding */}
      {!isAdding && (
        <button 
          className="btn btn-primary"
          onClick={handleAddClick}
          style={{ 
            width: '100%',
            marginTop: projects.length > 0 ? '1rem' : '0'
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
