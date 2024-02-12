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
      <h2 className="mb-4" style={{color: '#4CAF50', textAlign: 'left', marginBottom: '1rem', fontFamily: 'Timesquare'}}><b>Skills</b></h2>
      <div className="mb-3">
        <div className="input-group">
        
  <input
    type="text"
    className="form-control"
    placeholder="Search or Add new skill"
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    style={{  border: '1px solid #ccc', height: '38px', marginRight: '0px', flex: '1' }}
  />
  <button
    className="btn btn-secondary"
    type="button"
    onClick={handleAction}
    style={{ height: '38px' }}
  >
    <FontAwesomeIcon icon={faPlus} />
  </button>

        </div>
      </div>
      <div className="d-flex flex-wrap">
  {skills.map((skill) => (
    <div
      key={skill._id}
      className="card m-2"
      style={{ width: '200px', borderRadius: '20px', border: '1px solid #ccc' }}
    >
      <div className="card-body d-flex justify-content-between align-items-center">
        <span>{skill.name}</span>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => handleDeleteSkill(skill._id)}
          style={{ borderRadius: '4px' }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  ))}
</div>
    </div>
  );
  
};

export default Skills;
