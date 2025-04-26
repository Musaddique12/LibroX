import React, { useState, useEffect } from 'react';
import BookAdvaitice from './BookAdvaitice';
import ProfileAdvaitice from './ProfileAdvatice';
import { useNavigate, useParams } from 'react-router-dom';

function AdvatisePage() {
    const [randomAd, setRandomAd] = useState(null);
    const navigate=useNavigate()
    const {bid}=useParams()

    useEffect(() => {

        if(Math.random() < 0.1)
        {
            navigate(`/dashboard/showbook/${bid}`)
        }
        else{
            if (Math.random() < 0.5) {
                setRandomAd('book'); 
            } else {
                setRandomAd('profile');  
            }
        }

    }, []);

    return (
        <div>
            {randomAd === 'book' ? <BookAdvaitice bid={bid} /> :  <ProfileAdvaitice bid={bid} />}
        </div>
    );
}

export default AdvatisePage;
