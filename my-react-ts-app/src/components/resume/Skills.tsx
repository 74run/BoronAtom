import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  faPlus, faTrash, faEdit, faSave, 
  faToggleOn, faToggleOff, faRobot, 
  faArrowUp, faArrowDown , faGripVertical, 
  faTimes
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
  const [isLoading, setIsLoading] = useState(false);

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

  const handleAISuggestions = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/userprofile/generate/${userID}/skills`
      );
      const { domain, name } = response.data;
  
      // Update the new skill with the fetched data
      setNewSkill({
        _id: '', // Assuming it's new and will get an ID on save
        domain,
        name,
        includeInResume: true,
      });
  
      
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
  
      // User-friendly error message
      alert('Failed to fetch AI suggestions. Please try again later.');
    } finally {
      setIsLoading(false); // Stop loading
    }
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
    <div className="skills-container">
      <style>
        {`
          .skills-container {
            background-color: rgba(0, 3, 8, 0.45);
            border-radius: 12px;
            padding: 1.5rem;
            color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .section-header {
            color: #63b3ed;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
          }

          .skill-card {
            background-color: #1a202c;
            border-radius: 8px;
            padding: 1.25rem;
            margin-bottom: 1rem;
            border: 1px solid #4a5568;
            transition: all 0.2s ease;
            position: relative;
          }

          .skill-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .drag-handle {
            position: absolute;
            top: 1rem;
            right: 1rem;
            color: #4a5568;
            cursor: grab;
          }

          .drag-handle:active {
            cursor: grabbing;
          }

          .domain-name {
            color: #63b3ed;
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }

          .skill-name {
            color: #a0aec0;
            font-size: 0.95rem;
            margin-bottom: 1rem;
          }

          .input-field {
            width: 100%;
            padding: 0.75rem;
            border-radius: 6px;
            background-color: #2d3748;
            border: 1px solid #4a5568;
            color: white;
            font-size: 0.95rem;
            margin-bottom: 1rem;
          }

          .input-field:focus {
            outline: none;
            border-color: #63b3ed;
          }

          .btn-group {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
          }

          .btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.875rem;
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

          .include-toggle {
            background: none;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.875rem;
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

          .move-buttons {
            position: absolute;
            right: 3rem;
            top: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .move-btn {
            padding: 0.25rem;
            background: none;
            border: none;
            color: #4a5568;
            cursor: pointer;
            transition: color 0.2s ease;
          }

          .move-btn:hover:not(:disabled) {
            color: #63b3ed;
          }

          .move-btn:disabled {
            color: #2d3748;
            cursor: not-allowed;
          }

          .loading-dots {
            display: flex;
            gap: 4px;
          }

          .dot {
            width: 6px;
            height: 6px;
            background-color: white;
            border-radius: 50%;
            animation: dot-flashing 1s infinite linear alternate;
          }

          .dot:nth-child(2) { animation-delay: 0.2s; }
          .dot:nth-child(3) { animation-delay: 0.4s; }

          @keyframes dot-flashing {
            0% { opacity: 0.2; }
            100% { opacity: 1; }
          }

          @media (max-width: 640px) {
            .btn-group {
              flex-direction: column;
            }
            
            .btn {
              width: 100%;
            }
          }
        `}
      </style>

      <h2 className="section-header">Skills</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="skills">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {skills.map((skill, index) => (
                <Draggable key={skill._id} draggableId={skill._id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="skill-card"
                      style={{
                        ...provided.draggableProps.style,
                        backgroundColor: snapshot.isDragging ? '#4a5568' : '#1a202c',
                      }}
                    >
                      {editData && editData.id === skill._id ? (
                        <div className="edit-form">
                          <input
                            type="text"
                            className="input-field"
                            placeholder="Domain"
                            value={editData.domain}
                            onChange={(e) => setEditData({ ...editData, domain: e.target.value })}
                          />
                          <input
                            type="text"
                            className="input-field"
                            placeholder="Skill Name"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          />
                          <div className="btn-group">
                            <button 
                              className="btn btn-success"
                              onClick={handleUpdate}
                            >
                              <FontAwesomeIcon icon={faSave} />
                              Update
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
                          <div {...provided.dragHandleProps} className="drag-handle">
                            <FontAwesomeIcon icon={faGripVertical} />
                          </div>
                          <h3 className="domain-name">{skill.domain}</h3>
                          <p className="skill-name">{skill.name}</p>
                          <div className="btn-group">
                            <button 
                              className="btn btn-primary"
                              onClick={() =>
                                handleEditClick(
                                  skill._id,
                                  skill.domain,
                                  skill.name,
                                  skill.includeInResume
                                )
                              }
                            >
                              <FontAwesomeIcon icon={faEdit} />
                              Edit
                            </button>
                           
                            <button 
                              className={`include-toggle ${skill.includeInResume ? 'included' : 'excluded'}`}
                              onClick={() => handleToggleInclude(skill._id)}
                            >
                              <FontAwesomeIcon icon={skill.includeInResume ? faToggleOn : faToggleOff} />
                              {skill.includeInResume ? 'Included' : 'Excluded'}
                            </button>

                            <button 
                              className="btn btn-danger"
                              onClick={() => handleDelete(skill._id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                              Delete
                            </button>
                          </div>
                          <div className="move-buttons">
                            <button 
                              className="move-btn"
                              onClick={() => moveSkillUp(index)}
                              disabled={index === 0}
                            >
                              <FontAwesomeIcon icon={faArrowUp} />
                            </button>
                            <button 
                              className="move-btn"
                              onClick={() => moveSkillDown(index)}
                              disabled={index === skills.length - 1}
                            >
                              <FontAwesomeIcon icon={faArrowDown} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {isAdding && (
        <div className="skill-card">
          <input
            type="text"
            className="input-field"
            placeholder="Domain Name"
            value={newSkill.domain}
            onChange={(e) => setNewSkill({ ...newSkill, domain: e.target.value })}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Skill Name"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
          />
          <div className="btn-group">
            <button 
              className="btn btn-primary"
              onClick={handleAISuggestions}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-dots">
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </div>
              ) : (
                <>
                  <FontAwesomeIcon icon={faRobot} />
                  Add with AI
                </>
              )}
            </button>
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
      )}

      {!isAdding && (
        <button 
          className="btn btn-primary"
          onClick={handleAddClick}
          style={{ width: '100%', marginTop: skills.length > 0 ? '1rem' : '0' }}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Skill
        </button>
      )}
    </div>
  );
};


export default Skills;
