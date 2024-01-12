import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleAction = () => {
    if (inputValue.trim() !== '') {
      setSkills([...skills, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleDeleteSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const filteredSkills = skills.filter((skill) =>
    skill.toLowerCase().includes(inputValue.toLowerCase())
  );

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
            {filteredSkills.length === 0 ? (
              <FontAwesomeIcon icon={faPlus} />
            ) : (
              <FontAwesomeIcon icon={faSearch} />
            )}
          </button>
        </div>
      </div>
      <ul className="list-group mb-3">
        {filteredSkills.map((skill, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {skill}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDeleteSkill(index)}
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
