import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faToggleOn, faToggleOff, faMagic, faArrowUp, faArrowDown, faBold, faTimes  } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';

interface Experience {
  _id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  description: string;
  includeInResume: boolean;
  isPresent?: boolean; // Add this field to track if the end date is 'Present'
  isEditing?: boolean;
}

interface ExperienceProps {
  Experiences: Experience[];
  onEdit: (id: string, data: {
    jobTitle: string;
    company: string;
    location: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string;
    includeInResume: boolean;
    isPresent: boolean;
  }) => void;
  onDelete: (id: string) => void;
}

const ExperienceSection: React.FC<ExperienceProps> = ({ Experiences, onEdit, onDelete }) => {
  const [editData, setEditData] = useState<{
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string;
    includeInResume: boolean;
    isPresent: boolean;
  } | null>(null);

  const [experiences, setExperiences] = useState<Experience[]>(Experiences);
  const [newExperience, setNewExperience] = useState<Experience>({
    _id: '',
    jobTitle: '',
    company: '',
    location: '',
    startDate: { month: '', year: '' },
    endDate: { month: '', year: '' },
    description: '',
    includeInResume: true,
    isPresent: false, // Initialize as false
  });

  const [isAdding, setIsAdding] = useState(false);
  const { userID } = useParams();
  const [showBoldButton, setShowBoldButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
const newTextareaRef = useRef<HTMLTextAreaElement>(null);



  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const graduationYears = Array.from({ length: 57 }, (_, index) => (new Date()).getFullYear() + 7 - index);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/experience`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch experiences');
        }
        return response.json();
      })
      .then(data => {
        setExperiences(data);
      })
      .catch(error => {
        console.error('Error fetching experiences:', error);
      });
  };

  const moveExperienceUp = (index: number) => {
    if (index > 0) {
      const updatedExperiences = [...experiences];
      [updatedExperiences[index - 1], updatedExperiences[index]] = 
        [updatedExperiences[index], updatedExperiences[index - 1]];
      setExperiences(updatedExperiences);
      saveExperienceOrder(updatedExperiences);
    }
  };

  const moveExperienceDown = (index: number) => {
    if (index < experiences.length - 1) {
      const updatedExperiences = [...experiences];
      [updatedExperiences[index + 1], updatedExperiences[index]] = 
        [updatedExperiences[index], updatedExperiences[index + 1]];
      setExperiences(updatedExperiences);
      saveExperienceOrder(updatedExperiences);
    }
  };

  const saveExperienceOrder = (updatedExperiences: Experience[]) => {
    axios.put(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/experiences/reorder`, { experiences: updatedExperiences })
      .then(() => console.log('Experience order updated'))
      .catch(error => console.error('Error updating order:', error));
  };

  const handleGenerateDescription = (jobTitle: string) => {
    // Set loading state to true
    setIsLoading(true);
  
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/userprofile/generate-job-description/${userID}/${jobTitle}`,
        {
          params: { jobTitle },
        }
      )
      .then((response) => {
        const generatedDescription = response.data.text;
  
        // Update the description based on the current context (edit or new experience)
        if (editData) {
          setEditData((prevData) => ({
            ...prevData!,
            description: generatedDescription,
          }));
        } else {
          setNewExperience((prevExperience) => ({
            ...prevExperience,
            description: generatedDescription,
          }));
        }
      })
      .catch((error) => {
        console.error("Error generating description:", error);
      })
      .finally(() => {
        // Set loading state to false after the request finishes
        setIsLoading(false);
      });
  };
  
  const handleEditClick = (
    id: string,
    jobTitle: string,
    company: string,
    location: string,
    startDate: { month: string; year: string },
    endDate: { month: string; year: string },
    description: string,
    includeInResume: boolean,
    isPresent: boolean
  ) => {
    setEditData({ id, jobTitle, company, location, startDate, endDate, description, includeInResume, isPresent });
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, {
        jobTitle: editData.jobTitle,
        company: editData.company,
        location: editData.location,
        startDate: { ...editData.startDate },
        endDate: { ...editData.endDate },
        description: editData.description,
        includeInResume: editData.includeInResume,
        isPresent: editData.isPresent,
      });

      const updatedItems = experiences.map((experience) =>
        experience._id === editData.id
          ? { ...experience, jobTitle: editData.jobTitle, company: editData.company, location: editData.location, startDate: { ...editData.startDate }, endDate: { ...editData.endDate }, description: editData.description, includeInResume: editData.includeInResume, isPresent: editData.isPresent }
          : experience
      );

      setExperiences(updatedItems);
      setEditData(null);
    }
  };

  const handleSaveClick = () => {
    const formattedExperience = {
      ...newExperience,
      startDate: {
        month: newExperience.startDate.month,
        year: newExperience.startDate.year,
      },
      endDate: {
        month: newExperience.endDate.month,
        year: newExperience.endDate.year,
      },
    };

    axios.post(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/experience`, formattedExperience)
      .then((response) => {
        const newExperienceFromServer = response.data.experience;
        const newExpData = newExperienceFromServer[newExperienceFromServer.length - 1];
        setExperiences([...experiences, newExpData]);

        setNewExperience({
          _id: '',
          jobTitle: '',
          company: '',
          location: '',
          startDate: { month: '', year: '' },
          endDate: { month: '', year: '' },
          description: '',
          includeInResume: true,
          isPresent: false, // Reset to false
        });

        setIsAdding(false);
      })
      .catch((error) => {
        console.error('Error saving experience:', error.message);
      });
  };

  const handleDelete = (id: string) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/experience/${id}`)
      .then(() => {
        const updatedExperiences = experiences.filter((experience) => experience._id !== id);
        setExperiences(updatedExperiences);
        setEditData(null);
      })
      .catch((error) => {
        console.error('Error deleting experience:', error.message);
      });
  };

  const handleAddClick = () => {
    setNewExperience({
      _id: '',
      jobTitle: '',
      company: '',
      location: '',
      startDate: { month: '', year: '' },
      endDate: { month: '', year: '' },
      description: '',
      includeInResume: true,
      isPresent: false, // Initialize as false
    });
    setIsAdding(true);
  };

  const handleToggleInclude = (id: string) => {
    const updatedExperiences = experiences.map((experience) =>
      experience._id === id ? { ...experience, includeInResume: !experience.includeInResume } : experience
    );
    setExperiences(updatedExperiences);

    const experienceToUpdate = updatedExperiences.find(exp => exp._id === id);
    if (experienceToUpdate) {
      onEdit(id, {
        jobTitle: experienceToUpdate.jobTitle,
        company: experienceToUpdate.company,
        location: experienceToUpdate.location,
        startDate: experienceToUpdate.startDate,
        endDate: experienceToUpdate.endDate,
        description: experienceToUpdate.description,
        includeInResume: experienceToUpdate.includeInResume,
        isPresent: experienceToUpdate.isPresent ?? false, // Provide default value if undefined
      });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    const lines = description.split('\n');

    if (lines.length > 0 && !lines[0].startsWith('*')) {
      lines[0] = '* ' + lines[0];
    }

    for (let i = 1; i < lines.length; i++) {
      if (lines[i] !== '' && !lines[i].startsWith('*')) {
        lines[i] = '* ' + lines[i];
      }
    }

    const newDescription = lines.join('\n');
    setNewExperience({ ...newExperience, description: newDescription });
  };

  const handleEditDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    const lines = description.split('\n');

    const linesWithAsterisks = lines.map(line => {
      if (line.trim() !== '' && !line.trim().startsWith('*')) {
        return `* ${line}`;
      } else {
        return line;
      }
    });

    const newDescription = linesWithAsterisks.join('\n');

    if (editData) {
      setEditData({
        ...editData,
        description: newDescription
      });
    }
  };

  const handleTogglePresent = () => {
    if (editData) {
      setEditData({ ...editData, isPresent: !editData.isPresent });
    } else {
      setNewExperience({ ...newExperience, isPresent: !newExperience.isPresent });
    }
  };

  const handleSelection = (isEditing: boolean) => {
    const textarea = isEditing ? editTextareaRef.current : newTextareaRef.current;
    if (!textarea) return;
  
    const { selectionStart, selectionEnd } = textarea;
  
    if (selectionStart !== selectionEnd) {
      // Get selected text
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
  
      // Get the range of selected text
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
  
      if (rect) {
        // Calculate position relative to viewport and add scroll offset
        const top = rect.top + window.pageYOffset - 40; // 40px above selection
        const left = rect.left + window.pageXOffset;
  
        setButtonPosition({ top, left });
        setShowBoldButton(true);
      }
    } else {
      setShowBoldButton(false);
    }
  };

  const applyBold = (isEditing: boolean) => {
    const textarea = isEditing ? editTextareaRef.current : newTextareaRef.current;
    if (!textarea) return;
  
    const { selectionStart, selectionEnd } = textarea;
    const selectedText = textarea.value.substring(selectionStart, selectionEnd);
    
    if (!selectedText.trim()) {
      setShowBoldButton(false);
      return;
    }
  
    if (isEditing && editData) {
      const beforeText = editData.description.substring(0, selectionStart);
      const afterText = editData.description.substring(selectionEnd);
      
      // Check if text is already bold
      const isBold = selectedText.startsWith('**') && selectedText.endsWith('**');
      const newDescription = isBold
        ? `${beforeText}${selectedText.slice(2, -2)}${afterText}`
        : `${beforeText}**${selectedText}**${afterText}`;
  
      setEditData({ ...editData, description: newDescription });
    } else {
      const beforeText = newExperience.description.substring(0, selectionStart);
      const afterText = newExperience.description.substring(selectionEnd);
      
      // Check if text is already bold
      const isBold = selectedText.startsWith('**') && selectedText.endsWith('**');
      const newDescription = isBold
        ? `${beforeText}${selectedText.slice(2, -2)}${afterText}`
        : `${beforeText}**${selectedText}**${afterText}`;
  
      setNewExperience({ ...newExperience, description: newDescription });
    }
  
    setShowBoldButton(false);
    textarea.focus();
  };

  const BoldButton = ({ onClick, style }: { onClick: () => void; style: React.CSSProperties }) => (
    <button className="bold-button" onClick={onClick} style={style}>
      <FontAwesomeIcon icon={faBold} /> Bold
    </button>
  );

  return (
    <div className="experience-container">
      <style>
        {`
          .experience-container {
            background-color: rgba(0, 3, 8, 0.45);
            border-radius: 12px;
            padding: 1.5rem;
            color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .section-header {
            color: #63b3ed;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
          }

          .experience-card {
            background-color: #1a202c;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            border: 1px solid #4a5568;
            transition: all 0.2s ease;
            position: relative;
          }

          .experience-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .job-title {
            color: #63b3ed;
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
          }

          .company-info {
            color: #a0aec0;
            font-size: 0.75rem;
            margin-bottom: 0.5rem;
          }

          
          .description-box {
            background-color: #2d3748;
            border-radius: 6px;
            padding: 1rem;
            margin: 1rem 0;
            border: 1px solid #4a5568;
            color: #e2e8f0;
            font-size: 0.75rem;
            line-height: 1.6;
            white-space: pre-wrap;
          }
          .form-group {
            margin-bottom: 1rem;
          }

          .input-field {
            width: 100%;
            padding: 0.75rem;
            border-radius: 6px;
            background-color: #2d3748;
            border: 1px solid #4a5568;
            color: white;
            font-size: 0.75rem;
            margin-bottom: 1rem;
          }

          .input-field:focus {
            outline: none;
            border-color: #63b3ed;
          }

          .date-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1rem;
          }

          .date-label {
            color: #a0aec0;
            font-size: 0.75rem;
            margin-bottom: 0.5rem;
          }

          .select-field {
            padding: 0.75rem;
            border-radius: 6px;
            background-color: #2d3748;
            border: 1px solid #4a5568;
            color: white;
            font-size: 0.75rem;
            width: 100%;
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
            padding: 0.75rem 1rem;
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
            background: linear-gradient(to right, #3182ce, #4facfe);
            color: white;
          }

          .btn-danger {
            background: linear-gradient(to right, #e53e3e, #fc8181);
            color: white;
          }


.btn-success {
  background: linear-gradient(to right, #38a169, #68d391);
  color: white;
}

  .btn-secondary {
            background-color: #4a5568;
            color: white;
          }

          
          .btn-ai {
            background: linear-gradient(to right, #17a2b8, #4fc3f7);
            color: white;
          }
          .present-toggle {
            width: 100%;
            padding: 0.75rem;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: background-color 0.2s ease;
          }

          .present-toggle.active {
            background: linear-gradient(to right, #38a169, #68d391);
            color: white;
          }

          .present-toggle.inactive {
            background: linear-gradient(to right, #e53e3e, #fc8181);
            color: white;
          }

          .include-toggle {
            background: none;
            border: none;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

  .include-toggle.included {
            background: linear-gradient(to right, #38a169, #68d391);
            color: white;
          }

          .include-toggle.excluded {
            background: linear-gradient(to right, #e53e3e, #fc8181);
            color: white;
          }de-toggle:hover {
  transform: scale(1.05);
  opacity: 0.9;
}


          .move-buttons {
            position: absolute;
            top: 1rem;
            right: 1rem;
            display: flex;
            gap: 0.5rem;
          }

          .move-btn {
            padding: 0.5rem;
            border-radius: 4px;
            background-color: #4a5568;
            color: white;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .move-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .move-btn:not(:disabled):hover {
            background-color: #3182ce;
          }

          .toggle-btn {
          width: 100%;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .toggle-btn.active {
          background-color: #38a169;
          color: white;
        }

        .toggle-btn.inactive {
          background-color: #4a5568;
          color: white;
        }

        

          .loading-dots {
            display: flex;
            gap: 4px;
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

          @media (max-width: 640px) {
            .btn-group {
              flex-direction: column;
            }
            
            .btn {
              width: 100%;
            }
          }

          .bold-text {
            color: #63b3ed;
            font-weight: 600;
          }

          

      
         



  ./* Button container for view mode */
.actions-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
  justify-content: flex-start;
}

@media (max-width: 640px) {
  .actions-group {
    flex-direction: column;
  }
  
  .actions-group button {
    width: 100%;
  }
}

.btn-ai {
  background: linear-gradient(to right, #17a2b8, #4fc3f7);
  color: white;
}

.bold-button {
  position: absolute; /* Change from fixed to absolute */
  background: linear-gradient(to right, #3182ce, #4facfe);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.bold-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
          
        `}
      </style>

      <h2 className="section-header">Experience</h2>

      {experiences.map((experience, index) => (
        <div key={experience._id} className="experience-card">
          {editData && editData.id === experience._id ? (
            <div className="form-group">
              <input
                type="text"
                className="input-field"
                placeholder="Job Title"
                value={editData.jobTitle}
                onChange={(e) => setEditData({ ...editData, jobTitle: e.target.value })}
              />

              <input
                type="text"
                className="input-field"
                placeholder="Company"
                value={editData.company}
                onChange={(e) => setEditData({ ...editData, company: e.target.value })}
              />

              <input
                type="text"
                className="input-field"
                placeholder="Location"
                value={editData.location}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
              />

              <div className="date-grid">
                <div>
                  <div className="date-label">Start Date</div>
                  <select
                    className="select-field"
                    value={editData.startDate.month}
                    onChange={(e) => setEditData({
                      ...editData,
                      startDate: { ...editData.startDate, month: e.target.value }
                    })}
                  >
                    <option value="" disabled>Select Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="date-label">&nbsp;</div>
                  <select
                    className="select-field"
                    value={editData.startDate.year}
                    onChange={(e) => setEditData({
                      ...editData,
                      startDate: { ...editData.startDate, year: e.target.value }
                    })}
                  >
                    <option value="" disabled>Select Year</option>
                    {graduationYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {!editData.isPresent && (
                <div className="date-grid">
                  <div>
                    <div className="date-label">End Date</div>
                    <select
                      className="select-field"
                      value={editData.endDate.month}
                      onChange={(e) => setEditData({
                        ...editData,
                        endDate: { ...editData.endDate, month: e.target.value }
                      })}
                    >
                      <option value="" disabled>Select Month</option>
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="date-label">&nbsp;</div>
                    <select
                      className="select-field"
                      value={editData.endDate.year}
                      onChange={(e) => setEditData({
                        ...editData,
                        endDate: { ...editData.endDate, year: e.target.value }
                      })}
                    >
                      <option value="" disabled>Select Year</option>
                      {graduationYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button 
                className={`present-toggle ${editData.isPresent ? 'active' : 'inactive'}`}
                onClick={handleTogglePresent}
              >
                <FontAwesomeIcon icon={editData.isPresent ? faToggleOn : faToggleOff} />
                {editData.isPresent ? "Currently Working Here" : "Not Currently Working Here"}
              </button>

              <textarea
  className="input-field"
  placeholder="Job Description"
  value={editData.description}
  onChange={handleEditDescriptionChange}
  onSelect={() => handleSelection(true)}
  ref={editTextareaRef}
  style={{ minHeight: "150px" }}
/>

              <div className="btn-group">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleGenerateDescription(editData.jobTitle)}
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
                  Save Changes
                </button>

                <button 
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Cancel
                </button>

                {showBoldButton && (
  <BoldButton
    onClick={() => applyBold(editData !== null)}
    style={{
      top: buttonPosition.top,
      left: buttonPosition.left,
    }}
  />
)}
              </div>
            </div>
          ) : (
            <>
              <h3 className="job-title">{experience.jobTitle}</h3>
              <div className="company-info">
                <strong>Company:</strong> {experience.company}
              </div>
              <div className="company-info">
                <strong>Location:</strong> {experience.location}
              </div>
              <div className="company-info">
                <strong>Duration:</strong> {experience.startDate.month} {experience.startDate.year} - 
                {experience.isPresent ? " Present" : ` ${experience.endDate.month} ${experience.endDate.year}`}
              </div>
    
              <div className="description-box">{experience.description.split("**").map((part, index) =>
    index % 2 === 1 ? (
      <b key={index} style={{ color: "#00d084", fontWeight: 600 }}>{part}</b> // Bold content
    ) : (
      <span key={index}>{part}</span> // Regular content
    )
  )}</div>

              <div className="btn-group">
                <button 
                  className="btn btn-primary"
                  onClick={() =>  handleEditClick(
                    experience._id,
                    experience.jobTitle,
                    experience.company,
                    experience.location,
                    experience.startDate,
                    experience.endDate,
                    experience.description,
                    experience.includeInResume,
                    experience.isPresent || false
                  )}
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Edit
                </button>

                <button 
                  className={`include-toggle ${experience.includeInResume ? 'included' : 'excluded'}`}
                  onClick={() => handleToggleInclude(experience._id)}
                >
                  <FontAwesomeIcon icon={experience.includeInResume ? faToggleOn : faToggleOff} />
                  {experience.includeInResume ? "Included" : "Excluded"}
                </button>

                <button 
                  className="btn btn-danger"
                  onClick={() => handleDelete(experience._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Delete
                </button>
              </div>

              <div className="move-buttons">
                <button 
                  className="move-btn"
                  onClick={() => moveExperienceUp(index)}
                  disabled={index === 0}
                >
                  <FontAwesomeIcon icon={faArrowUp} />
                </button>
                <button 
                  className="move-btn"
                  onClick={() => moveExperienceDown(index)}
                  disabled={index === experiences.length - 1}
                >
                  <FontAwesomeIcon icon={faArrowDown} />
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {isAdding && (
        <div className="experience-card">
          <div className="form-group">
            <input
              type="text"
              className="input-field"
              placeholder="Job Title"
              value={newExperience.jobTitle}
              onChange={(e) => setNewExperience({ ...newExperience, jobTitle: e.target.value })}
            />

            <input
              type="text"
              className="input-field"
              placeholder="Company"
              value={newExperience.company}
              onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
            />

            <input
              type="text"
              className="input-field"
              placeholder="Location"
              value={newExperience.location}
              onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
            />

            <div className="date-grid">
              <div>
                <div className="date-label">Start Date</div>
                <select
                  className="select-field"
                  value={newExperience.startDate.month}
                  onChange={(e) => setNewExperience({
                    ...newExperience,
                    startDate: { ...newExperience.startDate, month: e.target.value }
                  })}
                >
                  <option value="" disabled>Select Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="date-label">&nbsp;</div>
                <select
                  className="select-field"
                  value={newExperience.startDate.year}
                  onChange={(e) => setNewExperience({
                    ...newExperience,
                    startDate: { ...newExperience.startDate, year: e.target.value }
                  })}
                >
                  <option value="" disabled>Select Year</option>
                  {graduationYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {!newExperience.isPresent && (
              <div className="date-grid">
                <div>
                  <div className="date-label">End Date</div>
                  <select
                    className="select-field"
                    value={newExperience.endDate.month}
                    onChange={(e) => setNewExperience({
                      ...newExperience,
                      endDate: { ...newExperience.endDate, month: e.target.value }
                    })}
                  >
                    <option value="" disabled>Select Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="date-label">&nbsp;</div>
                  <select
                    className="select-field"
                    value={newExperience.endDate.year}
                    onChange={(e) => setNewExperience({
                      ...newExperience,
                      endDate: { ...newExperience.endDate, year: e.target.value }
                    })}
                  >
                    <option value="" disabled>Select Year</option>
                    {graduationYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button 
              className={`present-toggle ${newExperience.isPresent ? 'active' : 'inactive'}`}
              onClick={() => setNewExperience({ ...newExperience, isPresent: !newExperience.isPresent })}
            >
              <FontAwesomeIcon icon={newExperience.isPresent ? faToggleOn : faToggleOff} />
              {newExperience.isPresent ? "Currently Working Here" : "Not Currently Working Here"}
            </button>

            <textarea
  className="input-field"
  placeholder="Job Description"
  value={newExperience.description}
  onChange={handleDescriptionChange}
  onSelect={() => handleSelection(false)}
  ref={newTextareaRef}
  style={{ minHeight: "150px" }}
/>

            <div className="btn-group">
              <button 
                className="btn btn-primary"
                onClick={() => handleGenerateDescription(newExperience.jobTitle)}
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

              {showBoldButton && (
  <BoldButton
    onClick={() => applyBold(editData !== null)}
    style={{
      top: buttonPosition.top,
      left: buttonPosition.left,
    }}
  />
)}
            </div>
          </div>
        </div>
      )}

      {!isAdding && (
        <button 
          className="btn btn-primary"
          onClick={handleAddClick}
          style={{ 
            width: '100%',
            marginTop: experiences.length > 0 ? '1rem' : '0'
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Experience
        </button>
      )}
    </div>
  );
};

export default ExperienceSection;
