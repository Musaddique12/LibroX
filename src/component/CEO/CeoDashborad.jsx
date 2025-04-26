import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './ceoDashboard.css';

function CeoDashborad() {
  return (
    <div className="ceoDashboard-container">
      <nav className="ceoDashboard-nav">
        <Link to="addevent" className="ceoDashboard-link">Add Event</Link>
        <Link to="eventinfo" className="ceoDashboard-link">Event Info</Link>
      </nav>
      <div className="ceoDashboard-outlet">
        <Outlet />
      </div>
    </div>
  );
}

export default CeoDashborad;
