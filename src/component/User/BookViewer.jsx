import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./bookViewer.css";

const BookViewer = () => {
  const location = useLocation();
  const { pdfUrl, price } = location.state || {};

  const iframeRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);

  if (!pdfUrl) {
    return <p className="book-viewer-error">No book found!</p>;
  }

  // 🔄 Reload PDF
  const reloadPDF = () => {
    if (iframeRef.current) {
      iframeRef.current.src += "";
    }
  };

  // 🖥️ Toggle Fullscreen
  const toggleFullScreen = () => {
    if (iframeRef.current.requestFullscreen) {
      iframeRef.current.requestFullscreen();
      console.log("Fullscreen mode activated BY RequestFullScreen.");
    } 
    // else if (iframeRef.current.mozRequestFullScreen) {
    //   iframeRef.current.mozRequestFullScreen();
    //   console.log("Fullscreen mode activated BY MozRequestFullScreen.");
    // } else if (iframeRef.current.webkitRequestFullscreen) {
    //   iframeRef.current.webkitRequestFullscreen();
    //   console.log("Fullscreen mode activated BY WebkitRequestFullscreen.");
    // } else if (iframeRef.current.msRequestFullscreen) {
    //   iframeRef.current.msRequestFullscreen();
    //   console.log("Fullscreen mode activated BY MsRequestFullScreen.");
    // }
  };

  // 🌙 Toggle Dark Mode
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div className={`book-viewer-container ${darkMode ? "dark-mode" : ""}`}>
      <h2 className="book-viewer-title">Book Viewer</h2>

      {/* 📖 PDF Viewer */}
      <iframe
        ref={iframeRef}
        src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}#toolbar=1&navpanes=0&view=FitH&disableDownload=true`}
      // src={pdfUrl}
        className="book-viewer-iframe"
        title="PDF Viewer"
      />

      {/* 🎮 Controls */}
      <div className="book-viewer-controls">
        <button onClick={toggleFullScreen} className="book-viewer-btn">🖥️ Fullscreen</button>
        <button onClick={reloadPDF} className="book-viewer-btn">🔄 Reload</button>
        <button onClick={toggleDarkMode} className="book-viewer-btn">
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* 📥 Download Button (Only for Free Books) */}
      {price <= 0 && (
        <a href={pdfUrl} download className="book-viewer-download-btn">
          ⬇ Download Book
        </a>
      )}
    </div>
  );
};

export default BookViewer;
