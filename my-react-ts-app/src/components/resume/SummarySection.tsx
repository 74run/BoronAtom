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
    <div className="bg-[#000308] bg-opacity-45 rounded-xl p-6 text-white shadow-md">
      <div className="text-[#63b3ed] text-lg font-semibold mb-6 flex justify-between items-center">
        <span>Summary</span>
        {!isAdding && summarys.length === 0 && (
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#3182ce] to-[#4facfe] text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
            onClick={handleAddClick}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Summary
          </button>
        )}
      </div>

      {summarys.map((summary) => (
        <div key={summary._id} className="bg-[#1a202c] rounded-lg p-5 mb-4 border border-[#4a5568] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          {editData && editData.id === summary._id ? (
            <>
              <textarea
                className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm min-h-[120px] resize-y mb-4 focus:outline-none focus:border-[#63b3ed]"
                value={editData.content}
                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                placeholder="Enter your professional summary..."
              />
              <div className="flex flex-wrap gap-3">
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#17a2b8] to-[#4fc3f7] text-white text-sm font-medium disabled:opacity-50 hover:-translate-y-0.5 transition-transform"
                  onClick={handleGenerateTextClick}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-100"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-200"></div>
                    </div>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faMagic} />
                      AI Generate
                    </>
                  )}
                </button>
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-green-600 to-green-400 text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
                  onClick={handleUpdate}
                >
                  <FontAwesomeIcon icon={faSave} />
                  Save
                </button>
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#4a5568] text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
                  onClick={handleCancelClick}
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-[#e2e8f0] text-sm leading-relaxed mb-4">{summary.content}</div>
              {!viewOnly && (
                <div className="flex flex-wrap gap-3">
                  <button 
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#3182ce] to-[#4facfe] text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
                    onClick={() => handleEditClick(summary._id, summary.content)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </button>
                  <button 
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-red-600 to-red-400 text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
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
        <div className="bg-[#1a202c] rounded-lg p-5 mb-4 border border-[#4a5568]">
          <textarea
            className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm min-h-[120px] resize-y mb-4 focus:outline-none focus:border-[#63b3ed]"
            value={newSummary.content}
            onChange={(e) => setNewSummary({ ...newSummary, content: e.target.value })}
            placeholder="Enter your professional summary..."
          />
          <div className="flex flex-wrap gap-3">
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#17a2b8] to-[#4fc3f7] text-white text-sm font-medium disabled:opacity-50 hover:-translate-y-0.5 transition-transform"
              onClick={handleGenerateTextClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-200"></div>
                </div>
              ) : (
                <>
                  <FontAwesomeIcon icon={faMagic} />
                  AI Generate
                </>
              )}
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-green-600 to-green-400 text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
              onClick={handleSaveClick}
            >
              <FontAwesomeIcon icon={faSave} />
              Save
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#4a5568] text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
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
