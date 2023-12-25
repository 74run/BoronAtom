// YourReactComponent.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const YourReactComponent = () => {
  const [universities, setUniversities] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/universities');
        console.log('Response data:', response.data.universities);
        setUniversities(response.data.universities);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div>
      <label>Select University:</label>
      <select>
      <option value="" disabled>Select University</option>
  {universities.map((university) => (
    <option key={university} value={university}>
      {university}
    </option>
  ))}
</select>
    </div>
  );
};

export default YourReactComponent;
