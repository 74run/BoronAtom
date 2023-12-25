import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

function SummarySection() {
  const [isEditing, setIsEditing] = useState(false);
  const [summary, setSummary] = useState(
    'I am a passionate and dedicated professional with experience in [your field]. My expertise includes [specific skills or achievements]. I am committed to [your mission or goals] and thrive in collaborative environments. Let\'s connect and explore opportunities together!'
  );

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // You can add logic here to save the edited summary
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    // You can add logic here to cancel the edit and revert changes
    setIsEditing(false);
  };

  return (
    <div
      style={{
        border: '2px solid black',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
      }}
    >
      <h2 style={{ color: 'black' }}>Summary</h2>
      {isEditing ? (
        <>
          {/* Edit mode */}
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="form-control mb-2"
            style={{ height: '150px' }}  
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSaveClick}
              className="btn btn-success me-2"
              style={{
                backgroundColor: '#28a745',
                borderColor: '#28a745',
                color: '#fff',
              }}
            >
              <FontAwesomeIcon icon={faSave} className="me-2" />
              Save
            </button>
            <button
              onClick={handleCancelClick}
              className="btn btn-secondary"
              style={{
                backgroundColor: '#6c757d',
                borderColor: '#6c757d',
                color: '#fff',
              }}
            >
              <FontAwesomeIcon icon={faTimes} className="me-2" />
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          {/* View mode */}
          <p style={{ marginBottom: '1rem' }}>{summary}</p>
          <button
            onClick={handleEditClick}
            className="btn btn-primary"
            style={{
              backgroundColor: '#007bff',
              borderColor: '#007bff',
              color: '#fff',
            }}
          >
            <FontAwesomeIcon icon={faEdit} className="me-2" />
            Edit
          </button>
        </>
      )}
    </div>
  );
}

export default SummarySection;
