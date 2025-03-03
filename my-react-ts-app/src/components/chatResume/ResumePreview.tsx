import React from 'react';

interface ResumeData {
  personalInfo: any;
  experience: any[];
  education: any[];
  skills: string[];
}

interface ResumePreviewProps {
  data: ResumeData;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Resume Preview</h1>
      
      {/* Personal Info Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
        {/* Render personal info */}
      </section>

      {/* Experience Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            {/* Render experience items */}
          </div>
        ))}
      </section>

      {/* Education Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Education</h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-4">
            {/* Render education items */}
          </div>
        ))}
      </section>

      {/* Skills Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, index) => (
            <span key={index} className="bg-gray-100 px-3 py-1 rounded">
              {skill}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResumePreview;
