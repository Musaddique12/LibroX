import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './withdraw.css';
import { toast, ToastContainer } from 'react-toastify';
import { update_data } from '../Essential_Functions';

function Withdraw() {
    const navigate = useNavigate();
  const location = useLocation();
  const withdrawalAmount = parseFloat(location.state?.withdrawalAmount || 0);
  const withdrawn = parseFloat(location.state?.withdrawn || 0);
  console.log("Withdrawal Amount:", location.state);

  const fee = withdrawalAmount * 0.1;
  const finalAmount = withdrawalAmount - fee;

  const [upi, setUpi] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (withdrawalAmount === 0 || withdrawalAmount < 10) {
      navigate(-1); // Go back
    }
  }, [withdrawalAmount, navigate]);

  const handleWithdraw = async() => {
    if (!upi || !name || !phone) {
      toast.error("All fields are required", { position: 'top-center' });
      return;
    }


    toast.success("Withdrawal request submitted successfully!", { position: 'top-center' });
    await update_data('user',localStorage.getItem('cid'),'total',0);
    await update_data('user',localStorage.getItem('cid'),'total_withdrawn',withdrawalAmount+withdrawn);
    navigate(-1)
    // Here, you'd send the data to your backend or Firestore
  };

  return (
    <div className="withdraw-container">
      <h2 className="withdraw-title">💸 Withdraw Funds</h2>

      <div className="withdraw-summary">
        <p><strong>Original Amount:</strong> ${withdrawalAmount.toFixed(2)}</p>
        <p><strong>Withdrawal Fee (10%):</strong> ${fee.toFixed(2)}</p>
        <p><strong>Final Amount You'll Receive:</strong> ${finalAmount.toFixed(2)}</p>
      </div>

      <div className="withdraw-form">
        <input
          type="text"
          placeholder="Enter your UPI ID"
          className="withdraw-input"
          value={upi}
          onChange={(e) => setUpi(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your Name"
          className="withdraw-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your Phone Number"
          className="withdraw-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button className="withdraw-button" onClick={handleWithdraw}>
          🚀 Request Withdrawal
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Withdraw;
