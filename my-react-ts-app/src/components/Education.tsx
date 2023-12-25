import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faSave, faPlus } from '@fortawesome/free-solid-svg-icons';

interface Education {
  _id: string;
  university: string;
  degree: string;
  graduationYear: string;
  isEditing?: boolean;
}

const EducationSection: React.FC = () => {
  const [universities, setUniversities] = useState<string[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<string[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [newEducation, setNewEducation] = useState<Education>({
    _id: '',
    university: '',
    degree: '',
    graduationYear: '',
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newEducationSearchTerm, setNewEducationSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/universities');
        setUniversities(response.data.universities);
        setFilteredUniversities(response.data.universities);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    fetchEducations();
  }, []);

  const fetchEducations = () => {
    axios.get('/api/educations')
      .then(response => setEducations(response.data))
      .catch(error => console.error('Error fetching educations:', error));
  };

  const handleSaveClick = () => {
    axios.post('/api/educations', newEducation)
      .then(response => {
        setEducations([...educations, response.data]);
        setNewEducation({ _id: '', university: '', degree: '', graduationYear: '' });
        setIsAdding(false);
      })
      .catch(error => console.error('Error saving education:', error));
  };

  const handleEditClick = (id: string) => {
    setEducations(prevEducations =>
      prevEducations.map(edu =>
        edu._id === id ? { ...edu, isEditing: true } : edu
      )
    );
  };

  const handleEditSaveClick = async (id: string) => {
    try {
      const editedEducation = educations.find(edu => edu._id === id);

      const response = await axios.put(`/api/educations/${id}`, {
        university: editedEducation?.university,
        degree: editedEducation?.degree,
        graduationYear: editedEducation?.graduationYear,
      });

      const updatedEducation = response.data;

      setEducations(prevEducations =>
        prevEducations.map(edu =>
          edu._id === id ? { ...edu, ...updatedEducation, isEditing: false } : edu
        )
      );
    } catch (error) {
      console.error('Error updating education entry:', error);
    }
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      axios.delete(`/api/educations/${id}`)
        .then(() => {
          const updatedEducations = educations.filter(edu => edu._id !== id);
          setEducations(updatedEducations);
        })
        .catch(error => console.error('Error deleting education:', error));
    }
  };

  const handleAddClick = () => {
    setNewEducation({ _id: '', university: '', degree: '', graduationYear: '' });
    setIsAdding(true);
    setNewEducationSearchTerm('');
  };

  return (
    <div className="container">
      <h2>Education</h2>
      {educations.map(education => (
        <div key={education._id} className="mb-3">
          {education.isEditing ? (
            <div className="editing-form">
              <input
                list="universities"
                type="text"
                className="form-control mb-2"
                placeholder="University Name"
                value={education.university}
                onChange={(e) =>
                  setEducations(prevEducations =>
                    prevEducations.map(edu =>
                      edu._id === education._id ? { ...edu, university: e.target.value } : edu
                    )
                  )
                }
              />
              <datalist id="universities" style={{ background: '#fff', width: '100%' }}>
                {filteredUniversities.map((name, index) => (
                  <option key={index} value={name} />
                ))}
              </datalist>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Degree"
                value={education.degree}
                onChange={(e) =>
                  setEducations(prevEducations =>
                    prevEducations.map(edu =>
                      edu._id === education._id ? { ...edu, degree: e.target.value } : edu
                    )
                  )
                }
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Graduation Year"
                value={education.graduationYear}
                onChange={(e) =>
                  setEducations(prevEducations =>
                    prevEducations.map(edu =>
                      edu._id === education._id ? { ...edu, graduationYear: e.target.value } : edu
                    )
                  )
                }
              />
              <button
                className="btn btn-primary me-2"
                onClick={() => handleEditSaveClick(education._id)}
              >
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  setEducations(prevEducations =>
                    prevEducations.map(edu =>
                      edu._id === education._id ? { ...edu, isEditing: false } : edu
                    )
                  )
                }
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="display-info">
              <h3>{education.university}</h3>
              <p>{education.degree}</p>
              <p>{education.graduationYear}</p>
              <button
                className="btn btn-primary me-2"
                onClick={() => handleEditClick(education._id)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteClick(education._id)}
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
          <datalist id="universities" style={{ background: '#fff', width: '100%' }}>
            {filteredUniversities.map((name, index) => (
              <option key={index} value={name} />
            ))}
          </datalist>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Degree"
            value={newEducation.degree}
            onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Graduation Year"
            value={newEducation.graduationYear}
            onChange={(e) =>
              setNewEducation({ ...newEducation, graduationYear: e.target.value })
            }
          />
          <button className="btn btn-primary" onClick={handleSaveClick}>
            Save
          </button>
          <button className="btn btn-secondary ms-2" onClick={() => setIsAdding(false)}>
            Cancel
          </button>
        </div>
      )}
      {!isAdding && (
        <button className="btn btn-primary" onClick={handleAddClick}>
          Add Education
        </button>
      )}
    </div>
  );
};

export default EducationSection;
