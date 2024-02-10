import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Involvement {
  _id: string;
  organization: string;
  role: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  description: string;
  isEditing?: boolean;
}

interface InvolvementProps {
  Involvements: Involvement[];
  onEdit: (id: string, data: { organization: string; role: string; startDate: { month: string; year: string };
    endDate: { month: string; year: string }; description: string }) => void;
  onDelete: (id: string) => void;
}

const InvolvementSection: React.FC<InvolvementProps> = ({ Involvements, onEdit, onDelete }) => {
  const [editData, setEditData] = useState<{ id: string; organization: string; role: string; startDate: { month: string; year: string };
  endDate: { month: string; year: string }; description: string } | null>(null);
  const [involvements, setInvolvements] = useState<Involvement[]>(Involvements);
  const [newInvolvement, setNewInvolvement] = useState<Involvement>({
    _id: '',
    organization: '',
    role: '',
    startDate: { month: '', year: '' },
    endDate: { month: '', year: '' },
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
    const storedInvolvements = JSON.parse(localStorage.getItem(`involvements_${userID}`) || '[]');
    setInvolvements(storedInvolvements);
  }, []);

  
  const handleEditClick = (id: string, organization: string, role: string, startDate: { month: string; year: string },
    endDate: { month: string; year: string }, description: string) => {
    setEditData({ id, organization, role, startDate, endDate, description });
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, { organization: editData.organization, role: editData.role, startDate: { ...editData.startDate }, endDate: { ...editData.endDate }, description: editData.description });

      const updatedItems = involvements.map((involvement) =>
        involvement._id === editData.id
          ? { ...involvement, organization: editData.organization, role: editData.role, startDate: { ...editData.startDate }, endDate: { ...editData.endDate }, description: editData.description }
          : involvement
      );

      setInvolvements(updatedItems);

      localStorage.setItem(`involvements_${userID}`, JSON.stringify(updatedItems));
      

      setEditData(null);
    }
  };

  const handleSaveClick = () => {
    // // Form validation check
    // if (!newInvolvement.organization || !newInvolvement.role || !newInvolvement.startDate.month || !newInvolvement.startDate.year || !newInvolvement.endDate.month || !newInvolvement.endDate.year || !newInvolvement.description) {
    //   console.error('Please fill in all required fields');
    //   // You can display an error message to the user or handle it as appropriate
    //   return;
    // }

    const formattedInvolvement = {
      ...newInvolvement,
      startDate: {
        month: newInvolvement.startDate.month,
        year: newInvolvement.startDate.year,
      },
      endDate: {
        month: newInvolvement.endDate.month,
        year: newInvolvement.endDate.year,
      },
    };

    const storageKey = `involvements_${userID}`;
    axios.post(`http://localhost:3001/api/userprofile/${userID}/involvement`, formattedInvolvement)
      .then((response) => {
        const newInvolvementFromServer = response.data.involvement;
        const newInvData = newInvolvementFromServer[newInvolvementFromServer.length-1]
        setInvolvements([...involvements, newInvData]);
  
        // Reset the newExperience state
        setNewInvolvement({ _id: '', organization: '', role: '', startDate: { month: '', year: '' },
        endDate: { month: '', year: '' }, description: '' });

        const updatedInvolvements = [...involvements, newInvData];
        localStorage.setItem(storageKey, JSON.stringify(updatedInvolvements));
  
        // Set isAdding to false
        setIsAdding(false);
      })
      .catch((error) => {
        // Handle errors by logging them to the console
        console.error('Error saving involvement:', error.message);
      });
  };




  //   fetch('http://localhost:3001/api/involvements', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(formattedInvolvement),
  //   })
  //     .then((response) => response.json())
  //     .then((newInvolvementFromServer: Involvement) => {
  //       // Update the involvements state with the new involvement
  //       setInvolvements([...involvements, newInvolvementFromServer]);

  //       // Reset the newInvolvement state
  //       setNewInvolvement({ _id: '', organization: '', role: '', startDate: { month: '', year: '' },
  //       endDate: { month: '', year: '' }, description: '' });

  //       // Set isAdding to false
  //       setIsAdding(false);
  //     })
  //     .catch((error) => {
  //       // Handle errors by logging them to the console
  //       console.error('Error saving involvement:', error.message);
  //     });
  // };

  const handleDelete = (id: string) => {
    fetch(`http://localhost:3001/api/userprofile/${userID}/involvement/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Update the state to remove the deleted involvement
        const updatedInvolvements = involvements.filter((involvement) => involvement._id !== id);
        setInvolvements(updatedInvolvements);

        // Reset the editData state
        setEditData(null);
        localStorage.setItem(`involvements_${userID}`, JSON.stringify(updatedInvolvements));
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
      startDate: { month: '', year: '' },
      endDate: { month: '', year: '' },
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
              <p>Start Date: {involvement.startDate && `${involvement.startDate.month} ${involvement.startDate.year}`}</p>
              <p>End Date: {involvement.endDate && `${involvement.endDate.month} ${involvement.endDate.year}`}</p>
              <p>Description: {involvement.description}</p>
              <button
                className="btn btn-primary me-2"
                onClick={() => handleEditClick(involvement._id, involvement.organization, involvement.role, involvement.startDate, involvement.endDate, involvement.description)}
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
          <div className="date-dropdowns">
            <label>Start Date:</label>
            <div className="flex-container">
              <select
                className="form-control mb-2"
                value={newInvolvement.startDate.month}
                onChange={(e) => setNewInvolvement({ ...newInvolvement, startDate: { ...newInvolvement.startDate, month: e.target.value } })}
              >
                {!newInvolvement.startDate.month && (
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
                value={newInvolvement.startDate.year}
                onChange={(e) => setNewInvolvement({ ...newInvolvement, startDate: { ...newInvolvement.startDate, year: e.target.value } })}
              >
                {!newInvolvement.startDate.year && (
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
                value={newInvolvement.endDate.month}
                onChange={(e) => setNewInvolvement({ ...newInvolvement, endDate: { ...newInvolvement.endDate, month: e.target.value } })}
              >
                {!newInvolvement.endDate.month && (
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
                value={newInvolvement.endDate.year}
                onChange={(e) => setNewInvolvement({ ...newInvolvement, endDate: { ...newInvolvement.endDate, year: e.target.value } })}
              >
                {!newInvolvement.endDate.year && (
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
