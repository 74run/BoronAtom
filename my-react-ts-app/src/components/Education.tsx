import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
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
  isEditing?: boolean;
}

interface EducationProps {
  Educations: Education[];
  UserDetail: UserDetails | null;
  onEdit: (id: string, data: {university: string; cgpa: string; degree: string; major: string; startDate: { month: string; year: string }; endDate: { month: string; year: string }})=> void;
  onDelete :(id: string)=> void;
  
}


const EducationSection: React.FC<EducationProps>= ({Educations, UserDetail, onEdit, onDelete}) => {
  const [editData, setEditData] = useState<{id: string; university: string; cgpa: string;  degree: string; major: string; startDate: { month: string; year: string }; endDate: { month: string; year: string }} | null>(null);
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
  });
  const { userID } = useParams();

  const [isAdding, setIsAdding] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const graduationYears = Array.from({ length: 57 }, (_, index) => (new Date()).getFullYear() + 7 - index);


  useEffect(() => {
    // Make an HTTP request to fetch user details based on the user ID
    axios.get(`http://localhost:3001/api/userprofile/details/${userID}`)
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
  fetch(`http://localhost:3001/api/userprofile/${userID}/education`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch educations');
      }
      return response.json(); // Parse the response JSON
    })
    .then(data => {
      // console.log("Project data:",data)
      setEducations(data); // Set projects state with the fetched data
    })
    .catch(error => {
      console.error('Error fetching projects:', error);
    });
};








  const handleEditClick = (    id: string,
    university: string,
    cgpa: string,
    degree: string,
    major: string,
    startDate: { month: string; year: string },
    endDate: { month: string; year: string }) => {
    setEditData({  id, university, cgpa, degree, major, startDate, endDate });
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
            }
          : education
      );
  
      setEducations(updatedItems);
  
      // Update local storage
      // localStorage.setItem(`educations_${userID}`, JSON.stringify(updatedItems));
  
      setEditData(null);
    }
  };
  
  const handleDelete = (id: string) => {
    fetch(`http://localhost:3001/api/userprofile/${userID}/education/${id}`, {
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
  
        // Update local storage
        // localStorage.setItem(`educations_${userID}`, JSON.stringify(updatedEducations));
  
        // Reset the editData state
        setEditData(null);
      })
      .catch((error) => {
        console.error('Error deleting education:', error.message);
      });
  };
  
  // Rest of the code remains unchanged
  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/universities');
        // setUniversities(response.data.universities);
        setFilteredUniversities(response.data.universities);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    
  }, []);



  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // const storageKey = `educations_${userID}`;
  
  //       // Check if data exists in local storage
  //       // const storedData = localStorage.getItem(storageKey);
  //       if (storedData) {
  //         setEducations(JSON.parse(storedData));
  //       } else {
  //         // If not, fetch data from the server
  //         const response = await axios.get(`http://localhost:3001/api/userprofile/${userID}/educations`);
  //         const fetchedEducations = response.data.educations;
  
  //         // Update state
  //         setEducations(fetchedEducations);
  
  //         // Store the fetched data in local storage
  //         // localStorage.setItem(storageKey, JSON.stringify(fetchedEducations));
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  
  //   fetchData();
  // }, [userID]);
  

  // useEffect(() => {
  //   fetch('/api/items')
  //     .then((res) => res.json())
  //     .then((data) => setEducations(data));
  // }, []);




  const handleSaveClick = () => {
    // Form validation check
    if (!newEducation.university || !newEducation.cgpa || !newEducation.degree || !newEducation.major || !newEducation.startDate.month || !newEducation.startDate.year || !newEducation.endDate.month || !newEducation.endDate.year) {
      console.error('Please fill in all required fields');
      // You can display an error message to the user or handle it as appropriate
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
  
    // const storageKey = `educations_${userID}`;

  axios.post(`http://localhost:3001/api/userprofile/${userID}/education`, formattedEducation)
    .then((response) => {
      const newEducationFromServer = response.data.education;
      const newEduData = newEducationFromServer[newEducationFromServer.length - 1];

      // Update state
      setEducations([...educations, newEduData]);

      // Update local storage
      const updatedEducations = [...educations, newEduData];
      // localStorage.setItem(storageKey, JSON.stringify(updatedEducations));

      setNewEducation({
        _id: '',
        university: '',
        cgpa: '',
        degree: '',
        major: '',
        startDate: { month: '', year: '' },
        endDate: { month: '', year: '' },
      });

      setIsAdding(false);
    })
    .catch((error) => {
      console.error('Error saving education:', error.message);
      // Handle errors by displaying an error message to the user or logging it as appropriate
    });
};
  


  const handleAddClick = () => {
    setNewEducation({     _id: '',
    university: '',
    cgpa: '',
    degree: '',
    major: '',
    startDate: { month: '', year: '' },
    endDate: { month: '', year: '' }, });
    setIsAdding(true);
    // setNewEducationSearchTerm('');
  };

  return (
    <div 
      
      style={{
        border: '2px solid #4CAF50',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 0 200px rgba(10, 0, 0, 0.5)'
      }}
    >
      <h2 style={{ color: '#4CAF50', textAlign: 'left', marginBottom: '1rem', fontFamily: 'Timesquare' }}><b>Education</b></h2>
      {educations.map(education => (
        <div key={education._id} className="mb-3" style={{border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '1rem'}}>
          {editData && editData.id === education._id ? (
            <div className="editing-form">
              <input
                list="universities"
                type="text"
                className="form-control mb-2"
                placeholder="University Name"
                value={editData.university}
                onChange={(e) => setEditData({ ...editData, university: e.target.value })}
                style={{borderRadius: '4px', border: '1px solid #ccc'}}
              />
              <datalist id="universities" style={{ background: 'white', width: '100%', color:'black' }}>
                {filteredUniversities.map((name, index) => (
                  <option key={index} value={name} />
                ))}
              </datalist>
              <input
        type="text"
        className="form-control mb-2"
        placeholder="CGPA"
        value={editData.cgpa}
        onChange={(e) => setEditData({ ...editData, cgpa: e.target.value })}
        style={{borderRadius: '4px', border: '1px solid #ccc'}}
    />
              <select
                className="form-control mb-2"
                value={editData.degree}
                onChange={(e) => setEditData({ ...editData, degree: e.target.value })}
                style={{borderRadius: '4px', border: '1px solid #ccc'}}
              >
                <option value="Associate Degree">Associate Degree</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Doctoral Degree">Doctoral Degree</option>
              </select>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Major"
                value={editData.major}
                onChange={(e) => setEditData({ ...editData, major: e.target.value })}
                style={{borderRadius: '4px', border: '1px solid #ccc'}}
              />
              
              <div className="date-dropdowns">
                <label>Start Date:</label>
                <div className="flex-container">
                  <select
                    className="form-control mb-2"
                    value={editData.startDate.month}
                    onChange={(e) => setEditData({ ...editData, startDate: { ...editData.startDate, month: e.target.value } })}
                    style={{borderRadius: '4px', border: '1px solid #ccc', marginRight: '0.5rem'}}
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
                    onChange={(e) => setEditData({ ...editData, startDate: { ...editData.startDate, year: e.target.value } })}
                    style={{borderRadius: '4px', border: '1px solid #ccc'}}
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
              <div className="date-dropdowns">
                <label>End Date:</label>
                <div className="flex-container">
                  <select
                    className="form-control mb-2"
                    value={editData.endDate.month}
                    onChange={(e) => setEditData({ ...editData, endDate: { ...editData.endDate, month: e.target.value } })}
                    style={{borderRadius: '4px', border: '1px solid #ccc', marginRight: '0.5rem'}}
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
                    value={editData.endDate.year}
                    onChange={(e) => setEditData({ ...editData, endDate: { ...editData.endDate, year: e.target.value } })}
                    style={{borderRadius: '4px', border: '1px solid #ccc'}}
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
                className="btn btn-primary me-2"
                onClick={handleUpdate}
                style={{borderRadius: '4px'}}
              >
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Update
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCancelEdit}
                style={{borderRadius: '4px'}}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="display-info" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '1rem' }}>
  <h3 style={{ color: '#007bff', fontFamily: 'Arial, sans-serif', marginBottom: '0.5rem' }}><b>{education.university}</b></h3>
  <p style={{ marginBottom: '0.5rem' }}>GPA: {education.cgpa}</p>
  <p style={{ marginBottom: '0.5rem' }}>Degree: {education.degree}</p>
  <p style={{ marginBottom: '0.5rem' }}>Major: {education.major}</p>
  <p style={{ marginBottom: '0.5rem' }}>Start Date: {education.startDate && `${education.startDate.month} ${education.startDate.year}`}</p>
  <p style={{ marginBottom: '0.5rem' }}>End Date: {education.endDate && `${education.endDate.month} ${education.endDate.year}`}</p>
  <div>
    <button
      className="btn btn-primary me-2"
      onClick={() => handleEditClick(education._id, education.university, education.cgpa, education.degree, education.major, education.startDate, education.endDate)}
      style={{ borderRadius: '4px' }}
    >
      <FontAwesomeIcon icon={faEdit} className="me-2" />
      Edit
    </button>
    <button
      className="btn btn-danger"
      onClick={() => handleDelete(education._id)}
      style={{ borderRadius: '4px' }}
    >
      <FontAwesomeIcon icon={faTrash} className="me-2" />
      Delete
    </button>
  </div>
</div>

          )}
        </div>
      ))}
      {isAdding && (
        <div className="adding-form">
          <input
            list="universities"
            type="text"
            className="form-control mb-2"
            placeholder="Search University"
            onChange={(e) => setNewEducation({ ...newEducation, university: e.target.value })}
            value={newEducation.university}
            style={{borderRadius: '4px', border: '1px solid #ccc'}}
          />
          <datalist id="universities" style={{ background: 'white', width: '100%', color:'black' }}>
            {filteredUniversities.map((name, index) => (
              <option key={index} value={name} />
            ))}
          </datalist>
          <select
            className="form-control mb-2"
            value={newEducation.degree}
            onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
            style={{borderRadius: '4px', border: '1px solid #ccc'}}
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
            className="form-control mb-2"
            placeholder="Major"
            value={newEducation.major}
            onChange={(e) => setNewEducation({ ...newEducation, major: e.target.value })}
            style={{borderRadius: '4px', border: '1px solid #ccc'}}
          />
             <input
      type="text"
      className="form-control mb-2"
      placeholder="CGPA"
      value={newEducation.cgpa}
      onChange={(e) => setNewEducation({ ...newEducation, cgpa: e.target.value })}
      style={{borderRadius: '4px', border: '1px solid #ccc'}}
    />
          <div className="date-dropdowns">
            <label>Start Date:</label>
            <div className="flex-container">
              <select
                className="form-control mb-2"
                value={newEducation.startDate.month}
                onChange={(e) => setNewEducation({ ...newEducation, startDate: { ...newEducation.startDate, month: e.target.value } })}
                style={{borderRadius: '4px', border: '1px solid #ccc', marginRight: '0.5rem'}}
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
                onChange={(e) => setNewEducation({ ...newEducation, startDate: { ...newEducation.startDate, year: e.target.value } })}
                style={{borderRadius: '4px', border: '1px solid #ccc'}}
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
          <div className="date-dropdowns">
            <label>End Date:</label>
            <div className="flex-container">
              <select
                className="form-control mb-2"
                value={newEducation.endDate.month}
                onChange={(e) => setNewEducation({ ...newEducation, endDate: { ...newEducation.endDate, month: e.target.value } })}
                style={{borderRadius: '4px', border: '1px solid #ccc', marginRight: '0.5rem'}}
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
                onChange={(e) => setNewEducation({ ...newEducation, endDate: { ...newEducation.endDate, year: e.target.value } })}
                style={{borderRadius: '4px', border: '1px solid #ccc'}}
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
          <button type="submit" className="btn btn-primary" onClick={handleSaveClick} style={{borderRadius: '4px'}}>
          <FontAwesomeIcon icon={faSave} className="me-2" />
            Save
          </button>
          <button className="btn btn-secondary ms-2" onClick={() => setIsAdding(false)} style={{borderRadius: '4px'}}>
            Cancel
          </button>
        </div>
      )}
      {!isAdding && (
        <button
          className="btn btn-primary"
          onClick={handleAddClick}
          style={{borderRadius: '4px'}}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Education
        </button>
      )}
    </div>
  );
  
  
};

export default EducationSection;

