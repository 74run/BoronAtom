import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface PasswordCriteriaProps {
  password: string;
}

const PasswordCriteria: React.FC<PasswordCriteriaProps> = ({ password }) => {
  const criteria = [
    { label: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
    { label: 'At most 15 characters', test: (pw: string) => pw.length <= 15 },
    { label: 'At least one uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
    { label: 'At least one lowercase letter', test: (pw: string) => /[a-z]/.test(pw) },
    { label: 'At least one number', test: (pw: string) => /\d/.test(pw) },
  ];

  return (
    <ul className="password-criteria">
      {criteria.map((criterion, index) => (
        <li key={index} className="d-flex align-items-center">
          <i
            className={`fas ${criterion.test(password) ? 'fa-check text-success' : 'fa-times text-danger'}`}
            style={{ marginRight: '8px' }}
          ></i>
          {criterion.label}
        </li>
      ))}
    </ul>
  );
};

export default PasswordCriteria;
