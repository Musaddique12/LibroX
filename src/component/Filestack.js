import React, { useState } from 'react';
import { client } from 'filestack-react'; // Import Filestack client

function PdfUpload() {
  const [file, setFile] = useState(null);
  const [uploadedUrls, setUploadedUrls] = useState();

  const filestackClient = client.init('A5OiZtOJ3QymnEaQOUJFFz'); // Replace with your Filestack API key

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Only set one file at a time
  };

  // Handle file upload to Filestack
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    try {
      // Upload the single file
      const result = await filestackClient.upload(file);
      setUploadedUrls( result.url); // Add the uploaded file's URL to the state

      // Clear the file input after upload
      setFile(null);

    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
  };

  return (
    <div>
      <h2>Upload PDF</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Upload PDF</button>

      {uploadedUrls && (
        <div>
          <h3>Uploaded PDFs:</h3>
          <ul>
            {uploadedUrls.map((url, index) => (
              <li key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  View PDF {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PdfUpload;


