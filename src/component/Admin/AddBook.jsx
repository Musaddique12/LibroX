import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { firestore_database } from '../../Firebase';
import './admin.css'
import { fetch_data, update_data } from '../Essential_Functions';
import { toast, ToastContainer } from 'react-toastify';
import { handleUpload } from '../PdfUpload';

function AddBook() {
  const [Book_Pdf, set_Book_Pdf] = useState('')
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('unknown');
  const [releaseDate, setReleaseDate] = useState('unknown');
  const [price, setPrice] = useState(0);
  const [desc, setDesc] = useState('No description');
  const [image, setImage] = useState('');
  const [language, setLanguage] = useState('')
  const [category, setCategory] = useState()
  const [uploading,setUploading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('uid');

    const userSnap = await fetch_data('user', 'uid', userId);

    const randomString = Math.random().toString(36).substr(2, 9).toUpperCase();

    try {
      const pdf_uploading = await handleUpload(Book_Pdf)
      // Add the book to the 'book' collection
      if (pdf_uploading) {
        setUploading(true);
        await addDoc(collection(firestore_database, 'book'), {
          uid: userId,
          bid: randomString,
          name,
          author,
          category,
          releaseDate,
          price,
          desc,
          pdf_url: pdf_uploading,
          image,
          seller: userSnap[0].channelName,
          quantity: 0,
          like: 0,
        });

        console.log('Book added successfully');
        setAuthor('')
        setCategory('')
        setDesc('')
        setImage('')
        setLanguage('')
        setName('')
        setPrice('')
        setReleaseDate('')
        set_Book_Pdf('')
      
      // Fetch user data to get the followers

      if (userSnap.length > 0) {
        const userData = userSnap[0]; // Access first user data object
        const followers = Array.isArray(userData.follower) ? userData.follower : [];

        if (followers.length > 0) {
          console.log(`Notifying ${followers.length} followers...`);

          // Create notification object
          const notification = {
            message: `🔔 Exciting news! 📚 A new book, "${name}", has been added by ${userData.username}. Explore it now!`,
            timestamp:new Date().toISOString(),
            bid: randomString,
            seen: false
          };

          for (const followerId of followers) {
            const followerSnap = await fetch_data('user', 'uid', followerId)

            if (followerSnap.length > 0) {
              const followerData = followerSnap[0];
              const notifications = Array.isArray(followerData.notifications) ? [...followerData.notifications, notification] : [notification];
              await update_data('user', followerData.id, 'notifications', notifications);


              console.log(`Notification sent to ${followerData.id}`);
            } else {
              console.warn(`Follower ${followerSnap[0].id} not found`);
            }
          }
          toast.success(`Notification sent to ${followers.length} follwers`)
          setUploading(false);
        } else {
          console.log('No followers to notify');
        }
      } else {
        console.log('User not found');
      }}
    } catch (e) {
      toast.error(`Error: ${e.message || e}`);
      console.error('Error:', e);
    }
  };


  return (
    <div className="add-book-form">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Book Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Book Name"
            required
          />
        </div>

        <div>
          <label>Author Name:</label>

          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div>
          <label>Select Category::</label>
          <select onChange={(e) => setCategory(e.target.value)} required>
            <option>Browse</option>
            <option value='horor'>Horor</option>
            <option value='funny'>Funny</option>
            <option value='novel'>Novel</option>
            <option value='manga'>Manga</option>
          </select>
        </div>

        <div>
          <label>Realse Date:</label>

          <input
            type="date"
            id="releaseDate"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div>
          <label>Book Pdf:</label>

          <input
  type="file"
  id="book_pdf"
  onChange={(e) => set_Book_Pdf(e.target.files[0])}
  required
/>

        </div>


        <div>
          <label>Book Thumbnail Url:</label>

          <input
            type="url"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL"
            required
          />
        </div>


        <div>
          <label>Book Price:</label>

          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div>
          <label>Book Description:</label>

          <textarea
            id="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div>
          <label>Book Language:</label>

          <input
            type="text"
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="Language"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Add Book'}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default AddBook;
