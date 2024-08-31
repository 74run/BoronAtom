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
    // Add other fields as needed
  }

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
    if (savedCoverLetter) {
      setCoverLetter(savedCoverLetter);
      setIsEditable(false);
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

      setCoverLetter(response.data.coverLetter);
      localStorage.setItem('coverLetter', response.data.coverLetter); // Save to local storage
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
    localStorage.setItem('coverLetter', e.target.value); // Save changes to local storage
  };

  const handleEditToggle = () => {
    setIsEditable(!isEditable); // Toggle edit mode
  };

  const handleSaveCoverLetter = () => {
    localStorage.setItem('coverLetter', coverLetter);
    alert('Cover letter saved successfully!');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const marginLeft = 15;
    const marginTop = 20;
  

    const lineHeight = 0.85; // Decreased line height for tighter spacing
    const maxLineWidth = 180; // Width of the text
    const paragraphSpacing = 0.5;
    const fontSize = 10; // Smaller font size for better fit
    const verticalMargin = marginTop;

    doc.setFont('Times New Roman', ''); // Set font style
    doc.setFontSize(fontSize);

    const lines = doc.splitTextToSize(coverLetter, maxLineWidth);

    let verticalOffset = marginTop;

    

    lines.forEach((line: any, index: any) => {
        // Check if adding this line will exceed the page height
        if (verticalOffset + fontSize * lineHeight > pageHeight - marginTop) {
            doc.addPage(); // Add a new page
            verticalOffset = marginTop; // Reset vertical offset for the new page
        }

        doc.text(line, marginLeft, verticalOffset);

        // Check if the current line is the last line of a paragraph
        if (index < lines.length - 1 && lines[index + 1] === '') {
            verticalOffset += fontSize * paragraphSpacing; // Add extra space after a paragraph
        } else {
            verticalOffset += fontSize * lineHeight; // Regular line spacing
        }
    });

    doc.save('cover-letter.pdf');
  };

  return (
    
    <Container className="mt-5" style={{ paddingBottom: '50px', paddingTop: '50px' }}>
        <NavigationBar UserDetail={userDetails}/>
      <h1 className="text-center mb-4"><strong>AI-Powered Cover Letter Generator</strong></h1>
      <Form>
        <Form.Group controlId="jobDescription">
          <Form.Label>Job Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="mb-4"
            disabled={loading} // Disable input while loading
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={handleGenerateCoverLetter}
          disabled={loading}
          className="w-100"
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Generate Cover Letter'}
        </Button>
      </Form>
  
      {error && <Alert variant="danger" className="mt-4">{error}</Alert>}
  
      {coverLetter && (
        <div className="mt-4" >
         <div style={{ textAlign: 'center', width: '100%', marginBottom: '20px' }}>
  <h2><strong>Generated Cover Letter</strong></h2>
  
  <Button
    variant="secondary"
    onClick={handleEditToggle}
    className="mt-3"
  >
    {isEditable ? 'Stop Editing' : 'Edit Cover Letter'}
  </Button>
  
  {isEditable && (
    <Button
      variant="success"
      onClick={handleSaveCoverLetter}
      className="mt-3 ms-2"
    >
      Save Cover Letter
    </Button>
  )}
  
  <Button
    variant="info"
    onClick={handleDownloadPDF}
    className="mt-3 ms-2"
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
                margin: '0 auto', // Centers the textarea
                display: 'block', // Ensures the element is treated as a block-level element
                whiteSpace: 'pre-wrap',
                backgroundColor: '#f8f9fa'
              }}
            readOnly={!isEditable} // Set to readonly if not editable
          />
         
        </div>
      )}
  
    </Container>


  );
 

  
};



export default CoverLetter;
