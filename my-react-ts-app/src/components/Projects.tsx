import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faSave, faPlus } from '@fortawesome/free-solid-svg-icons';

interface Project {
  id: number;
  name: string;
  description: string;
  isEditing?: boolean;
}

function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: 'Project 1', description: 'Description of Project 1' },
    // Add more project entries as needed
  ]);

  const [newProject, setNewProject] = useState<Project>({
    id: 0,
    name: '',
    description: '',
  });

  const [isAdding, setIsAdding] = useState(false);

  const handleEditClick = (id: number) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === id ? { ...project, isEditing: true } : project
      )
    );
  };

  const handleSaveClick = (id?: number) => {
    if (id !== undefined) {
      // Editing an existing project entry
      setProjects(prevProjects =>
        prevProjects.map(proj => (proj.id === id ? { ...proj, isEditing: false } : proj))
      );
    } else {
      // Adding a new project entry
      setNewProject(prevProject => ({
        ...prevProject,
        id: Date.now(), // Use a timestamp as a unique identifier
      }));
      setProjects(prevProjects => [...prevProjects, newProject]);
      setNewProject({ id: 0, name: '', description: '' });
      setIsAdding(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    // Deleting a project entry
    setProjects(prevProjects => prevProjects.filter(proj => proj.id !== id));
  };

  const handleAddClick = () => {
    setNewProject({ id: 0, name: '', description: '' });
    setIsAdding(true);
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, id?: number) => {
    if (event.key === 'Enter') {
      handleSaveClick(id);
    }
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
      <h2><b>Projects</b></h2>
      {projects.map(project => (
        <div key={project.id} className="mb-3">
          {project.isEditing ? (
            // Edit mode
            <div>
              <input
          type="text"
          className="form-control mb-2"
          placeholder="Project Name"
          value={project.name}
          onChange={(e) => setProjects((prevProjects) =>
            prevProjects.map((proj) => (proj.id === project.id ? { ...proj, name: e.target.value } : proj))
          )}
          onKeyPress={(e) => handleKeyPress(e, project.id)} // Add this line
          />

          <input
          type="text"
          className="form-control mb-2"
          placeholder="Description"
          value={project.description}
          onChange={(e) => setProjects((prevProjects) =>
            prevProjects.map((proj) => (proj.id === project.id ? { ...proj, description: e.target.value } : proj))
          )}
          onKeyPress={(e) => handleKeyPress(e, project.id)} // Add this line
          />
              <button
                className="btn btn-primary me-2"
                onClick={() => handleSaveClick(project.id)}
              >
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setProjects(prevProjects =>
                  prevProjects.map(proj => (proj.id === project.id ? { ...proj, isEditing: false } : proj))
                )}
              >
                Cancel
              </button>
            </div>
          ) : (
            // View mode
            <div>
              <h3>{project.name}</h3>
              <p>Description: {project.description}</p>
              <button
                className="btn btn-primary me-2"
                onClick={() => handleEditClick(project.id)}
              >
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteClick(project.id)}
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
            onChange={e => setNewProject({ ...newProject, name: e.target.value })}
            onKeyPress={(e) => handleKeyPress(e)}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Description"
            value={newProject.description}
            onChange={e => setNewProject({ ...newProject, description: e.target.value })}
            onKeyPress={(e) => handleKeyPress(e)}
          />
          <button
            className="btn btn-primary"
            onClick={() => handleSaveClick()}
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
}

export default ProjectsSection;
