import React, { useRef, useState, useEffect } from "react";
import { Pencil } from "react-bootstrap-icons";
import Modal from "./Model";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { pdf, Document, Page, Text } from '@react-pdf/renderer';
import Latex from 'react-latex';

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  // Add other fields as needed
}

interface ProfileProps {
  UserDetail: UserDetails | null;
}

const Profile: React.FC<ProfileProps> = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const avatarUrl = useRef<string>(
    "https://avatarfiles.alphacoders.com/161/161002.jpg"
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [fullImageModalOpen, setFullImageModalOpen] = useState<boolean>(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);

  const { userID } = useParams();

  const updateAvatar = (imgSrc: string) => {
    avatarUrl.current = imgSrc;
  };

  useEffect(() => {
    // Make an HTTP request to fetch user details based on the user ID
    axios.get(`http://localhost:3001/api/userprofile/details/${userID}`)
      .then(response => {
        setUserDetails(response.data.user);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });
  }, [userID]);

  const generatePdf = () => {
 
  
    const educations = [
      {
        institute: "Saint Louis University",
        location: "St. Louis, MO",
        graduationDate: "05/2025",
        degree: "MS in Analytics",
        GPA: "3.9/4.0",
      },
      {
        institute: "Visvesvaraya National Institute of Technology",
        location: "Nagpur, India",
        graduationDate: "05/2022",
        degree: "BTech in Mechanical Engineering",
        CGPA: "7.00/10.00",
      },
      // Add more education entries if needed
    ];
  
    const educationSection = educations
      .map(
        (education) => `
        \\subsection*{${education.institute}}
        ${education.location} -- Expected Graduation: ${education.graduationDate}
        \\textit{${education.degree} \\labelitemi ${education.GPA || education.CGPA}}
      `
      )
      .join("\n");
  
    const latexCode = `
      \\documentclass{article}
      \\usepackage{fullpage}
      \\usepackage{amsmath}
      \\usepackage{amssymb}
      \\usepackage[T1]{fontenc}
      \\usepackage{fancyhdr}
      \\usepackage{lastpage}
      \\usepackage{graphicx}
      \\usepackage{fontawesome}
      \\usepackage{setspace}
      \\usepackage{hyperref}
      \\usepackage{url}
      
      \\usepackage{lipsum}
      
      \\newcommand\\blfootnote[1]{%
        \\begingroup
        \\renewcommand\\thefootnote{}\\footnote{#1}%
        \\addtocounter{footnote}{-1}%
        \\endgroup
      }
      
      \\begin{document}
      
      \\textbf{First Name:} ${userDetails?.firstName}
      \\par
      \\textbf{Last Name:} ${userDetails?.lastName}
      \\par
      \\textbf{email:} ${userDetails?.email}
      
      \\section*{Education}
      
      ${educationSection}
      
      % Add more sections if needed
      
      \\end{document}
    `;
    
    axios.post('http://localhost:3001/compile-latex', { latexCode }, { responseType: 'blob' })
      .then(response => {
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPreviewPdfUrl(pdfUrl);
      })
      .catch(error => {
        console.error('Error compiling LaTeX:', error);
      });
  };
  
  

  
  const previewPdf = () => {
    if (previewPdfUrl) {
      // Open the PDF in a new tab/window
      window.open(previewPdfUrl, '_blank');
    }
  };

  return (
    <div className="container mt-(-3)">
    <div className="d-flex flex-column align-items-center pt-0">
      <div className="position-relative">
        {/* Add onClick handler to the image */}
        <img
          src={avatarUrl.current}
          alt="Avatar"
          className="rounded-circle border border-secondary"
          style={{ width: "150px", height: "150px", cursor: "pointer" }}
          onClick={() => setFullImageModalOpen(true)}
        />
        <button
          className="position-absolute bottom-0 start-50 translate-middle p-1 rounded-circle bg-dark border border-dark"
          title="Change photo"
          onClick={() => setModalOpen(true)}
        >
          <Pencil size={50} style={{width: "20px", height: "20px"}} className="text-light" />
        </button>
      </div>
      <h2 className="text-black font-weight-bold mt-4">{userDetails && `${userDetails.firstName} ${userDetails.lastName}`}
</h2>
      <p className="text-secondary text-sm mt-2">{userDetails && `${userDetails.email}`}
</p>

      {/* Edit Avatar Modal */}
      {modalOpen && (
        <Modal
          updateAvatar={updateAvatar}
          closeModal={() => setModalOpen(false)}
          currentAvatar={avatarUrl.current}  
        />
      )}
       
        {/* PDF Download and Preview Buttons */}
        <div className="d-flex justify-content-end">
      <button className="btn btn-primary mr-2" onClick={generatePdf}>
        Download PDF
      </button>
      <button className="btn btn-secondary" onClick={previewPdf}>
        Preview PDF
      </button>
    </div>
        {/* PDF Preview */}
        {previewPdfUrl && (
          <iframe
            title="PDF Preview"
            src={previewPdfUrl}
            style={{ width: '100%', height: '500px', border: 'none' }}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
