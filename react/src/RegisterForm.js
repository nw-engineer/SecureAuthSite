import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://10.2.0.50:4002/auth/register', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.is_active) {
        navigate('/dashboard');
      } else {
        setMessage(response.data.detail || 'Registration failed');
      }
    } catch (error) {
      setMessage('Registration failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
      {message && <p className="error-message">{message}</p>}
    </form>
  );
}

export default RegisterForm;
