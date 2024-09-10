import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import NavigationBar from '../NavigationBar';
import Footer from '../Footer';
import jsPDF from 'jspdf';

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

const COVER_LETTER_EXPIRATION_TIME = 3600000; // 1 hour in milliseconds

const CoverLetter: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false); // New state to control edit mode
  const { userID } = useParams();

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

  // Load the saved cover letter from local storage
  useEffect(() => {
    const savedCoverLetter = localStorage.getItem('coverLetter');
    const savedTimestamp = localStorage.getItem('coverLetterTimestamp');

    if (savedCoverLetter && savedTimestamp) {
      const currentTime = new Date().getTime();
      const storedTime = parseInt(savedTimestamp, 10);

      // Check if the saved cover letter has expired
      if (currentTime - storedTime > COVER_LETTER_EXPIRATION_TIME) {
        localStorage.removeItem('coverLetter');
        localStorage.removeItem('coverLetterTimestamp');
      } else {
        setCoverLetter(savedCoverLetter);
        setIsEditable(false);
      }
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

      // Save the generated cover letter and current time to local storage
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

  const handleCoverLetterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCoverLetter(e.target.value);
    localStorage.setItem('coverLetter', e.target.value);
    localStorage.setItem('coverLetterTimestamp', new Date().getTime().toString()); // Update timestamp when changes are made
  };

  const handleEditToggle = () => {
    setIsEditable(!isEditable); // Toggle edit mode
  };

  const handleSaveCoverLetter = () => {
    localStorage.setItem('coverLetter', coverLetter);
    localStorage.setItem('coverLetterTimestamp', new Date().getTime().toString()); // Update timestamp when saving
    setIsEditable(false); 
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const marginLeft = 15;
    const marginTop = 20;
    const maxLineWidth = 180; // Width of the text
    const fontSize = 11; // Smaller font size for better fit
    const lineHeight = 0.5;  // Adjust the line height here
    const paragraphSpacing = 7;  // Space between paragraphs
  
    doc.setFont('Times New Roman', '');
    doc.setFontSize(fontSize);
  
    const lines = doc.splitTextToSize(coverLetter, maxLineWidth);
    let verticalOffset = marginTop;
  
    lines.forEach((line: any, index: number) => {
      if (verticalOffset + fontSize * lineHeight > doc.internal.pageSize.height - marginTop) {
        doc.addPage();
        verticalOffset = marginTop;
      }
  
      doc.text(line, marginLeft, verticalOffset);
  
      // Check if the next line starts a new paragraph by detecting double newlines
      if (index < lines.length - 1 && lines[index + 1] === "") {
        verticalOffset += paragraphSpacing;  // Extra space for new paragraph
      } else {
        verticalOffset += fontSize * lineHeight;  // Normal line height
      }
    });
  
    doc.save('cover-letter.pdf');
  };
  

  return (
    <div style={{ backgroundColor: '#1c1c1e', color: '#f5f5f5', minHeight: '100vh', paddingBottom: '50px', paddingTop: '50px' }}>
      <NavigationBar UserDetail={userDetails} />
      <Container className="mt-5" style={{ paddingBottom: '50px', paddingTop: '50px', backgroundColor: '#2d2d30', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}>
        <h1 className="text-center mb-4" style={{ color: '#4CAF50', fontFamily: "'Roboto Slab', serif", fontSize: '2rem', fontWeight: 700 }}>
          <strong>AI-Powered Cover Letter Generator</strong>
        </h1>
        <Form>
          <Form.Group controlId="jobDescription">
            <Form.Label style={{ color: '#f5f5f5' }}>Job Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="mb-4"
              style={{ backgroundColor: '#1c1c1e', color: '#f5f5f5', border: '1px solid #444', borderRadius: '8px' }}
              disabled={loading} // Disable input while loading
            />
          </Form.Group>
          <Button
            variant="primary"
            onClick={handleGenerateCoverLetter}
            disabled={loading}
            className="w-100"
            style={{ backgroundColor: '#007bff', borderRadius: '8px', transition: 'background-color 0.3s' }}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Generate Cover Letter'}
          </Button>
        </Form>

        {error && <Alert variant="danger" className="mt-4">{error}</Alert>}

        {coverLetter && (
          <div className="mt-4">
            <div style={{ textAlign: 'center', width: '100%', marginBottom: '20px' }}>
              <h2 style={{ color: '#4CAF50', fontFamily: "'Roboto Slab', serif", fontSize: '1.5rem', fontWeight: 700 }}>
                <strong>Generated Cover Letter</strong>
              </h2>

              <Button
                variant="secondary"
                onClick={handleEditToggle}
                className="mt-3"
                style={{ backgroundColor: '#6c757d', borderRadius: '8px', transition: 'background-color 0.3s' }}
              >
                {isEditable ? 'Stop Editing' : 'Edit Cover Letter'}
              </Button>

              {isEditable && (
                <Button
                  variant="success"
                  onClick={handleSaveCoverLetter}
                  className="mt-3 ms-2"
                  style={{ backgroundColor: '#28a745', borderRadius: '8px', transition: 'background-color 0.3s' }}
                >
                  Save Cover Letter
                </Button>
              )}

              <Button
                variant="info"
                onClick={handleDownloadPDF}
                className="mt-3 ms-2"
                style={{ backgroundColor: '#17a2b8', borderRadius: '8px', transition: 'background-color 0.3s' }}
              >
                Download as PDF
              </Button>
            </div>

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
          </div>
        )}
      </Container>
    </div>
  );
};

export default CoverLetter;
