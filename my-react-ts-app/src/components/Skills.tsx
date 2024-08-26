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
    <div
      className="container"
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
        Skills
      </h4>
      {skills.map((skill) => (
        <div
          key={skill._id}
          className="mb-3"
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '1.5rem',
            backgroundColor: '#f8f9fa',
            transition: 'transform 0.3s, box-shadow 0.3s',
            position: 'relative',
          }}
        >
          {editData && editData.id === skill._id ? (
            // Edit mode
            <div>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Domain"
                value={editData.domain}
                onChange={(e) =>
                  setEditData({ ...editData, domain: e.target.value })
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
                placeholder="Skill Name"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  padding: '12px',
                  fontSize: '1rem',
                  marginBottom: '1rem',
                }}
              />
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
            // View mode
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
              <h6
                style={{
                  color: '#333',
                  fontFamily: "'Roboto Slab', serif",
                  fontSize: '1.2rem',
                  marginBottom: '0.5rem',
                  fontWeight: 700,
                }}
              >
                {skill.domain}
              </h6>
              <p
                style={{
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#555',
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                {skill.name}
              </p>
  
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <button
                  className="btn btn-outline-primary"
                  onClick={() =>
                    handleEditClick(skill._id, skill.domain, skill.name)
                  }
                  style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: '1px solid #007bff',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleDelete(skill._id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    padding: '0.3rem 0.6rem',
                    border: '1px solid #dc3545',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
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
            className="form-control mb-3"
            placeholder="Domain Name"
            value={newSkill.domain}
            onChange={(e) =>
              setNewSkill({ ...newSkill, domain: e.target.value })
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
            placeholder="Skill Name"
            value={newSkill.name}
            onChange={(e) =>
              setNewSkill({ ...newSkill, name: e.target.value })
            }
            style={{
              borderRadius: '8px',
              border: '1px solid #ddd',
              padding: '12px',
              fontSize: '1rem',
              marginBottom: '1rem',
            }}
          />
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
        // Show "Add Skill" button
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
