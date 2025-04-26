  import React, { useEffect, useState } from 'react';
  import { fetch_data, update_data } from '../Essential_Functions'; // Fetch user data
  import { firestore_database } from '../../Firebase';
  import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
  import { ToastContainer } from 'react-toastify';
  import { toast } from 'react-toastify';
  import { useNavigate } from 'react-router-dom';

  function Purchased() {
    const [userData, setUserData] = useState(null);
    const [books, setBooks] = useState([]); // Store fetched books
    const [message, setMessage] = useState('');// To display the message when buttons are clicked
    const [booksKeys,setKeys]=useState('') 
    const navigate = useNavigate();

    useEffect(() => {
      getUserData();
    }, []);

    const getUserData = async () => {
      const uid = localStorage.getItem('uid');
      const data = await fetch_data('user', 'uid', uid);

      if (data && data.length > 0) {
        setUserData(data[0]);
        getBooksFromIds(Object.keys(data[0].rented)); // Fetch books using purchased IDs
        setKeys(Object.keys(data[0].rented))
      }
    };


    const getBooksFromIds = async (rentedIds) => {
      if (!rentedIds || rentedIds.length === 0) return; // If no books purchased

      try {
        const booksRef = collection(firestore_database, 'book');
        let booksList = [];

        // Firestore allows only 10 items in `in` query, so we process in chunks of 10
        for (let i = 0; i < rentedIds.length; i += 10) {
          const batchIds = rentedIds.slice(i, i + 10); // Get a batch of 10
          const q = query(booksRef, where('bid', 'in', batchIds));

          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => booksList.push({ id: doc.id, ...doc.data() }));
        }

        setBooks(booksList); // Update state with all fetched books
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };


    const isBookLocked = (bookBid) => {
      const rentalDate = userData?.rented?.[bookBid];
      if (!rentalDate) return false; // If no rental date, return false (not locked)

      const rentedTime = rentalDate; // rentalDate is already in milliseconds
      const currentDate = Date.now(); // Get the current timestamp in milliseconds

      const diffTime = currentDate - rentedTime; // Difference in milliseconds
      const diffDays = diffTime / (1000 * 60 * 60 * 24); // Convert milliseconds to days

      // Lock the book if it's rented for 30 days or more
      return diffDays >= 30;
    };


    const handleRenewClick = async(book) => {
     userData.rented[book.bid]=Date.now();
     await update_data('user',userData.id,'rented',userData.rented)
     await update_data('book',book.id,'quantity',book.quantity+1)
     navigate('/dashboard/payment',{state:{amount:book.price,msg:'Renewed Book'}})
    };


    const handleDeleteClick = async(book) => {
     delete userData.rented[book.bid]
      await update_data('user',userData.id,'rented',userData.rented)
      await getBooksFromIds(booksKeys)
    };
    

    return (
      <div id="wishlist-container">
        <h1>Purchased Book</h1>
        {books.length > 0 ? (
          books.map((book, index) => (
            <div
              key={book.id}
              id={`book-card-${index + 1}`}
              className={`book-card ${isBookLocked(book.bid) ? 'locked' : ''}`}
            >
              <img
                id={`book-image-${index + 1}`}
                src={book.image}
                alt={book.name}
                className={'book-image'}
              />
              {isBookLocked(book.bid) && (
                <div className="lock-overlay">
                  <span className="lock-icon">🔒</span>
                  <div className="locked-actions">
                    <button
                      className="revenue-btn"
                      onClick={() => handleRenewClick(book)}
                    >
                      Renew Again
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(book)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
              <div id={`book-details-${index + 1}`} className="book-details">
                <p id={`book-name-${index + 1}`}>{book.name}</p>
                <p id={`book-author-${index + 1}`}>{book.author}</p>
                <p id={`book-category-${index + 1}`}>{book.category}</p>
                <p id={`user-id-${index + 1}`} className="user-id">
                  User ID: {userData.id}
                </p>
              </div>
              <div id={`book-actions-${index + 1}`} className="book-actions">
                <button
                  className="show-book-btn"
                  onClick={() => navigate(`/dashboard/showbook/${book.bid}`)}
                >
                  Show Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p id="no-books-message">No Purchased books found</p>
        )}

        <ToastContainer />
      </div>
    );
  }

  export default Purchased;
