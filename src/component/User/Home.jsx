import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore_database } from '../../Firebase'; // Adjust the path as needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './user.css';
import { fetch_data, update_data } from '../Essential_Functions';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]); // Stores filtered books
  const [userData, setUserData] = useState([]);
  const [broseOption, setBrose] = useState('');
  const [searchedText, setSearcheText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    get_all_book_data();
    async function fetchUserData() {
      const data = await fetch_data('user', 'uid', localStorage.getItem('uid'));
      if (data.length > 0) {
        setUserData(data[0]);
        localStorage.setItem('cid', data[0].id);
      }
    }
    fetchUserData();
  }, []);

  const get_all_book_data = async () => {
    try {
      const collectionRef = collection(firestore_database, 'book');
      const querySnapshot = await getDocs(collectionRef);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(data);
      setFilteredBooks(data); // Ensure filteredBooks is updated
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };


  const getFilterBooks = (price) => {
    console.log("Selected price:", price); // Debugging log

    if (!broseOption) {
      toast.info("Please select a filter option", { position: "top-center", autoClose: 3000 });
      return;
    }

    let filteredBooks = books; // Start with all books

    // Apply text search filter only if `broseOption` is not 'all'
    if (broseOption !== 'all' && searchedText.trim()) {
      filteredBooks = books.filter(book =>
        String(book[broseOption]).toLowerCase().includes(searchedText.toLowerCase())
      );

      if (filteredBooks.length === 0) {
        toast.info("Book Not Available", { position: "top-center", autoClose: 3000 });
        setFilteredBooks([]);
        return;
      }
    }

    // Apply price filter if a price is selected
    if (typeof price === "number") { // Ensure price is a valid number
      filteredBooks = filteredBooks.filter(book => Number(book.price) <= price);

      if (filteredBooks.length === 0) {
        toast.info("No books available under this price", { position: "top-center", autoClose: 3000 });
        setFilteredBooks([]);
        return;
      }
    }

    setFilteredBooks(filteredBooks);
  };


  const handleAddToWishlist = async (book_Bid) => {
    const wishlist = userData.wishList || [];

    if (!wishlist.includes(book_Bid)) {
      const updatedWishlist = [...wishlist, book_Bid];
      await update_data('user', userData.id, 'wishlist', updatedWishlist);
      setUserData((prev) => ({ ...prev, wishList: updatedWishlist }));
      toast.success("Book Added to Wishlist!", { position: "top-center", autoClose: 3000 });
    } else {
      toast.info("Book already in Wishlist!", { position: "top-center", autoClose: 3000 });
    }
  };

  return (
    <div className="home-container">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="hero-section">
        <h1 className="hero-title">Welcome to LibroX</h1>
        <p className="hero-description">Browse and buy books from our vast collection of digital books. Explore now!</p>
        <button className="event-button" onClick={() => { navigate('event') }}>
          Enter In The Event
        </button>
      </div>

      <div className="home-filter-container">
        <div className="filter-controls">
          <select onChange={(e) => setBrose(e.target.value)} className="filter-select">
            <option value="all">All</option>
            <option value="name">Book Name</option>
            <option value="author">Author</option>
            <option value="seller">Channel Name</option>
            <option value="price">Price</option>
          </select>
          <input
            type="search"
            placeholder="Search..."
            onChange={(e) => setSearcheText(e.target.value)}
            className="filter-input"
          />
          <button onClick={() => getFilterBooks(null)} className="filter-button">Search</button>
        </div>

        {/* Price Filter Section */}
        <div className="price-filter-group">

          <label className="price-option">
            <input
              type="radio"
              name="price"
              onClick={() => { getFilterBooks(null) }}
              className="price-radio"
            />
            <span className="price-label">All</span>
          </label>


          {[200, 100, 300, 500].map(price => (
            <label key={price} className="price-option">
              <input
                type="radio"
                name="price"
                value={price}
                onClick={() => { getFilterBooks(price) }}
                className="price-radio"
              />
              <span className="price-label">${price}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="books-container">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card">
              <img src={book.image} alt={book.name} className="book-image" />
              <div className="book-info">
                <h2 className="book">{book.name}</h2>
                <p className="book-author"><strong>Author:</strong> {book.author}</p>
                <p className="book-price"><strong>Price:</strong> ${book.price}</p>
                <p className="book-price"><strong>Category:</strong> {book.category}</p>
                <p className="book-release-date"><strong>Release Date:</strong> {book.releaseDate}</p>
              </div>
              <div className="notification-buttons-container">
                <div className="notification-btn-like">❤️ {book.like}</div>
                <div onClick={() => handleAddToWishlist(book.bid)} className="notification-btn-wishlist">🛒 Wishlist</div>
                <div onClick={() => navigate(`showAd/${book.bid}`)} className="notification-btn-details">📖 Show Details</div>
              </div>
            </div>
          ))
        ) : (
          <p>No books available in this price range.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
