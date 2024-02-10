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
    const storedProjects = JSON.parse(localStorage.getItem(`projects_${userID}`) || '[]');
    setProjects(storedProjects);
  }, []);
  

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

      localStorage.setItem(`projects_${userID}`, JSON.stringify(updatedItems));

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
  
    axios.post(`http://localhost:3001/api/userprofile/${userID}/project`, formattedExperience)
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
        localStorage.setItem(storageKey, JSON.stringify(updatedProjects));

        // Set isAdding to false
        setIsAdding(false);
      })
      .catch((error) => {
        // Handle errors by logging them to the console
        console.error('Error saving project:', error.message);
      });
  };

  const handleDelete = (id: string) => {
    axios.delete(`http://localhost:3001/api/userprofile/${userID}/project/${id}`)
    .then((response) => {
      // Update the state to remove the deleted certification
        const updatedProjects = projects.filter((project) => project._id !== id);
        setProjects(updatedProjects);

        // Reset the editData state
        setEditData(null);
        localStorage.setItem(`projects_${userID}`, JSON.stringify(updatedProjects));
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
  //   fetch('http://localhost:3001/api/projects')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setProjects(data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching projects:', error);
  //     });
  // }, []);

  return (
    <div
      style={{
        border: '2px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
      }}
    >
      <h2><b>Projects</b></h2>
      {projects.map((project) => (
        <div key={project._id} className="mb-3">
          {editData && editData.id === project._id ? (
            // Edit mode
            <div>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Project Name"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
              <textarea
                
                className="form-control mb-2"
                placeholder="Description"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Skills Acquired"
                value={editData.skills}
                onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
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
              <h3>{project.name}</h3>
              <p>Start Date: {project.startDate.month} {project.startDate.year}</p>
              <p>End Date: {project.endDate.month} {project.endDate.year}</p>
              <p>{project.skills}</p>
              <p>{project.description}</p>
              <button
                className="btn btn-primary me-2"
                onClick={() => handleEditClick(project._id, project.name, project.startDate, project.endDate, project.skills, project.description)}
              >
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(project._id)}
              >
                <FontAwesomeIcon icon={faTrash} className="me-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
      {isAdding && (
        // Add project entry
        <div>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          />
          <textarea
            
            className="form-control mb-2"
            placeholder="Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Skills Acquired"
            value={newProject.skills}
            onChange={(e) => setNewProject({ ...newProject, skills: e.target.value })}
          />
          <div className="date-dropdowns">
            <label>Start Date:</label>
            <div className="flex-container">
              <select
                className="form-control mb-2"
                value={newProject.startDate.month}
                onChange={(e) => setNewProject({ ...newProject, startDate: { ...newProject.startDate, month: e.target.value } })}
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
                onChange={(e) => setNewProject({ ...newProject, startDate: { ...newProject.startDate, year: e.target.value } })}
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
          <div className="date-dropdowns">
            <label>End Date:</label>
            <div className="flex-container">
              <select
                className="form-control mb-2"
                value={newProject.endDate.month}
                onChange={(e) => setNewProject({ ...newProject, endDate: { ...newProject.endDate, month: e.target.value } })}
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
                onChange={(e) => setNewProject({ ...newProject, endDate: { ...newProject.endDate, year: e.target.value } })}
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
        // Show "Add Project" button
        <button
          className="btn btn-primary"
          onClick={handleAddClick}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Project
        </button>
      )}
    </div>
  );
};

export default ProjectsSection;
