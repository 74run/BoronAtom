import React, { useState } from 'react';
import { AiOutlineFileAdd, AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { MdUploadFile } from 'react-icons/md';
import axios from 'axios';

interface UploadResumeProps {
  userID: string | undefined;
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
  };
  summary: Array<{
    content: string;
  }>;
  experience: Array<{
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    isPresent: boolean;
    description: string;
    achievements: string[];
    technologies: string[];
    includeInResume: boolean;
  }>;
  education: Array<{
    university: string;
    degree: string;
    major: string;
    cgpa: string;
    startDate: string;
    endDate: string;
    isPresent: boolean;
    universityUrl: string;
    includeInResume: boolean;
  }>;
  skills: {
    technical: Array<{
      domain: string;
      skills: string[];
    }>;
    soft: string[];
  };
  certifications: Array<{
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expiryDate: string;
    credentialId: string;
    credentialUrl: string;
    includeInResume: boolean;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    startDate: string;
    endDate: string;
    isPresent: boolean;
    githubUrl: string;
    liveUrl: string;
    includeInResume: boolean;
  }>;
  involvement: Array<{
    organization: string;
    role: string;
    startDate: string;
    endDate: string;
    isPresent: boolean;
    description: string;
    includeInResume: boolean;
  }>;
}

const UploadResume: React.FC<UploadResumeProps> = ({ userID, isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  // Add state for tracking which sections to include
  const [includeSections, setIncludeSections] = useState({
    summary: true,
    experience: true,
    education: true,
    skills: true,
    certifications: true,
    projects: true,
    involvement: true
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setParsedData(null);
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
        `${process.env.REACT_APP_API_URL}/api/userprofile/upload-resume/${userID}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setParsedData(response.data.data);
      setMessage('Resume parsed successfully! Please review the extracted information.');
    } catch (error) {
      setMessage('Failed to upload file. Please try again.');
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const transformDates = (data: any) => {
    const transformed = { ...data };

    // Transform education dates
    if (transformed.education) {
      transformed.education = transformed.education.map((edu: any) => ({
        ...edu,
        startDate: {
          month: edu.startDate?.split('/')[0] || '',
          year: edu.startDate?.split('/')[1] || ''
        },
        endDate: {
          month: edu.isPresent ? '' : (edu.endDate?.split('/')[0] || ''),
          year: edu.isPresent ? '' : (edu.endDate?.split('/')[1] || '')
        }
      }));
    }

    // Transform experience dates
    if (transformed.experience) {
      transformed.experience = transformed.experience.map((exp: any) => ({
        ...exp,
        startDate: {
          month: exp.startDate?.split('/')[0] || '',
          year: exp.startDate?.split('/')[1] || ''
        },
        endDate: {
          month: exp.isPresent ? '' : (exp.endDate?.split('/')[0] || ''),
          year: exp.isPresent ? '' : (exp.endDate?.split('/')[1] || '')
        }
      }));
    }

    // Transform project dates
    if (transformed.project) {
      transformed.project = transformed.project.map((proj: any) => ({
        ...proj,
        startDate: {
          month: proj.startDate?.split('/')[0] || '',
          year: proj.startDate?.split('/')[1] || ''
        },
        endDate: {
          month: proj.isPresent ? '' : (proj.endDate?.split('/')[0] || ''),
          year: proj.isPresent ? '' : (proj.endDate?.split('/')[1] || '')
        }
      }));
    }

    // Transform involvement dates
    if (transformed.involvement) {
      transformed.involvement = transformed.involvement.map((inv: any) => ({
        ...inv,
        startDate: {
          month: inv.startDate?.split('/')[0] || '',
          year: inv.startDate?.split('/')[1] || ''
        },
        endDate: {
          month: inv.isPresent ? '' : (inv.endDate?.split('/')[0] || ''),
          year: inv.isPresent ? '' : (inv.endDate?.split('/')[1] || '')
        }
      }));
    }

    // Transform certification dates
    if (transformed.certification) {
      transformed.certification = transformed.certification.map((cert: any) => ({
        ...cert,
        issuedDate: {
          month: cert.issuedDate?.split('/')[0] || '',
          year: cert.issuedDate?.split('/')[1] || ''
        },
        expirationDate: {
          month: cert.expirationDate?.split('/')[0] || '',
          year: cert.expirationDate?.split('/')[1] || ''
        }
      }));
    }

    return transformed;
  };

  const handleSaveToProfile = async () => {
    if (!parsedData || !userID) {
      setMessage('No parsed data to save.');
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      // Transform the data to match the schema
      const transformedData = transformDates(parsedData);

      console.log('Transformed data before saving:', transformedData); // For debugging

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/userprofile/save-parsed-resume/${userID}`,
        {
          includeSections,
          parsedData: transformedData
        }
      );

      setMessage('Resume data saved to your profile successfully!');
      setParsedData(null);
      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error('Error saving resume data:', error);
      setMessage('Failed to save resume data to your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a202c] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border border-white/10">
        <div className="sticky top-0 bg-[#1a202c] px-6 py-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-[#63b3ed] text-xl font-semibold flex items-center gap-2">
            <MdUploadFile size={24} />
            Upload Resume
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <AiOutlineCloseCircle size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="border-2 border-dashed border-[#4A90E2] rounded-xl p-8 text-center cursor-pointer hover:border-[#63b3ed] transition-colors"
               onClick={() => document.getElementById('resumeInput')?.click()}>
            <input
              type="file"
              id="resumeInput"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <AiOutlineFileAdd className="mx-auto text-[#4A90E2] text-5xl mb-4" />
            <p className="text-[#a0aec0] mb-2">
              {selectedFile ? selectedFile.name : 'Drag and drop your resume here or click to browse'}
            </p>
            <p className="text-[#718096] text-sm">
              Supported formats: PDF, DOC, DOCX
            </p>
          </div>

          {selectedFile && !parsedData && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`mt-6 w-full py-3 rounded-lg ${
                uploading 
                  ? 'bg-gray-600' 
                  : 'bg-gradient-to-r from-[#3182ce] to-[#4facfe] hover:-translate-y-0.5'
              } text-white font-medium transition-all duration-200`}
            >
              {uploading ? 'Parsing...' : 'Parse Resume'}
            </button>
          )}

          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              message.includes('successfully') 
                ? 'bg-green-900/30 text-green-400' 
                : 'bg-red-900/30 text-red-400'
            }`}>
              {message}
            </div>
          )}

          {parsedData && (
            <div className="mt-8 space-y-6">
              <h3 className="text-[#63b3ed] text-lg font-semibold border-b border-white/10 pb-2">
                Parsed Resume Data
              </h3>
              
              {/* Render parsed sections with the same styling as your profile cards */}
              {/* Personal Info */}
              <div className="bg-[#1a202c]/50 rounded-lg p-4 border border-white/5">
                <h4 className="text-[#63b3ed] font-medium mb-3">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4 text-[#a0aec0]">
                  <p>Name: {parsedData.personalInfo.name}</p>
                  <p>Email: {parsedData.personalInfo.email}</p>
                  <p>Phone: {parsedData.personalInfo.phone}</p>
                  <p>Location: {parsedData.personalInfo.location}</p>
                  <p>LinkedIn: {parsedData.personalInfo.linkedIn}</p>
                </div>
              </div>

              {/* Summary Section */}
              <div className="bg-[#1a202c]/50 rounded-lg p-4 border border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[#63b3ed] font-medium">Professional Summary</h4>
                  <label className="flex items-center gap-2 text-[#a0aec0]">
                    <input
                      type="checkbox"
                      checked={includeSections.summary}
                      onChange={(e) => setIncludeSections({
                        ...includeSections,
                        summary: e.target.checked
                      })}
                      className="rounded border-gray-600 bg-gray-700 text-[#4facfe] focus:ring-[#4facfe]"
                    />
                    Include in profile
                  </label>
                </div>
                <div className="text-[#a0aec0]">
                  <p>{typeof parsedData.summary === 'string' ? parsedData.summary : parsedData.summary[0]?.content}</p>
                </div>
              </div>

              {/* Experience Section */}
              <div className="bg-[#1a202c]/50 rounded-lg p-4 border border-white/5">
                <div className="section-header">
                  <h4>Experience</h4>
                  <label>
                    <input
                      type="checkbox"
                      checked={includeSections.experience}
                      onChange={(e) => setIncludeSections({
                        ...includeSections,
                        experience: e.target.checked
                      })}
                    />
                    Include in profile
                  </label>
                </div>
                <div className="content">
                  {parsedData.experience.map((exp, index) => (
                    <div key={index} className="item">
                      <h5>{exp.jobTitle} at {exp.company}</h5>
                      <p>{exp.location}</p>
                      <p>{exp.startDate} - {exp.isPresent ? 'Present' : exp.endDate}</p>
                      <p>{exp.description}</p>
                      <div>
                        <strong>Achievements:</strong>
                        <ul>
                          {exp.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Technologies:</strong>
                        {exp.technologies.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Section */}
              <div className="bg-[#1a202c]/50 rounded-lg p-4 border border-white/5">
                <div className="section-header">
                  <h4>Education</h4>
                  <label>
                    <input
                      type="checkbox"
                      checked={includeSections.education}
                      onChange={(e) => setIncludeSections({
                        ...includeSections,
                        education: e.target.checked
                      })}
                    />
                    Include in profile
                  </label>
                </div>
                <div className="content">
                  {parsedData.education.map((edu, index) => (
                    <div key={index} className="item">
                      <h5>{edu.degree} in {edu.major}</h5>
                      <p>{edu.university}</p>
                      <p>CGPA: {edu.cgpa}</p>
                      <p>{edu.startDate} - {edu.isPresent ? 'Present' : edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Section */}
              <div className="bg-[#1a202c]/50 rounded-lg p-4 border border-white/5">
                <div className="section-header">
                  <h4>Skills</h4>
                  <label>
                    <input
                      type="checkbox"
                      checked={includeSections.skills}
                      onChange={(e) => setIncludeSections({
                        ...includeSections,
                        skills: e.target.checked
                      })}
                    />
                    Include in profile
                  </label>
                </div>
                <div className="content">
                  <div>
                    <strong>Technical Skills:</strong>
                    {parsedData.skills.technical.map((domain, index) => (
                      <div key={index}>
                        <h6>{domain.domain}</h6>
                        <p>{domain.skills.join(', ')}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <strong>Soft Skills:</strong>
                    <p>{parsedData.skills.soft.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Add similar sections for Certifications, Projects, and Involvement */}
              
              <div className="sticky bottom-0 bg-[#1a202c] py-4 mt-8 flex justify-end gap-4">
                <button
                  onClick={() => {
                    setParsedData(null);
                    setSelectedFile(null);
                  }}
                  className="px-6 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <AiOutlineCloseCircle className="inline mr-2" />
                  Discard
                </button>
                <button
                  onClick={handleSaveToProfile}
                  disabled={saving}
                  className={`px-6 py-2 rounded-lg ${
                    saving
                      ? 'bg-gray-600'
                      : 'bg-gradient-to-r from-[#38a169] to-[#68d391] hover:-translate-y-0.5'
                  } text-white font-medium transition-all duration-200`}
                >
                  <AiOutlineCheckCircle className="inline mr-2" />
                  {saving ? 'Saving...' : 'Save to Profile'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadResume;
