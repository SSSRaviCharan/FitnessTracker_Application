import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./Components/CalculatorComp/LoginForm";
import SignUp from "./Components/CalculatorComp/SignUp";
import Navbar from "./Components/Navbar/Navbar1";
import ChangePassword from "./Components/BluffPages/ChangePassword";
import ForgotPassword from "./Components/BluffPages/ForgotPassword";

function App() {
  const loggedIn = window.localStorage.getItem("isLoggedIn");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={loggedIn ? <Navbar /> : <LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/track" element={<Navbar />} />
        <Route path="/update_password" element={<ChangePassword />} />
        <Route path="forgot_password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
