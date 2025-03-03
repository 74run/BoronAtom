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
    <div className="bg-opacity-45 bg-[#000308] rounded-xl p-6 text-white shadow-md">
      <h2 className="text-[#63b3ed] text-lg font-semibold mb-6">Skills</h2>

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
                      className={`bg-[#1a202c] rounded-lg p-5 mb-4 border border-[#4a5568] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg relative ${
                        snapshot.isDragging ? 'bg-[#4a5568]' : ''
                      }`}
                      style={provided.draggableProps.style}
                    >
                      {editData && editData.id === skill._id ? (
                        <div className="edit-form">
                          <input
                            type="text"
                            className="w-full p-3 rounded-md bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
                            placeholder="Domain"
                            value={editData.domain}
                            onChange={(e) => setEditData({ ...editData, domain: e.target.value })}
                          />
                          <input
                            type="text"
                            className="w-full p-3 rounded-md bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
                            placeholder="Skill Name"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          />
                          <div className="flex gap-3 flex-wrap">
                            <button 
                              className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-green-600 to-green-400 text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
                              onClick={handleUpdate}
                            >
                              <FontAwesomeIcon icon={faSave} />
                              Update
                            </button>
                            <button 
                              className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#4a5568] text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
                              onClick={handleCancelEdit}
                            >
                              <FontAwesomeIcon icon={faTimes} />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div {...provided.dragHandleProps} className="absolute top-4 right-4 text-[#4a5568] cursor-grab active:cursor-grabbing">
                            <FontAwesomeIcon icon={faGripVertical} />
                          </div>
                          <h3 className="text-[#63b3ed] text-base font-semibold mb-2">{skill.domain}</h3>
                          <p className="text-[#a0aec0] text-xs mb-4">{skill.name}</p>
                          <div className="flex gap-3 flex-wrap">
                            <button 
                              className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#3182ce] to-[#4facfe] text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
                              onClick={() => handleEditClick(skill._id, skill.domain, skill.name, skill.includeInResume)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                              Edit
                            </button>
                            <button 
                              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium hover:-translate-y-0.5 transition-transform ${
                                skill.includeInResume 
                                  ? 'bg-gradient-to-r from-green-600 to-green-400' 
                                  : 'bg-gradient-to-r from-red-600 to-red-400'
                              } text-white`}
                              onClick={() => handleToggleInclude(skill._id)}
                            >
                              <FontAwesomeIcon icon={skill.includeInResume ? faToggleOn : faToggleOff} />
                              {skill.includeInResume ? 'Included' : 'Excluded'}
                            </button>
                            <button 
                              className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-red-600 to-red-400 text-white text-sm font-medium hover:-translate-y-0.5 transition-transform"
                              onClick={() => handleDelete(skill._id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                              Delete
                            </button>
                          </div>
                          <div className="absolute right-12 top-4 flex flex-col gap-1">
                            <button 
                              className={`p-1 text-[#4a5568] hover:text-[#63b3ed] transition-colors ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              onClick={() => moveSkillUp(index)}
                              disabled={index === 0}
                            >
                              <FontAwesomeIcon icon={faArrowUp} />
                            </button>
                            <button 
                              className={`p-1 text-[#4a5568] hover:text-[#63b3ed] transition-colors ${index === skills.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
        <div className="bg-[#1a202c] rounded-lg p-5 mb-4 border border-[#4a5568]">
          <input
            type="text"
            className="w-full p-3 rounded-md bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
            placeholder="Domain Name"
            value={newSkill.domain}
            onChange={(e) => setNewSkill({ ...newSkill, domain: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-3 rounded-md bg-[#2d3748] border border-[#4a5568] text-white text-sm mb-4 focus:outline-none focus:border-[#63b3ed]"
            placeholder="Skill Name"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
          />
          <div className="flex gap-3 flex-wrap">
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#3182ce] to-[#4facfe] text-white text-sm font-medium disabled:opacity-50"
              onClick={handleAISuggestions}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-[dot-flashing_1s_infinite_linear_alternate]" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-[dot-flashing_1s_infinite_linear_alternate_0.2s]" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-[dot-flashing_1s_infinite_linear_alternate_0.4s]" />
                </div>
              ) : (
                <>
                  <FontAwesomeIcon icon={faRobot} />
                  Add with AI
                </>
              )}
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-green-600 to-green-400 text-white text-sm font-medium"
              onClick={handleSaveClick}
            >
              <FontAwesomeIcon icon={faSave} />
              Save
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#4a5568] text-white text-sm font-medium"
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
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#3182ce] to-[#4facfe] text-white text-sm font-medium w-full mt-4"
          onClick={handleAddClick}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Skill
        </button>
      )}
    </div>
  );
};


export default Skills;
