import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./Payment.css"; // Import the CSS file

const Payment = ({ onPaymentSuccess }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const amount = location.state?.amount || 0;
  const message = location.state?.msg || "Try Again!";
  console.log("Payment Amount:", location.state?.amount); 
  console.log("Payment Message:", message);

  const handlePayment = (event) => {
    event.preventDefault()
    toast.success(message, { position: "top-center", autoClose: 3000 });
    setTimeout(() => {
      navigate(-1);
    }, 3000);
  };

  return (
    <div className="payment-container">
      <h2 className="payment-title">Payment</h2>
      <p className="payment-amount">Amount to Pay: <strong>${amount}</strong></p>
      
     <form onSubmit={handlePayment}>
     <input 
        type="text" 
        placeholder="Enter Card Number" 
        required 
        className="payment-input"
      />
      
      <input 
        type="date" 
        placeholder="Enter Expiry" 
        required 
        className="payment-input"
      />

      <input 
        type="number" 
        placeholder="Enter C.V.V" 
        required 
        className="payment-input"
      />
      
      <button type='submit' className="payment-button">Pay</button>
     </form>
      <ToastContainer />
    </div>
  );
};

export default Payment;
