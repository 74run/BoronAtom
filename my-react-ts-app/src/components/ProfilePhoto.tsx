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
  
    const experiences = [
      {
        position: "Data Analyst Intern",
        company: "TechCorp",
        location: "Remote",
        startDate: "01/2024",
        endDate: "04/2024",
        responsibilities: [
          "Conducted data analysis and visualization.",
          "Collaborated with cross-functional teams on various projects.",
        ],
      },
      // Add more experience entries if needed
    ];
  
    // Add sections for projects, certifications, skills, involvements as needed
  
    const educationSection = educations
    .map(
      (education) => `
        \\school{${education.institute}}{${education.location}}{Graduation: ${education.graduationDate}}{\\textit{${education.degree} \\labelitemi ${education.GPA || education.CGPA}}}
      `
    )
    .join("\n");
  
    const experienceSection = experiences
      .map(
        (experience) => `
          \\subsection*{${experience.position} - ${experience.company}}
          ${experience.location} -- ${experience.startDate} to ${experience.endDate}
          \\begin{itemize}
            ${experience.responsibilities.map((responsibility) => `\\item ${responsibility}`).join("\n")}
          \\end{itemize}
        `
      )
      .join("\n");
  
    // Add similar sections for projects, certifications, skills, involvements
  
    const latexCode = `
    \\documentclass{article}
    \\usepackage{geometry}
    \\geometry{margin=1in}
    \\usepackage{enumitem}
    \\setlist{nosep}
    \\usepackage{hyperref}
    \\usepackage{fancyhdr}
    \\pagestyle{fancy}
    \\renewcommand{\\headrulewidth}{0pt}
    \\rfoot{Page \\thepage}
    \\usepackage{fontawesome}


    \\textheight=10in
    \\pagestyle{fancy}
    \\raggedright
    \\fancyhf{}
    \\renewcommand{\\headrulewidth}{0pt}

    \\setlength{\\hoffset}{-2pt}
    \\setlength{\\footskip}{20pt}

    \\def\\bull{\\vrule height 0.8ex width .7ex depth -.1ex }

    \\newcommand{\\contact}[3]{
    \\vspace*{5pt}
    \\begin{center}
    {\\LARGE \\scshape {#1}}\\\\
    \\vspace{3pt}
    #2 
    \\vspace{2pt}
    #3
    \\end{center}
    \\vspace*{-8pt}
    }
   
    \\newcommand{\\school}[4]{
      \\textbf{#1} \\labelitemi #2 \\hfill #3 \\\\ #4 \\vspace*{5pt}
    }

    \\newcommand{\\lineunder}{
      \\vspace*{-8pt} \\\\ \\hspace*{-18pt} 
      \\hrulefill \\\\
      }

    \\newcommand{\\header}[1]{{
      \\hspace*{-15pt}\\vspace*{6pt} \\textsc{#1}} \\vspace*{-6pt} 
      \\lineunder
      }

    \\newcommand{\\content}{
        \\vspace*{2pt}%
        }

    \\renewcommand{\\labelitemi}{
      $\\vcenter{\\hbox{\\tiny$\\bullet$}}$\\hspace*{3pt}
      }
      
      \\renewcommand{\\labelitemii}{
      $\\vcenter{\\hbox{\\tiny$\\bullet$}}$\\hspace*{-3pt}
      }



    \\begin{document}

    \\small
    \\smallskip
    \\vspace*{-44pt}

    \\begin{center}
      {\\LARGE \\textbf{Tarun Sai Janapati}} \\\\
      \\faPhone\\ 551-755-1991 \\quad
      \\faEnvelope\\ \\href{mailto:tarunsai.janapati@slu.edu}{tarunsai.janapati@slu.edu} \\quad
      \\faLinkedin\\ \\url{https://www.linkedin.com/in/tarun-janapati/}
    \\end{center}

    \\vspace{15pt}

   \\header{Education}

    {${educationSection}}

    \\vspace*{4pt}%
    \\header{Experience}

    {${experienceSection}}
    
    \\vspace*{4pt}%
    \\header{Skills}

    \\begin{itemize}
      \\item \\textbf{Programming Languages:} Python, R Programming, SPSS
      \\item \\textbf{Data Analysis:} Pandas, NumPy
      \\item \\textbf{Data Science:} Tensorflow, Keras, OpenCV, NLTK, Pytorch
      \\item \\textbf{Machine Learning:} Scikit-Learn, Regression Models
      \\item \\textbf{Data Visualization:} Matplotlib, Seaborn, Tableau
      \\item \\textbf{Statistical Analysis:} Hypothesis Testing, Regression Analysis
      \\item \\textbf{Microsoft Tools:} Excel, Word, Power Point, Power Automate.
      \\item \\textbf{Tools:} Jupyter Notebook, Git, SQL
    \\end{itemize}

    \\vspace*{4pt}%
    \\header{Projects}
    \\textbf{Dynamic Steam Properties Calculator (Personal Project)} \\
    12/2022 -- 02/2023 \\
    Developed a web-based tool using Python, Flask, HTML, CSS, and JavaScript to calculate steam properties. Deployed: \\url{https://steamcalci.com}

    % Add other projects similarly

    \\vspace*{4pt}%
    \\header{Certifications}
    \\begin{itemize}
      \\item \\textbf{International Conference on Innovative Product Design and Intelligent Manufacturing System '2022} \\hfill 11/2022
      \\item \\textbf{Hero Campus Challenge Season 7} \\hfill 02/2021
      \\item \\textbf{Introduction to Data Analytics} \\hfill 02/2023
    \\end{itemize}

    \\vspace*{4pt}%
    \\header{Involvements}
    \\begin{itemize}
      \\item \\textbf{Student Representative, Training and Placement, VNIT} \\hfill 05/2021 -- 08/2021
      \\item \\textbf{Volunteer, AXIS'20, Visvesvaraya National Institute of Technology} \\hfill 01/2020 -- 03/2020
      \\item \\textbf{Organizer, Prayaas Club, Visvesvaraya National Institute of Technology} \\hfill 09/2018 -- 03/2020
    \\end{itemize}

    \\end{document}
  `;

  axios
    .post('http://localhost:3001/compile-latex', { latexCode }, { responseType: 'blob' })
    .then((response) => {
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

      // Create a download link for the PDF
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(pdfBlob);
      downloadLink.download = 'resume.pdf';

      // Append the link to the document body
      document.body.appendChild(downloadLink);

      // Trigger the download
      downloadLink.click();

      // Remove the link from the document body
      document.body.removeChild(downloadLink);

      // Cleanup
      URL.revokeObjectURL(downloadLink.href);
    })
    .catch((error) => {
      console.error('Error compiling LaTeX:', error);
    });
};
  

  
const previewPdf = async () => {
  try {
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
  
    const experiences = [
      {
        position: "Data Analyst Intern",
        company: "TechCorp",
        location: "Remote",
        startDate: "01/2024",
        endDate: "04/2024",
        responsibilities: [
          "Conducted data analysis and visualization.",
          "Collaborated with cross-functional teams on various projects.",
        ],
      },
      // Add more experience entries if needed
    ];
  
    // Add sections for projects, certifications, skills, involvements as needed
  
    const educationSection = educations
    .map(
      (education) => `
        \\school{${education.institute}}{${education.location}}{Graduation: ${education.graduationDate}}{\\textit{${education.degree} \\labelitemi ${education.GPA || education.CGPA}}}
      `
    )
    .join("\n");
  
    const experienceSection = experiences
      .map(
        (experience) => `
          \\subsection*{${experience.position} - ${experience.company}}
          ${experience.location} -- ${experience.startDate} to ${experience.endDate}
          \\begin{itemize}
            ${experience.responsibilities.map((responsibility) => `\\item ${responsibility}`).join("\n")}
          \\end{itemize}
        `
      )
      .join("\n");
  
    // Add similar sections for projects, certifications, skills, involvements
  
    const latexCode = `
    \\documentclass{article}
    \\usepackage{geometry}
    \\geometry{margin=1in}
    \\usepackage{enumitem}
    \\setlist{nosep}
    \\usepackage{hyperref}
    \\usepackage{fancyhdr}
    \\pagestyle{fancy}
    \\renewcommand{\\headrulewidth}{0pt}
    \\rfoot{Page \\thepage}
    \\usepackage{fontawesome}


    \\textheight=10in
    \\pagestyle{fancy}
    \\raggedright
    \\fancyhf{}
    \\renewcommand{\\headrulewidth}{0pt}

    \\setlength{\\hoffset}{-2pt}
    \\setlength{\\footskip}{20pt}

    \\def\\bull{\\vrule height 0.8ex width .7ex depth -.1ex }

    \\newcommand{\\contact}[3]{
    \\vspace*{5pt}
    \\begin{center}
    {\\LARGE \\scshape {#1}}\\\\
    \\vspace{3pt}
    #2 
    \\vspace{2pt}
    #3
    \\end{center}
    \\vspace*{-8pt}
    }
   
    \\newcommand{\\school}[4]{
      \\textbf{#1} \\labelitemi #2 \\hfill #3 \\\\ #4 \\vspace*{5pt}
    }

    \\newcommand{\\lineunder}{
      \\vspace*{-8pt} \\\\ \\hspace*{-18pt} 
      \\hrulefill \\\\
      }

    \\newcommand{\\header}[1]{{
      \\hspace*{-15pt}\\vspace*{6pt} \\textsc{#1}} \\vspace*{-6pt} 
      \\lineunder
      }

    \\newcommand{\\content}{
        \\vspace*{2pt}%
        }

    \\renewcommand{\\labelitemi}{
      $\\vcenter{\\hbox{\\tiny$\\bullet$}}$\\hspace*{3pt}
      }
      
      \\renewcommand{\\labelitemii}{
      $\\vcenter{\\hbox{\\tiny$\\bullet$}}$\\hspace*{-3pt}
      }



    \\begin{document}

    \\small
    \\smallskip
    \\vspace*{-44pt}

    \\begin{center}
      {\\LARGE \\textbf{Tarun Sai Janapati}} \\\\
      \\faPhone\\ 551-755-1991 \\quad
      \\faEnvelope\\ \\href{mailto:tarunsai.janapati@slu.edu}{tarunsai.janapati@slu.edu} \\quad
      \\faLinkedin\\ \\url{https://www.linkedin.com/in/tarun-janapati/}
    \\end{center}

    \\vspace{15pt}

   \\header{Education}

    {${educationSection}}

    \\vspace*{4pt}%
    \\header{Experience}

    {${experienceSection}}
    
    \\vspace*{4pt}%
    \\header{Skills}

    \\begin{itemize}
      \\item \\textbf{Programming Languages:} Python, R Programming, SPSS
      \\item \\textbf{Data Analysis:} Pandas, NumPy
      \\item \\textbf{Data Science:} Tensorflow, Keras, OpenCV, NLTK, Pytorch
      \\item \\textbf{Machine Learning:} Scikit-Learn, Regression Models
      \\item \\textbf{Data Visualization:} Matplotlib, Seaborn, Tableau
      \\item \\textbf{Statistical Analysis:} Hypothesis Testing, Regression Analysis
      \\item \\textbf{Microsoft Tools:} Excel, Word, Power Point, Power Automate.
      \\item \\textbf{Tools:} Jupyter Notebook, Git, SQL
    \\end{itemize}

    \\vspace*{4pt}%
    \\header{Projects}
    \\textbf{Dynamic Steam Properties Calculator (Personal Project)} \\
    12/2022 -- 02/2023 \\
    Developed a web-based tool using Python, Flask, HTML, CSS, and JavaScript to calculate steam properties. Deployed: \\url{https://steamcalci.com}

    % Add other projects similarly

    \\vspace*{4pt}%
    \\header{Certifications}
    \\begin{itemize}
      \\item \\textbf{International Conference on Innovative Product Design and Intelligent Manufacturing System '2022} \\hfill 11/2022
      \\item \\textbf{Hero Campus Challenge Season 7} \\hfill 02/2021
      \\item \\textbf{Introduction to Data Analytics} \\hfill 02/2023
    \\end{itemize}

    \\vspace*{4pt}%
    \\header{Involvements}
    \\begin{itemize}
      \\item \\textbf{Student Representative, Training and Placement, VNIT} \\hfill 05/2021 -- 08/2021
      \\item \\textbf{Volunteer, AXIS'20, Visvesvaraya National Institute of Technology} \\hfill 01/2020 -- 03/2020
      \\item \\textbf{Organizer, Prayaas Club, Visvesvaraya National Institute of Technology} \\hfill 09/2018 -- 03/2020
    \\end{itemize}

    \\end{document}
  `;

  const response = await axios.post('http://localhost:3001/compile-latex', { latexCode }, { responseType: 'blob' });
  const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

  // Open the PDF in a new window without asking for confirmation
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');

  // Clean up the data URL
  URL.revokeObjectURL(pdfUrl);
} catch (error) {
  console.error('Error compiling or previewing PDF:', error);
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
      </div><div>
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
