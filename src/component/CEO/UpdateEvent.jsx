import { collection, doc, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { firestore_database } from '../../Firebase';
import './updateevent.css'
function UpdateEvent() {
    const location = useLocation();
    const [book, setBook] = useState(null);
    const [isUpdating, setUpdating] = useState(false);
    const [oldPrice, setOldPrice] = useState(0);
    const [oldStock, setOldStock] = useState() // Store old price
    const navigate=useNavigate()

    // Load book details when page loads
    useEffect(() => {

        if (location.state) {
            setBook(location.state);
            setOldPrice(location.state.price); // Save old price for calculations
            setOldStock(location.state.quantity);
            console.log(location.state)
        }
    }, [location.state]);


    const sendingNotification = async () => {
        const notification = {
            message: `🔔 Exciting news! 📚 A new book, "${book.bookName}", has been updated. Explore it now!`,
            timestamp: new Date(),
            bid: book.bid,
            seen: false
        };

        const isStockChanged = oldStock !== book.quantity;
        const isOtherDetailsChanged = oldPrice !== book.price ||
            book.description !== location.state.description ||
            book.img !== location.state.img;

        let userToNotify = [];

        // If only stock changed, notify only waiter users
        if (isStockChanged && !isOtherDetailsChanged) {
            userToNotify = book.waiter;
        } else {
            // If stock + details changed, notify all users
            const usersSnapshot = await getDocs(collection(firestore_database, 'user'));
            userToNotify = usersSnapshot.docs.map(doc => doc.id);
        }

        // Update notifications using `arrayUnion`
        userToNotify.forEach(async (userId) => {
            const userRef = doc(firestore_database, "user", userId);
            await updateDoc(userRef, {
                notifications: arrayUnion(notification)
            });
        });

        console.log("Notifications sent successfully!");
    };


    const update_event_book = async (e) => {
        e.preventDefault();
        if (!book) return;

        setUpdating(true);


        // Check if price changed
        let updatedBook = { ...book };
        if (oldPrice !== Number(book.price)) {
            updatedBook.previous_earning = updatedBook.previous_earning + ((book.sell || 0) * oldPrice);
            updatedBook.sell = 0;
        }

        try {
            const bookDocRef = doc(firestore_database, 'event', book.id);
            await updateDoc(bookDocRef, updatedBook);
            await sendingNotification()
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
        <div className="update-event-container">
            <div className="update-event-card">
                <h2 className="update-event-heading">Update Book Details</h2>

                {book ? (
                    <form onSubmit={update_event_book} className="update-event-form">
                        <div className="update-event-input-group">
                            <label className="update-event-label">Book Name:</label>
                            <input
                                type="text"
                                value={book.bookName}
                                onChange={(e) => setBook({ ...book, bookName: e.target.value })}
                                className="update-event-input"
                            />
                        </div>

                        <div className="update-event-input-group">
                            <label className="update-event-label">Price:</label>
                            <input
                                type="number"
                                value={book.price}
                                onChange={(e) => setBook({ ...book, price: Number(e.target.value) })}
                                className="update-event-input"
                            />
                        </div>

                        <div className="update-event-input-group">
                            <label className="update-event-label">Available Quantity:</label>
                            <input
                                type="number"
                                value={book.quantity}
                                onChange={(e) => setBook({ ...book, quantity: Number(e.target.value) })}
                                className="update-event-input"
                            />
                        </div>

                        <div className="update-event-input-group">
                            <label className="update-event-label">Description:</label>
                            <textarea
                                value={book.description}
                                onChange={(e) => setBook({ ...book, description: e.target.value })}
                                className="update-event-textarea"
                            />
                        </div>

                        <div className="update-event-input-group">
                            <label className="update-event-label">Image URL:</label>
                            <input
                                type="url"
                                value={book.img}
                                onChange={(e) => setBook({ ...book, img: e.target.value })}
                                className="update-event-input"
                            />
                        </div>

                        {!isUpdating ? (
                            <button type="submit" className="update-event-button">
                                Update
                            </button>
                        ) : (
                            <p className="update-event-loading">Updating...</p>
                        )}
                    </form>
                ) : (
                    <p className="update-event-loading">Loading book details...</p>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}

export default UpdateEvent;
