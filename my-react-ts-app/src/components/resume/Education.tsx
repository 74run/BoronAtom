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

interface Education {
  _id: string;
  university: string;
  cgpa: string;
  degree: string;
  major: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  includeInResume: boolean;
  isEditing?: boolean;
  isPresent?: boolean; // Add this field to track if the end date is 'Present'
}

interface EducationProps {
  Educations: Education[];
  UserDetail: UserDetails | null;
  onEdit: (id: string, data: { university: string; cgpa: string; degree: string; major: string; startDate: { month: string; year: string }; endDate: { month: string; year: string }; includeInResume: boolean, isPresent: boolean }) => void;
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
    includeInResume: boolean;
    isPresent: boolean;
  } | null>(null);
  const [educations, setEducations] = useState<Education[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [filteredUniversities, setFilteredUniversities] = useState<string[]>([]);
  const [newEducation, setNewEducation] = useState<Education>({
    _id: '',
    university: '',
    cgpa: '',
    degree: '',
    major: '',
    startDate: { month: '', year: '' },
    endDate: { month: '', year: '' },
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
    includeInResume: boolean,
    isPresent: boolean
  ) => {
    setEditData({ id, university, cgpa, degree, major, startDate, endDate, includeInResume, isPresent });
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
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/universities`);
        setFilteredUniversities(response.data.universities);
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };
    fetchData();
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
    <div className="education-container">
      <style>
        {`
          .education-container {
            background-color: rgba(0, 3, 8, 0.45);
            border-radius: 12px;
            padding: 1.5rem;
            color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .section-header {
            color: #63b3ed;
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
          }

          .education-card {
            background-color: #1a202c;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            border: 1px solid #4a5568;
            transition: all 0.2s ease;
          }

          .education-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .school-name {
            color: #63b3ed;
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
          }

          .education-info {
            color: #a0aec0;
            font-size: 0.75rem;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
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

          .select-field {
            padding: 0.75rem;
            border-radius: 6px;
            background-color: #2d3748;
            border: 1px solid #4a5568;
            color: white;
            font-size: 0.75rem;
            width: 100%;
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
            font-weight: 500;
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

          .btn-success {
            background: linear-gradient(to right, #38a169, #68d391);
            color: white;
          }

          .btn-danger {
            background: linear-gradient(to right, #e53e3e, #fc8181);
            color: white;
          }

          .btn-secondary {
            background-color: #4a5568;
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
            transition: all 0.2s ease;
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
          }

          .university-search {
            position: relative;
          }

          .university-list {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: #2d3748;
            border: 1px solid #4a5568;
            border-radius: 6px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 10;
          }

          .university-option {
            padding: 0.75rem;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }

          .university-option:hover {
            background-color: #4a5568;
          }
        `}
      </style>

      <h2 className="section-header">Education</h2>

      {educations.map((education) => (
        <div key={education._id} className="education-card">
          {editData && editData.id === education._id ? (
            <div className="form-group">
              <div className="university-search">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Search University"
                  value={editData.university}
                  onChange={(e) => setEditData({ ...editData, university: e.target.value })}
                />
                <datalist id="universities">
                  {filteredUniversities.map((name, index) => (
                    <option key={index} value={name} />
                  ))}
                </datalist>
              </div>

              <input
                type="number"
                className="input-field"
                placeholder="CGPA"
                step="0.01"
                min="0"
                max="4"
                value={editData.cgpa}
                onChange={(e) => setEditData({ ...editData, cgpa: e.target.value })}
              />

              <select
                className="select-field"
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
                className="input-field"
                placeholder="Major"
                value={editData.major}
                onChange={(e) => setEditData({ ...editData, major: e.target.value })}
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
                {editData.isPresent ? "Currently Studying" : "Completed"}
              </button>

              <div className="btn-group">
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
              </div>
            </div>
          ) : (
            <>
              <h3 className="school-name">{education.university}</h3>
              <div className="education-info">
                <strong>Degree:</strong> {education.degree} in {education.major}
              </div>
              <div className="education-info">
                <strong>GPA:</strong> {education.cgpa}
              </div>
              <div className="education-info">
                <strong>Duration:</strong> {education.startDate.month} {education.startDate.year} - 
                {education.isPresent ? " Present" : ` ${education.endDate.month} ${education.endDate.year}`}
              </div>

              <div className="btn-group">
                <button 
                  className="btn btn-primary"
                  onClick={() =>
                    handleEditClick(
                      education._id,
                      education.university,
                      education.cgpa,
                      education.degree,
                      education.major,
                      education.startDate,
                      education.endDate,
                      education.includeInResume,
                      education.isPresent || false
                    )}
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Edit
                </button>
                
                <button 
                  className={`include-toggle ${education.includeInResume ? 'included' : 'excluded'}`}
                  onClick={() => handleToggleInclude(education._id)}
                >
                  <FontAwesomeIcon icon={education.includeInResume ? faToggleOn : faToggleOff} />
                  {education.includeInResume ? "Included" : "Excluded"}
                </button>

                <button 
                  className="btn btn-danger"
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
        <div className="education-card">
          <div className="form-group">
            <div className="university-search">
              <input
                type="text"
                className="input-field"
                placeholder="Search University"
                value={newEducation.university}
                onChange={(e) => setNewEducation({ ...newEducation, university: e.target.value })}
              />
              <datalist id="universities">
                {filteredUniversities.map((name, index) => (
                  <option key={index} value={name} />
                ))}
              </datalist>
            </div>

            <input
              type="number"
              className="input-field"
              placeholder="CGPA"
              step="0.01"
              min="0"
              max="4"
              value={newEducation.cgpa}
              onChange={(e) => setNewEducation({ ...newEducation, cgpa: e.target.value })}
            />

            <select
              className="select-field"
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
              className="input-field"
              placeholder="Major"
              value={newEducation.major}
              onChange={(e) => setNewEducation({ ...newEducation, major: e.target.value })}
            />

            <div className="date-grid">
            <div>
                <div className="date-label">Start Date</div>
                <select
                  className="select-field"
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
                <div className="date-label">&nbsp;</div>
                <select
                  className="select-field"
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
              <div className="date-grid">
                <div>
                  <div className="date-label">End Date</div>
                  <select
                    className="select-field"
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
                  <div className="date-label">&nbsp;</div>
                  <select
                    className="select-field"
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
              className={`present-toggle ${newEducation.isPresent ? 'active' : 'inactive'}`}
              onClick={handleTogglePresent}
            >
              <FontAwesomeIcon icon={newEducation.isPresent ? faToggleOn : faToggleOff} />
              {newEducation.isPresent ? "Currently Studying" : "Completed"}
            </button>

            <div className="btn-group">
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
        </div>
      )}

      {!isAdding && (
        <button 
          className="btn btn-primary"
          onClick={handleAddClick}
          style={{ 
            width: '100%',
            marginTop: educations.length > 0 ? '1rem' : '0'
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Education
        </button>
      )}
    </div>
  );
};


export default EducationSection;
