import React, { useEffect, useState } from 'react'
import AdminNav from './AdminNav'
import { Outlet, useNavigate } from 'react-router-dom'
import './admin.css'
import { fetch_data } from '../Essential_Functions';

function AdminDashboard() {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkingUser();
  }, []);

  const checkingUser = async () => {
    const validate_user = localStorage.getItem('uid');

    if (!validate_user || validate_user.length !== 28) {
      setError("Invalid UID! Please log in.");
      setLoading(false);
      return;
    }

    try {
      const data = await fetch_data('user', 'uid', validate_user);

      if (data.length > 0) {
        setError(null); // No error, user found
      } else {
        setError("User not found. Please log in.");
      }
    } catch (err) {
      setError("Error fetching user data. Try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ textAlign: 'center', padding: '20px', }}>
    {isLoading ? (
      <p style={{ fontSize: '18px' }}>Loading...</p>
    ) : error ? (
      <div>
        <h1 style={{ color: 'red' }}>Error</h1>
        <p style={{ color: 'red', fontSize: '18px' }}>{error}</p>
        <button
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px'
          }}
          onClick={() => navigate('/')}
        >
          Go to Login
        </button>
      </div>
    ) : (
      <>
        <div style={{ height: '60px' }}><AdminNav /></div>
        <div style={{ padding: '10px' }}><Outlet /></div>
      </>
    )}
  </div>
  )
}

export default AdminDashboard
