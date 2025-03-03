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
    <div className="bg-[#000308] bg-opacity-45 rounded-xl p-6 text-white shadow-md">
      <h2 className="text-[#63b3ed] text-lg font-semibold mb-6">Experience</h2>

      {experiences.map((experience, index) => (
        <div key={experience._id} className="bg-[#1a202c] rounded-lg p-6 mb-4 border border-[#4a5568] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg relative">
          {editData && editData.id === experience._id ? (
            <div className="space-y-4">
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
                placeholder="Job Title"
                value={editData.jobTitle}
                onChange={(e) => setEditData({ ...editData, jobTitle: e.target.value })}
              />

              <input
                type="text"
                className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
                placeholder="Company"
                value={editData.company}
                onChange={(e) => setEditData({ ...editData, company: e.target.value })}
              />

              <input
                type="text"
                className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
                placeholder="Location"
                value={editData.location}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[#a0aec0] text-sm mb-2">Start Date</div>
                  <select
                    className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm"
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
                  <div className="text-[#a0aec0] text-sm mb-2">&nbsp;</div>
                  <select
                    className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm"
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[#a0aec0] text-sm mb-2">End Date</div>
                    <select
                      className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm"
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
                    <div className="text-[#a0aec0] text-sm mb-2">&nbsp;</div>
                    <select
                      className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm"
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
                className={`w-full p-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200
                  ${editData.isPresent ? 'bg-gradient-to-r from-green-600 to-green-400' : 'bg-gradient-to-r from-red-600 to-red-400'} text-white`}
                onClick={handleTogglePresent}
              >
                <FontAwesomeIcon icon={editData.isPresent ? faToggleOn : faToggleOff} />
                {editData.isPresent ? "Currently Working Here" : "Not Currently Working Here"}
              </button>

              <textarea
                ref={editTextareaRef}
                className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm min-h-[150px] focus:outline-none focus:border-[#63b3ed]"
                placeholder="Job Description"
                value={editData.description}
                onChange={handleEditDescriptionChange}
                onSelect={() => handleSelection(true)}
              />

              <div className="flex flex-wrap gap-3">
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#17a2b8] to-[#4fc3f7] text-white text-sm font-medium disabled:opacity-50 hover:-translate-y-0.5 transition-transform"
                  onClick={() => handleGenerateDescription(editData.jobTitle)}
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
                  Save Changes
                </button>
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#4a5568] text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
                  onClick={handleCancelEdit}
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-[#63b3ed] text-base font-semibold mb-3">{experience.jobTitle}</h3>
              <div className="text-[#a0aec0] text-sm mb-2">
                <strong>Company:</strong> {experience.company}
              </div>
              <div className="text-[#a0aec0] text-sm mb-2">
                <strong>Location:</strong> {experience.location}
              </div>
              <div className="text-[#a0aec0] text-sm mb-2">
                <strong>Duration:</strong> {experience.startDate.month} {experience.startDate.year} - 
                {experience.isPresent ? " Present" : ` ${experience.endDate.month} ${experience.endDate.year}`}
              </div>

              <div className="bg-[#2d3748] rounded-lg p-4 my-4 border border-[#4a5568] text-[#e2e8f0] text-sm leading-relaxed whitespace-pre-wrap">
                {experience.description.split("**").map((part, index) =>
                  index % 2 === 1 ? (
                    <b key={index} className="text-[#00d084] font-semibold">{part}</b>
                  ) : (
                    <span key={index}>{part}</span>
                  )
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#3182ce] to-[#4facfe] text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
                  onClick={() => handleEditClick(
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium hover:-translate-y-0.5 transition-transform
                    ${experience.includeInResume ? 'bg-gradient-to-r from-green-600 to-green-400' : 'bg-gradient-to-r from-red-600 to-red-400'} text-white`}
                  onClick={() => handleToggleInclude(experience._id)}
                >
                  <FontAwesomeIcon icon={experience.includeInResume ? faToggleOn : faToggleOff} />
                  {experience.includeInResume ? "Included" : "Excluded"}
                </button>
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-red-600 to-red-400 text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
                  onClick={() => handleDelete(experience._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Delete
                </button>
              </div>

              <div className="absolute right-4 top-4 flex gap-1">
                <button 
                  className="p-2 rounded bg-[#4a5568] text-white hover:bg-[#3182ce] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => moveExperienceUp(index)}
                  disabled={index === 0}
                >
                  <FontAwesomeIcon icon={faArrowUp} />
                </button>
                <button 
                  className="p-2 rounded bg-[#4a5568] text-white hover:bg-[#3182ce] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="bg-[#1a202c] rounded-lg p-6 mb-4 border border-[#4a5568]">
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
              placeholder="Job Title"
              value={newExperience.jobTitle}
              onChange={(e) => setNewExperience({ ...newExperience, jobTitle: e.target.value })}
            />

            <input
              type="text"
              className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
              placeholder="Company"
              value={newExperience.company}
              onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
            />

            <input
              type="text"
              className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
              placeholder="Location"
              value={newExperience.location}
              onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[#a0aec0] text-sm mb-2">Start Date</div>
                <select
                  className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm"
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
                <div className="text-[#a0aec0] text-sm mb-2">&nbsp;</div>
                <select
                  className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm"
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[#a0aec0] text-sm mb-2">End Date</div>
                  <select
                    className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm"
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
                  <div className="text-[#a0aec0] text-sm mb-2">&nbsp;</div>
                  <select
                    className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm"
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
              className={`w-full p-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200
                ${newExperience.isPresent ? 'bg-gradient-to-r from-green-600 to-green-400' : 'bg-gradient-to-r from-red-600 to-red-400'} text-white`}
              onClick={() => setNewExperience({ ...newExperience, isPresent: !newExperience.isPresent })}
            >
              <FontAwesomeIcon icon={newExperience.isPresent ? faToggleOn : faToggleOff} />
              {newExperience.isPresent ? "Currently Working Here" : "Not Currently Working Here"}
            </button>

            <textarea
              ref={newTextareaRef}
              className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm min-h-[150px] focus:outline-none focus:border-[#63b3ed]"
              placeholder="Job Description"
              value={newExperience.description}
              onChange={handleDescriptionChange}
              onSelect={() => handleSelection(false)}
            />

            <div className="flex flex-wrap gap-3">
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#17a2b8] to-[#4fc3f7] text-white text-sm font-medium disabled:opacity-50 hover:-translate-y-0.5 transition-transform"
                onClick={() => handleGenerateDescription(newExperience.jobTitle)}
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
        </div>
      )}

      {!isAdding && (
        <button 
          className="flex items-center justify-center gap-2 w-full px-4 py-2 mt-4 rounded-md bg-gradient-to-r from-[#3182ce] to-[#4facfe] text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
          onClick={handleAddClick}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Experience
        </button>
      )}

      {showBoldButton && (
        <button
          className="absolute bg-gradient-to-r from-[#3182ce] to-[#4facfe] text-white border-none rounded px-2 py-1 cursor-pointer z-50 flex items-center gap-2 shadow-md hover:-translate-y-0.5 transition-transform"
          onClick={() => applyBold(editData !== null)}
          style={{
            top: buttonPosition.top,
            left: buttonPosition.left,
          }}
        >
          <FontAwesomeIcon icon={faBold} /> Bold
        </button>
      )}
    </div>
  );
};

export default ExperienceSection;
