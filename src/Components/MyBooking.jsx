import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
      setBookings(storedBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCancelBooking = (id) => {
    const updatedBookings = bookings.filter((booking) => booking.id !== id);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
    alert("Booking cancelled successfully");
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const filteredBookings = searchQuery
    ? bookings.filter(
        (booking) =>
          (booking.center?.name || booking["Hospital Name"] || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (booking.center?.location || booking["City"] || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (booking.timeOfDay || booking.bookingTime || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : bookings;

  if (isLoading) {
    return (
      <div className="bg-blue-50 min-h-screen pt-[120px]">
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-500"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 pt-[120px]">
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">My Bookings</h1>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search bookings..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-md shadow-md p-8 text-center">
            {searchQuery ? (
              <>
                <p className="text-lg text-gray-700">
                  No bookings match your search.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <p className="text-lg text-gray-700">
                  You don't have any bookings yet.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Find Medical Centers
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking, index) => (
              <div key={index} className="bg-white rounded-md shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 text-lg">
                        {booking.center?.name ||
                          booking["Hospital Name"].toLowerCase() ||
                          "Unknown Hospital"}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {booking.center?.location ||
                          `${booking["City"]}, ${booking["State"]}`}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {booking.status || "Confirmed"}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-500 text-xs mb-1">Date</p>
                    <p className="text-gray-800 font-medium">
                      {booking.date
                        ? formatDate(booking.date)
                        : formatDate(booking.bookingDate || new Date())}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-500 text-xs mb-1">Time</p>
                    <p className="text-gray-800 font-medium">
                      {booking.timeOfDay || booking.bookingTime || "12:00 PM"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-500 text-xs mb-1">Booking ID</p>
                    <p className="text-gray-800 font-medium">
                      #{(booking.id || index).toString().slice(-6)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4 flex justify-end">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-2 transition-colors"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Cancel Booking
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                    onClick={() => {
                      sessionStorage.setItem(
                        "selectedCenter",
                        JSON.stringify({
                          "Hospital Name":
                            booking.center?.name ||
                            booking["Hospital Name"] ||
                            "southeast alabama medical center",
                          City:
                            (booking.center?.location || "").split(", ")[0] ||
                            booking["City"] ||
                            "",
                          State:
                            (booking.center?.location || "").split(", ")[1] ||
                            booking["State"] ||
                            "",
                          Address:
                            booking.center?.address || booking["Address"] || "",
                          "Phone Number":
                            booking.center?.phone ||
                            booking["Phone Number"] ||
                            "",
                          "Hospital Type":
                            booking.center?.type ||
                            booking["Hospital Type"] ||
                            "",
                        })
                      );
                      navigate(`/book/${booking.id || index}`);
                    }}
                  >
                    Change Date
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
