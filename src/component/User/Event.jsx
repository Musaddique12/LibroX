import React, { useEffect, useState } from 'react';
import { firestore_database } from '../../Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import { update_data } from '../Essential_Functions';
import { useNavigate } from 'react-router-dom';
import './event.css'

function Event() {
  const [events, setEvents] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate()

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore_database, 'event'));
      const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleNotify = async (book) => {
    try {
      const userId = localStorage.getItem('cid');

      if (book.waiter.includes(userId)) {
        toast.info("You are already added");
        fetchEvents()
      } else {
        const updatedWaiter = [...book.waiter, userId];
        await update_data('event', book.id, 'waiter', updatedWaiter);
        toast.success("We will inform you soon");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const buyBook = async (book) => {
    try {
      const quantityToBuy = quantities[book.id] || 1; // Default to 1 if not set


      await update_data('event', book.id, 'sell', book.sell + quantityToBuy);
      await update_data('event', book.id, 'quantity', book.quantity - quantityToBuy);
      navigate('/dashboard/payment', { state: { 'amount': book.price * quantityToBuy, 'msg': 'Buy succefull' } })
      // Refresh data after update

    } catch (error) {
      console.error(error);
      toast.error("Failed to complete the purchase.");
    }
  };

  return (
    <div className="event">
      <ul className="event-list">
        {events.map((book) => (
          <div key={book.id} className="event-card">
            <img src={book.img} alt={book.bookName} className="event-image" />
            <p className="event-title">{book.bookName}</p>
            <p className="event-price">Price: ${book.price}</p>
            <p className="event-stock">Stock: {book.quantity}</p>
            <p className="event-description">{book.description}</p>

            {book.quantity > 0 ? (
              <div className="event-buy-section">
                <div className="event-quantity">
                  <button
                    className="event-quantity-btn"
                    onClick={() =>
                      setQuantities((prev) => {
                        const currentQty = prev[book.id] || 1;
                        if (currentQty < book.quantity) {
                          return {
                            ...prev,
                            [book.id]: currentQty + 1,
                          };
                        } else {
                          toast.info("You can't select more than available stock");
                          return prev;
                        }
                      })
                    }
                  >
                    +
                  </button>

                  <p className="event-quantity-value">{quantities[book.id] || 1}</p>
                  <button
                    className="event-quantity-btn"
                    onClick={() =>
                      setQuantities((prev) => ({
                        ...prev,
                        [book.id]: Math.max((prev[book.id] || 1) - 1, 1),
                      }))
                    }
                  >
                    -
                  </button>
                </div>
                <button className="event-buy-btn" onClick={() => buyBook(book)}>
                  Buy Now
                </button>
              </div>
            ) : (
              <button className="event-notify-btn" onClick={() => handleNotify(book)}>
                Notify Me When Available
              </button>
            )}
          </div>
        ))}
      </ul>
      <ToastContainer />
    </div>
  );

}

export default Event;
