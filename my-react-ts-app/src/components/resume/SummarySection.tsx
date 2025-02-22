import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { faMagic, faSave, faTimes, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

interface Summary {
  _id: string;
  content: string;
  isEditing?: boolean;
}

interface SummarySectionProps {
  Summarys: Summary[];
  onEdit: (id: string, data: { content: string }) => void;
  onDelete: (id: string) => void;
  viewOnly?: boolean;
  parsedSummary?: string; 
}

const SummarySection: React.FC<SummarySectionProps> = ({
  Summarys,
  onEdit,
  onDelete,
  viewOnly = false,
  parsedSummary,
}) => {
  const [summarys, setSummarys] = useState<Summary[]>(Summarys);
  const [editData, setEditData] = useState<{ id: string; content: string } | null>(null);
  const [newSummary, setNewSummary] = useState<Summary>({
    _id: '',
    content: '',
  });
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const { userID } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Prepopulate newSummary with parsedSummary if it's available
  useEffect(() => {
    if (parsedSummary) {
      setNewSummary({ _id: '', content: parsedSummary });
      console.log('Parsed Summary received:', parsedSummary);
    }
  }, [parsedSummary]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = () => {
    fetch(`${API_BASE_URL}/api/userprofile/${userID}/summary`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        return response.json();
      })
      .then((data) => {
        setSummarys(data);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      });
  };



const fetchGeneratedText = () => {
  setIsLoading(true); // Start loading
  axios
    .get(`${API_BASE_URL}/api/userprofile/generate/${userID}`)
    .then((response) => {
      const generatedText = response.data.text;
      setGeneratedText(generatedText);

      const words = generatedText.split(' ');

      const printWords = (index: number) => {
        if (index < words.length) {
          const currentContent = words.slice(0, index + 1).join(' ');

          if (editData) {
            // Update content for editing mode
            setEditData((prevData) => ({
              ...prevData!,
              content: currentContent,
            }));
          } else {
            // Update content for new summaries
            setNewSummary((prevSummary) => ({
              ...prevSummary,
              content: currentContent,
            }));
          }

          // Continue printing words with delay
          setTimeout(() => {
            printWords(index + 1);
          }, 200); // Adjust speed here (200ms per word)
        } else {
          setIsLoading(false); // Stop loading when done
        }
      };

      printWords(0);
    })
    .catch((error) => {
      console.error('Error fetching generated text:', error);
      alert('Failed to generate text. Please try again later.'); // User-friendly error message
      setIsLoading(false); // Ensure loading is stopped on error
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

  // if (isLoading) {
  //   return (
  //     <div className="summary-container">
  //     <h2 className="section-header">Summary</h2>
  //       <div className="animate-pulse">
  //         <div className="summary-card">
  //           <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
  //           <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
  //           <div className="h-4 bg-gray-700 rounded w-2/3"></div>
  //           <div className="btn-group mt-4">
  //             <div className="h-8 w-24 bg-gray-700 rounded"></div>
  //             <div className="h-8 w-24 bg-gray-700 rounded"></div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }


  return (
    <div className="summary-container">
      <style>
        {`
          .summary-container {
            background-color: rgba(0, 3, 8, 0.45);
            border-radius: 12px;
            padding: 1.5rem;
            color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .summary-header {
            color: #63b3ed;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .summary-card {
            background-color: #1a202c;
            border-radius: 8px;
            padding: 1.25rem;
            margin-bottom: 1rem;
            border: 1px solid #4a5568;
            transition: all 0.2s ease;
          }

          .summary-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .summary-content {
            color: #e2e8f0;
            font-size: 0.75rem;
            line-height: 1.6;
            margin-bottom: 1rem;
          }

          .btn-group {
            display: flex;
            gap: 0.75rem;
            margin-top: 1rem;
            flex-wrap: wrap;
          }


          .btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .btn:hover {
            transform: translateY(-1px);
          }

          .btn-primary {
            background-color: #3182ce;
            color: white;
          }

          .btn-secondary {
            background-color: #4a5568;
            color: white;
          }

          .btn-danger {
            background-color: #e53e3e;
            color: white;
          }

          .btn-success {
            background-color: #38a169;
            color: white;
          }

          .textarea-field {
            width: 100%;
            min-height: 120px;
            padding: 0.75rem;
            border-radius: 6px;
            background-color: #2d3748;
            border: 1px solid #4a5568;
            color: white;
            font-size: 0.75rem;
            resize: vertical;
            margin-bottom: 1rem;
          }

          .textarea-field:focus {
            outline: none;
            border-color: #63b3ed;
          }

          .loading-dots {
            display: flex;
            gap: 4px;
          }

          .section-header {
            color: #63b3ed;
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
          }


          .dot {
            width: 6px;
            height: 6px;
            background-color: white;
            border-radius: 50%;
            animation: dot-flashing 1s infinite linear alternate;
          }

          .dot:nth-child(2) { animation-delay: 0.2s; }
          .dot:nth-child(3) { animation-delay: 0.4s; }

          @keyframes dot-flashing {
            0% { opacity: 0.2; }
            100% { opacity: 1; }
          }
        `}
      </style>

      <div className="section-header">
        <span>Summary</span>
        {!isAdding && summarys.length === 0 && (
          <button 
            className="btn btn-primary"
            onClick={handleAddClick}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Summary
          </button>
        )}
      </div>

      {summarys.map((summary) => (
        <div key={summary._id} className="summary-card">
          {editData && editData.id === summary._id ? (
            <>
              <textarea
                className="textarea-field"
                value={editData.content}
                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                placeholder="Enter your professional summary..."
              />
              <div className="btn-group">
                <button 
                  className="btn btn-primary"
                  onClick={handleGenerateTextClick}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loading-dots">
                      <div className="dot" />
                      <div className="dot" />
                      <div className="dot" />
                    </div>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faMagic} />
                      AI Generate
                    </>
                  )}
                </button>
                <button 
                  className="btn btn-success"
                  onClick={handleUpdate}
                >
                  <FontAwesomeIcon icon={faSave} />
                  Save
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleCancelClick}
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="summary-content">{summary.content}</div>
              {!viewOnly && (
                <div className="btn-group">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleEditClick(summary._id, summary.content)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(summary._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}

      {isAdding && (
        <div className="summary-card">
          <textarea
            className="textarea-field"
            value={newSummary.content}
            onChange={(e) => setNewSummary({ ...newSummary, content: e.target.value })}
            placeholder="Enter your professional summary..."
          />
          <div className="btn-group">
            <button 
              className="btn btn-primary"
              onClick={handleGenerateTextClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-dots">
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </div>
              ) : (
                <>
                  <FontAwesomeIcon icon={faMagic} />
                  AI Generate
                </>
              )}
            </button>
            <button 
              className="btn btn-success"
              onClick={handleSaveClick}
            >
              <FontAwesomeIcon icon={faSave} />
              Save
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setIsAdding(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummarySection;
