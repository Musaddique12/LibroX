import React, { useEffect, useState } from "react";
import { fetch_data, update_data } from "../Essential_Functions";
import { useNavigate, useParams } from "react-router-dom";
import { FaUserMinus, FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { collection, getDocs, query, where } from 'firebase/firestore';
import "react-toastify/dist/ReactToastify.css";
import "./Following.css";
import { firestore_database } from "../../Firebase";

function Following() {
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [opt_data,set_opt_data]=useState([])
    const [opt_data_value,set_opt_data_value]=useState([])
    const [user,setUser]=useState([])
    const navigate = useNavigate();
    const uid = localStorage.getItem("uid");
    const { opt } = useParams(); // Get the 'opt' param from URL

    useEffect(() => {
        const getUserData = async () => {
            try {
                const user = await fetch_data("user", "uid", uid);
                if (user.length > 0) {
                    setUser(user);
                    setFollowers(user[0].follower || []);
                    setFollowing(user[0].following || []);
                    console.log(user[0], 'User of 0 is here');
                    console.log(user[0][opt], 'user of 0 with opt');
                    if (user[0][opt]) {
                        // Directly set opt_data without calling get_opt_data yet
                        set_opt_data(user[0][opt]);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        getUserData();
    }, [uid, opt]);

    // Watch for changes in opt_data and then call get_opt_data
    useEffect(() => {
        if (opt_data.length > 0) {
            get_opt_data(); // Only fetch data if opt_data is set
        }
    }, [opt_data]); // Dependency on opt_data state

    const get_opt_data = async () => {
        console.log("Fetching additional data based on opt_data", opt_data);
        try {
            const followRef = collection(firestore_database, 'user');
            let followList = [];
            console.log(opt_data, 'opt data line 46');
            for (let i = 0; i < opt_data.length; i += 10) {
                const batchIds = opt_data.slice(i, i + 10);
                console.log(i);
                const q = query(followRef, where('uid', 'in', batchIds));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => followList.push({ id: doc.id, ...doc.data() }));
            }
             set_opt_data_value(followList);
            console.log(followList, 'Updated followList after fetching data');
        } catch (error) {
            console.error('Error fetching additional data:', error);
        }
    };

    


    // Function to remove a follower
    const removeFollower = async (followerId) => {
        try {
            // Get the remove follower data
            const follower = await fetch_data("user", "uid", followerId);

            // Update the current user's followers list
            const updatedFollowers = user[0].follower.filter(id => id !== followerId);
            await update_data("user", user[0].id, "follower", updatedFollowers);
            setFollowers(updatedFollowers);

            // Remove current user from the follower's following list
            const updatedFollowing = follower[0].following.filter(id => id !== uid);
            await update_data("user", follower[0].id, "following", updatedFollowing);

            toast.success("Follower removed successfully!");
        } catch (error) {
            console.error("Error removing follower:", error);
            toast.error("Failed to remove follower.");
        }
    };

    // Function to unfollow a user
    const unfollowUser = async (followingId) => {
        try {
            // Get the unfollower data data
            const followingUser = await fetch_data("user", "uid", followingId);

            // Update the current user's following list
            const updatedFollowing = user[0].following.filter(id => id !== followingId);
            await update_data("user", user[0].id, "following", updatedFollowing);
            setFollowing(updatedFollowing);

            // Remove current user from the following user's follower list
            const updatedFollowers = followingUser[0].follower.filter(id => id !== uid);
            await update_data("user", followingUser[0].id, "follower", updatedFollowers);

            toast.success("Unfollowed successfully!");
        } catch (error) {
            console.error("Error unfollowing user:", error);
            toast.error("Failed to unfollow.");
        }
    };

    return (
        <div className="following-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                <FaArrowLeft /> Back
            </button>

            {/* Conditionally render the content based on 'opt' */}
            {(opt === 'follower'||opt === 'following') ? (
                <div className="section">
                    <h2>{opt==='follower'?'Follower':'Following'}</h2>
                    {opt_data_value.length > 0 ? (
                        opt_data_value.map((user) => (
                            <div key={user.id} className="user-item">
                                <span>{user.channelName}</span>
                                <button className="remove-button"   onClick={() => opt === 'follower' ? removeFollower(user.uid) : unfollowUser(user.uid)}>
                                    Remove <FaUserMinus />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No {opt==='follower'?'Follower':'Following'} yet.</p>
                    )}
                </div>
            ) : (
                <p>Invalid option provided.</p>
            )}

            <ToastContainer />
        </div>
    );
}

export default Following;
