import React, { useEffect, useState } from 'react';
import { fetch_data, update_data, update_user_Likes } from '../Essential_Functions';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore_database } from '../../Firebase';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Liked() {
  const [userData, setUserData] = useState(null);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
const navigate=useNavigate()
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const uid = localStorage.getItem('uid');
    const data = await fetch_data('user', 'uid', uid);

    if (data && data.length > 0) {
      setUserData(data[0]);
      fetchLikedBooks(data[0].likes);
    } else {
      setIsLoading(false); // Stop loading if no user data found
    }
  };

  const fetchLikedBooks = async (likes) => {
    if (!likes) {
      setBooks([]);
      setIsLoading(false);
      return;
    }

    const allBookIds = Object.values(likes).flat();
    if (allBookIds.length === 0) {
      setBooks([]);
      setIsLoading(false);
      return;
    }

    try {
      const booksRef = collection(firestore_database, 'book');
      let booksList = [];

      for (let i = 0; i < allBookIds.length; i += 10) {
        const batchIds = allBookIds.slice(i, i + 10);
        const q = query(booksRef, where('bid', 'in', batchIds));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => booksList.push({ id: doc.id, ...doc.data() }));
      }

      setBooks(booksList);
    } catch (error) {
      console.error('Error fetching liked books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (book) => {
    if (!userData?.id) return;

    await update_user_Likes(userData.id, book.id, book.category, book.bid, book.like);
    setBooks((prevBooks) => prevBooks.filter(b => b.bid !== book.bid));
  };



  return (
    <div id="wishlist-container">
      <h1>Liked Books</h1>
      {isLoading ? (
        <p id="loading-message">Loading...</p>
      ) : books.length > 0 ? (
        books.map((book, index) => (
          <div key={book.id} id={`book-card-${index + 1}`} className="book-card">
            <img id={`book-image-${index + 1}`} src={book.image} alt={book.name} />
            <div id={`book-details-${index + 1}`} className="book-details">
              <p id={`book-name-${index + 1}`}>{book.name}</p>
              <p id={`book-author-${index + 1}`}>{book.author}</p>
              <p id={`book-category-${index + 1}`}>{book.category}</p>
              <p id={`user-id-${index + 1}`} className="user-id">User ID: {userData?.id}</p>
            </div>
            <div id={`book-actions-${index + 1}`} className="book-actions">
              <button onClick={() => handleLike(book)}>
                <span>Remove Like</span>
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
        <p id="no-books-message">No Liked Books Found</p>
      )}
      <ToastContainer />
    </div>
  );
}

export default Liked;
