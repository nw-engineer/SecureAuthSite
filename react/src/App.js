import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./LoginForm";
import TotpSetup from "./TotpSetup";
import Dashboard from './Dashboard';
import TfaForm from './TfaForm';
import RegisterForm from './RegisterForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/totp-setup" element={<TotpSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tfa" element={<TfaForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
