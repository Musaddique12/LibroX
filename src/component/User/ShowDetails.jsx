import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetch_data, update_data, update_user_Likes } from '../Essential_Functions';
import { FaHeart, FaUser, FaTag, FaCalendarAlt, FaDollarSign, FaBox, FaUserPlus } from 'react-icons/fa'; // React Icons
import './ShowDetails.css'; // Import the updated CSS
import { toast, ToastContainer } from 'react-toastify';
import { MdMacroOff } from 'react-icons/md';
import { addDoc, collection } from 'firebase/firestore';
import { firestore_database } from '../../Firebase';

function ShowDetails() {
    const [data, setData] = useState(null);
    const [userData, setCurrentUser] = useState([]);
    const [allComment, setAllComment] = useState([]);
    const [addComment, setAddComment] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // For handling errors
    const { bid } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        getData();
    }, [bid]);



    const getData = async () => {
        try {

            setLoading(true); // Start loading

            const fetchedData = await fetch_data('book', 'bid', bid);
            const fetchedCurrentUser = await fetch_data('user', 'uid', localStorage.getItem('uid'));

            if (fetchedData.length > 0) {

                setData(fetchedData[0]);
                const fetchComment = await fetch_data('comment', 'bid', fetchedData[0].bid)

                if (fetchComment.length > 0) {
                    setAllComment(fetchComment[0].comments)
                }

            } else {

                setError(true); // Set error message if no book is found
            }

            setCurrentUser(fetchedCurrentUser[0]);

        } catch (error) {

            console.error("Error fetching book details:", error);

            setError('Something went wrong. Please try again later.');

        } finally {

            setLoading(false); // End loading
        }
    };


    const read_book = () => {
        if (
            (data.price > 0) &&
            (!userData.rented[data.bid] || (Date.now() - userData.rented[data.bid]) > 30 * 24 * 60 * 60 * 1000)
        ) {
            toast.info("You haven't bought the book", { position: "top-center", autoClose: 3000 });
        } else {
            navigate("/dashboard/book-viewer", {
                state: {
                  pdfUrl: data.pdf_url,
                  price: data.price, // Change to 0 to enable download
                },
              });
        }

    };


    const handleRent = async (book) => {
        if (!userData?.id) return;

        const rentedBooks = userData.rented || {}; // Default to an empty object

        if ((rentedBooks[book.bid]) && (Date.now() - rentedBooks[book.bid]) <= 30 * 24 * 60 * 60 * 1000) {

            toast.info('Book already rented!', { position: 'top-center', autoClose: 3000 });
            return;

        }

        const updatedRented = { ...rentedBooks, [book.bid]: Date.now() };

        await update_data('user', userData.id, 'rented', updatedRented);
        await update_data('user', userData.id, 'total',  userData.total+book.price);
        await update_data('book', book.id, 'quantity', book.quantity + 1);

        setCurrentUser({
            ...userData,
            rented: updatedRented,
        });
        navigate('/dashboard/payment',{state:{amount:book.price,msg:'Book Rented!'}})

        // toast.success('', { position: 'top-center', autoClose: 3000 });
    };



    const handleComment = async (e) => {
        e.preventDefault()
        // Ensure there is a comment text
        if (addComment.length < 0) {
            toast.info("Please enter a comment", { position: "top-center", autoClose: 3000 });
            return;
        }


        const newComment = {
            commenterName: userData.channelName, // Assuming `userData` contains the user's name
            commentText: addComment,
            date: new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()
        };


        try {
            // Check if the book already has comments
            const existingComments = await fetch_data('comment', 'bid', bid);

            if (existingComments.length > 0) {
                // If comments already exist, update the comment array
                const updatedComments = [...existingComments[0].comments, newComment];
                await update_data('comment', existingComments[0].id, 'comments', updatedComments);
                setAllComment(updatedComments);
                setAddComment('')
                toast.success("Comment added successfully", { position: "top-center", autoClose: 3000 });
            } else {
                // If no comment document exists, create a new one
                await addDoc(collection(firestore_database, 'comment'), {
                    bid: bid,
                    comments: [newComment],
                });
                setAllComment([newComment]);
                setAddComment('')
                toast.success("Comment added successfully", { position: "top-center", autoClose: 3000 });
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Failed to add comment", { position: "top-center", autoClose: 3000 });
        }
    };




    const handleAddToWishlist = async (book) => {
        const wishlist = userData.wishList || [];

        if (!wishlist.includes(book.bid)) {
            const updatedWishlist = [...wishlist, book.bid];
            await update_data('user', userData.id, 'wishlist', updatedWishlist);
            toast.success("Book Added to Wishlist!", { position: "top-center", autoClose: 3000 });
        } else {
            toast.info("Book already in Wishlist!", { position: "top-center", autoClose: 3000 });
        }
    };


    const handleLike = async (book) => {
        if (!userData?.id) return;

        await update_user_Likes(userData.id, book.id, book.category, book.bid, book.like);
        await getData();
    };






    if (loading) return <div className="loading">Loading...</div>;

    if (error) {
        return (
            <div className="no-book-found">
                <h2 className="error-title">Good News!</h2>
                <p className="error-message">This book is part of an ongoing event where you can buy it directly from the event and get it delivered to your doorstep!</p>
                <p className="cta-message">Would you like to visit the event for more details and make your purchase?</p>
                <button onClick={() => navigate('/dashboard/event')} className="go-to-event-btn">
                    Visit Event & Buy Now
                </button>
            </div>
        );
    }


    return (
        <div className="show-book-container">
            <div className="show-book-card">
                {/* Image Section */}
                <div className="show-book-image-container">
                    <img className="show-book-image" src={data.image} alt={data.name} />
                    <p onClick={() => { navigate(`/dashboard/showuser/${data.uid}`) }} className="view-profile-link">
                        Visit User Profile
                    </p>

                    <button onClick={() => { handleLike(data); }} className="like-btn">
                        {Object.values(userData.likes).flat().includes(bid) ? 'Dislike' : 'Like'}
                    </button>

                    <button onClick={() => { handleAddToWishlist(data); }} className="wishlist-btn">
                        Save
                    </button>
                    <button onClick={() => { handleRent(data); }} className="purchase-btn">
                        Purchase
                    </button>
                </div>

                {/* Info Section */}
                <div className="show-book-info">
                    <h2 className="show-book-title">{data.name}</h2>

                    {/* Author Information */}
                    <div className="show-book-author-info">
                        <p className="channel-name">Seller: <strong>@{data.seller}</strong></p>

                        <button className="read-book-btn" onClick={() => { read_book(); }}>Read Book</button>
                    </div>

                    {/* Meta Information */}
                    <div className="show-book-meta">
                        <p><FaUser className="show-book-icon" /> <strong>Author:</strong> {data.author||'Invalid'}</p>
                    </div>
                    <div className="show-book-meta">
                        <p><FaTag className="show-book-icon" /> <strong>Category:</strong> {data.category||'Invalid'}</p>
                    </div>
                    <div className="show-book-meta">
                        <p><FaDollarSign className="show-book-icon" /> <strong>Price:</strong> ${data.price||'Null'}</p>
                    </div>
                    <div className="show-book-meta">
                        <p><FaBox className="show-book-icon" /> <strong>Quantity Sold:</strong> {data.quantity||0} units</p>
                    </div>
                    <div className="show-book-meta">
                        <p><FaCalendarAlt className="show-book-icon" /> <strong>Release Date:</strong> {data.releaseDate||'Invalid Date'}</p>
                    </div>
                    <div className="show-book-meta">
                        <p><FaHeart className="show-book-icon" /> <strong>Likes:</strong> {data.like||0}</p>
                    </div>

                    {/* Description Section */}
                    <p className="show-book-desc">{data.desc}</p>
                </div>


                {/* Comment Section */}
                <div className="show-book-container">
                    <h3 className="comment-title">Comments</h3>

                    <form className="comment-form" onSubmit={handleComment}>
                        <input
                            type="text"
                            className="comment-input"
                            placeholder="Write a comment..."
                            onChange={(e) => setAddComment(e.target.value)}
                            value={addComment}
                        />
                        <button type="submit" className="comment-btn">Post</button>
                    </form>

                    <div className="comment-list">
                        {allComment.length > 0 ? (
                            allComment.map((comment, index) => (
                                <div key={index} className="comment">
                                    <div className="comment-header">
                                        <FaUser className="comment-icon" />
                                        <strong>{comment.commenterName}</strong>
                                        <span className="comment-date">{comment.date}</span>
                                    </div>
                                    <p className="comment-text">{comment.commentText}</p>
                                </div>
                            ))
                        ) : (
                            <p className="no-comments">No comments yet. Be the first to comment!</p>
                        )}
                    </div>
                </div>

            </div>
            <ToastContainer />
        </div>


    );
}

export default ShowDetails;

