import React from "react";
import "./commonPage.css";
import { useNavigate } from "react-router-dom";
import { nav } from "framer-motion/client";

const CommonPage = () => {
  const navigate = useNavigate()
  return (
    <div className="commonpage-container">
      {/* Navbar */}
      <nav className="commonpage-navbar">
        <div className="commonpage-nav-left">
          <h2 className="commonpage-logo">LibroX</h2>
        </div>
        <div className="commonpage-nav-right">
          <a href="#about" className="commonpage-nav-link">About</a>
          <a href="#testimonials" className="commonpage-nav-link">Testimonials</a>
          <a href="#contact" className="commonpage-nav-link">Contact</a>
          <button className="commonpage-auth-btn" onClick={() => { navigate('/login') }}>Login</button>
          <button className="commonpage-auth-btn commonpage-signup-btn" onClick={() => { navigate('/login') }}>Signup</button>
        </div>
      </nav>

      {/* About Section */}
      <section id="about" className="commonpage-section commonpage-about-section">
        <h2 className="commonpage-section-title">About LibroX</h2>
        <p className="commonpage-section-description">
          LibroX is an online library where users can read, rent, or share books.
          It offers a seamless experience for book lovers and authors.
        </p>
      </section>

      {/* Featured Books Section */}
      <section id="featured-books" className="commonpage-section commonpage-books-section">
        <h2 className="commonpage-section-title">Featured Books</h2>
        <div className="commonpage-book-list">
          <div className="commonpage-book-card">
            <img
              src="https://images.pexels.com/photos/356043/pexels-photo-356043.jpeg"
              alt="Book 1"
              className="commonpage-book-image"
            />
            <h3 className="commonpage-book-title">Atomic Habits</h3>
            <p className="commonpage-book-author">By James Clear</p>
            <span className="commonpage-book-rating">⭐ 4.8</span>
          </div>
          <div className="commonpage-book-card">
            <img
              src="https://static1.squarespace.com/static/5eca7fbf4215f5026a6f9e4a/t/60798f03f4775a38b9a07540/1618579207601/subtle%2Bart.jpg?format=1500w"
              alt="Book 2"
              className="commonpage-book-image"
            />
            <h3 className="commonpage-book-title">The Subtle Art of Not Giving a F*ck</h3>
            <p className="commonpage-book-author">By Mark Manson</p>
            <span className="commonpage-book-rating">⭐ 4.6</span>
          </div>

          <div className="commonpage-book-card">
            <img
              src="https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg"
              alt="Book 2"
              className="commonpage-book-image"
            />
            <h3 className="commonpage-book-title">The Alchemist</h3>
            <p className="commonpage-book-author">By Paulo Coelho</p>
            <span className="commonpage-book-rating">⭐ 4.7</span>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="commonpage-section commonpage-testimonials-section">
        <h2 className="commonpage-section-title">What Users Say</h2>
        <div className="commonpage-testimonial-card">📚 "Amazing platform to find rare books!"</div>
        <div className="commonpage-testimonial-card">📖 "Easy to rent and share books with others."</div>
      </section>

      {/* Call-To-Action Section */}
      <section className="commonpage-section commonpage-cta-section">
        <h2 className="commonpage-cta-title">Join the LibroX Community!</h2>
        <p className="commonpage-cta-description">
          Discover new books, connect with readers, and share your collection.
        </p>
        <button className="commonpage-cta-btn" onClick={() => { navigate('/login') }}>Get Started</button>
      </section>

      {/* Contact Section */}
      <section id="contact" className="commonpage-section commonpage-contact-section">
        <h2 className="commonpage-section-title">Contact Us</h2>
        <p className="commonpage-contact-description">Connect with us on social media:</p>
        <div className="commonpage-social-icons">
          <i className="commonpage-icon fab fa-facebook"></i>
          <i className="commonpage-icon fab fa-twitter"></i>
          <i className="commonpage-icon fab fa-instagram"></i>
        </div>
      </section>
    </div>
  );
};

export default CommonPage;
