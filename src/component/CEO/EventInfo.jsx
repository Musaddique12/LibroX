import React, { useEffect, useState } from 'react';
import { firestore_database } from '../../Firebase';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './eventinfo.css';

function EventInfo() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [events, filter]);

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore_database, 'event'));
      const eventsData = [];
      querySnapshot.forEach((doc) => {
        eventsData.push({ ...doc.data(), id: doc.id });
      });
      setEvents(eventsData);
    } catch (error) {
      console.log('Error fetching events:', error);
    }
  };

  const deleteBook = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteDoc(doc(firestore_database, "event", bookId));
        setEvents(events.filter((book) => book.id !== bookId));
        toast.success("Book Deleted", { position: "top-center", autoClose: 3000 });
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const applyFilter = () => {
    if (filter === 'Available') {
      setFilteredEvents(events.filter(e => e.quantity > 0));
    } else if (filter === 'SoldOut') {
      setFilteredEvents(events.filter(e => e.quantity === 0));
    } else {
      setFilteredEvents(events);
    }
  };

  return (
    <div className="EventInfo-container">
      <h2 className="EventInfo-header">Event Information</h2>

      <div className="EventInfo-filters">
        <button className={`EventInfo-filterBtn ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All</button>
        <button className={`EventInfo-filterBtn ${filter === 'Available' ? 'active' : ''}`} onClick={() => setFilter('Available')}>Available</button>
        <button className={`EventInfo-filterBtn ${filter === 'SoldOut' ? 'active' : ''}`} onClick={() => setFilter('SoldOut')}>Sold Out</button>
      </div>

      <ul className="EventInfo-list">
        {filteredEvents.map((book) => (
          <li key={book.id} className="EventInfo-card">
            <img src={book.img} alt="Book" className="EventInfo-img" />
            <p className="EventInfo-name">{book.bookName}</p>
            <p className="EventInfo-price">Price: {book.price}</p>
            <p className="EventInfo-available">Available: {book.quantity}</p>

            {book.quantity === 0 && (
              <p
                className={`EventInfo-waiter ${Array.isArray(book.waiter) && book.waiter.length > 0 ? 'EventInfo-alert' : ''
                  }`}
              >
                <span className="EventInfo-waiterCount">
                  {Array.isArray(book.waiter) ? book.waiter.length : (book.waiter || 0)}
                </span>{' '}
                {Array.isArray(book.waiter) && book.waiter.length === 1 ? 'person is' : 'people are'} waiting
                {Array.isArray(book.waiter) && book.waiter.length > 0 && (
                  <span className="EventInfo-waiterIcon">⚠️</span>
                )}
              </p>
            )}

            <p className="EventInfo-selled">Sold: {book.sell}</p>
            <p className="EventInfo-income">
              Income: {(book.price * book.sell) + book.previous_earning}
            </p>
            <div className="EventInfo-buttons">
              <button className="EventInfo-updateBtn" onClick={() => navigate('/ceo/updateEvent', { state: book })}>
                Update
              </button>
              <button className="EventInfo-deleteBtn" onClick={() => deleteBook(book.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <ToastContainer />
    </div>
  );
}

export default EventInfo;
