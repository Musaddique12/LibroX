import React, { useState } from "react";

function CloudinaryPdfUpload() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");

  // Cloudinary credentials
  const CLOUD_NAME = "dy0p6iio6";
  const UPLOAD_PRESET = "LibroX"; // Set this in your Cloudinary settings

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "LibroX"); // Your preset
    formData.append("cloud_name", "dy0p6iio6");
  
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/dy0p6iio6/upload`, {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      
      if (data.secure_url) {
        setUrl(data.secure_url);
        console.log(data)
      } else {
        console.error("Cloudinary upload error:", data);
        alert("Failed to upload. Check Cloudinary settings.");
      }
    } catch (err) {
      console.error("Error uploading PDF:", err);
      alert("Upload failed. Please try again.");
    }
  };
  

  return (
    <div>
      <h2>Upload PDF to Cloudinary</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload PDF</button>
      {url && (
        <div>
          <p>Uploaded PDF:</p>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Open PDF
          </a>
        </div>
      )}
    </div>
  );
}

export default CloudinaryPdfUpload;
