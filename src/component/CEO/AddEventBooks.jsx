import { addDoc, collection, getDocs } from 'firebase/firestore';
import React, { useRef, useState } from 'react'
import { firestore_database } from '../../Firebase';
import { toast, ToastContainer } from 'react-toastify';
import { update_data } from '../Essential_Functions';
import './addeventbook.css'

function AddEventBooks() {
    const [isUploading,setUploading]=useState(false)
    const bookNameRef = useRef(null);
    const priceRef = useRef(null);
    const quantityRef = useRef(null);
    const descRef = useRef(null);
    const imgRef = useRef(null);
  

    const handleSubmit = async(e) => {
        e.preventDefault();
       try{
        setUploading(true)
        const randomString = Math.random().toString(36).substr(2, 9).toUpperCase();

        await addDoc(collection(firestore_database,'event'),{
            bid:randomString,
            bookName: bookNameRef.current.value,
            price: priceRef.current.value,
            quantity: quantityRef.current.value,
            description: descRef.current.value,
            img: imgRef.current.value,
            sell:0,
            previous_earning:0,
            waiter:[]
        });

        const notification = {
            message: `🔔 Exciting news! 📚 A new book, "${bookNameRef.current.value}", has been added to event. Explore it now!`,
            timestamp: new Date(),
            bid: randomString,
            seen: false
          };

        const usersSnapshot = await getDocs(collection(firestore_database, 'user'));
        usersSnapshot.forEach(async (doc) => {
            const allNotification=Array.isArray(doc.notification)?[...doc.notifications,notification]:[notification]
            await update_data('user', doc.id, 'notifications', allNotification);
        });

        toast.success("Book Added", { position: "top-center", autoClose: 3000 });
        setTimeout(()=>{
            window.location.reload();
        },1500)

       }catch(e){
            console.log('Error While Add Event Book',e)
       }
    };

   
    return (
      <div className="AddEventBooks-container">
          <form onSubmit={handleSubmit} className="AddEventBooks-form">
              <h2 className="AddEventBooks-title">Add Event Book</h2>
              <input type="text" placeholder="Book Name" ref={bookNameRef} className="AddEventBooks-input" required />
              <input type="number" placeholder="Price" ref={priceRef} className="AddEventBooks-input" required />
              <input type="number" placeholder="Available Quantity" ref={quantityRef} className="AddEventBooks-input" required />
              <textarea placeholder="Basic Description" ref={descRef} className="AddEventBooks-textarea" required></textarea>
              <input type="url" placeholder="Image URL" ref={imgRef} className="AddEventBooks-input" required/>
              {!isUploading ? (
                  <button type="submit" className="AddEventBooks-button">Submit</button>
              ) : (
                  <p className="AddEventBooks-uploading">Uploading...</p>
              )}
          </form>
          <ToastContainer />
      </div>
  );
}

export default AddEventBooks
