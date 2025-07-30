import React, { useEffect, useState } from 'react';
import { firestore_database } from '../../Firebase';
import { updateDoc, doc } from 'firebase/firestore';
import { fetch_data, update_data } from '../Essential_Functions';
import { useNavigate } from 'react-router-dom';
import './Notification.css';

function Notification() {
  const [userData, setUser] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, read, unread
  const userId = localStorage.getItem('uid'); // Logged-in user ID
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userSnap = await fetch_data('user', 'uid', userId);
        if (userSnap.length > 0) {
          const userData = userSnap[0];
          setUser(userData);
          setNotifications(userData.notifications || []);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (notificationId) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.bid === notificationId ? { ...notification, seen: true } : notification
    );

    try {
      await update_data('user', userData.id, 'notifications', updatedNotifications);
      setNotifications(updatedNotifications);
      navigate(`/dashboard/showbook/${notificationId}`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };


  const markAllAsRead = async () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      seen: true
    }));

    try {
      await update_data('user', userData.id, 'notifications', updatedNotifications);
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };


  const deleteNotification = async (notificationId) => {
    const updatedNotifications = notifications.filter((notification) => notification.bid !== notificationId);

    try {
      await update_data('user', userData.id, 'notifications', updatedNotifications);
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };


  const deleteAllNotifications = async () => {
    try {
      await update_data('user', userData.id, 'notifications', []);
      setNotifications([]);
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'read') return notification.seen === true;
    if (filter === 'unread') return notification.seen === false;
    return true;
  });

  const hasUnreadNotifications = notifications.some((notification) => !notification.seen);

  return (
    <div className="notification-container">
      <h1 className="notification-title">Notifications</h1>

      <div className="notification-filter-options">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'notification-filter-active' : ''}>All</button>
        <button onClick={() => setFilter('read')} className={filter === 'read' ? 'notification-filter-active' : ''}>Read</button>
        <button onClick={() => setFilter('unread')} className={filter === 'unread' ? 'notification-filter-active' : ''}>Unread</button>
      </div>

   <div className='notification-button-container'>
   {hasUnreadNotifications && (
        <button className="notification-mark-all" onClick={markAllAsRead}>
          Mark All as Read
        </button>
      )}

      {notifications.length > 0 && (
        <button className="notification-delete-all" onClick={deleteAllNotifications}>
          Delete All
        </button>
      )}
   </div>

      {filteredNotifications.length === 0 ? (
        <p className="notification-no-data">You have no notifications.</p>
      ) : (
        <div className="notification-list">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.timestamp}
              className={`notification-item ${notification.seen ? 'notification-read' : 'notification-unread'}`}
            >
              <div className="notification-content" onClick={() => markAsRead(notification.bid)}>
                <p className="notification-message">{notification.message}</p>
                <small className="notification-timestamp">  {notification.timestamp?.toDate().toLocaleString()|| "jjjj"}</small>
              </div>
              <button className="notification-delete" onClick={() => deleteNotification(notification.bid)}>🗑</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;
