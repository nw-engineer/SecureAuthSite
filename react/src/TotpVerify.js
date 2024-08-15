import React, { useState } from "react";
import axios from "axios";

function TotpVerify() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://10.2.0.50:4002/auth/verify-totp", {
        otp: otp,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data.success) {
        setMessage("TOTP verified successfully!");
        // ダッシュボードにリダイレクトなどの処理
        window.location.href = "/dashboard";
      } else {
        setMessage("Invalid TOTP code. Please try again.");
      }
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter TOTP Code"
        required
      />
      <button type="submit">Verify TOTP</button>
      <p>{message}</p>
    </form>
  );
}

export default TotpVerify;
