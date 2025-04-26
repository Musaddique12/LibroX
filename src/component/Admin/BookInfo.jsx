import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { firestore_database } from "../../Firebase";
import "./bookinfo.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { fetch_data } from "../Essential_Functions";

function AdminBookInfo() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("");
  const [total, setTotal] = useState(0);
  const [userData, setUserData] = useState({});
  const [withdrawnAmount, setWithdrawnAmount] = useState(0);
  const navigate = useNavigate();
  const userId = localStorage.getItem("uid");

  useEffect(() => {
    if (userId) {
      fetchBooks();
    }
  }, [userId]);

  const fetchBooks = async () => {
    try {
      const userInfo=await fetch_data('user','uid',userId);
      
      const booksRef = collection(firestore_database, "book");
      const q = query(booksRef, where("uid", "==", userId));
      const querySnapshot = await getDocs(q);

      const booksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (booksData.length > 0) {
        setBooks(booksData);
      setFilteredBooks(booksData);
      setUserData(userInfo[0]);
      setTotal(userInfo[0].total);
      setWithdrawnAmount(userInfo[0].total_withdrawn);
      }

      
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // 📌 Handle Filtering Logic
  useEffect(() => {
    let filtered = books;

    if (searchTerm) {
      filtered = filtered.filter((book) =>
        book.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (authorFilter) {
      filtered = filtered.filter((book) =>
        book.author.toLowerCase().includes(authorFilter.toLowerCase())
      );
    }

    if (priceRange.min !== "" || priceRange.max !== "") {
      filtered = filtered.filter((book) => {
        return (
          (!priceRange.min || book.price >= parseFloat(priceRange.min)) &&
          (!priceRange.max || book.price <= parseFloat(priceRange.max))
        );
      });
    }

    if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === "quantity") {
      filtered = [...filtered].sort((a, b) => b.quantity - a.quantity);
    }

    setFilteredBooks(filtered);
  }, [searchTerm, authorFilter, priceRange, sortBy, books]);

  return (
    <div className="admin-book-container">
      <h2 className="admin-book-title">📚 Your Books Overview</h2>


      {/* 📌 Filter Options */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by book name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />

        <input
          type="text"
          placeholder="Filter by author..."
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
          className="filter-input"
        />

        <input
          type="number"
          placeholder="Min Price"
          value={priceRange.min}
          onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
          className="filter-input"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={priceRange.max}
          onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
          className="filter-input"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="quantity">Quantity Sold</option>
        </select>
      </div>

      {/* 📌 Earnings & Stats */}
      <div className="admin-stats-container">
        
      <div className="admin-earnings-card">
          <h3>Total Books</h3>
          <p>{filteredBooks.length}</p>
        </div>

        <div className="admin-earnings-card">
          <h3>Total Earnings</h3>
          <p>${total}</p>
          <button
            onClick={() => {
              if (total < 10) {
                toast.info("Minimum withdrawal amount is $10", {
                  position: "top-center",
                  autoClose: 3000,
                });
              } else {
                navigate('/store/withdraw', { state: { withdrawalAmount: total ,withdrawn:withdrawnAmount} });
              }
            }}
          >
            Withdraw
          </button>
        </div>

      
        <div className="admin-earnings-card">
          <h3>Total Withdrawn</h3>
          <p>{withdrawnAmount}</p>
        </div>
      </div>

      

      {/* 📌 Books List */}
      <div className="admin-book-list">
        {filteredBooks.map((book) => (
          <div key={book.id} className="admin-book-card">
            <div className="book-image-container">
              <img src={book.image} alt={book.name} />
            </div>  <p><i>id: {book.bid}</i></p>
            <div className="book-details">
              <h4>{book.name}</h4>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Sold:</strong> {book.quantity}</p>
              <p><strong>Price:</strong> ${book.price}</p>
              <p><strong>Total Value:</strong> ${book.price * book.quantity}</p>

            </div>
            <div className="book-actions">
              <button className="details-btn" onClick={() => navigate(`/dashboard/showbook/${book.bid}`)}>Show Details</button>
              <button className="update-btn" onClick={() => navigate('/store/updatebook', { state: book })}>Update</button>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer/>
    </div>
  );
}

export default AdminBookInfo;
