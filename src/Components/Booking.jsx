import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [center, setCenter] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("Morning");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
  
    const storedCenter = sessionStorage.getItem('selectedCenter');
    
    if (!storedCenter) {
      setError("Center information not found. Please select a center again.");
      setIsLoading(false);
      return;
    }
    
    try {
      const centerData = JSON.parse(storedCenter);
      setCenter(centerData);
      const dates = [];
      const today = new Date();
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          day: date.getDate(),
          weekday: date.toLocaleDateString('en-US', { weekday: 'short' })
        });
      }
      
      setAvailableDates(dates);
      setSelectedDate(dates[0].value);
      
    } catch (err) {
      setError("Failed to load center information.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time for your appointment");
      return;
    }
    
    const booking = {
      id: Date.now(),
      center: {
        name: center["Hospital Name"],
        location: `${center["City"]}, ${center["State"]}`,
        address: center["Address"],
        phone: center["Phone Number"],
        type: center["Hospital Type"],
        rating: center["Hospital overall rating"]
      },
      date: selectedDate,
      timeOfDay: selectedTime,
      status: "Confirmed"
    };
    
    const existingBookings = JSON.parse(localStorage.getItem('bookings')) || [];
    localStorage.setItem('bookings', JSON.stringify([...existingBookings, booking]));
    
    alert(`Booking confirmed at ${center["Hospital Name"]} for ${selectedTime} on ${selectedDate}`);
    navigate("/my-bookings");
  };

  if (isLoading) {
    return (
      <div className="bg-blue-50 min-h-screen pt-[120px]">
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <svg className="animate-spin h-12 w-12 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-blue-50 min-h-screen pt-[120px]">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Return to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 pt-[120px]">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">Book an Appointment</h2>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-start mb-4">
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
                    <h3 className="text-blue-600 font-semibold text-lg">{center["Hospital Name"]}</h3>
                    <div className="flex items-center mt-1">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      <span className="text-green-600 text-sm">Available Today</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-6">
                  <div>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Location:</span> {center["City"]}, {center["State"]}
                    </p>
                  </div>
                  
                  {center["Address"] && (
                    <div>
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Address:</span> {center["Address"]}
                      </p>
                    </div>
                  )}
                  
                  {center["Phone Number"] && (
                    <div>
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Phone:</span> {center["Phone Number"]}
                      </p>
                    </div>
                  )}
                  
                  {center["Hospital Type"] && (
                    <div>
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Type:</span> {center["Hospital Type"]}
                      </p>
                    </div>
                  )}
                  
                  {center["Hospital Ownership"] && (
                    <div>
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Ownership:</span> {center["Hospital Ownership"]}
                      </p>
                    </div>
                  )}
                  
                  {center["Emergency Services"] && (
                    <div>
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Emergency Services:</span> {center["Emergency Services"]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <h4 className="font-medium text-gray-800 mb-4">Select Appointment Date & Time</h4>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-3">Available Dates (Next 7 Days)</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {availableDates.map((date) => (
                    <div 
                      key={date.value}
                      onClick={() => handleDateChange(date.value)}
                      className={`text-center p-3 rounded-md cursor-pointer border transition-colors
                        ${selectedDate === date.value 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-blue-300'}`}
                    >
                      <div className="text-xs font-medium text-gray-500">
                        {date.weekday}
                      </div>
                      <div className="text-lg font-bold mt-1">
                        {date.day}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-3">Available Time Slots</p>
                <p className="text-gray-600.mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "Morning", label: "Morning", time: "8:00 AM - 12:00 PM" },
                    { id: "Afternoon", label: "Afternoon", time: "12:00 PM - 4:00 PM" },
                    { id: "Evening", label: "Evening", time: "4:00 PM - 8:00 PM" }
                  ].map((slot) => (
                    <div 
                      key={slot.id}
                      onClick={() => handleTimeChange(slot.id)}
                      className={`text-center p-4 rounded-md cursor-pointer border transition-colors
                        ${selectedTime === slot.id 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-blue-300'}`}
                    >
                      <p className="text-sm font-medium">{slot.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{slot.time}</p>
                    </div>
                  ))}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h5 className="font-medium text-gray-800 mb-2">Booking Summary</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Medical Center:</span>
                    <span className="text-gray-800 ml-2">{center["Hospital Name"]}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <span className="text-gray-800 ml-2">
                      {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Time:</span>
                    <span className="text-gray-800 ml-2">{selectedTime}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Fee:</span>
                    <span className="text-green-600 font-medium ml-2">FREE</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => navigate('/results')}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBooking}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Book FREE Center Visit
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Download the Medify App</h3>
              <p className="text-gray-600 mb-4">Access healthcare on the go with our mobile app</p>
              <div className="flex space-x-4">
                <a href="#" className="bg-black text-white px-4 py-2 rounded flex items-center">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.6,13.8l-4-7.5c-0.1-0.2-0.3-0.3-0.5-0.3h-0.9c-0.2,0-0.4,0.1-0.5,0.3l-4,7.5c-0.1,0.2-0.1,0.4,0,0.6l4,7.5 c0.1,0.2,0.3,0.3,0.5,0.3h0.9c0.2,0,0.4-0.1,0.5-0.3l4-7.5C17.7,14.2,17.7,14,17.6,13.8z M16.5,14.1l-3.5,6.6h-0.8l-3.5-6.6 c-0.1-0.1-0.1-0.3,0-0.5l3.5-6.6h0.8l3.5,6.6C16.6,13.8,16.6,14,16.5,14.1z"/>
                  </svg>
                  Google Play
                </a>
                <a href="#" className="bg-black text-white px-4 py-2 rounded flex items-center">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                  </svg>
                  App Store
                </a>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <img src="/app-preview.png" alt="Medify App" className="h-[200px] object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;