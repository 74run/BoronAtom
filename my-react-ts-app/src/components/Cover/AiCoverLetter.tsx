import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wand2, User, Edit2, Save, Download } from "lucide-react";
import { Container, Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import NavigationBar from '../NavigationBar';
import Footer from '../Footer';
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
    doc.text(`${personalDetails.address}`, marginLeft, marginTop + 6);
 

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
    setShowModal(false);
  };

  return (
<>
      <style>
        {`
        body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #0d1b2a;
  color: #ffffff;
  display: block; /* Change to block instead of flex */
  margin-top: 8rem;
   height: 100vh; /* Full viewport height */
  /* Remove default body margin */
    text-align: center; /* Ensure full page height */
}

.container {
  width: 100%;
}

.container-cover {
  text-align: center;

    flex-direction: column;
    align-items: center;
    justify-content: center;
  width: 65%; /* Allow full width */
  max-width: 1500px; /* Max width to control how wide it can go */
  background-color: #1b263b;
  padding: 30px;
  border-radius: 10px;
  
  margin: 0 auto; /* Center horizontally */
  
   
}

h1 {
    color: #00ff87;
    font-size: 2em;
    margin-bottom: 10px;
}

p {
    color: #a0aec0;
    margin-bottom: 20px;
}
        .form-group {
            text-align: left;
            margin-bottom: 0px;
        }
        .form-group .label-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            padding: 10px 0;
        }
        .form-group label {
            font-weight: bold;
        }
        .form-group textarea {
            width: 100%;
            height: 250px;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #2d3748;
            background-color: #0d1b2a;
            color: #a0aec0;
            resize: none;
      
        }
        .form-group textarea::placeholder {
            color: #718096;
        }
        .form-group .add-details button {
            background-color: #2d3748;
            color: #a0aec0;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
        }
        .form-group .add-details button i {
            margin-right: 5px;
        }
        .form-group .add-details button:hover {
            background-color: #4a5568;
        }
        .generate-button {
            text-align: center;
        }
        .generate-button button {
            background-color: #000000; /* Black background color */
            color: #ffffff;
            border: none;
            padding: 15px 30px;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 45px;
        }
        .generate-button button i {
            margin-right: 10px;
        }
        .generate-button button:hover {
            background-color: #2d3748;
        }

        `}
      </style>

      <head>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"></link>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>

    </head>

    <NavigationBar UserDetail={userDetails} />

      <h1 className="text-4xl font-bold text-emerald-400 mb-3">AI Cover Letter Generator</h1>
      <p className="text-slate-300">
        Transform your job description into a compelling cover letter
      </p>

      <div className="container-cover">
      <div className="form-group">
            <div className="label-container">
                <label htmlFor="job-description">Job Description</label>
                <div className="add-details">
                    <button><i className="fas fa-user"></i> Add Personal Details</button>
                </div>
            </div>
            <textarea id="job-description" placeholder="Paste the job description here..." value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="mb-(-1)"
              disabled={loading}></textarea>
        </div>
        <div className="generate-button">
          <Button
          className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white w-full flex items-center justify-center gap-2"
            onClick={handleGenerateCoverLetter}
            disabled={loading}
           >
            <Wand2 className="w-4 h-4"/> 
            {loading ? 'Generating...' : 'Generate Cover Letter'}
          </Button>

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

        </div>
      </div>

      {coverLetter && (
          
        

            <Card className="bg-slate-800 border-slate-700">
           
            
            <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-slate-200">Generated Cover Letter</CardTitle>

            <div className="flex gap-2">
                <Button variant="ghost"  onClick={handleEditToggle} className="text-slate-400 hover:text-emerald-400 p-2">
                   {isEditable ? 'Stop Editing' : <Edit2 className="w-4 h-4" />}
                </Button>

                {isEditable && (
                <Button variant="ghost"   onClick={handleSaveCoverLetter} className="text-slate-400 hover:text-emerald-400 p-2">
                  <Save className="w-4 h-4" />
                </Button>
                  )}

                <Button variant="ghost" onClick={handleDownloadPDF} className="text-slate-400 hover:text-emerald-400 p-2">
                  <Download className="w-4 h-4" />
                </Button>
              </div>


              </CardHeader>
      

            <CardContent>

              <Form.Control
              as="textarea"
              rows={30}
              value={coverLetter}
              onChange={handleCoverLetterChange}
              className="p-3 border rounded"
              style={{
                width: '80%',
                margin: '0 auto',
                display: 'block',
                whiteSpace: 'pre-wrap',
                backgroundColor: '#1c1c1e',
                color: '#f5f5f5',
                border: '1px solid #444',
                borderRadius: '8px'
              }}
              readOnly={!isEditable}
            />

            
              </CardContent>

              </Card>

           
     
        )}

      {showPersonalDetails && (
        <div className="modal" >
          <div className="modal-content">
            <h2 className="text-xl font-bold text-white mb-4">
              Personal Details
            </h2>
            <form>
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
              <button
                type="button"
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => setShowPersonalDetails(false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
  </>
  );
};

export default CoverLetterGenerator;
