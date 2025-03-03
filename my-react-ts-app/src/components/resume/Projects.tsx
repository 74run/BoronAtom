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






return (
  <div className="bg-[#000308] bg-opacity-45 rounded-xl p-6 text-white shadow-md">
    {projects.map((project, index) => (
      <div key={project._id} className="bg-[#1a202c] rounded-lg p-6 mb-4 border border-[#4a5568] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
        {editData && editData.id === project._id ? (
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
              placeholder="Project Name"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />

            <input
              type="text"
              className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
              placeholder="Organization"
              value={editData.skills}
              onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[#a0aec0] text-sm mb-2">Start Date</div>
                <select
                  className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm"
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
                <div className="text-[#a0aec0] text-sm mb-2">&nbsp;</div>
                <select
                  className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm"
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[#a0aec0] text-sm mb-2">End Date</div>
                  <select
                    className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm"
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
                  <div className="text-[#a0aec0] text-sm mb-2">&nbsp;</div>
                  <select
                    className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm"
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
              className={`w-full p-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200
                ${editData.isPresent ? 'bg-gradient-to-r from-green-600 to-green-400' : 'bg-gradient-to-r from-red-600 to-red-400'} text-white`}
              onClick={handleTogglePresent}
            >
              <FontAwesomeIcon icon={editData.isPresent ? faToggleOn : faToggleOff} />
              {editData.isPresent ? "Currently Working" : "Project Completed"}
            </button>

            <textarea
              ref={editTextareaRef}
              className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm min-h-[150px] focus:outline-none focus:border-[#63b3ed]"
              placeholder="Project Description"
              value={editData.description}
              onChange={handleEditDescriptionChange}
              onSelect={() => handleSelection(true)}
            />

            <div className="flex flex-wrap gap-3 mt-4">
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#17a2b8] to-[#4fc3f7] text-white text-sm font-medium disabled:opacity-50 hover:-translate-y-0.5 transition-transform"
                onClick={() => handleGenerateDescription(editData.name)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-200"></div>
                  </div>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faMagic} />
                    AI Description
                  </>
                )}
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-green-600 to-green-400 text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
                onClick={handleUpdate}
              >
                <FontAwesomeIcon icon={faSave} />
                Update
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#4a5568] text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
                onClick={handleCancelEdit}
              >
                <FontAwesomeIcon icon={faTimes} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-[#63b3ed] text-base font-semibold mb-3">{project.name}</h3>
            <div className="text-[#a0aec0] text-sm mb-2">
              <strong>Organization:</strong> {project.skills}
            </div>
            <div className="text-[#a0aec0] text-sm mb-2">
              <strong>Duration:</strong> {project.startDate.month} {project.startDate.year} - 
              {project.isPresent ? " Present" : ` ${project.endDate.month} ${project.endDate.year}`}
            </div>
            <div className="bg-[#2d3748] rounded-lg p-4 my-4 border border-[#4a5568] text-[#e2e8f0] text-sm leading-relaxed whitespace-pre-wrap">
              {project.description.split("**").map((part, index) =>
                index % 2 === 1 ? (
                  <b key={index} className="text-[#00d084] font-semibold">{part}</b>
                ) : (
                  <span key={index}>{part}</span>
                )
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#3182ce] to-[#4facfe] text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
                onClick={() => handleEditClick(
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
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium hover:-translate-y-0.5 transition-transform
                  ${project.includeInResume ? 'bg-gradient-to-r from-green-600 to-green-400' : 'bg-gradient-to-r from-red-600 to-red-400'} text-white`}
                onClick={() => handleToggleInclude(project._id)}
              >
                <FontAwesomeIcon icon={project.includeInResume ? faToggleOn : faToggleOff} />
                {project.includeInResume ? "Included" : "Excluded"}
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-red-600 to-red-400 text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
                onClick={() => handleDelete(project._id)}
              >
                <FontAwesomeIcon icon={faTrash} />
                Delete
              </button>
            </div>

            <div className="absolute top-4 right-4 flex gap-1">
              <button 
                className="p-2 rounded bg-gradient-to-r from-[#3182ce] to-[#4facfe] text-white shadow-md transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => moveProjectUp(index)}
                disabled={index === 0}
              >
                <FontAwesomeIcon icon={faArrowUp} />
              </button>
              <button 
                className="p-2 rounded bg-gradient-to-r from-[#3182ce] to-[#4facfe] text-white shadow-md transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
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

    {/* Add Project Form */}
    {isAdding && (
      <div className="bg-[#1a202c] rounded-lg p-6 mb-4 border border-[#4a5568]">
        <div className="space-y-4">
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          />

          <input
            type="text"
            className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
            placeholder="Organization"
            value={newProject.skills}
            onChange={(e) => setNewProject({ ...newProject, skills: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[#a0aec0] text-sm mb-2">Start Date</div>
              <select
                className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm"
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
              <div className="text-[#a0aec0] text-sm mb-2">&nbsp;</div>
              <select
                className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm"
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[#a0aec0] text-sm mb-2">End Date</div>
                <select
                  className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm"
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
                <div className="text-[#a0aec0] text-sm mb-2">&nbsp;</div>
                <select
                  className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm"
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
            className={`w-full p-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200
              ${newProject.isPresent ? 'bg-gradient-to-r from-green-600 to-green-400' : 'bg-gradient-to-r from-red-600 to-red-400'} text-white`}
            onClick={() => setNewProject({ ...newProject, isPresent: !newProject.isPresent })}
          >
            <FontAwesomeIcon icon={newProject.isPresent ? faToggleOn : faToggleOff} />
            {newProject.isPresent ? "Currently Working" : "Project Completed"}
          </button>

          <textarea
            ref={newTextareaRef}
            className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm min-h-[150px] focus:outline-none focus:border-[#63b3ed]"
            placeholder="Project Description"
            value={newProject.description}
            onChange={handleDescriptionChange}
            onSelect={() => handleSelection(false)}
          />
          

          <div className="flex flex-wrap gap-3 mt-4">
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#17a2b8] to-[#4fc3f7] text-white text-sm font-medium disabled:opacity-50 hover:-translate-y-0.5 transition-transform"
              onClick={() => handleGenerateDescription(newProject.name)}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-200"></div>
                </div>
              ) : (
                <>
                  <FontAwesomeIcon icon={faMagic} />
                  AI Description
                </>
              )}
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-green-600 to-green-400 text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
              onClick={handleSaveClick}
            >
              <FontAwesomeIcon icon={faSave} />
              Save
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#4a5568] text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
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
        className="flex items-center justify-center gap-2 w-full px-4 py-2 mt-4 rounded-md bg-gradient-to-r from-[#3182ce] to-[#4facfe] text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
        onClick={handleAddClick}
      >
        <FontAwesomeIcon icon={faPlus} />
        Add Project
      </button>
    )}

    {showBoldButton && (
      <button
        className="absolute bg-gradient-to-r from-[#3182ce] to-[#4facfe] text-white border-none rounded px-2 py-1 cursor-pointer z-50 flex items-center gap-2 shadow-md hover:-translate-y-0.5 transition-transform"
        onClick={() => applyBold(editData !== null)}
        style={{
          top: buttonPosition.top,
          left: buttonPosition.left,
        }}
      >
        <FontAwesomeIcon icon={faBold} /> Bold
      </button>
    )}
  </div>
);

};

export default ProjectsSection;
