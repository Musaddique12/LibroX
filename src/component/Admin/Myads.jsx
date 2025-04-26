import React, { use, useEffect, useState } from 'react'
import { fetch_data } from '../Essential_Functions'
import { collection, getDocs } from 'firebase/firestore'
import { firestore_database } from '../../Firebase'
import './myads.css'
import { useNavigate } from 'react-router-dom'

function Myads() {

    const [allBooks,setAllBook]=useState([])
    const [bookToShow,setBookToShow]=useState([])
    const [profileToShow,setProfileToShow]=useState([])
    const [advaticedData,setadvaticedData]=useState([])
    const navigate=useNavigate()
    useEffect(()=>{
        fetchUserAllBook()
        fetchAdvaticeBook()
    },[])

    useEffect(() => {
        chekingBook();
        chekingProfileAdd();
    }, [allBooks, advaticedData]); 

    const fetchUserAllBook=async()=>{
        const all_Book=await fetch_data('book','uid',localStorage.getItem('uid'))
        if(all_Book.length>0){
            setAllBook(all_Book)
        }
    }

    const fetchAdvaticeBook=async()=>{
        const advatice_book = await getDocs(collection(firestore_database, 'advatice'));
        if (!advatice_book.empty) {
            setadvaticedData(advatice_book.docs[0].data()); // Extracting data properly
          }
    }

    const chekingBook=()=>{
        if (!advaticedData || !advaticedData.book) return; // Ensure advaticedData is valid

        const allKey=Object.keys(advaticedData.book)
        const fetchShowData=allBooks.filter(book => allKey.includes(book.bid));
        if(fetchShowData.length>0){
            setBookToShow(fetchShowData)
        }
        console.log(advaticedData)
    }

    const chekingProfileAdd=()=>{
      if (!advaticedData || !advaticedData.profile) return; // Ensure advaticedData is valid

      const allKey=Object.keys(advaticedData.profile)
      if(allKey.includes(localStorage.getItem('uid'))){
          setProfileToShow(advaticedData.profile[localStorage.getItem('uid')])
      }
      console.log(advaticedData)
  }

  return (
    <div className="myads-container">
       <div className="myads-header">
  </div>
      {profileToShow && (
        <>
          <div className="profile-adv-expiry fade-in">
            <h2 className="profile-adv-heading">Your Profile Advertisement</h2>
            <p className="myads-expiry">
            <button className="myads-add-advatice-btn"  onClick={()=>{navigate('/store/addlaunch')}}>Add More</button>

              <span>Expires:</span> {new Date(profileToShow).toDateString()}
            </p>
          </div>
          <div className="separator-line"></div>
        </>
      )}
  
      {bookToShow.length > 0 ? (
        <div className="myads-grid">
          {bookToShow.map((book) => (
            <div className="myads-card" key={book.bid}>
              <div className="myads-image-container">
                <img src={book.image} alt={book.name} className="myads-image" />
              </div>
              <div className="myads-content">
                <h3 className="myads-title">{book.name}</h3>
                <p className="myads-id">
                  <span>ID:</span> {book.bid}
                </p>
                <p className="myads-expiry">
                  <span>Expires:</span>{" "}
                  {new Date(advaticedData.book[book.bid]).toDateString()}
                </p>
                <div className="myads-buttons">
                  <button className="extend-btn" onClick={()=>{navigate('/store/addlaunch')}}>Extend</button>
                  <button className="details-btn">Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !profileToShow ? (
        <div className="no-ads">
          <img
            src="https://www.icegif.com/wp-content/uploads/2023/03/icegif-245.gif"
            alt="No Ads"
            className="no-ads-image"
          />
          <p>No active ads found.</p>
        </div>
      ) : null}
    </div>
  );
  
  
    
    
}

export default Myads
