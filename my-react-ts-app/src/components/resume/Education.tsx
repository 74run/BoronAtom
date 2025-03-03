import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faSave, faTrash, faToggleOn, faToggleOff, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import CustomUniversityDropdown from './CustomUniversityDropdown';

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  // Add other fields as needed
}

interface University {
  name: string;
  url: string[]; // Assuming `url` is an array of strings
}

interface Education {
  _id: string;
  university: string;
  cgpa: string;
  degree: string;
  major: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  universityUrl: string;
  includeInResume: boolean;
  isEditing?: boolean;
  isPresent?: boolean; // Add this field to track if the end date is 'Present'
}

interface EducationProps {
  Educations: Education[];
  UserDetail: UserDetails | null;
 
  onEdit: (id: string, data: { university: string; cgpa: string; degree: string; major: string; startDate: { month: string; year: string }; endDate: { month: string; year: string }; universityUrl: string; includeInResume: boolean, isPresent: boolean }) => void;
  onDelete: (id: string) => void;
}



const EducationSection: React.FC<EducationProps> = ({ Educations, UserDetail, onEdit, onDelete }) => {
  const [editData, setEditData] = useState<{
    id: string;
    university: string;
    cgpa: string;
    degree: string;
    major: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    universityUrl: string;
    includeInResume: boolean;
    isPresent: boolean;
  } | null>(null);
  const [educations, setEducations] = useState<Education[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [universitiesUrl, setUniversitiesUrl] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEducation, setNewEducation] = useState<Education>({
    _id: '',
    university: '',
    cgpa: '',
    degree: '',
    major: '',
    startDate: { month: '', year: '' },
    endDate: { month: '', year: '' },
    universityUrl: '',
    includeInResume: true,
    isPresent: false, // Initialize as false
  });
  const { userID } = useParams();
  const [isAdding, setIsAdding] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const graduationYears = Array.from({ length: 57 }, (_, index) => (new Date()).getFullYear() + 7 - index);

  useEffect(() => {
    // Fetch user details
    axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/details/${userID}`)
      .then(response => {
        setUserDetails(response.data.user);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });
  }, [userID]);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/education`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch educations');
        }
        return response.json(); // Parse the response JSON
      })
      .then(data => {
        setEducations(data); // Set educations state with the fetched data
      })
      .catch(error => {
        console.error('Error fetching educations:', error);
      });
  };

  const handleEditClick = (
    id: string,
    university: string,
    cgpa: string,
    degree: string,
    major: string,
    startDate: { month: string; year: string },
    endDate: { month: string; year: string },
    universityUrl: string,
    includeInResume: boolean,
    isPresent: boolean
  ) => {
    setEditData({ id, university, cgpa, degree, major, startDate, endDate, universityUrl, includeInResume, isPresent });
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, {
        university: editData.university,
        cgpa: editData.cgpa,
        degree: editData.degree,
        major: editData.major,
        startDate: { ...editData.startDate },
        endDate: { ...editData.endDate },
        universityUrl: editData.universityUrl,
        includeInResume: editData.includeInResume,
        isPresent: editData.isPresent,
      });

      const updatedItems = educations.map((education) =>
        education._id === editData.id
          ? {
            ...education,
            university: editData.university,
            cgpa: editData.cgpa,
            degree: editData.degree,
            major: editData.major,
            startDate: { ...editData.startDate },
            endDate: { ...editData.endDate },
            universityUrl: editData.universityUrl,
            includeInResume: editData.includeInResume,
            isPresent: editData.isPresent,
          }
          : education
      );

      setEducations(updatedItems);
      setEditData(null);
    }
  };

  const handleDelete = (id: string) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/education/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to delete education. Status: ${res.status}`);
        }

        // Update the state to remove the deleted education
        const updatedEducations = educations.filter((education) => education._id !== id);
        setEducations(updatedEducations);

        setEditData(null);
      })
      .catch((error) => {
        console.error('Error deleting education:', error.message);
      });
  };

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/universities`);
        
        // Since the server sends an array of objects with name and url properties
        setUniversities(response.data.universities);
        console.log(response.data.universities);
        setError(null);
      } catch (err) {
        setError('An unknown error occurred')
      } finally {
        setIsLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  const handleToggleInclude = (id: string) => {
    const updatedEducations = educations.map((education) =>
      education._id === id ? { ...education, includeInResume: !education.includeInResume } : education
    );
    setEducations(updatedEducations);
  
    const educationToUpdate = updatedEducations.find(education => education._id === id);
    if (educationToUpdate) {
      onEdit(id, {
        university: educationToUpdate.university,
        cgpa: educationToUpdate.cgpa,
        degree: educationToUpdate.degree,
        major: educationToUpdate.major,
        startDate: educationToUpdate.startDate,
        endDate: educationToUpdate.endDate,
        universityUrl: educationToUpdate.universityUrl,
        includeInResume: educationToUpdate.includeInResume,
        isPresent: educationToUpdate.isPresent ?? false, // Use nullish coalescing operator to provide a default value
      });
    }
  };
  

  const handleSaveClick = () => {
    // Form validation check


    const formattedEducation = {
      ...newEducation,
      startDate: {
        month: newEducation.startDate.month,
        year: newEducation.startDate.year,
      },
      endDate: {
        month: newEducation.endDate.month,
        year: newEducation.endDate.year,
      },
    };

    axios.post(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/education`, formattedEducation)
      .then((response) => {
        const newEducationFromServer = response.data.education;
        const newEduData = newEducationFromServer[newEducationFromServer.length - 1];

        // Update state
        setEducations([...educations, newEduData]);

        setNewEducation({
          _id: '',
          university: '',
          cgpa: '',
          degree: '',
          major: '',
          startDate: { month: '', year: '' },
          endDate: { month: '', year: '' },
          universityUrl: '',
          includeInResume: true,
          isPresent: false, // Reset to false
        });

        setIsAdding(false);
      })
      .catch((error) => {
        console.error('Error saving education:', error.message);
      });
  };

  const handleAddClick = () => {
    setNewEducation({
      _id: '',
      university: '',
      cgpa: '',
      degree: '',
      major: '',
      startDate: { month: '', year: '' },
      endDate: { month: '', year: '' },
      universityUrl: '',
      includeInResume: true,
      isPresent: false, // Initialize as false
    });
    setIsAdding(true);
  };

  const handleTogglePresent = () => {
    if (editData) {
      setEditData({ ...editData, isPresent: !editData.isPresent });
    } else {
      setNewEducation({ ...newEducation, isPresent: !newEducation.isPresent });
    }
  };

  return (
    <div className="bg-[#000308] bg-opacity-45 rounded-xl p-6 text-white shadow-md">
      <h2 className="text-lg font-semibold mb-6">Education</h2>

      {educations.map((education) => (
        <div key={education._id} className="bg-[#1a202c] rounded-lg p-6 mb-4 border border-[#4a5568] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          {editData && editData.id === education._id ? (
            <div className="space-y-4">
              <div className="relative w-full">
                <input
                  type="text"
                  list="universities"
                  className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
                  placeholder={isLoading ? "Loading universities..." : "Search University"}
                  value={editData.university}
                  onChange={(e) => {
                    const selectedUniversity = universities.find(
                      (uni: University) => uni.name === e.target.value
                    );
                    setEditData({
                      ...editData,
                      university: e.target.value,
                      universityUrl: selectedUniversity ? selectedUniversity.url[0] || '' : ''
                    });
                  }}
                  disabled={isLoading}
                />
                
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
                  placeholder="University URL"
                  value={editData.universityUrl}
                  onChange={(e) => setEditData({ ...editData, universityUrl: e.target.value })}
                />

                <datalist id="universities">
                  {universities.map((university: { name: string, url: string[] }) => (
                    <option 
                      key={university.name} 
                      value={university.name}
                      data-url={university.url[0]} 
                    />
                  ))}
                </datalist>
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
              </div>

              <input
                type="number"
                className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
                placeholder="CGPA"
                step="0.01"
                min="0"
                max="4"
                value={editData.cgpa}
                onChange={(e) => setEditData({ ...editData, cgpa: e.target.value })}
              />

              <select
                className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
                value={editData.degree}
                onChange={(e) => setEditData({ ...editData, degree: e.target.value })}
              >
                <option value="" disabled>Select Degree</option>
                <option value="Associate Degree">Associate Degree</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Doctoral Degree">Doctoral Degree</option>
              </select>

              <input
                type="text"
                className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
                placeholder="Major"
                value={editData.major}
                onChange={(e) => setEditData({ ...editData, major: e.target.value })}
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
                {editData.isPresent ? "Currently Studying" : "Completed"}
              </button>

              <div className="flex flex-wrap gap-3">
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
              <h3 className="text-[#63b3ed] text-base font-semibold mb-3">{education.university}</h3>
              <div className="text-[#a0aec0] text-sm mb-2">
                <strong>Degree:</strong> {education.degree} in {education.major}
              </div>
              <div className="text-[#a0aec0] text-sm mb-2">
                <strong>GPA:</strong> {education.cgpa}
              </div>
              <div className="text-[#a0aec0] text-sm mb-2">
                <strong>Duration:</strong> {education.startDate.month} {education.startDate.year} - 
                {education.isPresent ? " Present" : ` ${education.endDate.month} ${education.endDate.year}`}
              </div>
              {education.universityUrl && (
                <div className="text-[#a0aec0] text-sm mb-2">
                  <strong>University URL:</strong> <a href={education.universityUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">{education.universityUrl}</a>
                </div>
              )}

              <div className="flex flex-wrap gap-3 mt-4">
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#3182ce] to-[#4facfe] text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
                  onClick={() => handleEditClick(
                    education._id,
                    education.university,
                    education.cgpa,
                    education.degree,
                    education.major,
                    education.startDate,
                    education.endDate,
                    education.universityUrl,
                    education.includeInResume,
                    education.isPresent || false
                  )}
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Edit
                </button>
                <button 
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium hover:-translate-y-0.5 transition-transform
                    ${education.includeInResume ? 'bg-gradient-to-r from-green-600 to-green-400' : 'bg-gradient-to-r from-red-600 to-red-400'} text-white`}
                  onClick={() => handleToggleInclude(education._id)}
                >
                  <FontAwesomeIcon icon={education.includeInResume ? faToggleOn : faToggleOff} />
                  {education.includeInResume ? "Included" : "Excluded"}
                </button>
                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-red-600 to-red-400 text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
                  onClick={() => handleDelete(education._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Add Education Form */}
      {isAdding && (
        <div className="bg-[#1a202c] rounded-lg p-6 mb-4 border border-[#4a5568]">
          <div className="space-y-4">
            <div className="relative w-full">
              <input
                type="text"
                list="universities"
                className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
                placeholder={isLoading ? "Loading universities..." : "Search University"}
                value={newEducation.university}
                onChange={(e) => {
                  const selectedUniversity = universities.find(
                    (uni: University) => uni.name === e.target.value
                  );
                  setNewEducation({
                    ...newEducation,
                    university: e.target.value,
                    universityUrl: selectedUniversity ? selectedUniversity.url[0] || '' : '', // Use first URL or empty string
                  });
                }}
                disabled={isLoading}
              />
              
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
                placeholder="University URL"
                value={newEducation.universityUrl}
                onChange={(e) => setNewEducation({ 
                  ...newEducation, 
                  universityUrl: e.target.value 
                })}
              />
              
              <datalist id="universities">
                {universities.map((university: { name: string, url: string[] }) => (
                  <option 
                    key={university.name} 
                    value={university.name}
                    data-url={university.url[0]}
                  />
                ))}
              </datalist>

              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>

            <input
              type="number"
              className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
              placeholder="CGPA"
              step="0.01"
              min="0"
              max="4"
              value={newEducation.cgpa}
              onChange={(e) => setNewEducation({ ...newEducation, cgpa: e.target.value })}
            />

            <select
              className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
              value={newEducation.degree}
              onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
            >
              <option value="" disabled>Select Degree</option>
              <option value="Associate Degree">Associate Degree</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="Doctoral Degree">Doctoral Degree</option>
            </select>

            <input
              type="text"
              className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
              placeholder="Major"
              value={newEducation.major}
              onChange={(e) => setNewEducation({ ...newEducation, major: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[#a0aec0] text-sm mb-2">Start Date</div>
                <select
                  className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm"
                  value={newEducation.startDate.month}
                  onChange={(e) => setNewEducation({
                    ...newEducation,
                    startDate: { ...newEducation.startDate, month: e.target.value }
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
                  value={newEducation.startDate.year}
                  onChange={(e) => setNewEducation({
                    ...newEducation,
                    startDate: { ...newEducation.startDate, year: e.target.value }
                  })}
                >
                  <option value="" disabled>Select Year</option>
                  {graduationYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {!newEducation.isPresent && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[#a0aec0] text-sm mb-2">End Date</div>
                  <select
                    className="w-full p-3 rounded-lg bg-[#2d3748] border border-[#4a5568] text-white text-sm"
                    value={newEducation.endDate.month}
                    onChange={(e) => setNewEducation({
                      ...newEducation,
                      endDate: { ...newEducation.endDate, month: e.target.value }
                    })}
                    disabled={newEducation.isPresent}
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
                    value={newEducation.endDate.year}
                    onChange={(e) => setNewEducation({
                      ...newEducation,
                      endDate: { ...newEducation.endDate, year: e.target.value }
                    })}
                    disabled={newEducation.isPresent}
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
                ${newEducation.isPresent ? 'bg-gradient-to-r from-green-600 to-green-400' : 'bg-gradient-to-r from-red-600 to-red-400'} text-white`}
              onClick={handleTogglePresent}
            >
              <FontAwesomeIcon icon={newEducation.isPresent ? faToggleOn : faToggleOff} />
              {newEducation.isPresent ? "Currently Studying" : "Completed"}
            </button>

            <div className="flex flex-wrap gap-3">
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
          Add Education
        </button>
      )}
    </div>
  );
};


export default EducationSection;
