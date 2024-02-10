import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Summary {
  _id: string;
  content: string;
  isEditing?: boolean;
}

interface SummarySectionProps {
  Summarys: Summary[];
  onEdit : (id: string, data: {content:string}) => void;
  onDelete: (id: string) => void;
}

const SummarySection: React.FC<SummarySectionProps> = ({Summarys, onEdit, onDelete}) => {
  const [summarys, setSummarys] = useState<Summary[]>(Summarys);
  const [editData, setEditData] = useState<{
    id: string;
    content: string
  } | null>(null);
  const [newSummary, setNewSummary] = useState<Summary>({
    _id: '',
    content: '', 
  });
  const [isAdding, setIsAdding] = useState(false);
  const { userID } = useParams();

  useEffect(() => {
    const storedSummarys = JSON.parse(localStorage.getItem(`summarys_${userID}`) || '[]');
    setSummarys(storedSummarys);
  }, []);
  

  const handleEditClick = (id: string, content: string) => {
    setEditData({id, content});
  };

  const handleSaveClick = () => {
    const storageKey = `summarys_${userID}`;
    axios.post(`http://localhost:3001/api/userprofile/${userID}/summary`, newSummary)
      .then((response) => {
        const newSummaryFromServer = response.data.summary;
        const newSumData = newSummaryFromServer[newSummaryFromServer.length-1]
        // console.log('Data Is:',newSummaryFromServer[newSummaryFromServer.length-1])
        setSummarys([...summarys, newSumData]);
        setNewSummary({
          _id: '',
           content: '',
        });

        const updatedSummarys = [...summarys, newSumData];
        localStorage.setItem(storageKey, JSON.stringify(updatedSummarys));
        
  
        setIsAdding(false);
      })
      .catch((error) => {
        console.error('Error saving education:', error.message);
        // Handle errors by displaying an error message to the user or logging it as appropriate
      });
  };

  const handleUpdate =() =>{
    if(editData) {
      onEdit(editData.id, { content: editData.content,});

      const updatedItems = summarys.map((summary) =>
      summary._id === editData.id
      ? {...summary, content: editData.content}: summary
      );
      setSummarys(updatedItems);

      localStorage.setItem(`summarys_${userID}`, JSON.stringify(updatedItems));
      setEditData(null);
    }
  }

  const handleCancelClick = () => {
    setEditData(null);
  };

  const handleDelete = (id: string) => {
    axios.delete(`http://localhost:3001/api/userprofile/${userID}/summary/${id}`)
      .then((response) => {
        // Check if the delete operation was successful
        if (response.status === 200) {
          // Update the state to remove the deleted summary
          const updatedSummarys = summarys.filter((summary) => summary._id !== id);
          setSummarys(updatedSummarys);

          localStorage.setItem(`summarys_${userID}`, JSON.stringify(updatedSummarys));
  
          // Reset the editData state
          setEditData(null);
        } else {
          throw new Error(`Failed to delete summary. Status: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error('Error deleting summary:', error.message);
      });
  };

  const handleAddClick = () => {
    setNewSummary({ _id: '',
  content: '',
});
setIsAdding(true);
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
      {summarys.map((summary) => (
        <div key={summary._id} style={{ marginBottom: '1rem' }}>
          {editData && editData.id === summary._id ? (
            <>
              {/* Edit mode */}
              <textarea
                value={editData.content}
                onChange= {(e)=> setEditData({...editData, content: e.target.value })}
                className="form-control mb-2"
                style={{ height: '150px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick= {handleUpdate}
                  className="btn btn-success me-2"
                  style={{
                    backgroundColor: '#28a745',
                    borderColor: '#28a745',
                    color: '#fff',
                  }}
                >
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Update
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
              <p style={{ marginBottom: '1rem' }}>{summary.content}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleEditClick(summary._id, summary.content)}
                  className="btn btn-primary me-2"
                  style={{
                    backgroundColor: '#007bff',
                    borderColor: '#007bff',
                    color: '#fff',
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(summary._id)}
                  className="btn btn-danger"
                >
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
      {isAdding && summarys.length === 0 && (
         <><textarea
          value={newSummary.content}
          onChange={(e) => setNewSummary({ ...newSummary, content: e.target.value })}
          className="form-control mb-2"
          style={{ height: '150px' }} />
          
          <button type="submit" className="btn btn-primary" onClick={handleSaveClick}>
            Save
          </button><button className="btn btn-secondary ms-2" onClick={() => setIsAdding(false)}>
            Cancel
          </button></>
        
      )}
      
     {!isAdding && summarys.length === 0 &&(
      
      <button
        onClick={handleAddClick}
        className="btn btn-primary"
        style={{
          backgroundColor: '#007bff',
          borderColor: '#007bff',
          color: '#fff',
        }}
      >
        <FontAwesomeIcon icon={faEdit} className="me-2" />
        Add Summary
      </button>
     )}
    </div>
  );
};

export default SummarySection;
