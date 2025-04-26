import { collection, doc, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { firestore_database } from '../../Firebase';
import './updatebook.css'
function UpdateBook() {
    const location = useLocation();
    const [book, setBook] = useState(null);
    const [isUpdating, setUpdating] = useState(false);
    const navigate=useNavigate()

    // Load book details when page loads
    useEffect(() => {

        if (location.state) {
            setBook(location.state);
            console.log(location.state)
        }
    }, [location.state]);


    const update_event_book = async (e) => {
        e.preventDefault();
        if (!book) return;

        setUpdating(true);


        
       
        try {
            const bookDocRef = doc(firestore_database, 'book', book.id);
            await updateDoc(bookDocRef, ...book);

            toast.success("Book Updated Successfully!", { position: "top-center", autoClose: 3000 });
            setTimeout(()=>{
                navigate(-1)
            },2000)
        } catch (error) {
            toast.error("Failed to update book.", { position: "top-center", autoClose: 3000 });
            console.error("Error updating book: ", error);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="updatebook-container">
            <h2 className="updatebook-title">Update Book Details</h2>

            {book ? (
                <form onSubmit={update_event_book} className="updatebook-form">
                    <label className="updatebook-label">Book Name:</label>
                    <input
                        type="text"
                        value={book.name}
                        onChange={(e) => setBook({ ...book, name: e.target.value })}
                        className="updatebook-input"
                    />

                    <label className="updatebook-label">Author:</label>
                    <input
                        type="text"
                        value={book.author}
                        onChange={(e) => setBook({ ...book, author: e.target.value })}
                        className="updatebook-input"
                    />

                    <label className="updatebook-label">Category:</label>
                    <input
                        type="text"
                        value={book.category}
                        onChange={(e) => setBook({ ...book, category: e.target.value })}
                        className="updatebook-input"
                    />

                    <label className="updatebook-label">Release Date:</label>
                    <input
                        type="text"
                        value={book.releaseDate}
                        onChange={(e) => setBook({ ...book, releaseDate: e.target.value })}
                        className="updatebook-input"
                    />

                    <label className="updatebook-label">Price:</label>
                    <input
                        type="number"
                        value={book.price}
                        onChange={(e) => setBook({ ...book, price: Number(e.target.value) })}
                        className="updatebook-input"
                    />

                    <label className="updatebook-label">Description:</label>
                    <textarea
                        value={book.desc}
                        onChange={(e) => setBook({ ...book, description: e.target.value })}
                        className="updatebook-textarea"
                    />

                    <label className="updatebook-label">Image URL:</label>
                    <input
                        type="url"
                        value={book.image}
                        onChange={(e) => setBook({ ...book, image: e.target.value })}
                        className="updatebook-input"
                    />

                    {!isUpdating ? (
                        <button type="submit" className="updatebook-button">
                            Update
                        </button>
                    ) : (
                        <p className="updatebook-loading">Updating...</p>
                    )}
                </form>
            ) : (
                <p className="updatebook-loading">Loading book details...</p>
            )}

            <ToastContainer />
        </div>
    );
}

export default UpdateBook;
