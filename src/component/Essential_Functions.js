import { collection, getDocs, query, updateDoc, where ,doc, getDoc, setDoc,} from 'firebase/firestore';
import { firestore_database } from '.././Firebase'; // Adjust the path as needed
import { toast } from 'react-toastify';  // Make sure to import Toastify

// Fetch books based on category
export const fetch_data = async (collec, key, value) => {

    const booksCollectionRef = collection(firestore_database, collec);
    const q = query(booksCollectionRef, where(key, "==", value));

    try {
        const querySnapshot = await getDocs(q);
        const books = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Books fetched:", books);
        return books;
    } catch (error) {
        console.error("Error fetching books: ", error);

    }
}






export const update_data=async(collec_Name,collecId,key,value)=>{
    const bookDocRef = doc(firestore_database, collec_Name, collecId);

    try {
      await updateDoc(bookDocRef, {
        [key]: value, // Field to update
      });
      console.log("Data updated successfully");
    } catch (error) {
      console.error("Error updating book price: ", error);
    }
}









export const update_user_Likes = async (user_collection_Id, bookId, book_category, book_Bid, bookLike) => {
  const userRef = doc(firestore_database, "user", user_collection_Id);

  try {
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      let userData = userDoc.data();
      let likes = userData.likes || {}; // Get likes map or initialize empty

      if (!likes[book_category]) {
        // If the category doesn't exist, create a new array
        likes[book_category] = [];
      }

      if (!likes[book_category].includes(book_Bid)) {
        // Add new like if not already in array
        likes[book_category].push(book_Bid);
        update_data('book', bookId, 'like', bookLike + 1);   

        // Display success message using Toastify
        toast.success("Book added to likes!", {
          position: "top-center", 
          autoClose: 2000
        });
      } else {
        likes[book_category] = likes[book_category].filter(bid =>  bid !== book_Bid);
        update_data('book', bookId, 'like', bookLike - 1);

        // Display info message using Toastify
        toast.info("Book removed from likes!", {
          position: "top-center", 
          autoClose: 2000
        });
      }

      // Update Firestore document
      await updateDoc(userRef, { likes });

      console.log(`Updated likes for category "${book_category}":`, likes);
      
    } else {
      console.log("User not found!");
    }
  } catch (error) {
    console.error("Error updating likes:", error);

    // Display error message using Toastify
    toast.error("Failed to update likes. Please try again.", {
      position: "top-center", 
      autoClose: 3000
    });
  }
};
