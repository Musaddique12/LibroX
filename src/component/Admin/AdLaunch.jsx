import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore_database } from '../../Firebase';
import { fetch_data, update_data } from '../Essential_Functions';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import './adlaunch.css'
function AdLaunch() {
    const [BookData, setBookData] = useState({});
    const [ProfileData, setProfilesData] = useState({});
    const [data, setData] = useState([]);
    const [Type, setType] = useState(null);
    const [duration, setDuration] = useState(null);
    const [selectedId, setSelectedId] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [isLaunching,setLaunching]=useState(false)
    const [amount,setamount]=useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => setLoaded(true), 200); // Delayed animation effect

        getAdData();
    }, []);

    const getAdData = async () => {
        try {
            const fetching_Data = await getDocs(collection(firestore_database, 'advatice'));
            const data = fetching_Data.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (data.length > 0) {
                setBookData(data[0].book || {});
                setProfilesData(data[0].profile || {});
                setData(data[0]);
            }
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    };

    const IsBookExist = async (bid) => {

        const book = await fetch_data('book', 'bid', bid)
        return book.length > 0;

    }

    const calculateNewTimestamp = (currentTimestamp, durationType) => {

        const currentTime = Date.now();
        const baseTime = currentTimestamp > currentTime ? currentTimestamp : currentTime; // Use the greater of the two
        console.log('durationType',durationType)
        switch (durationType) {
            case "1 Day":{setamount(2); return baseTime + 24 * 60 * 60 * 1000;}  // 1 day in milliseconds
            case "1 Week":{ setamount(15);return baseTime + 7 * 24 * 60 * 60 * 1000;}  // 1 week in milliseconds
            case "5 Weeks":{ setamount(60);return baseTime + 5 * 7 * 24 * 60 * 60 * 1000;}  // 4 weeks in milliseconds
            default: return baseTime;
            
        }

    };

    const handleAdvatice = async () => {

        if (!Type || !duration) {
            toast.error("Please select type, enter ID, and choose a package.", { position: "top-center", autoClose: 3000 });
            return;
        }
        if (Type === "Profile" && (selectedId==="" || selectedId.length < 28)) {
            toast.error("Please Login Again.", { position: "top-center", autoClose: 3000 });
        
            const timer = setTimeout(() => {
                navigate('/');
            }, 3000);
            return;
        }
        

        if (Type === "Book" && !await IsBookExist(selectedId)) {
            toast.error("Book bid is incorrect", { position: "top-center", autoClose: 3000 });
            return;
        }

        try {
            if (Type === "Profile") {
                setLaunching(true)
                const currentTimestamp = ProfileData[selectedId] || 0;
                const newTimestamp = calculateNewTimestamp(currentTimestamp, duration);
                const updatedProfiles = { ...ProfileData, [selectedId]: newTimestamp };

                await update_data('advatice', data.id, 'profile', updatedProfiles);
                setProfilesData(updatedProfiles); // Update local state
                setTimeout(() => {setLaunching(false)
                    console.log('duration',duration)
                    navigate('/dashboard/payment',{state:{amount:amount,msg:'You Profile is in Advatise'}})
                    toast.success("You Profile is in Advatise", { position: "top-center", autoClose: 3000 });
                }, 3000);
            }
            else if (Type === "Book") {
                setLaunching(true)
                const currentTimestamp = BookData[selectedId] || 0;
                const newTimestamp = calculateNewTimestamp(currentTimestamp, duration);
                const updatedBooks = { ...BookData, [selectedId]: newTimestamp };

                await update_data('advatice', data.id, 'book', updatedBooks);
                setBookData(updatedBooks); // Update local state
                setTimeout(() => {setLaunching(false)
                    console.log('duration',duration)
                    navigate('/dashboard/payment',{state:{amount:amount,msg:'You Book is in Advatise'}})
                    toast.success("", { position: "top-center", autoClose: 3000 });
                }, 3000);
            }

        } catch (error) {
            setTimeout(() => setLaunching(false), 3000);
            console.log("Error updating advertisement:", error);
        }
    };

    return (
        <div className={`adlaunch-container ${loaded ? "fade-in" : ""}`}>
            <h2 className="adlaunch-title">🚀 Launch Your Advertisement</h2>

            <form className="adlaunch-form">
                <div className="adlaunch-type">
                    <label>
                        <input type="radio" name="type" value="Book" onClick={()=>{setSelectedId('')}} onChange={() => setType("Book")} /> For Book
                    </label>
                    <label>
                        <input type="radio" name="type" value="Profile" onClick={()=>{setSelectedId(localStorage.getItem('uid'||""))}} onChange={() => setType("Profile")} /> For Profile
                    </label>
                </div>

                <input
                    type="text"
                    placeholder="Enter Book bid"
                    className="adlaunch-input"
                    value={selectedId}
                    disabled={Type === 'Profile'}
                    onChange={(e) => setSelectedId(e.target.value)}
                />
            </form>

            <div className="adlaunch-duration">
                <label>
                    <input type="radio" name="duration" value="1 Day" onChange={() => setDuration("1 Day")} /> 1 Day - $2
                </label>
                <label>
                    <input type="radio" name="duration" value="1 Week" onChange={() => setDuration("1 Week")} /> 1 Week - $10
                </label>
                <label>
                    <input type="radio" name="duration" value="4 Weeks" onChange={() => setDuration("5 Weeks")} /> 4 + 1 Weeks - $40
                </label>
            </div>

            <button className="adlaunch-button" onClick={handleAdvatice} disabled={isLaunching}>{isLaunching ?<><img src='https://cdn.dribbble.com/userupload/23755986/file/original-a9b2368ba51a2ea436bcf31ffdbd46ee.gif' style={{height:'100px',borderRadius:'10px',width:'100%'}}></img></>:'🚀 Launch Advertisement'}</button>

            <ToastContainer />
        </div>
    );
}

export default AdLaunch;
