import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';
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

interface PersonalDetails {
  name: string;
  address: string;
  cityStateZip: string;
  emailAddress: string;
  phoneNumber: string;
  date: string;
}

const COVER_LETTER_EXPIRATION_TIME = 3600000; // 1 hour in milliseconds

const CoverLetter: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const { userID } = useParams();

  // Personal Details Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    name: '',
    address: '',
    cityStateZip: '',
    emailAddress: '',
    phoneNumber: '',
    date: '',
  });

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

    // Load saved personal details from local storage if available
    if (savedPersonalDetails) {
      setPersonalDetails(JSON.parse(savedPersonalDetails));
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
    doc.text(`${personalDetails.address}`, marginLeft, marginTop+6 );
    doc.text(`${personalDetails.cityStateZip}`, marginLeft, marginTop+12 );
    doc.text(`${personalDetails.emailAddress}`, marginLeft, marginTop+17 );
    doc.text(`${personalDetails.phoneNumber}`, marginLeft, marginTop+24);
    doc.text(`${personalDetails.date}`, marginLeft, marginTop + 30);

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
    <div style={{ backgroundColor: '#1c1c1e', color: '#f5f5f5', minHeight: '100vh', paddingBottom: '50px', paddingTop: '50px' }}>
      <NavigationBar UserDetail={userDetails} />
      <Container className="mt-5" style={{ paddingBottom: '50px', paddingTop: '50px', backgroundColor: '#2d2d30', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}>
        <h1 className="text-center mb-4" style={{ color: '#4CAF50', fontFamily: "'Roboto Slab', serif", fontSize: '2rem', fontWeight: 700 }}>
          <strong>AI-Powered Cover Letter Generator</strong>
          
        </h1>

        {/* Button to open the modal for personal details */}
        <div className="text-center mb-4">
          <Button
            variant="primary"
            onClick={() => setShowModal(true)} // Show modal on click
            className="w-50"
            style={{ backgroundColor: '#007bff', borderRadius: '8px', transition: 'background-color 0.3s' }}
          >
            Fill Personal Details
          </Button>


        </div>

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
              disabled={loading}
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

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

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

      <br></br>
      <br></br>

      <p>“Please edit and remove the personal details generated by AI in the cover letter. These details are used to print at the beginning.”</p>

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


      {/* Modal for Personal Details */}
<Modal 
  show={showModal} 
  onHide={() => setShowModal(false)} 
  centered
  style={{ backgroundColor: '#1c1c1e', color: '#f5f5f5' }} // Dark mode for modal
>
  <Modal.Header 
    closeButton 
    style={{ backgroundColor: '#2d2d30', color: '#f5f5f5' }} // Dark mode for header
  >
    <Modal.Title>Personal Details</Modal.Title>
  </Modal.Header>
  <Modal.Body style={{ backgroundColor: '#1c1c1e', color: '#f5f5f5' }}> {/* Dark mode for body */}
    <Form>
      <Form.Group controlId="formName">
      <p>“Please edit and remove the personal details generated by AI in the cover letter. These details are used to print at the beginning.”</p>
        <Form.Label style={{ color: '#f5f5f5' }}>Your Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={personalDetails.name}
          onChange={handlePersonalDetailChange}
          style={{
            backgroundColor: '#2d2d30',
            color: '#f5f5f5',
            border: '1px solid #444',
            borderRadius: '8px',
          }}
        />
      </Form.Group>
      <Form.Group controlId="formAddress" className="mt-3">
        <Form.Label style={{ color: '#f5f5f5' }}>Your Address</Form.Label>
        <Form.Control
          type="text"
          name="address"
          value={personalDetails.address}
          onChange={handlePersonalDetailChange}
          style={{
            backgroundColor: '#2d2d30',
            color: '#f5f5f5',
            border: '1px solid #444',
            borderRadius: '8px',
          }}
        />
      </Form.Group>
      <Form.Group controlId="formCityStateZip" className="mt-3">
        <Form.Label style={{ color: '#f5f5f5' }}>City, State, Zip Code</Form.Label>
        <Form.Control
          type="text"
          name="cityStateZip"
          value={personalDetails.cityStateZip}
          onChange={handlePersonalDetailChange}
          style={{
            backgroundColor: '#2d2d30',
            color: '#f5f5f5',
            border: '1px solid #444',
            borderRadius: '8px',
          }}
        />
      </Form.Group>
      <Form.Group controlId="formEmailAddress" className="mt-3">
        <Form.Label style={{ color: '#f5f5f5' }}>Email Address</Form.Label>
        <Form.Control
          type="email"
          name="emailAddress"
          value={personalDetails.emailAddress}
          onChange={handlePersonalDetailChange}
          style={{
            backgroundColor: '#2d2d30',
            color: '#f5f5f5',
            border: '1px solid #444',
            borderRadius: '8px',
          }}
        />
      </Form.Group>
      <Form.Group controlId="formPhoneNumber" className="mt-3">
        <Form.Label style={{ color: '#f5f5f5' }}>Phone Number</Form.Label>
        <Form.Control
          type="tel"
          name="phoneNumber"
          value={personalDetails.phoneNumber}
          onChange={handlePersonalDetailChange}
          style={{
            backgroundColor: '#2d2d30',
            color: '#f5f5f5',
            border: '1px solid #444',
            borderRadius: '8px',
          }}
        />
      </Form.Group>
      <Form.Group controlId="formDate" className="mt-3">
        <Form.Label style={{ color: '#f5f5f5' }}>Date</Form.Label>
        <Form.Control
          type="date"
          name="date"
          value={personalDetails.date}
          onChange={handlePersonalDetailChange}
          style={{
            backgroundColor: '#2d2d30',
            color: '#f5f5f5',
            border: '1px solid #444',
            borderRadius: '8px',
          }}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer style={{ backgroundColor: '#2d2d30' }}> {/* Dark mode for footer */}
    <Button 
      variant="secondary" 
      onClick={() => setShowModal(false)} 
      style={{ backgroundColor: '#444', borderRadius: '8px', color: '#f5f5f5' }}
    >
      Close
    </Button>
    <Button 
      variant="primary" 
      onClick={handleSavePersonalDetails}
      style={{ backgroundColor: '#007bff', borderRadius: '8px', color: '#f5f5f5' }}
    >
      Save Personal Details
    </Button>
  </Modal.Footer>
</Modal>

    </div>


  );
};

export default CoverLetter;
