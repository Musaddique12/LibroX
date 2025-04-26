import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { firestore_database } from '../../Firebase';
import { fetch_data } from '../Essential_Functions';
import { useNavigate } from 'react-router-dom';
import './profilead.css';

function ProfileAdvaitice({ bid }) {
    const [ProfilesId, setProfilesId] = useState([]);
    const [Advatise, setAdvatise] = useState(null);
    const [showCloseButton, setShowCloseButton] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getProfileData();
        const timer = setTimeout(() => {
            setShowCloseButton(true);
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    const getProfileData = async () => {
        try {
            const fetching_Data = await getDocs(collection(firestore_database, 'advatice'));
            const data = fetching_Data.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (data.length > 0) {
                // Remove expired profiles
                const updatedProfiles = await removeExpireProfile(data[0]);

                setProfilesId(Object.keys(updatedProfiles));
                select_ProfileAdvaitice(Object.keys(updatedProfiles));
            }
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    };

    const removeExpireProfile = async (advertisement) => {
        const currentTime = Date.now(); // Get current time in milliseconds
        let updatedProfiles = {}; // Store profiles that are not expired

        // Check each profile for expiry
        Object.entries(advertisement.profile).forEach(([profileId, expiryDate]) => {
            // Ensure expiryDate is a valid timestamp and check expiry
            if (typeof expiryDate === 'number' && expiryDate > currentTime) {
                updatedProfiles[profileId] = expiryDate; // Keep non-expired profiles
            }
        });

        // If some profiles were expired, update Firestore
        if (Object.keys(updatedProfiles).length !== Object.keys(advertisement.profile).length) {
            try {
                const docRef = doc(firestore_database, 'advatice', advertisement.id);
                await updateDoc(docRef, { profile: updatedProfiles });
                console.log("Expired profiles removed from Firestore.");
            } catch (error) {
                console.error("Error updating Firestore:", error);
            }
        }

        return updatedProfiles; // Return updated profiles
    };

    const select_ProfileAdvaitice = async (profileData) => {
        if (profileData.length === 0) {
            console.log('No profile available for advatice.')
            navigateAfterAd()
            return
        };
        const randomIndex = Math.floor(Math.random() * profileData.length);

        try {
            const data = await fetch_data('user', 'uid', profileData[randomIndex]);
            if (data.length > 0) {
                setAdvatise(data[0]);
            }
        } catch (error) {
            console.log("Error fetching advertisement data:", error);
        }
    };

    const navigateAfterAd = () => {
        navigate(`/dashboard/showbook/${bid}`);
    };

    return (
        <div className="profile-ad-container">
            {Advatise && (
                <div className="profile-ad-overlay">
                    <div className="profile-ad-card animate-fade-in">
                        {showCloseButton && <button onClick={navigateAfterAd} className="profile-ad-close-btn">✖</button>}                        <div className="profile-ad-content">
                            <div className="profile-ad-header">
                                <h2 className="profile-ad-title">
                                    {Advatise.channelName}
                                </h2>
                                <div className="profile-ad-rating">
                                    ⭐⭐⭐⭐⭐ <span className="rating-score">4.8 (2,345 reviews)</span>
                                </div>
                            </div>
                            <p className="profile-ad-message">
                                🌟 Unlock exclusive content! Join <span className="highlight">{Advatise.channelName}</span> and experience a world of premium stories, knowledge, and adventure.
                                <span className="user-count">10,245+ users already joined.</span>
                            </p>
                            <button onClick={()=>{navigate(`/dashboard/showuser/${Advatise.uid}`);}} className="profile-ad-btn">Explore Now 🚀</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default ProfileAdvaitice;
