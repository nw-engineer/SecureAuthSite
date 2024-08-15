import React, { useState } from 'react';

function TFAForm({ username, password, onSuccess }) {
    const [otp, setOtp] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/auth/login-tfa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, otp })
        });

        if (response.ok) {
            const data = await response.json();
            onSuccess(data.token);
        } else {
            alert('Invalid OTP');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />
            <button type="submit">Submit OTP</button>
        </form>
    );
}

export default TFAForm;
