import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to Your Dashboard!</h1>
      <p>This is your personal dashboard where you can manage your account and settings.</p>
      <button onClick={() => alert("This is a demo button")}>Click Me</button>
    </div>
  );
}

export default Dashboard;
