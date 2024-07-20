import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes, faTrash, faMagic } from '@fortawesome/free-solid-svg-icons';
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
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const { userID } = useParams();

  // useEffect(() => {
  //   const storedSummarys = JSON.parse(localStorage.getItem(`summarys_${userID}`) || '[]');
  //   setSummarys(storedSummarys);
  // }, []);
  const API_BASE_URL = process.env.REACT_APP_API_URL;


  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = () => {
    fetch(`${API_BASE_URL}/api/userprofile/${userID}/summary`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        return response.json(); // Parse the response JSON
      })
      .then(data => {
        // console.log("Project data:",data)
        setSummarys(data); // Set projects state with the fetched data
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  };

    
 
  

const fetchGeneratedText = () => {
  axios.get(`${API_BASE_URL}/api/userprofile/generate/${userID}`)
    .then(response => {
      const generatedText = response.data.text;
      // console.log('Generated Text:', generatedText);
      setGeneratedText(generatedText);

      if (editData) {
        setEditData(prevData => ({ ...prevData!, content: '' }));
      } else {
        setNewSummary(prevSummary => ({ ...prevSummary, content: '' }));
      }

      
      // Split the generated text into words
      const words = generatedText.split(' ');
      
      // Define a function to print words one by one
      const printWords = (index: number) => {
        if (index < words.length) {
          const nextWord = words[index];
          
          // Print the word
          if (editData) {
            setEditData(prevData => ({ ...prevData!, content: prevData!.content + ' ' + nextWord }));
          } else {
            setNewSummary(prevSummary => ({ ...prevSummary, content: prevSummary.content + ' ' + nextWord }));
          }
          
          // Call the next word after a delay
          setTimeout(() => {
            printWords(index + 1);
          }, 200); // Adjust the timing as needed
        }
      };
      
      // Start printing words
      printWords(0);
      
    })
    .catch(error => {
      console.error('Error fetching generated text:', error);
    });
};

  




  const handleGenerateTextClick = () => {
    fetchGeneratedText();
  };
  
  

  const handleEditClick = (id: string, content: string) => {
    setEditData({id, content});
  };

  const handleSaveClick = () => {
    const storageKey = `summarys_${userID}`;
    axios.post(`${API_BASE_URL}/api/userprofile/${userID}/summary`, newSummary)
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
        // localStorage.setItem(storageKey, JSON.stringify(updatedSummarys));
        
  
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

      // localStorage.setItem(`summarys_${userID}`, JSON.stringify(updatedItems));
      setEditData(null);
    }
  }

  const handleCancelClick = () => {
    setEditData(null);
  };

  const handleDelete = (id: string) => {
    axios.delete(`${API_BASE_URL}/api/userprofile/${userID}/summary/${id}`)
      .then((response) => {
        // Check if the delete operation was successful
        if (response.status === 200) {
          // Update the state to remove the deleted summary
          const updatedSummarys = summarys.filter((summary) => summary._id !== id);
          setSummarys(updatedSummarys);

          // localStorage.setItem(`summarys_${userID}`, JSON.stringify(updatedSummarys));
  
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
      border: '2px solid #4CAF50',
      borderRadius: '10px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      background: 'rgba(255, 255, 255, 0.7)',
      boxShadow: '0 0 200px rgba(10, 0, 0, 0.5)'
    }}
  >
  
      <h4 style={{ color: '#4CAF50', textAlign: 'left', marginBottom: '1rem', fontFamily: 'Timesquare' }}><b>Summary</b></h4>
      {summarys.map((summary) => (
        <div key={summary._id} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', transition: 'all 0.3s' }}>
          {editData && editData.id === summary._id ? (
            <>
              {/* Edit mode */}
              <textarea
                value={editData.content}
                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                className="form-control mb-2"
                style={{ height: '150px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', marginBottom: '1rem', transition: 'all 0.3s' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
        onClick={handleGenerateTextClick}
        className="btn btn-info me-2"
        style={{
          backgroundColor: '#17a2b8',
          color: '#fff',
          border: '1px solid #17a2b8',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          transition: 'all 0.3s',
        }}
      >
        <FontAwesomeIcon icon={faMagic} className="me-2" />
        AI Summary
      </button>
                <button
                  onClick={handleUpdate}
                  className="btn btn-success me-2"
                  style={{
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: '1px solid #4CAF50',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    transition: 'all 0.3s',
                  }}
                >
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Update
                </button>
                <button
                  onClick={handleCancelClick}
                  className="btn btn-secondary"
                  style={{
                    backgroundColor: '#ccc',
                    color: '#000',
                    border: '1px solid #ccc',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    transition: 'all 0.3s',
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
              <p style={{ marginBottom: '1rem', fontSize: '14px' }}>{summary.content}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
  onClick={() => handleEditClick(summary._id, summary.content)}
  className="btn btn-primary me-2"
  style={{
    backgroundColor: '#007bff',
    color: '#fff',
    border: '1px solid #007bff',
    padding: '0.3rem 0.6rem', // Adjusted padding
    borderRadius: '4px',
    transition: 'all 0.3s',
    fontSize: '0.8rem', // Adjusted font size
  }}
>
  <FontAwesomeIcon icon={faEdit} className="me-1" style={{ fontSize: '0.8rem' }} /> {/* Adjusted icon size */}
  Edit
</button>

                <button
                  onClick={() => handleDelete(summary._id)}
                  className="btn btn-danger"
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    padding: '0.3rem 0.4rem',
                    border: '1px solid #dc3545',
                    borderRadius: '4px',
                    transition: 'all 0.3s',
                    fontSize: '0.8rem',
                  }}
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
        <>
          <textarea
            value={newSummary.content}
            onChange={(e) => setNewSummary({ ...newSummary, content: e.target.value })}
            className="form-control mb-2"
            style={{ height: '150px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', marginBottom: '1rem', transition: 'all 0.3s' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

          <button
        onClick={handleGenerateTextClick}
        className="btn btn-info me-2"
        style={{
          backgroundColor: '#17a2b8',
          color: '#fff',
          border: '1px solid #17a2b8',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          transition: 'all 0.3s',
        }}
      >
        <FontAwesomeIcon icon={faMagic} className="me-2" />
        AI Summary
      </button>
            
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSaveClick}
              style={{
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: '1px solid #4CAF50',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                marginRight: '0.5rem',
                transition: 'all 0.3s',
              }}
            >
              Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setIsAdding(false)}
              style={{
                backgroundColor: '#ccc',
                color: '#000',
                border: '1px solid #ccc',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                transition: 'all 0.3s',
              }}
            >
              Cancel
            </button>
          </div>
        </>
      )}
  
      {!isAdding && summarys.length === 0 && (
        <button
          onClick={handleAddClick}
          className="btn btn-primary"
          style={{
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: '1px solid #4CAF50',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            transition: 'all 0.3s',
          }}
        >
          <FontAwesomeIcon icon={faEdit} className="me-2" />
          Add Summary
        </button>
      )}
    </div>
  );
  
        }  

export default SummarySection;
