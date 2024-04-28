import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faSearch, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';

interface Skill {
  _id: string;
  domain: string;
  name: string;
}

interface SkillsProps {
  Skills: Skill[];
  onEdit: (id: string, data: { domain: string; name: string }) => void;
  onDelete: (id: string) => void;
}

const Skills: React.FC<SkillsProps> = ({ Skills, onEdit, onDelete }) => {
  const [editData, setEditData] = useState<{ id: string; domain: string; name: string } | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [skills, setSkills] = useState<Skill[]>(Skills);
  const [newSkill, setNewSkill] = useState<Skill>({
    _id: '',
    domain: '',
    name: '',
  });

  const [isAdding, setIsAdding] = useState(false);
  const { userID } = useParams();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/skill`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        return response.json(); // Parse the response JSON
      })
      .then(data => {
        // console.log("Project data:",data)
        setSkills(data); // Set projects state with the fetched data
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  };

  const handleEditClick = (id: string, domain: string, name: string) => {
    setEditData({ id, domain, name });
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, { domain: editData.domain, name: editData.name, });

      const updatedItems = skills.map((skill) =>
      skill._id === editData.id
      ? {...skill, domain: editData.domain, name: editData.name}: skill
      );
      setSkills(updatedItems);

      setEditData(null);
    }
  };

  const handleSaveClick = () => {
    // console.log(newSkill);
    axios.post(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/skill`, newSkill)
    .then((response) => {
      // console.log(response.data); // Log the entire response data
      const newSkillFromServer = response.data.skills;
      const newSkillData = newSkillFromServer[newSkillFromServer.length - 1];
      setSkills([...skills, newSkillData]);
      setNewSkill({ _id: '', domain: '', name: '' });
      setIsAdding(false);
    })
    
      .catch((error) => {
        console.error('Error saving skill:', error.message);
      });
  };
  

  const handleDelete = (id: string) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/skill/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedSkills = skills.filter((skill) => skill._id !== id);
        setSkills(updatedSkills);
        setEditData(null);
      })
      .catch((error) => {
        console.error('Error deleting skill:', error);
      });
  };

  const handleAction = async () => {
    if (inputValue.trim() !== '') {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/skill`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ domain: inputValue.trim(), name: inputValue.trim() })
        });

        if (!response.ok) {
          throw new Error('Failed to add skill');
        }

        setInputValue('');
        fetchSkills();
      } catch (error) {
        console.error('Error adding skill:', error);
      }
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/skill/${id}`);
      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const handleAddClick = () => {
    setNewSkill({
      _id: '',
      domain: '',
      name: '',
    });
    setIsAdding(true);
  };

  return (
    <div className="container" style={{
      border: '2px solid #4CAF50',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 0 200px rgba(10, 0, 0, 0.5)'
    }}>
      <h4 style={{ color: '#4CAF50', textAlign: 'left', marginBottom: '1rem', fontFamily: 'Timesquare' }}><b>Skills</b></h4>
      {skills.map((skill) => (
        <div key={skill._id} className="mb-3" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '1rem' }}>
          {editData && editData.id === skill._id ? (
            // Edit mode
            <div>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Domain"
                value={editData.domain}
                onChange={(e) => setEditData({ ...editData, domain: e.target.value })}
                style={{ borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Skill Name"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                style={{ borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <button
                className="btn btn-primary me-2"
                onClick={handleUpdate}
                style={{ borderRadius: '4px' }}
              >
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Update
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCancelEdit}
                style={{ borderRadius: '4px' }}
              >
                Cancel
              </button>
            </div>
          ) : (
            // View mode
            <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '6px', marginBottom: '0.2rem', position: 'relative' }}>
  <h6 style={{ color: '#007bff', fontFamily: 'Arial, sans-serif', marginBottom: '0.5rem' }}><b>{skill.domain}</b></h6>
  <p style={{ marginBottom: '0.2rem', fontSize: '0.9rem'}}>{skill.name}</p>

  <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
    <button
      className="btn btn-primary me-2"
      onClick={() => handleEditClick(skill._id, skill.domain, skill.name)}
      style={{
        backgroundColor: '#007bff',
        color: '#fff',
        border: '1px solid #007bff',
        padding: '0.3rem 0.4rem', // Adjusted padding
        borderRadius: '100px',
        transition: 'all 0.3s',
        fontSize: '0.8rem', // Adjusted font size
      }}
    >
      <FontAwesomeIcon icon={faEdit} className="me-0" />
    </button>
    <button
      className="btn btn-danger"
      onClick={() => handleDelete(skill._id)}
      style={{
        backgroundColor: '#dc3545',
        color: '#fff',
        padding: '0.3rem 0.4rem',
        border: '1px solid #dc3545',
        borderRadius: '4px',
        transition: 'all 0.3s',
        fontSize: '0.8rem',
      }}
    >
      <FontAwesomeIcon icon={faTrash} className="me-0" />
    </button>
  </div>
</div>


          )}
        </div>
      ))}
      {isAdding && (
        // Add skill entry
        <div>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Domain Name"
            value={newSkill.domain}
            onChange={(e) => setNewSkill({ ...newSkill, domain: e.target.value })}
            style={{ borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Skill Name"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            style={{ borderRadius: '4px', border: '1px solid #ccc' }}
          />


          <button
            className="btn btn-primary"
            onClick={handleSaveClick}
            style={{ borderRadius: '4px' }}
          >
            <FontAwesomeIcon icon={faSave} className="me-2" />
            Save
          </button>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => setIsAdding(false)}
            style={{ borderRadius: '4px' }}
          >
            Cancel
          </button>
        </div>
      )}
      {!isAdding && (
        // Show "Add Involvement" button
        <button
          className="btn btn-primary"
          onClick={handleAddClick}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: '1px solid #007bff',
            padding: '0.3rem 0.6rem', // Adjusted padding
            borderRadius: '4px',
            transition: 'all 0.3s',
            fontSize: '0.8rem', // Adjusted font size
          }}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Skill
        </button>
      )}
    </div>
  );

};

export default Skills;
