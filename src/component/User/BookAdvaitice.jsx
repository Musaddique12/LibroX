import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { firestore_database } from '../../Firebase';
import { fetch_data } from '../Essential_Functions';
import { useNavigate } from 'react-router-dom';
import './bookadvatice.css'

function BookAdvaitice({ bid }) {
    const [BookIds, setBookIds] = useState([]);
    const [Advatise, setAdvatise] = useState(null);
    const [showCloseButton, setShowCloseButton] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getBookData(); 
        const timer = setTimeout(() => setShowCloseButton(true), 10000);
        return () => clearTimeout(timer);
    }, []);

    const getBookData = async () => {
        try {
            const fetching_Data = await getDocs(collection(firestore_database, 'advatice'));
            const data = fetching_Data.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (data.length > 0) {
                console.log("Original Data:", data[0]);
                const filteredBooks = await removeExpiredBooks(data[0]); // Remove expired books
                
                setBookIds(Object.keys(filteredBooks)); 
                select_BookAdvaitice(Object.keys(filteredBooks));
            }
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    };

    const removeExpiredBooks = async (advertisement) => {
        const currentTime = Date.now(); // Get current time in milliseconds
        let updatedBooks = {};

        // Filter only non-expired books
        Object.entries(advertisement.book).forEach(([bookId, expiryDate]) => {
            if (expiryDate > currentTime) {
                updatedBooks[bookId] = expiryDate; 
            }
        });

        // If there were expired books, update Firestore
        if (Object.keys(updatedBooks).length !== Object.keys(advertisement.book).length) {
            try {
                const docRef = doc(firestore_database, 'advatice', advertisement.id);
                await updateDoc(docRef, { book: updatedBooks });
                console.log("Expired books removed from Firestore.");
            } catch (error) {
                console.error("Error updating Firestore:", error);
            }
        }

        return updatedBooks;
    };

    const select_BookAdvaitice = async (bookData) => {
        
        if (bookData.length === 0) {
            console.log("No Book Available for advatice.");
            navigateAfterAd()            
            return;
        }
        const randomIndex = Math.floor(Math.random() * bookData.length);

        try {
            const data = await fetch_data('book', 'bid', bookData[randomIndex]);
            if (data.length > 0) {
                setAdvatise(data[0]);
                console.log("Selected Advertisement:", data[0]);
            }
        } catch (error) {
            console.log("Error fetching advertisement data:", error);
        }
    };

    const navigateAfterAd = () => {
        navigate(`/dashboard/showbook/${bid}`);
    };

    return (
        <div className="book-ad-container">
            {Advatise ? (
                <div className="book-ad">
                  {showCloseButton &&  <button className="close-btn" onClick={navigateAfterAd}>✖</button>}
                    <div className="book-ad-content">
                        <img className="book-ad-image" src={Advatise.image} alt="Book Cover" />
                        <div className="book-ad-info">
                            <h2 className="book-title">
                                {Advatise.name} 
                                <span className="verified-badge">✔</span>
                            </h2>
                            <p className="book-author">by {Advatise.author}</p>
                            <p className="book-category">{Advatise.category}</p>
                            <p className="book-desc">{Advatise.desc}</p>
                            <div className="book-rating">
                                ⭐⭐⭐⭐⭐ <span className="rating-score">(4.8/5)</span>
                            </div>
                            <p className="seller-info">Seller: {Advatise.seller}</p>
                            <button className="buy-now-btn" onClick={()=>{navigate(`/dashboard/showbook/${Advatise.bid}`);}}>Buy Now</button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="loading-text">Loading...</p>
            )}
        </div>
    );
    
}

export default BookAdvaitice;
