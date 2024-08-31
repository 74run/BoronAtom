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
  };
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
          id="fileInput"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          style={styles.hiddenFileInput}
        />
        <label
          htmlFor="fileInput"
          style={{
            ...styles.customFileLabel,
            ...(selectedFile ? styles.customFileLabelSelected : {}),
          }}
        >
          {selectedFile ? selectedFile.name : "Choose a file"}
        </label>
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
    fontFamily: 'Arial, sans-serif',
  },
  uploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  hiddenFileInput: {
    display: 'none',
  },
  customFileLabel: {
    display: 'inline-block',
    padding: '12px 24px',
    color: '#fff',
    backgroundColor: '#4A90E2', // Blue color
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
    textAlign: 'center',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    width: '100%', // Make the label take the full width
    maxWidth: '300px', // Set a max width for better appearance
  },
  customFileLabelSelected: {
    backgroundColor: '#357ABD', // Darker blue when file is selected
  },
  uploadButton: {
    padding: '10px 20px',
    borderRadius: '30px',
    backgroundColor: '#28a745', // Green color
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
  },
  uploadButtonHover: {
    backgroundColor: '#218838', // Darker green for hover
    boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.3)',
  },
  message: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
  },
};

export default ResumeUpload;
