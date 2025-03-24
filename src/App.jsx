import { useState } from "react";
import HomePage from "./Components/HomePage";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Results from "./Components/Result";
import Booking from "./Components/Booking";
import MyBookings from "./Components/MyBooking";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "tailwindcss";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<Results />} />
        <Route path="/book/:id" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
