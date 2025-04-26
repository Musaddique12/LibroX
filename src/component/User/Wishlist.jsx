import React, { useEffect, useState } from 'react';
import { fetch_data, update_data, update_user_Likes } from '../Essential_Functions';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore_database } from '../../Firebase';
import { toast, ToastContainer } from 'react-toastify';
import './wishlist.css'
import { useNavigate } from 'react-router-dom';

function Wishlist() {
  const [userData, setUserData] = useState({}); // Fix userData initialization
  const [books, setBooks] = useState([]); // Store fetched books
  const navigate=useNavigate()
  useEffect(() => {
    get_data();
  }, []);

  const get_data = async () => {
    const uid = localStorage.getItem('uid');
    const data = await fetch_data('user', 'uid', uid);

    if (data && data.length > 0) {
      setUserData(data[0]);
      get_books(data[0].wishlist || []); // Ensure wishlist is an array
    }
  };

  const get_books = async (wishlist_Ids) => {
    if (!wishlist_Ids || wishlist_Ids.length === 0) return; // Prevent errors if wishlist is empty

    try {
      const book_ref = collection(firestore_database, 'book');
      let booksList = [];

      for (let i = 0; i < wishlist_Ids.length; i += 10) {
        const slice_book = wishlist_Ids.slice(i, i + 10);
        const q = query(book_ref, where('bid', 'in', slice_book));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => booksList.push({ id: doc.id, ...doc.data() }));
      }

      setBooks(booksList);
    } catch (e) {
      console.log('Error fetching books in wishlist:', e);
    }
  };



  const handleRemoveFromWishlist = async(book) => {
    if (!userData.id) return;

    const updatedWishlist = (userData.wishlist || []).filter((bid) => bid !== book.bid);
  await  update_data('user', userData.id, 'wishlist', updatedWishlist);
    setBooks((prevBooks) => prevBooks.filter(b => b.bid !== book.bid));
    toast.info("Book removed from Wishlist!", { position: "top-center", autoClose: 3000 });
  };



  return (
    <div id="wishlist-container">
      <h1>Your Wishlist</h1>
      {books.length > 0 ? (
        books.map((book, index) => (
          <div
            key={book.id}
            id={`book-card-${index + 1}`}
            className="book-card"
          >
            <img
              id={`book-image-${index + 1}`}
              src={book.image}
              alt={book.name}
            />
            <div id={`book-details-${index + 1}`} className="book-details">
              <p id={`book-name-${index + 1}`}>{book.name}</p>
              <p id={`book-author-${index + 1}`}>{book.author}</p>
              <p id={`book-category-${index + 1}`}>{book.category}</p>
              <p id={`user-id-${index + 1}`} className="user-id">
                User ID: {userData.id}
              </p>
            </div>
            <div id={`book-actions-${index + 1}`} className="book-actions">
            <button onClick={() => handleRemoveFromWishlist(book)}>
                <span>Remove</span>
              </button>
              <button
                className="show-book-btn"
                onClick={() => navigate(`/dashboard/showAd/${book.bid}`)}
              >
                Show Details
              </button>
            </div>
          </div>
        ))
      ) : (
        <p id="no-books-message">No Wishlist found</p>
      )}
      <ToastContainer />
    </div>
  );
}

export default Wishlist;
