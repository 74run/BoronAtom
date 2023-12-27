import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faSave, faPlus } from '@fortawesome/free-solid-svg-icons';

interface Project {
  _id: string;
  name: string;
  description: string;
  isEditing?: boolean;
}

interface ProjectsSectionProps {
  Projects: Project[];
  onEdit: (id: string, data: { name: string; description: string }) => void;
  onDelete: (id: string) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ Projects, onEdit, onDelete }) => {
  const [editData, setEditData] = useState<{ id: string; name: string; description: string } | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Project>({
    _id: '',
    name: '',
    description: '',
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleEditClick = (id: string, name: string, description: string) => {
    setEditData({ id, name, description });
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, { name: editData.name, description: editData.description });

      const updatedItems = projects.map((project) =>
        project._id === editData.id
          ? { ...project, name: editData.name, description: editData.description }
          : project
      );

      setProjects(updatedItems);

      setEditData(null);
    }
  };

  const handleSaveClick = () => {
    fetch('http://localhost:3001/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProject),
    })
      .then((response) => response.json())
      .then((newProjectFromServer) => {

        // Update the projects state with the new project
        setProjects([...projects, newProjectFromServer]);

        // Reset the newProject state
        setNewProject({ _id: '', name: '', description: '' });

        // Set isAdding to false
        setIsAdding(false);
      })
      .catch((error) => {
        // Handle errors by logging them to the console
        console.error('Error saving project:', error.message);
      });
  };

  const handleDelete = (id: string) => {
    fetch(`http://localhost:3001/api/projects/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Update the state to remove the deleted project
        const updatedProjects = projects.filter((project) => project._id !== id);
        setProjects(updatedProjects);

        // Reset the editData state
        setEditData(null);
      })
      .catch((error) => {
        console.error('Error deleting project:', error);
      });
  };

  const handleAddClick = () => {
    setNewProject({
      _id: '',
      name: '',
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
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Description"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
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
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <button
                className="btn btn-primary me-2"
                onClick={() => handleEditClick(project._id, project.name, project.description)}
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
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
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
