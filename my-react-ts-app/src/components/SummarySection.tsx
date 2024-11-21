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
        window.location.reload();
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        border: 'none',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '40px',
        fontFamily: "'Poppins', sans-serif",
        color: '#f5f5f5',
        backgroundColor: '#1c1c1e',
        background: 'linear-gradient(135deg, #1c1c1e 0%, #2d2d30 100%)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 2, ease: 'easeInOut', loop: Infinity }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #00cec9, #6c5ce7)',
        }}
      />
      <h4
        style={{
          color: '#00cec9',
          textAlign: 'left',
          marginBottom: '2rem',
          fontFamily: "'Roboto Slab', serif",
          fontWeight: 700,
          fontSize: '2rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        Summary
      </h4>
      {summarys.map((summary) => (
        <motion.div
          key={summary._id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            marginBottom: '1.5rem',
            padding: '24px',
            borderRadius: '12px',
            backgroundColor: '#2d2d30',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            border: '1px solid #444',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #6c5ce7, #00cec9)',
            }}
          />
          {editData && editData.id === summary._id ? (
            <>
              <textarea
                value={editData.content}
                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                style={{
                  height: '150px',
                  width: '100%',
                  borderRadius: '10px',
                  border: '1px solid #444',
                  padding: '16px',
                  fontSize: '1rem',
                  backgroundColor: '#333',
                  color: '#f5f5f5',
                }}
              />
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
           <motion.button
  whileHover={{ scale: isLoading ? 1 : 1.05 }}
  whileTap={{ scale: isLoading ? 1 : 0.95 }}
  onClick={handleGenerateTextClick}
  disabled={isLoading}
  style={{
    backgroundColor: isLoading ? '#d1d1d1' : '#00cec9',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '10px',
    fontSize: '0.9rem',
    border: 'none',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
    transition: 'background-color 0.3s ease',
  }}
>
  {isLoading ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          animation: 'dot-flashing 1.2s infinite ease-in-out',
        }}
      />
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          animation: 'dot-flashing 1.2s infinite ease-in-out',
          animationDelay: '0.2s',
        }}
      />
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          animation: 'dot-flashing 1.2s infinite ease-in-out',
          animationDelay: '0.4s',
        }}
      />
    </div>
  ) : (
    <>
      <FontAwesomeIcon icon={faMagic} />
      AI Summary
    </>
  )}
</motion.button>

<style>
{`
  @keyframes dot-flashing {
    0% {
      opacity: 1;
    }
    50%,
    100% {
      opacity: 0.2;
    }
  }
`}
</style>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUpdate}
                    style={{
                      backgroundColor: '#6c5ce7',
                      color: '#fff',
                      padding: '0.5rem 1rem',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                    }}
                  >
                    <FontAwesomeIcon icon={faSave} />
                    Update
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancelClick}
                    style={{
                      backgroundColor: '#6c757d',
                      color: '#fff',
                      padding: '0.5rem 1rem',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    Cancel
                  </motion.button>
                </div>
                </div>
            </>
          ) : (
            <p
            style={{
              marginBottom: '1.5rem',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1rem',
              lineHeight: '1.8',
              color: '#ddd',
            }}
          >
            {summary.content}
          </p>
          )}
          {!viewOnly && !editData && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          
          <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => handleEditClick(summary._id, summary.content)}
  style={{
    background: 'linear-gradient(to right, #6c5ce7, #a29bfe)', // Purple gradient
    color: '#fff',
    borderRadius: '10px',
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px', // Space between icon and text
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // Subtle shadow
    transition: 'all 0.3s ease', // Smooth hover animation
  }}
>
  <FontAwesomeIcon icon={faEdit} />
  Edit
</motion.button>

<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => handleDelete(summary._id)}
  style={{
    background: 'linear-gradient(to right, #e74c3c, #ff6b6b)', // Red gradient
    color: '#fff',
    borderRadius: '10px',
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px', // Space between icon and text
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // Subtle shadow
    transition: 'all 0.3s ease', // Smooth hover animation
  }}
>
  <FontAwesomeIcon icon={faTrash} />
  Delete
</motion.button>

            </div>
          )}
        </motion.div>
      ))}



      {isAdding && (
        <>
          <textarea
            value={newSummary.content}
            onChange={(e) => setNewSummary({ ...newSummary, content: e.target.value })}
            style={{
              height: '150px',
              width: '100%',
              borderRadius: '10px',
              border: '1px solid #444',
              padding: '16px',
              fontSize: '1rem',
              backgroundColor: '#333',
              color: '#f5f5f5',
              marginBottom: '12px',
            }}
            placeholder="Write your new summary here..."
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <motion.button
  whileHover={{ scale: isLoading ? 1 : 1.05 }}
  whileTap={{ scale: isLoading ? 1 : 0.95 }}
  onClick={handleGenerateTextClick}
  disabled={isLoading}
  style={{
    backgroundColor: isLoading ? '#d1d1d1' : '#00cec9',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '10px',
    fontSize: '0.9rem',
    border: 'none',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
    transition: 'background-color 0.3s ease',
  }}
>
  {isLoading ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          animation: 'dot-flashing 1.2s infinite ease-in-out',
        }}
      />
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          animation: 'dot-flashing 1.2s infinite ease-in-out',
          animationDelay: '0.2s',
        }}
      />
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          animation: 'dot-flashing 1.2s infinite ease-in-out',
          animationDelay: '0.4s',
        }}
      />
    </div>
  ) : (
    <>
      <FontAwesomeIcon icon={faMagic} />
      AI Summary
    </>
  )}
</motion.button>

<style>
{`
  @keyframes dot-flashing {
    0% {
      opacity: 1;
    }
    50%,
    100% {
      opacity: 0.2;
    }
  }
`}
</style>
            <div style={{ display: 'flex', gap: '12px' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveClick}
                style={{
                  backgroundColor: '#6c5ce7',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '0.5rem 1rem',
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                }}
              >
                <FontAwesomeIcon icon={faSave} />
                Save
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAdding(false)}
                style={{
                  backgroundColor: '#6c757d',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '0.5rem 1rem',
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
                Cancel
              </motion.button>
            </div>
       
    
       
      </div>
        </>
      )}

{!isAdding && summarys.length === 0 && (
       <motion.button
       whileHover={{ scale: 1.1 }}
       whileTap={{ scale: 0.95 }}
       onClick={handleAddClick}
       style={{
         background: 'linear-gradient(to right, #6c5ce7, #a29bfe)', // Gradient for a dynamic look
         color: '#fff',
         borderRadius: '12px', // Slightly more rounded corners for a modern feel
         padding: '0.75rem 1.5rem', // Balanced padding for button size
         fontSize: '1rem',
         fontWeight: '600', // Slightly bolder text
         border: 'none',
         cursor: 'pointer',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         gap: '12px', // Consistent spacing between icon and text
         boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)', // More prominent shadow for depth
         transition: 'all 0.3s ease', // Smooth hover and tap animations
         margin: '0 auto', // Centers the button
       }}
     >
       <FontAwesomeIcon icon={faPlus} style={{ fontSize: '1.2rem' }} /> {/* Slightly larger icon */}
       Add Summary
     </motion.button>
     
      )}

      
    </motion.div>
  );
};

export default SummarySection;
