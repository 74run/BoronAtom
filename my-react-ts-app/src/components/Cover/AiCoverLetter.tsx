import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wand2, User, Edit2, Save, Download, UserIcon, Loader, X } from "lucide-react";
import { Container, Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import NavigationBar from '../NavigationBar';
import Footer from '../../components/Footer';
import jsPDF from 'jspdf';
import { Card, CardContent, CardHeader, CardTitle } from './card';






interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

interface PersonalDetails {
  name: string;
  address: string;
  cityStateZip: string;
  emailAddress: string;
  phoneNumber: string;
  date: string;
}

const COVER_LETTER_EXPIRATION_TIME = 3600000; // 1 hour in milliseconds

const CoverLetterGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [jobDescription, setJobDescription] = useState<string>('');
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const { userID } = useParams();

  const [showModal, setShowModal] = useState<boolean>(false);
 

    // Fetch user details
    useEffect(() => {
      const fetchData = async () => {
        try {
          const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/details/${userID}`);
          setUserDetails(userResponse.data.user);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [userID]);
  
    // Load the saved cover letter and personal details from local storage
    useEffect(() => {
      const savedCoverLetter = localStorage.getItem('coverLetter');
      const savedTimestamp = localStorage.getItem('coverLetterTimestamp');
      const savedPersonalDetails = localStorage.getItem('personalDetails');
      const savedJobDescription = localStorage.getItem('jobDescription');
  
      if (savedCoverLetter && savedTimestamp) {
        const currentTime = new Date().getTime();
        const storedTime = parseInt(savedTimestamp, 10);
  
        if (currentTime - storedTime > COVER_LETTER_EXPIRATION_TIME) {
          localStorage.removeItem('coverLetter');
          localStorage.removeItem('coverLetterTimestamp');
        } else {
          setCoverLetter(savedCoverLetter);
          setIsEditable(false);
        }
      }
  
      if (savedPersonalDetails) {
        setPersonalDetails(JSON.parse(savedPersonalDetails));
      }
  
      // Load saved job description from local storage if available
      if (savedJobDescription) {
        setJobDescription(savedJobDescription);
      }
    }, []);
  
    const handleGenerateCoverLetter = async () => {
      if (!userID) {
        setError('User ID is missing. Please make sure you are logged in.');
        return;
      }
  
      setLoading(true);
      setError(null);
  
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/userprofile/generate-cover-letter/${userID}`, {
          jobDescription,
        });
  
        const generatedCoverLetter = response.data.coverLetter;
        setCoverLetter(generatedCoverLetter);
  
        localStorage.setItem('coverLetter', generatedCoverLetter);
        localStorage.setItem('coverLetterTimestamp', new Date().getTime().toString());
      } catch (err: any) {
        if (err.response) {
          setError(`Error: ${err.response.status} - ${err.response.data.message || 'Failed to generate cover letter. Please try again.'}`);
        } else {
          setError('Failed to generate cover letter. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
  
    // Save job description to local storage
    const handleSaveJobDescription = () => {
      localStorage.setItem('jobDescription', jobDescription);
      alert('Job Description saved to local storage!');
    };
  
    const handleCoverLetterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCoverLetter(e.target.value);
      localStorage.setItem('coverLetter', e.target.value);
      localStorage.setItem('coverLetterTimestamp', new Date().getTime().toString());
    };
  
    const handleEditToggle = () => {
      setIsEditable(!isEditable);
    };
  
    const handleSaveCoverLetter = () => {
      localStorage.setItem('coverLetter', coverLetter);
      localStorage.setItem('coverLetterTimestamp', new Date().getTime().toString());
      setIsEditable(false);
    };


  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowCoverLetter(true);
    }, 1500);
  };

  const handleDetailsChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setPersonalDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const marginLeft = 15;
    const marginTop = 20;
    const maxLineWidth = 180;
    const fontSize = 11;
    const lineHeight = 0.5;
    const paragraphSpacing = 7;

    doc.setFont('Times New Roman', '');
    doc.setFontSize(fontSize);

    // Add personal details to the top of the PDF
    doc.text(`${personalDetails.name}`, marginLeft, marginTop);
    doc.text(`${personalDetails.email}`, marginLeft, marginTop+6);
    doc.text(`${personalDetails.address}`, marginLeft, marginTop+12);
    doc.text(`${personalDetails.phone}`, marginLeft, marginTop+18);
    doc.text(`${personalDetails.date}`, marginLeft, marginTop + 24);
 

    const lines = doc.splitTextToSize(coverLetter, maxLineWidth);
    let verticalOffset = marginTop + 38;

    lines.forEach((line: any, index: number) => {
      if (verticalOffset + fontSize * lineHeight > doc.internal.pageSize.height - marginTop) {
        doc.addPage();
        verticalOffset = marginTop;
      }

      doc.text(line, marginLeft, verticalOffset);
      if (index < lines.length - 1 && lines[index + 1] === "") {
        verticalOffset += paragraphSpacing;
      } else {
        verticalOffset += fontSize * lineHeight;
      }
    });

    doc.save('cover-letter.pdf');
  };

  // Handle modal form inputs
  const handlePersonalDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSavePersonalDetails = () => {
    localStorage.setItem('personalDetails', JSON.stringify(personalDetails));
    setShowPersonalDetails(false);
  };

  return (
    <div className="app-container">

<NavigationBar UserDetail={userDetails} />

  <div className="page-wrapper">
  <style>
      {`
        .page-wrapper {
          min-height: 100vh;
          padding-top: 80px;
          background-color: rgba(28, 82, 136, 0.1);
        }


        .app-container {
            background-color:rgb(0, 0, 0);
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
          }


        .cover-letter-container {
          max-width: 1800px;
          margin: 0rem auto;
          padding: 2rem;
          background-color: rgba(28, 82, 136, 0.1);
          min-height: calc(100vh - 8rem);
          border-radius: 5px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }

        .navbar {
            position: sticky; /* sticky positioning */
  top: 0; /* attach to the top */
  z-index: 50; /* layer priority */
  width: 100%; /* full width */
  border-bottom: 1px solid var(--border-color); /* bottom border */
  background-color: rgba(var(--background-color), 0.95); /* semi-transparent background */
  backdrop-filter: blur(10px); /* backdrop blur effect */
          }

          @supports (backdrop-filter: blur(10px)) {
  .navbar {
    background-color: rgba(var(--background-color), 0.6); /* alternate background if supported */
  }

          .logo-container {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .logo-container h1 {
            font-size: clamp(1.25rem, 4vw, 1.5rem);
            font-weight: bold;
            color: #63b3ed;
            margin: 0;
          }

          .nav-buttons {
            display: flex;
            gap: 0.75rem;
            align-items: center;
          }

          .nav-button {
            background-color: transparent;
            border: 2px solid #3182ce;
            color: white;
            font-weight: 600;
            padding: 0.5rem 1.25rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: clamp(0.875rem, 2vw, 1rem);
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
          }

          .nav-button.active {
            background-color: #3182ce;
          }

          .nav-button:hover {
            background-color: #3182ce;
            transform: translateY(-2px);
          }

          .nav-button:active {
            transform: translateY(0);
          }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-title {
  color: #63b3ed; // Resume theme green
  font-family: 'Roboto Slab', serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.page-subtitle {
  color: #bbb; // Matching resume subtle text
  font-size: 1.1rem;
  font-family: 'Roboto', sans-serif;
}

.section-title {
  color: #63b3ed;
  font-family: 'Roboto Slab', serif;
  font-size: 1.1rem;
  font-weight: 700;
}

span {
  color: #63b3ed;
}

strong {
  color: #63b3ed;
}

label {
  color: #63b3ed;
}
  // Helper text
.helper-text {
  color: #a0aec0;
}
  
        .split-view {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          height: calc(100vh - 280px);
          min-height: 600px;
        }

        .editor-container, .result-container {
          background-color:rgb(0, 0, 0);
          border: 1px solid #333;
          border-radius: 15px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          background-color:rgb(0, 0, 0);
          border-bottom: 1px solid #444;
        }

        .section-title {
          color: #00cec9;
          font-family: 'Roboto Slab', serif;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .editor-content, .result-content {
          flex: 1;
          padding: 1.25rem;
          overflow: auto;
        }

        .editor-textarea, .result-textarea {
          width: 100%;
          height: 100%;
          padding: 1.25rem;
          background-color: #1c1c1e;
          border: 1px solid #444;
          border-radius: 5px;
          color: #f5f5f5;
          font-size: 0.9rem;
          line-height: 1.6;
          resize: none;
          font-family: 'Roboto', sans-serif;
        }

       .editor-textarea:focus, .result-textarea:focus {
  outline: none;
  border-color: #63b3ed; // Updated focus color
}

        .button-container {
          padding: 1.25rem;
          background-color: #2c2c2e;
          border-top: 1px solid #444;
        }

        .personal-details-btn {
          padding: 0.7rem 1.5rem;
          background-color: #007bff;
          border: none;
          border-radius: 5px;
          color: white;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .personal-details-btn:hover {
          transform: scale(1.05);
        }

       .generate-btn {
  width: 100%;
  padding: 0.7rem 1.5rem;
  background-color: #3182ce; // Updated from #00d084 to blue
  border: none;
  border-radius: 5px;
  color: white; // Updated to white for better contrast
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

       .generate-btn:hover:not(:disabled) {
  transform: scale(1.05);
  background-color: #4299e1; // Lighter blue on hover
}

        .generate-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .action-buttons {
          display: flex;
          gap: 0.75rem;
        }

        .action-btn {
          padding: 0.7rem 1.5rem;
          background-color: #2d3748;
          border: none;
          border-radius: 5px;
          color: #f5f5f5;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }

      .action-btn:hover {
  transform: scale(1.05);
  background-color: #3182ce; // Updated hover color
  color: white;
}

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.75);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: #1b1b2f;
          padding: 2rem;
          border-radius: 5px;
          width: 90%;
          max-width: 500px;
          border: 1px solid #333;
        }

        .modal-content h2 {
  color: #63b3ed; // Updated modal header color
  font-family: 'Roboto Slab', serif;
  margin-bottom: 1.5rem;
}

.modal-content button.save-btn {
  padding: 0.7rem 1.5rem;
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  margin-right: 0.75rem;
}

.modal-content button.save-btn:hover {
  background-color: #4299e1;
  transform: scale(1.05);
}

.modal-content button.close-btn {
  padding: 0.7rem 1.5rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.modal-content button.close-btn:hover {
  background-color: #e53e3e;
  transform: scale(1.05);
}

.button-group {
  display: flex;
  justify-content: flex-start;
  margin-top: 1.5rem;
}

.date-field {
  background-color: #2d3748;
  color: #a0aec0;
  border: 1px solid #444;
  border-radius: 5px;
  padding: 0.75rem;
  width: 100%;
}

.date-field:focus {
  outline: none;
  border-color: #63b3ed;
  box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.1);
}

// Input focus states
.form-group input:focus {
  outline: none;
  border-color: #63b3ed;
  box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.1);
}

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          color: #f5f5f5;
          margin-bottom: 0.5rem;
          font-family: 'Roboto', sans-serif;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          background-color: #2d3748;
          border: 1px solid #444;
          border-radius: 5px;
          color: #f5f5f5;
        }

        .modal-content button {
          padding: 0.7rem 1.5rem;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }

        .modal-content button:hover {
          transform: scale(1.05);
        }

        @media (max-width: 1024px) {
          .split-view {
            grid-template-columns: 1fr;
            height: auto;
          }

          .editor-container, .result-container {
            height: 500px;
          }
        }
      `}
    </style>

   
      

    <div className="cover-letter-container">

      
      
      <div className="page-header">
        <h1 className="page-title">AI Cover Letter Generator</h1>
        {/* <p className="page-subtitle">Transform your job description into a compelling cover letter</p> */}
      </div>

      <div className="split-view">
        {/* Job Description Side */}
        <div className="editor-container">
          <div className="section-header">
            <span className="section-title" style={{ color: '#00cec9' }}>Job Description</span>
            <button className="personal-details-btn" onClick={() => setShowPersonalDetails(true)}>
              <UserIcon size={16} className="mr-2" />
              Personal Details
            </button>
          </div>

          <div className="editor-content">
            <textarea
              className="editor-textarea"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="button-container">
            <button 
              className="generate-btn"
              onClick={handleGenerateCoverLetter}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  Generate Cover Letter
                </>
              )}
            </button>
          </div>
        </div>

        {/* Cover Letter Side */}
        <div className="result-container">
          <div className="section-header">
            <span className="section-title">Cover Letter</span>
            <div className="action-buttons">
              <button className="action-btn" onClick={handleEditToggle} title={isEditable ? 'Stop Editing' : 'Edit'}>
                {isEditable ? <X size={18} /> : <Edit2 size={18} />}
              </button>
              {isEditable && (
                <button className="action-btn" onClick={handleSaveCoverLetter} title="Save">
                  <Save size={18} />
                </button>
              )}
              <button className="action-btn" onClick={handleDownloadPDF} title="Download PDF">
                <Download size={18} />
              </button>
            </div>
          </div>

          <div className="result-content">
            <textarea
              className="result-textarea"
              value={coverLetter}
              onChange={handleCoverLetterChange}
              readOnly={!isEditable}
              placeholder="Your cover letter will appear here..."
            />
          </div>
        </div>
      </div>
  
    

      {showPersonalDetails && (
  <div className="modal">
    <div className="modal-content">
      <h2 className="text-xl font-bold text-white mb-4">
        Personal Details
      </h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSavePersonalDetails();
      }}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={personalDetails.name}
            onChange={handleDetailsChange}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={personalDetails.email}
            onChange={handleDetailsChange}
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={personalDetails.phone}
            onChange={handleDetailsChange}
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={personalDetails.address}
            onChange={handleDetailsChange}
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            className="date-field"
            value={personalDetails.date || new Date().toISOString().split('T')[0]}
            onChange={handleDetailsChange}
          />
        </div>
        <div className="button-group">
          <button
            type="submit"
            className="save-btn"
          >
            Save
          </button>
          <button
            type="button"
            className="close-btn"
            onClick={() => setShowPersonalDetails(false)}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  </div>
)}

       </div>
    
       </div>
       <Footer />
       </div>
     
);
  
};

export default CoverLetterGenerator;
