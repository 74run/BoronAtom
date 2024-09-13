import React, { useState } from 'react';
import { AiOutlineFileAdd } from 'react-icons/ai';
import axios from 'axios';

interface UploadResumeProps {
  userID: string | undefined;
}

const UploadResume: React.FC<UploadResumeProps> = ({ userID }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
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
      // You can also handle the parsed data here if needed
      // const parsedData = response.data.parsedData;
    } catch (error) {
      setMessage('Failed to upload file. Please try again.');
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        flex: "1",
        marginLeft: "10px",
        marginTop: "10px",
        maxWidth: "100%",
        backgroundColor: "#2d2d30",
        padding: "15px",
        borderRadius: "12px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          color: '#4CAF50',
          fontFamily: "'Roboto Slab', serif",
        }}
      >
        Upload Your Resume
      </h2>
      <div
        style={{
          display: 'inline-block',
          width: '100%',
          padding: '15px',
          border: '2px dashed #4A90E2',
          borderRadius: '8px',
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        <input
          type="file"
          id="resumeInput"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
        />
        <label
          htmlFor="resumeInput"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <AiOutlineFileAdd style={{ fontSize: '2rem', color: '#4A90E2' }} />
          <span style={{ marginTop: '10px', color: '#bbb' }}>
            {selectedFile ? selectedFile.name : 'Upload file'}
          </span>
        </label>
      </div>
      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            borderRadius: '8px',
            backgroundColor: uploading ? '#6c757d' : '#4CAF50',
            color: '#fff',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      )}
      {message && (
        <p style={{ marginTop: '15px', color: '#4CAF50', fontSize: '1rem' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default UploadResume;
