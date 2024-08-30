import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';

const CoverLetter: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateCoverLetter = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/generate-cover-letter`, {
        jobDescription,
      });

      setCoverLetter(response.data.coverLetter);
    } catch (err) {
      setError('Failed to generate cover letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">AI-Powered Cover Letter Generator</h1>
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
        <div className="mt-4">
          <h4>Generated Cover Letter:</h4>
          <div className="p-3 border rounded" style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f8f9fa' }}>
            {coverLetter}
          </div>
        </div>
      )}
    </Container>
  );
};



export default CoverLetter;
