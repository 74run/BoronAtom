import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faSave, faTrash, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';

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
}

interface EducationProps {
  Educations: Education[];
  UserDetail: UserDetails | null;
  onEdit: (id: string, data: { university: string; cgpa: string; degree: string; major: string; startDate: { month: string; year: string }; endDate: { month: string; year: string }; includeInResume: boolean }) => void;
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
    includeInResume: boolean
  ) => {
    setEditData({ id, university, cgpa, degree, major, startDate, endDate, includeInResume });
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
        includeInResume: educationToUpdate.includeInResume
      });
    }
  };

  const handleSaveClick = () => {
    // Form validation check
    if (!newEducation.university || !newEducation.cgpa || !newEducation.degree || !newEducation.major || !newEducation.startDate.month || !newEducation.startDate.year || !newEducation.endDate.month || !newEducation.endDate.year) {
      console.error('Please fill in all required fields');
      return;
    }

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
    });
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
        Education
      </h4>
      {educations.map((education) => (
        <div
          key={education._id}
          className="mb-3"
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '1.5rem',
            backgroundColor: '#f8f9fa',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}
        >
          {editData && editData.id === education._id ? (
            <div>
              <input
                list="universities"
                type="text"
                className="form-control mb-3"
                placeholder="University Name"
                value={editData.university}
                onChange={(e) =>
                  setEditData({ ...editData, university: e.target.value })
                }
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '12px',
                  fontSize: '1rem',
                  marginBottom: '1rem',
                }}
              />
              <datalist id="universities" style={{ background: 'white', width: '100%', color: 'black' }}>
                {filteredUniversities.map((name, index) => (
                  <option key={index} value={name} />
                ))}
              </datalist>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="CGPA"
                value={editData.cgpa}
                onChange={(e) => setEditData({ ...editData, cgpa: e.target.value })}
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '12px',
                  fontSize: '1rem',
                  marginBottom: '1rem',
                }}
              />
              <select
                className="form-control mb-3"
                value={editData.degree}
                onChange={(e) =>
                  setEditData({ ...editData, degree: e.target.value })
                }
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '12px',
                  fontSize: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <option value="Associate Degree">Associate Degree</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Doctoral Degree">Doctoral Degree</option>
              </select>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Major"
                value={editData.major}
                onChange={(e) => setEditData({ ...editData, major: e.target.value })}
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '12px',
                  fontSize: '1rem',
                  marginBottom: '1rem',
                }}
              />
              <div className="date-dropdowns mb-3">
                <label>Start Date:</label>
                <div className="flex-container">
                  <select
                    className="form-control mb-2"
                    value={editData.startDate.month}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        startDate: {
                          ...editData.startDate,
                          month: e.target.value,
                        },
                      })
                    }
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      padding: '10px',
                      marginRight: '0.5rem',
                    }}
                  >
                    {!editData.startDate.month && (
                      <option value="" disabled>
                        Select Month
                      </option>
                    )}
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-control mb-2"
                    value={editData.startDate.year}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        startDate: {
                          ...editData.startDate,
                          year: e.target.value,
                        },
                      })
                    }
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      padding: '10px',
                    }}
                  >
                    {!editData.startDate.year && (
                      <option value="" disabled>
                        Select Year
                      </option>
                    )}
                    {graduationYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="date-dropdowns mb-3">
                <label>End Date:</label>
                <div className="flex-container">
                  <select
                    className="form-control mb-2"
                    value={editData.endDate.month}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        endDate: {
                          ...editData.endDate,
                          month: e.target.value,
                        },
                      })
                    }
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      padding: '10px',
                      marginRight: '0.5rem',
                    }}
                  >
                    {!editData.endDate.month && (
                      <option value="" disabled>
                        Select Month
                      </option>
                    )}
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-control mb-2"
                    value={editData.endDate.year}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        endDate: {
                          ...editData.endDate,
                          year: e.target.value,
                        },
                      })
                    }
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      padding: '10px',
                    }}
                  >
                    {!editData.endDate.year && (
                      <option value="" disabled>
                        Select Year
                      </option>
                    )}
                    {graduationYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                className="btn btn-success me-2"
                onClick={handleUpdate}
                style={{
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '1rem',
                }}
              >
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Update
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCancelEdit}
                style={{
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '1rem',
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: '#ffffff',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow =
                  '0 10px 30px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              <h5
                style={{
                  color: '#333',
                  fontFamily: "'Roboto Slab', serif",
                  fontSize: '1.2rem',
                  marginBottom: '0.5rem',
                  fontWeight: 700,
                }}
              >
                {education.university}
              </h5>
              <p
                style={{
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#555',
                }}
              >
                <strong>GPA:</strong> {education.cgpa}
              </p>
              <p
                style={{
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#555',
                }}
              >
                <strong>Degree:</strong> {education.degree}
              </p>
              <p
                style={{
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#555',
                }}
              >
                <strong>Major:</strong> {education.major}
              </p>
              <p
                style={{
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#555',
                }}
              >
                <strong>Start Date:</strong>{' '}
                {education.startDate &&
                  `${education.startDate.month} ${education.startDate.year}`}
              </p>
              <p
                style={{
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#555',
                }}
              >
                <strong>End Date:</strong>{' '}
                {education.endDate &&
                  `${education.endDate.month} ${education.endDate.year}`}
              </p>
              <div>
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() =>
                    handleEditClick(
                      education._id,
                      education.university,
                      education.cgpa,
                      education.degree,
                      education.major,
                      education.startDate,
                      education.endDate,
                      education.includeInResume
                    )
                  }
                  style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: '1px solid #007bff',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                  Edit
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleDelete(education._id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    padding: '0.3rem 0.8rem',
                    border: '1px solid #dc3545',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                  Delete
                </button>
                <button
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => handleToggleInclude(education._id)}
                  style={{
                    padding: '0.3rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    borderColor: education.includeInResume ? '#28a745' : '#dc3545',
                    color: education.includeInResume ? '#28a745' : '#dc3545',
                  }}
                >
                  <FontAwesomeIcon
                    icon={education.includeInResume ? faToggleOn : faToggleOff}
                    className="me-2"
                  />
                  {education.includeInResume ? 'Included' : 'Excluded'}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      {isAdding && (
        <div>
          <input
            list="universities"
            type="text"
            className="form-control mb-3"
            placeholder="Search University"
            onChange={(e) =>
              setNewEducation({ ...newEducation, university: e.target.value })
            }
            value={newEducation.university}
            style={{
              borderRadius: '8px',
              border: '1px solid #ddd',
              padding: '12px',
              fontSize: '1rem',
              marginBottom: '1rem',
            }}
          />
          <datalist
            id="universities"
            style={{ background: 'white', width: '100%', color: 'black' }}
          >
            {filteredUniversities.map((name, index) => (
              <option key={index} value={name} />
            ))}
          </datalist>
          <select
            className="form-control mb-3"
            value={newEducation.degree}
            onChange={(e) =>
              setNewEducation({ ...newEducation, degree: e.target.value })
            }
            style={{
              borderRadius: '8px',
              border: '1px solid #ddd',
              padding: '12px',
              fontSize: '1rem',
              marginBottom: '1rem',
            }}
          >
            {!newEducation.degree && (
              <option value="" disabled>
                Select Degree
              </option>
            )}
            <option value="Associate Degree">Associate Degree</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="Doctoral Degree">Doctoral Degree</option>
          </select>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Major"
            value={newEducation.major}
            onChange={(e) =>
              setNewEducation({ ...newEducation, major: e.target.value })
            }
            style={{
              borderRadius: '8px',
              border: '1px solid #ddd',
              padding: '12px',
              fontSize: '1rem',
              marginBottom: '1rem',
            }}
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="CGPA"
            value={newEducation.cgpa}
            onChange={(e) =>
              setNewEducation({ ...newEducation, cgpa: e.target.value })
            }
            style={{
              borderRadius: '8px',
              border: '1px solid #ddd',
              padding: '12px',
              fontSize: '1rem',
              marginBottom: '1rem',
            }}
          />
          <div className="date-dropdowns mb-3">
            <label>Start Date:</label>
            <div className="flex-container">
              <select
                className="form-control mb-2"
                value={newEducation.startDate.month}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    startDate: {
                      ...newEducation.startDate,
                      month: e.target.value,
                    },
                  })
                }
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '10px',
                  marginRight: '0.5rem',
                }}
              >
                {!newEducation.startDate.month && (
                  <option value="" disabled>
                    Select Month
                  </option>
                )}
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className="form-control mb-2"
                value={newEducation.startDate.year}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    startDate: {
                      ...newEducation.startDate,
                      year: e.target.value,
                    },
                  })
                }
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '10px',
                }}
              >
                {!newEducation.startDate.year && (
                  <option value="" disabled>
                    Select Year
                  </option>
                )}
                {graduationYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="date-dropdowns mb-3">
            <label>End Date:</label>
            <div className="flex-container">
              <select
                className="form-control mb-2"
                value={newEducation.endDate.month}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    endDate: {
                      ...newEducation.endDate,
                      month: e.target.value,
                    },
                  })
                }
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '10px',
                  marginRight: '0.5rem',
                }}
              >
                {!newEducation.endDate.month && (
                  <option value="" disabled>
                    Select Month
                  </option>
                )}
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className="form-control mb-2"
                value={newEducation.endDate.year}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    endDate: {
                      ...newEducation.endDate,
                      year: e.target.value,
                    },
                  })
                }
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '10px',
                }}
              >
                {!newEducation.endDate.year && (
                  <option value="" disabled>
                    Select Year
                  </option>
                )}
                {graduationYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="btn btn-success"
            onClick={handleSaveClick}
            style={{
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '1rem',
            }}
          >
            <FontAwesomeIcon icon={faSave} className="me-2" />
            Save
          </button>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => setIsAdding(false)}
            style={{
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '1rem',
            }}
          >
            Cancel
          </button>
        </div>
      )}
      {!isAdding && (
        <button
          className="btn btn-outline-primary"
          onClick={handleAddClick}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: '1px solid #007bff',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '1rem',
            transition: 'all 0.3s',
          }}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Education
        </button>
      )}
    </div>
  );
};

export default EducationSection;
