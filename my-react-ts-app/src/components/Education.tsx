import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
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
  degree: string;
  major: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  isEditing?: boolean;
}

interface EducationProps {
  Educations: Education[];
  UserDetail: UserDetails | null;
  onEdit: (id: string, data: {university: string; degree: string; major: string; startDate: { month: string; year: string }; endDate: { month: string; year: string }})=> void;
  onDelete :(id: string)=> void;
  
}


const EducationSection: React.FC<EducationProps>= ({Educations, UserDetail, onEdit, onDelete}) => {
  const [editData, setEditData] = useState<{id: string; university: string; degree: string; major: string; startDate: { month: string; year: string }; endDate: { month: string; year: string }} | null>(null);
  const [educations, setEducations] = useState<Education[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [filteredUniversities, setFilteredUniversities] = useState<string[]>([]);
  const [newEducation, setNewEducation] = useState<Education>({
    _id: '',
    university: '',
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








  const handleEditClick = (    id: string,
    university: string,
    degree: string,
    major: string,
    startDate: { month: string; year: string },
    endDate: { month: string; year: string }) => {
    setEditData({  id, university, degree, major, startDate, endDate });
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, {
        university: editData.university,
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
              degree: editData.degree,
              major: editData.major,
              startDate: { ...editData.startDate },
              endDate: { ...editData.endDate },
            }
          : education
      );
  
      setEducations(updatedItems);
  
      // Update local storage
      localStorage.setItem(`educations_${userID}`, JSON.stringify(updatedItems));
  
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
        localStorage.setItem(`educations_${userID}`, JSON.stringify(updatedEducations));
  
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



  useEffect(() => {
    const fetchData = async () => {
      try {
        const storageKey = `educations_${userID}`;
  
        // Check if data exists in local storage
        const storedData = localStorage.getItem(storageKey);
        if (storedData) {
          setEducations(JSON.parse(storedData));
        } else {
          // If not, fetch data from the server
          const response = await axios.get(`http://localhost:3001/api/userprofile/${userID}/educations`);
          const fetchedEducations = response.data.educations;
  
          // Update state
          setEducations(fetchedEducations);
  
          // Store the fetched data in local storage
          localStorage.setItem(storageKey, JSON.stringify(fetchedEducations));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [userID]);
  

  // useEffect(() => {
  //   fetch('/api/items')
  //     .then((res) => res.json())
  //     .then((data) => setEducations(data));
  // }, []);




  const handleSaveClick = () => {
    // Form validation check
    if (!newEducation.university || !newEducation.degree || !newEducation.major || !newEducation.startDate.month || !newEducation.startDate.year || !newEducation.endDate.month || !newEducation.endDate.year) {
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
  
    const storageKey = `educations_${userID}`;

  axios.post(`http://localhost:3001/api/userprofile/${userID}/education`, formattedEducation)
    .then((response) => {
      const newEducationFromServer = response.data.education;
      const newEduData = newEducationFromServer[newEducationFromServer.length - 1];

      // Update state
      setEducations([...educations, newEduData]);

      // Update local storage
      const updatedEducations = [...educations, newEduData];
      localStorage.setItem(storageKey, JSON.stringify(updatedEducations));

      setNewEducation({
        _id: '',
        university: '',
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
      border: '2px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '20px',
    }}
    className="container">
     <h2>Education</h2>
      {educations.map(education => (
        <div key={education._id} className="mb-3">
          {editData && editData.id === education._id ? (
            <div className="editing-form">
          
            <input
              list="universities"
              type="text"
              className="form-control mb-2"
              placeholder="University Name"
              value={editData.university}
              onChange={(e) => setEditData({ ...editData, university: e.target.value })}
            />
          <datalist
            id="universities"
          >
            {filteredUniversities.map((name, index) => (
              <option key={index} value={name} />
            ))}
          </datalist>
      
          <select
              className="form-control mb-2"
              value={editData.degree}
              onChange={(e) => setEditData({ ...editData, degree: e.target.value })}
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
              />
              <div className="date-dropdowns">
                <label>Start Date:</label>
                <div className="flex-container">
                  <select
                    className="form-control mb-2"
                    value={editData.startDate.month}
                    onChange={(e) => setEditData({ ...editData, startDate: { ...editData.startDate, month: e.target.value } })}
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
              >
                Update
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="display-info">
            
              <h3>{education.university}</h3>
              <p>Degree: {education.degree}</p>
              <p>Major: {education.major}</p>
              <p>Start Date: {education.startDate && `${education.startDate.month} ${education.startDate.year}`}</p>
              <p>End Date: {education.endDate && `${education.endDate.month} ${education.endDate.year}`}</p>

              <button
                className="btn btn-primary me-2"
                onClick={() => handleEditClick(education._id, education.university, education.degree, education.major, education.startDate, education.endDate)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(education._id)}
              >
                Delete
              </button>
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
          />
          <div className="date-dropdowns">
            <label>Start Date:</label>
            <div className="flex-container">
              <select
                className="form-control mb-2"
                value={newEducation.startDate.month}
                onChange={(e) => setNewEducation({ ...newEducation, startDate: { ...newEducation.startDate, month: e.target.value } })}
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
           <button type="submit" className="btn btn-primary" onClick={handleSaveClick}>
            Save
          </button>
          <button className="btn btn-secondary ms-2" onClick={() => setIsAdding(false)}>
            Cancel
          </button>
        </div>
      )}
      {!isAdding && (
        <button
        className="btn btn-primary"
        onClick={handleAddClick}
      >
        <FontAwesomeIcon icon={faPlus} className="me-2" />
        Add Education
      </button>
      )}
    </div>
  );
};

export default EducationSection;

