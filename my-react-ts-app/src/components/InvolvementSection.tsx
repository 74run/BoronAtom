import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

interface Involvement {
  id: number;
  organization: string;
  role: string;
  duration: string;
  description: string;
  isEditing?: boolean;
}

function InvolvementSection() {
  const [involvements, setInvolvements] = useState<Involvement[]>([
    { id: 1, organization: 'Community Organization', role: 'Volunteer Coordinator', duration: 'January 2020 - Present', description: 'Describe your involvement and contributions.' },
    // Add more involvement entries as needed
  ]);

  const [newInvolvement, setNewInvolvement] = useState<Involvement>({
    id: 0,
    organization: '',
    role: '',
    duration: '',
    description: '',
  });

  const [isAdding, setIsAdding] = useState(false);

  const handleEditClick = (id: number) => {
    setInvolvements((prevInvolvements) =>
      prevInvolvements.map((involvement) =>
        involvement.id === id ? { ...involvement, isEditing: true } : involvement
      )
    );
  };

  const handleSaveClick = (id?: number) => {
    if (id !== undefined) {
      // Editing an existing involvement entry
      setInvolvements((prevInvolvements) =>
        prevInvolvements.map((inv) => (inv.id === id ? { ...inv, isEditing: false } : inv))
      );
    } else {
      // Adding a new involvement entry
      setNewInvolvement((prevInvolvement) => ({
        ...prevInvolvement,
        id: Date.now(), // Use a timestamp as a unique identifier
      }));
      setInvolvements((prevInvolvements) => [...prevInvolvements, newInvolvement]);
      setNewInvolvement({ id: 0, organization: '', role: '', duration: '', description: '' });
      setIsAdding(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    // Deleting an involvement entry
    setInvolvements((prevInvolvements) => prevInvolvements.filter((inv) => inv.id !== id));
  };

  const handleAddClick = () => {
    setNewInvolvement({ id: 0, organization: '', role: '', duration: '', description: '' });
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
      <h2>Involvement</h2>
      {involvements.map((involvement) => (
        <div key={involvement.id} className="mb-3">
          {involvement.isEditing ? (
            // Edit mode
            <div>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Organization"
                value={involvement.organization}
                onChange={(e) =>
                  setInvolvements((prevInvolvements) =>
                    prevInvolvements.map((inv) =>
                      inv.id === involvement.id ? { ...inv, organization: e.target.value } : inv
                    )
                  )
                }
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Role"
                value={involvement.role}
                onChange={(e) =>
                  setInvolvements((prevInvolvements) =>
                    prevInvolvements.map((inv) =>
                      inv.id === involvement.id ? { ...inv, role: e.target.value } : inv
                    )
                  )
                }
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Duration"
                value={involvement.duration}
                onChange={(e) =>
                  setInvolvements((prevInvolvements) =>
                    prevInvolvements.map((inv) =>
                      inv.id === involvement.id ? { ...inv, duration: e.target.value } : inv
                    )
                  )
                }
              />
              <textarea
                className="form-control mb-2"
                placeholder="Description"
                value={involvement.description}
                onChange={(e) =>
                  setInvolvements((prevInvolvements) =>
                    prevInvolvements.map((inv) =>
                      inv.id === involvement.id ? { ...inv, description: e.target.value } : inv
                    )
                  )
                }
              />
              <button
                className="btn btn-primary me-2"
                onClick={() => handleSaveClick(involvement.id)}
              >
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  setInvolvements((prevInvolvements) =>
                    prevInvolvements.map((inv) =>
                      inv.id === involvement.id ? { ...inv, isEditing: false } : inv
                    )
                  )
                }
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
                onClick={() => handleEditClick(involvement.id)}
              >
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteClick(involvement.id)}
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
}

export default InvolvementSection;
