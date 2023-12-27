import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

interface Involvement {
  _id: string;
  organization: string;
  role: string;
  duration: string;
  description: string;
  isEditing?: boolean;
}

interface InvolvementProps {
  Involvements: Involvement[];
  onEdit: (id: string, data: { organization: string; role: string; duration: string; description: string }) => void;
  onDelete: (id: string) => void;
}

const InvolvementSection: React.FC<InvolvementProps> = ({ Involvements, onEdit, onDelete }) => {
  const [editData, setEditData] = useState<{ id: string; organization: string; role: string; duration: string; description: string } | null>(null);
  const [involvements, setInvolvements] = useState<Involvement[]>([]);
  const [newInvolvement, setNewInvolvement] = useState<Involvement>({
    _id: '',
    organization: '',
    role: '',
    duration: '',
    description: '',
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleEditClick = (id: string, organization: string, role: string, duration: string, description: string) => {
    setEditData({ id, organization, role, duration, description });
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, { organization: editData.organization, role: editData.role, duration: editData.duration, description: editData.description });

      const updatedItems = involvements.map((involvement) =>
        involvement._id === editData.id
          ? { ...involvement, organization: editData.organization, role: editData.role, duration: editData.duration, description: editData.description }
          : involvement
      );

      setInvolvements(updatedItems);

      setEditData(null);
    }
  };

  const handleSaveClick = () => {
    fetch('http://localhost:3001/api/involvements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newInvolvement),
    })
      .then((response) => response.json())
      .then((newInvolvementFromServer: Involvement) => {
        // Update the involvements state with the new involvement
        setInvolvements([...involvements, newInvolvementFromServer]);

        // Reset the newInvolvement state
        setNewInvolvement({ _id: '', organization: '', role: '', duration: '', description: '' });

        // Set isAdding to false
        setIsAdding(false);
      })
      .catch((error) => {
        // Handle errors by logging them to the console
        console.error('Error saving involvement:', error.message);
      });
  };

  const handleDelete = (id: string) => {
    fetch(`http://localhost:3001/api/involvements/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Update the state to remove the deleted involvement
        const updatedInvolvements = involvements.filter((involvement) => involvement._id !== id);
        setInvolvements(updatedInvolvements);

        // Reset the editData state
        setEditData(null);
      })
      .catch((error) => {
        console.error('Error deleting involvement:', error);
      });
  };

  const handleAddClick = () => {
    setNewInvolvement({
      _id: '',
      organization: '',
      role: '',
      duration: '',
      description: '',
    });
    setIsAdding(true);
  };

  // useEffect(() => {
  //   fetch('http://localhost:3001/api/involvements')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setInvolvements(data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching involvements:', error);
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
      <h2>Involvements</h2>
      {involvements.map((involvement) => (
        <div key={involvement._id} className="mb-3">
          {editData && editData.id === involvement._id ? (
            // Edit mode
            <div>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Organization"
                value={editData.organization}
                onChange={(e) => setEditData({ ...editData, organization: e.target.value })}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Role"
                value={editData.role}
                onChange={(e) => setEditData({ ...editData, role: e.target.value })}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Duration"
                value={editData.duration}
                onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
              />
              <textarea
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
              <h3>{involvement.organization}</h3>
              <p>Role: {involvement.role}</p>
              <p>Duration: {involvement.duration}</p>
              <p>Description: {involvement.description}</p>
              <button
                className="btn btn-primary me-2"
                onClick={() => handleEditClick(involvement._id, involvement.organization, involvement.role, involvement.duration, involvement.description)}
              >
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(involvement._id)}
              >
                <FontAwesomeIcon icon={faTrash} className="me-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
      {isAdding && (
        // Add involvement entry
        <div>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Organization"
            value={newInvolvement.organization}
            onChange={(e) => setNewInvolvement({ ...newInvolvement, organization: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Role"
            value={newInvolvement.role}
            onChange={(e) => setNewInvolvement({ ...newInvolvement, role: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Duration"
            value={newInvolvement.duration}
            onChange={(e) => setNewInvolvement({ ...newInvolvement, duration: e.target.value })}
          />
          <textarea
            className="form-control mb-2"
            placeholder="Description"
            value={newInvolvement.description}
            onChange={(e) => setNewInvolvement({ ...newInvolvement, description: e.target.value })}
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
        // Show "Add Involvement" button
        <button
          className="btn btn-primary"
          onClick={handleAddClick}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Involvement
        </button>
      )}
    </div>
  );
};

export default InvolvementSection;
