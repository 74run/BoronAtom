import React, { useState } from 'react';
import axios from 'axios';

interface ParsedData {
  name?: string;
  contact?: {
    
    email?: string;
    phone?: string;
    linkedin?: string;
  };
  summary?: string;
  skills?: {
    domain?: string[];
    skill?: string[];
  }
  education?: string[];
  experience?: string[];
  projects?: string[];
  certifications?: string[];
  involvements?: string[];
}

const ResumeUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isButtonHovered, setIsButtonHovered] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);

    setUploading(true);
    setMessage(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/userprofile/upload-resume`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage('File uploaded successfully!');
      setParsedData(response.data.parsedData);
  
    } catch (error) {
      setMessage('Failed to upload file. Please try again.');
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Upload Your Resume</h2>
      <div style={styles.uploadContainer}>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          style={styles.fileInput}
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{
            ...styles.uploadButton,
            ...(isButtonHovered && !uploading ? styles.uploadButtonHover : {}),
          }}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {message && <p style={styles.message}>{message}</p>}

      {/* {parsedData && (
        <div>
          <h3>Parsed Resume Data:</h3>
          <p>
            <strong>Name:</strong> {parsedData.name || 'N/A'}
          </p>
          <p>
            <strong>Email:</strong> {parsedData.contact?.email || 'N/A'}
          </p>
          <p>
            <strong>Phone:</strong> {parsedData.contact?.phone || 'N/A'}
          </p>
          <p>
            <strong>LinkedIn:</strong> {parsedData.contact?.linkedin || 'N/A'}
          </p>
          <p>
            <strong>Summary:</strong> {parsedData.summary || 'N/A'}
          </p>

          {parsedData.skills && parsedData.skills.length > 0 && (
            <div>
              <strong>Skills:</strong>
              <ul>
                {parsedData.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          )}

          {parsedData.education && parsedData.education.length > 0 && (
            <div>
              <strong>Education:</strong>
              <ul>
                {parsedData.education.map((edu, index) => (
                  <li key={index}>{edu}</li>
                ))}
              </ul>
            </div>
          )}

          {parsedData.experience && parsedData.experience.length > 0 && (
            <div>
              <strong>Experience:</strong>
              <ul>
                {parsedData.experience.map((exp, index) => (
                  <li key={index}>{exp}</li>
                ))}
              </ul>
            </div>
          )}

          {parsedData.projects && parsedData.projects.length > 0 && (
            <div>
              <strong>Projects:</strong>
              <ul>
                {parsedData.projects.map((project, index) => (
                  <li key={index}>{project}</li>
                ))}
              </ul>
            </div>
          )}

          {parsedData.certifications && parsedData.certifications.length > 0 && (
            <div>
              <strong>Certifications:</strong>
              <ul>
                {parsedData.certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </div>
          )}

          {parsedData.involvements && parsedData.involvements.length > 0 && (
            <div>
              <strong>Involvements:</strong>
              <ul>
                {parsedData.involvements.map((involvement, index) => (
                  <li key={index}>{involvement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )} */}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  header: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  },
  uploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  fileInput: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  uploadButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  uploadButtonHover: {
    backgroundColor: '#218838',
  },
  message: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#333',
  },
};

export default ResumeUpload;
