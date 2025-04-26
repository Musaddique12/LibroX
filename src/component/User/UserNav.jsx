import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />} {/* Toggle Icons */}
        </div>
        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link to="/dashboard" className="nav-link">Home</Link>
          <Link to="notifi" className="nav-link">Notification</Link>
          <Link to="purchased" className="nav-link">Purchased</Link>
          <Link to="profile" className="nav-link">Profile</Link>
          <Link to="/store" className="nav-link store">Open Store</Link>
        </div>
      </nav>

      <style>
        {`
          .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #333;
            padding: 12px;
            position: relative;
            height:30px
          }
          .menu-icon {
            display: none;
            font-size: 24px;
            color: white;
            cursor: pointer;
            position: absolute;
            right: 15px;
            top: 12px;
          }
          .nav-links {
            display: flex;
            gap: 15px;
          }
          .nav-link {
            color: white;
            text-decoration: none;
            font-size: 16px;
            padding: 8px 12px;
            transition: 0.3s;
          }
          .nav-link:hover {
            color: #4ea8de;
          }
          .store {
            font-weight: bold;
            color: #00ff99;
          }
          .store:hover {
            color: #00cc77;
          }

          /* Mobile Responsive */
          @media (max-width: 650px) {
            .menu-icon {
              display: block;
              z-index: 101;
            }
            .nav-links {
              position: fixed;
              top: 0;
              left: -250px; /* Start off-screen */
              width: 250px;
              height: 100vh;
              background: #222;
              flex-direction: column;
              padding-top: 60px;
              transition: left 0.3s ease-in-out;
              z-index: 100;
            }
            .nav-links.open {
              left: 0; /* Slide in */
            }
            .nav-link {
              display: block;
              padding: 15px;
              text-align: left;
              border-bottom: 1px solid #444;
            }
          }
        `}
      </style>
    </>
  );
};

export default Navbar;
