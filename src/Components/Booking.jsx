import React, { useState } from "react";
export default function Booking(id) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
  
    const handleBooking = () => {
      const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
      const newBooking = { id, date, time };
      localStorage.setItem("bookings", JSON.stringify([...bookings, newBooking]));
      alert("Appointment booked successfully!");
    };
  
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
        <input type="date" onChange={(e) => setDate(e.target.value)} className="border p-2" />
        <input type="time" onChange={(e) => setTime(e.target.value)} className="border p-2 ml-4" />
        <button onClick={handleBooking} className="bg-green-500 text-white px-4 py-2 ml-4">
          Confirm
        </button>
      </div>
    );
  };