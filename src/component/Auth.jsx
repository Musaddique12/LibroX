import React, { useState } from "react";
import { auth, firestore_database } from "../Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import './auth.css'

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [channelName, setChannelName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      if (isLogin) {
        const res = await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        localStorage.setItem("uid", res.user.uid);
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        if (!userName || !channelName) {
          toast.error("Please fill in all fields for signup!", {
            position: "top-center",
            autoClose: 3000,
          });
          return;
        }

        const res = await createUserWithEmailAndPassword(auth, email, password);
        toast.success("User created successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        localStorage.setItem("uid", res.user.uid);

        await addDoc(collection(firestore_database, "user"), {
          uid: res.user.uid,
          username: userName,
          channelName: channelName,
          likes: {},
          wishlist: [],
          purchased: [],
          follower: [],
          following: [],
          notificatios: [],
          total_withdrawn: 0,
          total: 0,
        });

        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (error) {
      toast.error(error.message, { position: "top-center" });
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="auth-title">{isLogin ? "Login" : "Signup"}</h2>

        <div className="auth-field">
          <label className="auth-label">Email:</label>
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label className="auth-label">Password:</label>
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {!isLogin && (
          <>
            <div className="auth-field">
              <label className="auth-label">Username:</label>
              <input
                className="auth-input"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Channel Name:</label>
              <input
                className="auth-input"
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="auth-buttons">
          <button
            type="button"
            className="auth-toggle-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Go To Signup" : "Go To Login"}
          </button>

          <button type="submit" className="auth-submit-btn">
            {isLogin ? "Login" : "Signup"}
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
}

export default Auth;
