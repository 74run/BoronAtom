import React from 'react';
import {  Document, Page } from 'react-pdf';

const MyPDFViewer = () => {
  return (
    
      <Document>
        <Page size="A4">
          {/* Your LaTeX template content */}
        </Page>
      </Document>
  
  );
};

export default MyPDFViewer;
