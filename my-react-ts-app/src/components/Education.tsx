import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faSave, faTrash, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
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
    <div
      style={{
        border: "none",
        borderRadius: "0px",
        padding: "24px",
        marginBottom: "30px",
        fontFamily: "'Roboto', sans-serif",
        color: "#f5f5f5",
        backgroundColor: "#1c1c1e",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
      }}
    >
      <h4
        style={{
          color: "#00d084",
          textAlign: "left",
          marginBottom: "1.5rem",
          fontFamily: "'Roboto Slab', serif",
          fontWeight: 700,
          fontSize: "1.6rem",
        }}
      >
        Education
      </h4>

      {educations.map((education) => (
        <div
          key={education._id}
          className="education-card"
          style={{
            border: "1px solid #333",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "20px",
            backgroundColor: "#1b1b2f",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.3s, box-shadow 0.3s",
            cursor: "pointer",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
          }}
        >
          {editData && editData.id === education._id ? (
            <div
            style={{
              border: "1px solid #444",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "2rem",
              backgroundColor: "#2d2d30",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
          
          
            {/* University Input */}
            <CustomUniversityDropdown
              universities={[]} // Pass your university list here
              value={editData.university}
              onChange={(value) => setEditData({ ...editData, university: value })}
            />
          
            {/* CGPA Input */}
            <input
              type="text"
              placeholder="CGPA"
              value={editData.cgpa}
              onChange={(e) => setEditData({ ...editData, cgpa: e.target.value })}
              style={{
                borderRadius: "8px",
                border: "1px solid #555",
                padding: "14px",
                fontSize: "1rem",
                marginBottom: "1.5rem",
                width: "100%",
                backgroundColor: "#1c1c1e",
                color: "#f5f5f5",
              }}
            />
          
            {/* Degree Dropdown */}
            <select
              value={editData.degree}
              onChange={(e) => setEditData({ ...editData, degree: e.target.value })}
              style={{
                borderRadius: "8px",
                border: "1px solid #555",
                padding: "14px",
                fontSize: "1rem",
                marginBottom: "1.5rem",
                width: "100%",
                backgroundColor: "#1c1c1e",
                color: "#f5f5f5",
              }}
            >
              <option value="Associate Degree">Associate Degree</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="Doctoral Degree">Doctoral Degree</option>
            </select>
          
            {/* Major Input */}
            <input
              type="text"
              placeholder="Major"
              value={editData.major}
              onChange={(e) => setEditData({ ...editData, major: e.target.value })}
              style={{
                borderRadius: "8px",
                border: "1px solid #555",
                padding: "14px",
                fontSize: "1rem",
                marginBottom: "1.5rem",
                width: "100%",
                backgroundColor: "#1c1c1e",
                color: "#f5f5f5",
              }}
            />
          
            {/* Start Date Section */}
            <h6 style={{ color: "#f5f5f5", marginBottom: "1rem", fontWeight: "bold" }}>
              Start Date
            </h6>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginBottom: "1.5rem",
              }}
            >
              <select
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
                  borderRadius: "8px",
                  border: "1px solid #555",
                  padding: "10px",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                  fontSize: "1rem",
                }}
              >
                <option value="" disabled>
                  Select Month
                </option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
          
              <select
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
                  borderRadius: "8px",
                  border: "1px solid #555",
                  padding: "10px",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                  fontSize: "1rem",
                }}
              >
                <option value="" disabled>
                  Select Year
                </option>
                {graduationYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          
            {/* End Date Section */}
            <h6 style={{ color: "#f5f5f5", marginBottom: "1rem", fontWeight: "bold" }}>
              End Date
            </h6>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginBottom: "1.5rem",
              }}
            >
              <select
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
                disabled={editData.isPresent}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #555",
                  padding: "10px",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                  fontSize: "1rem",
                }}
              >
                <option value="" disabled>
                  Select Month
                </option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
          
              <select
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
                disabled={editData.isPresent}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #555",
                  padding: "10px",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                  fontSize: "1rem",
                }}
              >
                <option value="" disabled>
                  Select Year
                </option>
                {graduationYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          
            {/* Toggle Present Button */}
            <button
              onClick={handleTogglePresent}
              style={{
                backgroundColor: editData.isPresent ? "#28a745" : "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "1rem",
                width: "100%",
                marginBottom: "1.5rem",
              }}
            >
              <FontAwesomeIcon
                icon={editData.isPresent ? faToggleOn : faToggleOff}
                style={{ marginRight: "8px" }}
              />
              {editData.isPresent ? "Present" : "Not Present"}
            </button>
          
            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                onClick={handleUpdate}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  flex: "1",
                  fontSize: "1rem",
                }}
              >
                <FontAwesomeIcon icon={faSave} /> Update
              </button>
          
              <button
                onClick={handleCancelEdit}
                style={{
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  flex: "1",
                  fontSize: "1rem",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
          
          ) : (
            <div>
              
              <h5
                style={{
                  color: "#00d084",
                  fontFamily: "'Roboto Slab', serif",
                  fontSize: "1.4rem",
                  marginBottom: "0.5rem",
                  fontWeight: 700,
                }}
              >
                {education.university}
              </h5>
              <p style={{ fontSize: "0.9rem", color: "#d1d1d1" }}>
                <strong>GPA:</strong> {education.cgpa}
              </p>
              <p style={{ fontSize: "0.9rem", color: "#d1d1d1" }}>
                <strong>Degree:</strong> {education.degree}
              </p>
              <p style={{ fontSize: "0.9rem", color: "#d1d1d1" }}>
                <strong>Major:</strong> {education.major}
              </p>
              <p style={{ fontSize: "0.9rem", color: "#d1d1d1" }}>
                <strong>Start Date:</strong> {education.startDate.month} {education.startDate.year}
              </p>
              <p style={{ fontSize: "0.9rem", color: "#d1d1d1" }}>
                <strong>End Date:</strong>{" "}
                {education.isPresent ? "Present" : `${education.endDate.month} ${education.endDate.year}`}
              </p>
              <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  flexWrap: "wrap",
                  padding: '10px'
                }}>
              <button
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
    )
  }
  style={{
    padding: "0.7rem 1.5rem",
    background: "linear-gradient(to right, #007bff, #4facfe)", // Blue gradient
    color: "#fff",
    border: "none",
    borderRadius: "25px", // Rounded corners
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "1rem",
    transition: "0.3s ease", // Smooth hover transition
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // Subtle shadow
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
>
  <FontAwesomeIcon icon={faEdit} style={{ marginRight: "8px" }} />
  Edit
</button>
<button
  onClick={() => handleDelete(education._id)}
  style={{
    padding: "0.7rem 1.5rem",
    background: "linear-gradient(to right, #ff4d4d, #ff8080)", // Red gradient
    color: "#fff",
    border: "none",
    borderRadius: "25px", // Rounded corners
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "1rem",
    transition: "0.3s ease", // Smooth hover transition
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // Subtle shadow
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
>
  <FontAwesomeIcon icon={faTrash} style={{ marginRight: "8px" }} />
  Delete
</button>
<button
  onClick={() => handleToggleInclude(education._id)}
  style={{
    padding: "0.7rem 1.5rem",
    background: education.includeInResume
      ? "linear-gradient(to right, #28a745, #8be78b)" // Green gradient for Included
      : "linear-gradient(to right, #dc3545, #ff7b7b)", // Red gradient for Excluded
    color: "#fff",
    border: "none",
    borderRadius: "25px", // Rounded corners
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "1rem",
    transition: "0.3s ease", // Smooth hover transition
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // Subtle shadow
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
>
  <FontAwesomeIcon
    icon={education.includeInResume ? faToggleOn : faToggleOff}
    style={{ marginRight: "8px" }}
  />
  {education.includeInResume ? "Included" : "Excluded"}
</button>

              </div>
            </div>
          )}
        </div>
      ))}

{isAdding && (
        <div
        style={{
          border: "1px solid #444",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "2rem",
          backgroundColor: "#2d2d30",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
  
      
        {/* University Input with Datalist */}
        <input
          list="universities"
          type="text"
          placeholder="Search University"
          value={newEducation.university}
          onChange={(e) => setNewEducation({ ...newEducation, university: e.target.value })}
          style={{
            borderRadius: "8px",
            border: "1px solid #555",
            padding: "14px",
            fontSize: "1rem",
            marginBottom: "1.5rem",
            width: "100%",
            backgroundColor: "#1c1c1e",
            color: "#f5f5f5",
          }}
        />
        <datalist id="universities" style={{ background: "#fff", color: "#000" }}>
          {filteredUniversities.map((name, index) => (
            <option key={index} value={name} />
          ))}
        </datalist>
      
        {/* CGPA Input */}
        <input
          type="number"
          step="0.01"
          min="0"
          max="4"
          placeholder="CGPA"
          value={newEducation.cgpa}
          onChange={(e) => setNewEducation({ ...newEducation, cgpa: e.target.value })}
          style={{
            borderRadius: "8px",
            border: "1px solid #555",
            padding: "14px",
            fontSize: "1rem",
            marginBottom: "1.5rem",
            width: "100%",
            backgroundColor: "#1c1c1e",
            color: "#f5f5f5",
          }}
        />
      
        {/* Degree Dropdown */}
        <select
          value={newEducation.degree}
          onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
          style={{
            borderRadius: "8px",
            border: "1px solid #555",
            padding: "14px",
            fontSize: "1rem",
            marginBottom: "1.5rem",
            width: "100%",
            backgroundColor: "#1c1c1e",
            color: "#f5f5f5",
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
      
        {/* Major Input */}
        <input
          type="text"
          placeholder="Major"
          value={newEducation.major}
          onChange={(e) => setNewEducation({ ...newEducation, major: e.target.value })}
          style={{
            borderRadius: "8px",
            border: "1px solid #555",
            padding: "14px",
            fontSize: "1rem",
            marginBottom: "1.5rem",
            width: "100%",
            backgroundColor: "#1c1c1e",
            color: "#f5f5f5",
          }}
        />
      
        {/* Start Date Section */}
        <h6 style={{ color: "#f5f5f5", marginBottom: "1rem", fontWeight: "bold" }}>
          Start Date
        </h6>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            marginBottom: "1.5rem",
          }}
        >
          <select
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
              borderRadius: "8px",
              border: "1px solid #555",
              padding: "10px",
              backgroundColor: "#1c1c1e",
              color: "#f5f5f5",
              fontSize: "1rem",
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
              borderRadius: "8px",
              border: "1px solid #555",
              padding: "10px",
              backgroundColor: "#1c1c1e",
              color: "#f5f5f5",
              fontSize: "1rem",
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
      
        {/* End Date Section */}
        <h6 style={{ color: "#f5f5f5", marginBottom: "1rem", fontWeight: "bold" }}>
          End Date
        </h6>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            marginBottom: "1.5rem",
          }}
        >
          <select
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
            disabled={newEducation.isPresent}
            style={{
              borderRadius: "8px",
              border: "1px solid #555",
              padding: "10px",
              backgroundColor: "#1c1c1e",
              color: "#f5f5f5",
              fontSize: "1rem",
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
            disabled={newEducation.isPresent}
            style={{
              borderRadius: "8px",
              border: "1px solid #555",
              padding: "10px",
              backgroundColor: "#1c1c1e",
              color: "#f5f5f5",
              fontSize: "1rem",
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
      
        {/* Toggle Present Button */}
        <button
          onClick={handleTogglePresent}
          style={{
            backgroundColor: newEducation.isPresent ? "#28a745" : "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontSize: "1rem",
            width: "100%",
            marginBottom: "1.5rem",
          }}
        >
          <FontAwesomeIcon
            icon={newEducation.isPresent ? faToggleOn : faToggleOff}
            style={{ marginRight: "8px" }}
          />
          {newEducation.isPresent ? "Present" : "Not Present"}
        </button>
      
        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleSaveClick}
            style={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              flex: "1",
              fontSize: "1rem",
            }}
          >
            Save
          </button>
      
          <button
            onClick={() => setIsAdding(false)}
            style={{
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              flex: "1",
              fontSize: "1rem",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      
      )}

      {!isAdding && (
        <button
          onClick={handleAddClick}
          style={{
            background: "linear-gradient(to right, #007bff, #4facfe)", // Blue gradient
            color: "#fff",
            border: "none",
            borderRadius: "10px", // Slightly rounded corners
            padding: "0.75rem 1.5rem", // Balanced padding
            width: "100%", // Full-width button
            marginTop: "20px", // Space above the button
            fontSize: "1rem", // Adjusted font size for readability
            fontWeight: "600", // Bold text for prominence
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // Center icon and text
            gap: "10px", // Space between the icon and text
            cursor: "pointer", // Pointer on hover
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
            transition: "all 0.3s ease", // Smooth hover effect
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Education
        </button>
      )}
    </div>
  );
  
};


export default EducationSection;
