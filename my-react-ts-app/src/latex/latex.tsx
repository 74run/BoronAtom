import React from 'react';
import Latex from 'react-latex-next';
import { jsPDF } from 'jspdf';

const LatexComponent = () => {
  const latexString = `E = mc^2`;

  const downloadPdf = () => {
    const doc = new jsPDF();

    // Convert the LaTeX to normal text or HTML, jsPDF can't directly render LaTeX.
    // Here we assume the rendered LaTeX is simple text.
    // For complex rendering, you may need to use an HTML-to-PDF approach.
    doc.text(latexString, 10, 10);
    doc.save('latex-document.pdf');
  };

  return (
    <div>
      <h1>Render LaTeX in React and Export to PDF</h1>
      <Latex>{latexString}</Latex>
      <button onClick={downloadPdf}>Download PDF</button>
    </div>
  );
};

export default LatexComponent;
