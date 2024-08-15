import React, { useEffect, useState } from "react";
import axios from "axios";
import './TotpSetup.css';

function TotpSetup() {
  const [totpUri, setTotpUri] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotpUri = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/totp-setup`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data)
        setTotpUri(response.data.totp_uri);
      } catch (error) {
        setMessage("Error fetching TOTP URI. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTotpUri();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/setup-totp`, {
        otp: otp,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data.success) {
        setMessage("TOTP setup successful!");
        window.location.href = "/dashboard";
      } else {
        setMessage("Invalid TOTP code. Please try again.");
      }
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div className="totp-setup-container">
      <h2>TOTP Setup</h2>
      {loading ? (
        <p>Loading...</p>
      ) : totpUri ? (
        <div>
          <p>認証アプリでこの QR コードをスキャンします。</p>
          <div className="qr-code">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(totpUri)}`} alt="TOTP QR Code" />
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter TOTP Code"
              required
            />
            <button type="submit">MFA登録</button>
          </form>
        </div>
      ) : (
        <p>Error loading TOTP setup. Please try again later.</p>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default TotpSetup;
