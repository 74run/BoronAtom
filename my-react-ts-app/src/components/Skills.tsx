import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';

interface Skill {
  _id: string;
  name: string;
}

interface SkillsProps {
  // Define any props you need to pass to the Skills component
}

const Skills: React.FC<SkillsProps> = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const { userID } = useParams();

  useEffect(() => {
    fetchSkills();
  }, []);

const fetchSkills = async () => {
  try {
    const response = await fetch(`http://localhost:3001/api/userprofile/${userID}/skill`);
    if (!response.ok) {
      throw new Error('Failed to fetch skills');
    }
    const data = await response.json();
    // console.log('Fetched skills:', data.skills); // Add this line to log the fetched skills
    setSkills(data);
  } catch (error) {
    console.error('Error fetching skills:', error);
  }
};


const handleAction = async () => {
  if (inputValue.trim() !== '') {
    try {
      const response = await fetch(`http://localhost:3001/api/userprofile/${userID}/skill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: inputValue.trim() })
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
      await axios.delete(`http://localhost:3001/api/userprofile/${userID}/skill/${id}`);
      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  // const filteredSkills = skills.filter((skill) =>
  //   skill.name.toLowerCase().includes(inputValue.toLowerCase())
  // );

  return (
    <div
      style={{
        border: '2px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
      }}
    >
      <h2 className="mb-4">Skills</h2>
      <div className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search or Add new skill"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleAction}
          >
            {skills.length === 0 ? (
              <FontAwesomeIcon icon={faPlus} />
            ) : (
              <FontAwesomeIcon icon={faSearch} />
            )}
          </button>
        </div>
      </div>
      <ul className="list-group mb-3">
        {skills.map((skill) => (
          <li
            key={skill._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {skill.name}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDeleteSkill(skill._id)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Skills;
