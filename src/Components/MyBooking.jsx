import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(storedBookings);
    setIsLoading(false);
  }, []);

  const cancelBooking = (id) => {
    const updatedBookings = bookings.map((booking) =>
      booking.id === id ? { ...booking, status: "Cancelled" } : booking
    );
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
  };

  const rescheduleBooking = (id) => {
    const timeOptions = ["Morning", "Afternoon", "Evening"];
    const currentBooking = bookings.find((booking) => booking.id === id);
    let newTime;
    do {
      newTime = timeOptions[Math.floor(Math.random() * timeOptions.length)];
    } while (newTime === currentBooking.timeOfDay);
    const updatedBookings = bookings.map((booking) =>
      booking.id === id ? { ...booking, timeOfDay: newTime, status: "Rescheduled" } : booking
    );
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
    alert(`Appointment rescheduled to ${newTime}`);
  };

  return (
    <div className="bg-blue-50 min-h-screen pt-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <svg className="animate-spin h-12 w-12 text-blue-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-blue-500">{booking.center.name}</h3>
                <p className="text-gray-600">{booking.center.description}</p>
                <p className="text-gray-600 mt-2">{booking.center.location}</p>
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-700">Date: <span className="font-semibold">{booking.date}</span></p>
                      <p className="text-gray-700">Time: <span className="font-semibold">{booking.timeOfDay}</span></p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === "Confirmed" 
                        ? "bg-green-100 text-green-800" 
                        : booking.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {booking.status}
                    </div>
                  </div>
                </div>
                {booking.status !== "Cancelled" && (
                  <div className="mt-4 flex space-x-3">
                    <button onClick={() => rescheduleBooking(booking.id)}
                      className="bg-blue-100 text-blue-600 px-4 py-2 rounded-md text-sm hover:bg-blue-200 transition-colors flex-1">
                      Reschedule
                    </button>
                    <button onClick={() => cancelBooking(booking.id)}
                      className="bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm hover:bg-red-200 transition-colors flex-1">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-700 text-lg mb-4">You don't have any bookings yet.</p>
            <Link to="/" className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
              Find Medical Centers
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
