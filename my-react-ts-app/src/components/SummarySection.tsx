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
  onEdit: (id: string, data: { content: string }) => void;
  onDelete: (id: string) => void;
}

const SummarySection: React.FC<SummarySectionProps> = ({ Summarys, onEdit, onDelete }) => {
  const [summarys, setSummarys] = useState<Summary[]>(Summarys);
  const [editData, setEditData] = useState<{ id: string; content: string } | null>(null);
  const [newSummary, setNewSummary] = useState<Summary>({
    _id: '',
    content: '',
  });
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const { userID } = useParams();

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = () => {
    fetch(`${API_BASE_URL}/api/userprofile/${userID}/summary`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        return response.json(); // Parse the response JSON
      })
      .then((data) => {
        setSummarys(data); // Set projects state with the fetched data
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      });
  };

  const fetchGeneratedText = () => {
    axios
      .get(`${API_BASE_URL}/api/userprofile/generate/${userID}`)
      .then((response) => {
        const generatedText = response.data.text;
        setGeneratedText(generatedText);

        if (editData) {
          setEditData((prevData) => ({ ...prevData!, content: '' }));
        } else {
          setNewSummary((prevSummary) => ({ ...prevSummary, content: '' }));
        }

        const words = generatedText.split(' ');

        const printWords = (index: number) => {
          if (index < words.length) {
            const nextWord = words[index];

            if (editData) {
              setEditData((prevData) => ({ ...prevData!, content: prevData!.content + ' ' + nextWord }));
            } else {
              setNewSummary((prevSummary) => ({ ...prevSummary, content: prevSummary.content + ' ' + nextWord }));
            }

            setTimeout(() => {
              printWords(index + 1);
            }, 200);
          }
        };

        printWords(0);
      })
      .catch((error) => {
        console.error('Error fetching generated text:', error);
      });
  };

  const handleGenerateTextClick = () => {
    fetchGeneratedText();
  };

  const handleEditClick = (id: string, content: string) => {
    setEditData({ id, content });
  };

  const handleSaveClick = () => {
    axios
      .post(`${API_BASE_URL}/api/userprofile/${userID}/summary`, newSummary)
      .then((response) => {
        const newSummaryFromServer = response.data.summary;
        const newSumData = newSummaryFromServer[newSummaryFromServer.length - 1];
        setSummarys([...summarys, newSumData]);
        setNewSummary({
          _id: '',
          content: '',
        });
        setIsAdding(false);
      })
      .catch((error) => {
        console.error('Error saving summary:', error.message);
      });
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, { content: editData.content });

      const updatedItems = summarys.map((summary) =>
        summary._id === editData.id ? { ...summary, content: editData.content } : summary
      );
      setSummarys(updatedItems);
      setEditData(null);
    }
  };

  const handleCancelClick = () => {
    setEditData(null);
  };

  const handleDelete = (id: string) => {
    axios
      .delete(`${API_BASE_URL}/api/userprofile/${userID}/summary/${id}`)
      .then((response) => {
        if (response.status === 200) {
          const updatedSummarys = summarys.filter((summary) => summary._id !== id);
          setSummarys(updatedSummarys);
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
    setNewSummary({ _id: '', content: '' });
    setIsAdding(true);
  };

  return (
    <div
      style={{
        border: 'none',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '30px',
        fontFamily: "'Roboto', sans-serif",
        color: '#333',
        backgroundColor: '#ffffff',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h4
        style={{
          color: '#4CAF50',
          textAlign: 'left',
          marginBottom: '1.5rem',
          fontFamily: "'Roboto Slab', serif",
          fontWeight: 700,
          fontSize: '1.5rem',
        }}
      >
        Summary
      </h4>
      {summarys.map((summary) => (
        <div
          key={summary._id}
          style={{
            marginBottom: '1.5rem',
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: '#f8f9fa',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            cursor: 'pointer',
            border: '1px solid #e0e0e0',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          {editData && editData.id === summary._id ? (
            <>
              <textarea
                value={editData.content}
                onChange={(e) =>
                  setEditData({ ...editData, content: e.target.value })
                }
                className="form-control mb-2"
                style={{
                  height: '150px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '12px',
                  fontSize: '1rem',
                  marginBottom: '1rem',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={handleGenerateTextClick}
                  className="btn btn-info me-2"
                  style={{
                    backgroundColor: '#17a2b8',
                    color: '#fff',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s',
                  
                  }}
                >
                  <FontAwesomeIcon icon={faMagic} className="me-2" />
                  AI Summary
                </button>
                <div>
                  <button
                    onClick={handleUpdate}
                    className="btn btn-success me-2"
                    style={{
                      backgroundColor: '#28a745',
                      color: '#fff',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
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
                      backgroundColor: '#6c757d',
                      color: '#fff',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s',
                    
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} className="me-2" />
                    Cancel
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <p
                style={{
                  marginBottom: '1rem',
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  color: '#495057',
                }}
              >
                {summary.content}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => handleEditClick(summary._id, summary.content)}
                  className="btn btn-outline-primary me-2"
                  style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '0.3rem 0.8rem',
                    fontSize: '0.9rem',
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(summary._id)}
                  className="btn btn-outline-danger"
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
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
            onChange={(e) =>
              setNewSummary({ ...newSummary, content: e.target.value })
            }
            className="form-control mb-2"
            style={{
              height: '150px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              padding: '12px',
              fontSize: '1rem',
              marginBottom: '1rem',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={handleGenerateTextClick}
              className="btn btn-info me-2"
              style={{
                backgroundColor: '#17a2b8',
                color: '#fff',
                borderRadius: '8px',
                padding: '10px 20px',
                transition: 'all 0.3s',
                fontSize: '1rem',
              }}
            >
              <FontAwesomeIcon icon={faMagic} className="me-2" />
              AI Summary
            </button>
            <div>
              <button
                type="submit"
                className="btn btn-success"
                onClick={handleSaveClick}
                style={{
                  backgroundColor: '#28a745',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  transition: 'all 0.3s',
                  fontSize: '1rem',
                }}
              >
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setIsAdding(false)}
                style={{
                  backgroundColor: '#6c757d',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  transition: 'all 0.3s',
                  fontSize: '1rem',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
      {!isAdding && summarys.length === 0 && (
        <button
          onClick={handleAddClick}
          className="btn btn-outline-primary"
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '1rem',
            transition: 'all 0.3s',
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
