import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() !== '') {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleDeleteSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const filteredSkills = skills.filter((skill) =>
    skill.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="border rounded p-4 mb-4">
      <h2 className="mb-4">Skills</h2>
      <div className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search skills"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button className="btn btn-outline-secondary" type="button">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>
      <ul className="list-group mb-3">
        {filteredSkills.map((skill, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
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
      <div className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Add new skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <button className="btn btn-success" type="button" onClick={handleAddSkill}>
            <FontAwesomeIcon icon={faPlus} />
            Add Skill
          </button>
        </div>
      </div>
    </div>
  );
};

export default Skills;
