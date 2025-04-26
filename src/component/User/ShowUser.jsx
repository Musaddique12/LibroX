import React, { useEffect, useState } from 'react';
import { fetch_data, update_data } from '../Essential_Functions';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUserAlt, FaBook, FaUsers, FaHeart, FaUserPlus } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ShowUser.css';

function ShowUser() {
    const [data, setData] = useState(null);
    const [books, setBooks] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const { uid } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            try {
                const fetchedData = await fetch_data('user', 'uid', uid);
                setData(fetchedData[0]);
                getBookData(fetchedData[0].uid);
                setIsFollowing(fetchedData[0].follower.includes(localStorage.getItem('uid')));
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const getBookData = async (uid) => {
            try {
                const fetchedData = await fetch_data('book', 'uid', uid);
                setBooks(fetchedData);
            } catch (error) {
                console.error("Error fetching book details:", error);
            }
        };

        getData();
    }, [uid]);

    const handleFollow = async () => {
        try {
            const currentUser = await fetch_data('user', 'uid', localStorage.getItem('uid'));
            const updatedFollowers = isFollowing
                ? data.follower.filter(id => id !== currentUser[0].uid)
                : [...data.follower, currentUser[0].uid];
            const updatedFollowing = isFollowing
                ? currentUser[0].following.filter(id => id !== uid)
                : [...currentUser[0].following, uid];

            await update_data('user', data.id, 'follower', updatedFollowers);
            await update_data('user', currentUser[0].id, 'following', updatedFollowing);

            setIsFollowing(!isFollowing);
            setData(prevData => ({ ...prevData, follower: updatedFollowers }));
            toast.success(isFollowing ? "Unfollowed successfully!" : "Followed successfully!");
        } catch (error) {
            console.error("Error handling follow action:", error);
            toast.error("Error occurred. Try again.");
        }
    };

    if (!data) return <div className="loading">Loading...</div>;

    return (
        <div className="user-profile-container">
            <div className="user-profile-card">
                <div className="user-profile-header">
                    <h2>Admin Profile</h2>
                    <div className="user-profile-avatar">
                        <img src="https://png.pngtree.com/png-vector/20220719/ourlarge/pngtree-color-icon---businessman-icon-color-sign-vectorteamwork-account-admin-photo-image_37961448.jpg" alt="Admin Avatar" />
                    </div>
                </div>
                <div className="user-profile-details">
                    <div className="user-profile-item">
                        <FaUserAlt className="profile-icon" />
                        <strong>{data.username}</strong>
                    </div>
                    <div className="user-profile-item">
                        <FaBook className="profile-icon" />
                        <span>Channel Name <strong>{data.channelName}</strong></span>
                    </div>
                    <div className="user-profile-item">
                        <FaUsers className="profile-icon" />
                        <span>Followers {data.follower.length}</span>
                    </div>
                    <div className="user-profile-item">
                        <FaHeart className="profile-icon" />
                        <span>Following {data.following.length}</span>
                    </div>
                    <button className="follow-button" onClick={handleFollow}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                        <FaUserPlus className="follow-icon" /> 
                    </button>
                </div>
            </div>

            <div className="user-books-container">
                <h3>Books Uploaded by Admin</h3>
                <div className="books-grid">
                    {books.length > 0 ? (
                        books.map((book) => (
                            <div key={book.id} className="book-card">
                                <img src={book.image} alt={book.name} className="book-image" />
                                <h4>{book.name}</h4>
                                <p>{book.category}</p>
                                <p>Price: ${book.price}</p>
                                <button className="show-details-button" onClick={() => navigate(`/dashboard/showbook/${book.bid}`)}>
                                    Show Details
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No books uploaded yet.</p>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default ShowUser;
