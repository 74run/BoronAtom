import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  faPlus, faTrash, faEdit, faSave, 
  faToggleOn, faToggleOff, faRobot, 
  faArrowUp, faArrowDown 
} from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';

interface Skill {
  _id: string;
  domain: string;
  name: string;
  includeInResume: boolean;
}

interface SkillsProps {
  Skills: Skill[];
  onEdit: (id: string, data: { domain: string; name: string; includeInResume: boolean }) => void;
  onDelete: (id: string) => void;
}

const Skills: React.FC<SkillsProps> = ({ Skills, onEdit, onDelete }) => {
  const [editData, setEditData] = useState<{ id: string; domain: string; name: string; includeInResume: boolean } | null>(null);
  const [skills, setSkills] = useState<Skill[]>(Skills);
  const [newSkill, setNewSkill] = useState<Skill>({
    _id: '',
    domain: '',
    name: '',
    includeInResume: true,
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
          throw new Error('Failed to fetch skills');
        }
        return response.json();
      })
      .then(data => {
        setSkills(data);
      })
      .catch(error => {
        console.error('Error fetching skills:', error);
      });
  };

  const handleEditClick = (id: string, domain: string, name: string, includeInResume: boolean) => {
    setEditData({ id, domain, name, includeInResume });
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, { domain: editData.domain, name: editData.name, includeInResume: editData.includeInResume });

      const updatedItems = skills.map((skill) =>
        skill._id === editData.id ? { ...skill, domain: editData.domain, name: editData.name, includeInResume: editData.includeInResume } : skill
      );
      setSkills(updatedItems);

      setEditData(null);
    }
  };

  const handleSaveClick = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/skill`, newSkill)
      .then((response) => {
        const newSkillFromServer = response.data.skills;
        const newSkillData = newSkillFromServer[newSkillFromServer.length - 1];
        setSkills([...skills, newSkillData]);
        setNewSkill({ _id: '', domain: '', name: '', includeInResume: true });
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

  const handleToggleInclude = (id: string) => {
    const updatedSkills = skills.map((skill) =>
      skill._id === id ? { ...skill, includeInResume: !skill.includeInResume } : skill
    );
    setSkills(updatedSkills);

    const skillToUpdate = updatedSkills.find(skill => skill._id === id);
    if (skillToUpdate) {
      onEdit(id, {
        domain: skillToUpdate.domain,
        name: skillToUpdate.name,
        includeInResume: skillToUpdate.includeInResume
      });
    }
  };

  const handleAddClick = () => {
    setNewSkill({
      _id: '',
      domain: '',
      name: '',
      includeInResume: true,
    });
    setIsAdding(true);
  };

  const handleAISuggestions = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/generate/${userID}/skills`)
      .then((response) => {
        const { domain, name } = response.data;
        setNewSkill({
          _id: '',
          domain,
          name,
          includeInResume: true,
        });
      })
      .catch((error) => {
        console.error('Error fetching AI suggestions:', error);
      });
  };

  const moveSkillUp = (index: number) => {
    if (index > 0) {
      const updatedSkills = [...skills];
      [updatedSkills[index - 1], updatedSkills[index]] = [updatedSkills[index], updatedSkills[index - 1]];
      setSkills(updatedSkills);
      saveSkillOrder(updatedSkills);
    }
  };

  const moveSkillDown = (index: number) => {
    if (index < skills.length - 1) {
      const updatedSkills = [...skills];
      [updatedSkills[index + 1], updatedSkills[index]] = [updatedSkills[index], updatedSkills[index + 1]];
      setSkills(updatedSkills);
      saveSkillOrder(updatedSkills);
    }
  };

  const saveSkillOrder = (updatedSkills: Skill[]) => {
    axios.put(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/skills/reorder`, { skills: updatedSkills })
      .then(() => console.log('Skills order updated'))
      .catch(error => console.error('Error updating skills order:', error));
  };

  const handleDragEnd = (result: any) => {
    const { destination, source } = result;

    if (!destination) return;

    const reorderedSkills = Array.from(skills);
    const [moved] = reorderedSkills.splice(source.index, 1);
    reorderedSkills.splice(destination.index, 0, moved);

    setSkills(reorderedSkills);
    saveSkillOrder(reorderedSkills);
  };

  return (
    <div
    style={{
      border: "none",
      borderRadius: "12px",
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
        color: "#4CAF50",
        textAlign: "left",
        marginBottom: "1.5rem",
        fontFamily: "'Roboto Slab', serif",
        fontWeight: 700,
        fontSize: "1.5rem",
      }}
      >
        Skills
      </h4>
  
      {/* Map over Skills */}
      {skills.map((skill, index) => (
        <div
          key={skill._id}
          className="mb-3"
          style={{
            border: "1px solid #444",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "1.5rem",
            backgroundColor: "#3a3a3c",
            transition: "transform 0.3s, box-shadow 0.3s",
            position: "relative",
            justifyContent: 'space-between', // Space between skill info and arrows
            alignItems: 'center', // Align content vertically
          }}
        >
          {editData && editData.id === skill._id ? (
            // Edit mode
            <div  style={{
              border: "1px solid #333",
              borderRadius: "12px",
              padding: "14px",
              marginBottom: "1.5rem",
              backgroundColor: "#2d2d30",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
              position: "relative",
            }}>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Domain"
                value={editData.domain}
                onChange={(e) =>
                  setEditData({ ...editData, domain: e.target.value })
                }
                style={{
                  borderRadius: "8px",
                  border: "1px solid #444",
                  padding: "12px",
                  fontSize: "1rem",
                  marginBottom: "1rem",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
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
                  borderRadius: "8px",
                  border: "1px solid #666",
                  padding: "12px",
                  fontSize: "1rem",
                  marginBottom: "1rem",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                }}
              />
  
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="btn btn-success"
                  onClick={handleUpdate}
                  style={{
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "1rem",
                    flex: 1,
                    backgroundColor: "#28a745",
                    color: "#fff",
                  }}
                >
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Update
                </button>
  
                <button
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                  style={{
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "1rem",
                    flex: 1,
                    backgroundColor: "#6c757d",
                    color: "#fff",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // View mode
            <div
            key={skill._id}
            className="mb-3"
            style={{
              display: 'flex',  // Align content horizontally
              justifyContent: 'space-between',  // Space between skill info and arrows
              alignItems: 'center',  // Vertically center everything
              border: '1px solid #444',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '1.5rem',
              backgroundColor: '#3a3a3c',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
          >
            {/* Skill Information with buttons underneath */}
            <div style={{ flex: 1 }}>
              <h6
                style={{
                  color: '#f5f5f5',
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
                  color: '#bbb',
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                {skill.name}
              </p>
          
              {/* Buttons under domain and skill name */}
              <div
                className="button-group"
                style={{
                  display: 'flex',
                  gap: '10px',
                  marginTop: '10px',
                  flexWrap: 'wrap', // Ensure wrapping on smaller screens
                }}
              >
                <button
                  className="btn btn-outline-primary"
                  onClick={() =>
                    handleEditClick(
                      skill._id,
                      skill.domain,
                      skill.name,
                      skill.includeInResume
                    )
                  }
                  style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
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
                    border: 'none',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
          
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleToggleInclude(skill._id)}
                  style={{
                    padding: '0.3rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    backgroundColor: skill.includeInResume ? '#28a745' : '#dc3545',
                    color: '#fff',
                    border: 'none',
                  }}
                >
                  <FontAwesomeIcon
                    icon={skill.includeInResume ? faToggleOn : faToggleOff}
                    className="me-2"
                  />
                  {skill.includeInResume ? 'Included' : 'Excluded'}
                </button>
              </div>
            </div>
          
            {/* Arrows aligned to the right */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',  // Stack arrows vertically
                alignItems: 'center',
                gap: '5px',  // Space between arrows
              }}
            >
              <button
                onClick={() => moveSkillUp(index)}
                disabled={index === 0}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#fff',
                  padding: '5px',
                }}
              >
                <FontAwesomeIcon icon={faArrowUp} />
              </button>
          
              <button
                onClick={() => moveSkillDown(index)}
                disabled={index === skills.length - 1}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#fff',
                  padding: '5px',
                }}
              >
                <FontAwesomeIcon icon={faArrowDown} />
              </button>
            </div>
          </div>
          
           
          )}
        </div>
      ))}
  
      {/* Add skill entry */}
      {isAdding && (
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
              borderRadius: "8px",
              border: "1px solid #666",
              padding: "12px",
              fontSize: "1rem",
              marginBottom: "1rem",
              backgroundColor: "#1c1c1e",
              color: "#f5f5f5",
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
              borderRadius: "8px",
              border: "1px solid #666",
              padding: "12px",
              fontSize: "1rem",
              marginBottom: "1rem",
              backgroundColor: "#1c1c1e",
              color: "#f5f5f5",
            }}
          />
          <div className="d-flex gap-2" style={{ display: "flex", gap: "10px" }}>
            <button
              className="btn btn-outline-secondary"
              onClick={handleAISuggestions}
              style={{
                backgroundColor: "#6c757d",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "1rem",
                flex: 1,
              }}
            >
              <FontAwesomeIcon icon={faRobot} className="me-2" />
              Add with AI
            </button>
  
            <button
              className="btn btn-success"
              onClick={handleSaveClick}
              style={{
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "1rem",
                flex: 1,
                backgroundColor: "#28a745",
                color: "#fff",
              }}
            >
              <FontAwesomeIcon icon={faSave} className="me-2" />
              Save
            </button>
  
            <button
              className="btn btn-secondary"
              onClick={() => setIsAdding(false)}
              style={{
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "1rem",
                flex: 1,
                backgroundColor: "#6c757d",
                color: "#fff",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
  
      {!isAdding && (
        <button
          className="btn btn-outline-primary"
          onClick={handleAddClick}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "1rem",
            width: "100%", // Full width on smaller screens
            marginTop: "20px",
          }}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Skill
        </button>
      )}
  
      <style >{`
        @media (max-width: 768px) {
          .button-group {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
  
};

export default Skills;
