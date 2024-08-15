import React, { useState } from "react";
import axios from "axios";
import './LoginForm.css';

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/login`, {
	grant_type: "password",
	username: email,
        password: password,
	scope: "",
	client_id: "",
	client_secret: "",
      }, {
	headers: {
	  'Content-Type': 'application/x-www-form-urlencoded'
	}
      });

      const token = response.data.access_token;
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);

      const totpResponse = await axios.get(`${process.env.REACT_APP_API_URL}/auth/check-totp`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (totpResponse.data.totp_setup_required) {
        window.location.href = "/totp-setup";
      } else if (totpResponse.data.totp_required) {
        window.location.href = "/tfa";
      } else {
        setMessage("Login successful!");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      setMessage("Login failed: " + error.response.data.detail);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
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
      <button type="submit">ログイン</button>
      <p>{message}</p>
    </form>
  );
}

export default LoginForm;
