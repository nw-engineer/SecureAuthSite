import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TfaForm.css';

function TfaForm() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const email = localStorage.getItem("email");
      const password = localStorage.getItem("password");

      if (!email || !password) {
        setMessage("Email or password is missing from local storage.");
        return;
      }

      const response = await axios.post('http://10.2.0.50:4002/auth/login-tfa', {
        username: email,
        password: password,
        otp: otp
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      localStorage.setItem("token", response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setMessage("TFA failed: " + (error.response?.data?.detail || "Unknown error"));
    }
  };

  return (
    <form className="tfa-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter your TOTP code"
        required
      />
      <button type="submit">Verify TOTP</button>
      {message && <p className="error-message">{message}</p>}
    </form>
  );
}

export default TfaForm;
