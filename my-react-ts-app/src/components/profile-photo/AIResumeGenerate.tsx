// ResumeBuilder.tsx
import React, { useEffect, useState } from 'react';
import { Upload, FileText, Send, Download, Loader } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import axios from 'axios';
import { useParams } from 'react-router-dom';



interface UserDetails {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    // Add other fields as needed
  }
  
  interface ParsedData {
    name?: string;
    contact?: {
      email?: string;
      phone?: string;
      linkedin?: string;
    };
    summary?: string;
    skills?: string[];
    education?: string[];
    experience?: string[];
    projects?: string[];
    certifications?: string[];
    involvements?: string[];
  }
  
  
  interface ContactDetails {
    name: string;
    email: string;
    phoneNumber: string;
  }
  
  
  interface EduDetails {
    education: Array<{
      university: string;
      cgpa: string;
      degree: string;
      major: string;
      startDate: { month: string; year: string };
      endDate: { month: string; year: string };
      includeInResume: boolean;
      isPresent?: boolean;
    }>;
    experience: Array<{
      jobTitle: string;
    company: string;
    location: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string;
    includeInResume: boolean;
    isPresent?: boolean;
    }>
    summary: Array<{
        content: string;
      
    }>
    project: Array<{
      name: string;
      startDate: { month: string; year: string };
      endDate: { month: string; year: string };
      skills: string;
      description: string;
      includeInResume: boolean;
      isPresent?: boolean;
    }>
    involvement: Array<{
    organization: string;
    role: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string;
    includeInResume: boolean;
    isPresent?: boolean;
    }>
    certification: Array<{
    name: string;
    issuedBy: string;
    issuedDate: { month: string; year: string };
    expirationDate: { month: string; year: string };
    url: string;
    includeInResume: boolean;
    }>
    skills: Array<{
      domain: string;
      name: string;
      includeInResume: boolean;
    }>
    contact: Array<{
      name: string;
      email: string;
      phoneNumber: string;
      linkedIn: string;
    }>
  }
  
  interface Skill {
    _id: string;
    domain: string;
    name: string;
    includeInResume: boolean;
  }
  
  interface Education {
    _id: string;
    university: string;
    cgpa: string;
    degree: string;
    major: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    includeInResume: boolean;
    isPresent?: boolean;
  }
  
  interface Summary {
    _id: string;
  content: string;
  }
  
  interface Experience {
    _id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string;
    includeInResume: boolean;
    isPresent?: boolean;
  }
  
  interface Involvement {
    _id: string;
    organization: string;
    role: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string;
    includeInResume: boolean;
    isPresent?: boolean;
   
  }
  
  interface Certification {
    _id: string;
    name: string;
    issuedBy: string;
    issuedDate: { month: string; year: string };
    expirationDate: { month: string; year: string };
    url: string;
    includeInResume: boolean;
    
  }
  
  interface Project {
    _id: string;
    name: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    skills: string;
    description: string;
    includeInResume: boolean;
    isPresent?: boolean;
  }

  



const ResumeBuilder: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [eduDetails, setEduDetails] = useState<EduDetails | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userID } = useParams();

  const [optimizedSummary, setOptimizedSummary] = useState('');

const handleOptimize = async () => {
  if (!jobDescription.trim()) {
    setError('Please enter a job description');
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/userprofile/generate-resume/${userID}/optimize`,
      { jobDescription }
    );

    setOptimizedSummary(response.data.text);
  } catch (err) {
    setError('Failed to optimize resume. Please try again.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};
      



  return (
  <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold mb-2">AI Resume Optimizer</h1>
      <p className="text-gray-600">Tailor your resume to match job descriptions perfectly</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Job Description Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Job Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full h-48 p-3 border rounded-lg resize-none"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <button
            onClick={handleOptimize}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader className="w-4 h-4 animate-spin" /> Optimizing...</>
            ) : (
              <><Send className="w-4 h-4" /> Optimize Resume</>
            )}
          </button>
        </CardContent>
      </Card>

      {/* Generated Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Optimized Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="w-full h-48 p-3 border rounded-lg overflow-auto">
            {optimizedSummary || "Generated summary will appear here..."}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
}

export default ResumeBuilder;
