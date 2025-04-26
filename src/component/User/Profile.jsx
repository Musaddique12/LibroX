import React, { useEffect, useState } from 'react';
import { fetch_data } from '../Essential_Functions';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const [data, setData] = useState(null); // Initially null to check if data has loaded
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const Data = await fetch_data('user', 'uid', localStorage.getItem('uid'));
      if (Data.length > 0) {
        console.log("Fetched Data:", Data[0]); // Debugging
        setData(Data[0]);
      } else {
        setData({ follower: [], following: [] }); // Set empty arrays if no data
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setData({ follower: [], following: [] }); // Prevent errors on failure
    }
  };

  if (data === null) {
    return <div className="profile-container">Loading...</div>; // Show loading state
  }

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img src="https://i.pinimg.com/originals/94/9c/98/949c980651015f825dbfe402c221faef.jpg" alt="Admin Avatar" />
          <div><strong>{data.channelName || "No bio available"}</strong></div>
        </div>
        <div className="profile-user-info">
          <h2 className="profile-username">{data.username}</h2>
          <div className="profile-stats">
            <div className="profile-stat" onClick={() => navigate(`/dashboard/${'follower'}`)}>
              <strong>{Array.isArray(data.follower) ? data.follower.length : 0}</strong> Followers
            </div>
            <div className="profile-stat" onClick={() => navigate(`/dashboard/${'following'}`)}>
              <strong>{Array.isArray(data.following) ? data.following.length : 0}</strong> Following
            </div>
          </div>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="profile-buttons">
        <button className="profile-button" onClick={() => navigate('/dashboard/liked')}>Liked Books</button>
        <button className="profile-button" onClick={() => navigate('/dashboard/wishlist')}>WishList</button>
      </div>

      {/* Logout Button */}
      <div className="profile-logout">
        <button className="profile-logout-button">Logout</button>
      </div>
    </div>
  );
}

export default Profile;
