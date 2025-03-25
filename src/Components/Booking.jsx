import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [center, setCenter] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [visibleDates, setVisibleDates] = useState([]);

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
          weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          slots: 10 + Math.floor(Math.random() * 10)
        });
      }
      
      setAvailableDates(dates);
      setSelectedDate(dates[0].value);
      updateVisibleDates(0, dates);
      
    } catch (err) {
      setError("Failed to load center information.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const updateVisibleDates = (startIndex, dates = availableDates) => {
    setVisibleDates(dates.slice(startIndex, startIndex + 3));
  };

  const handleDateChange = (index) => {
    setActiveTab(index);
    if (index >= 0 && index < availableDates.length) {
      setSelectedDate(availableDates[index].value);
    }
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time for your appointment.");
      return;
    }
  
    const booking = {
      id: Date.now(),
      "Hospital Name": center["Hospital Name"],
      "City": center["City"] || "",
      "State": center["State"] || "",
      "Hospital Type": center["Hospital Type"] || "",
      "Phone Number": center["Phone Number"] || "",
      "Address": center["Address"] || "",
      date: new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
      timeOfDay: selectedTime,
      status: "Confirmed"
    };
  
    const existingBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    localStorage.setItem("bookings", JSON.stringify([...existingBookings, booking]));
  
    alert(`Booking confirmed at ${center["Hospital Name"]} for ${selectedTime} on ${booking.date}`);
    setTimeout(() => navigate("/my-bookings"), 500);
  };
  

  const handleNavigation = (direction) => {
    if (direction === 'prev' && activeTab > 0) {
      const newIndex = Math.max(0, activeTab - 3);
      setActiveTab(newIndex);
      updateVisibleDates(newIndex);
    } else if (direction === 'next' && activeTab < availableDates.length - 3) {
      const newIndex = Math.min(availableDates.length - 3, activeTab + 3);
      setActiveTab(newIndex);
      updateVisibleDates(newIndex);
    }
  };

  const morningSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];
  const afternoonSlots = ["12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM"];
  const eveningSlots = ["05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"];

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

  const getDateLabel = (date, index) => {
    const today = new Date();
    const dateObj = new Date(date.value);
    
    if (dateObj.getDate() === today.getDate() && 
        dateObj.getMonth() === today.getMonth() && 
        dateObj.getFullYear() === today.getFullYear()) {
      return 'Today';
    } else if (dateObj.getDate() === today.getDate() + 1 && 
               dateObj.getMonth() === today.getMonth() && 
               dateObj.getFullYear() === today.getFullYear()) {
      return 'Tomorrow';
    } else {
      return `${date.weekday}, ${date.day} ${date.month}`;
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 pt-[120px]">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Book an Appointment</h1>
          
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
                    <h3 className="font-semibold text-blue-900 text-lg">{center["Hospital Name"]}</h3>
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
                <div className="relative flex mb-8">
                  <button 
                    onClick={() => handleNavigation('prev')}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 ${activeTab === 0 ? 'text-gray-300' : 'text-blue-500'}`}
                    disabled={activeTab === 0}
                  >
                    <span className="text-2xl">&lsaquo;</span>
                  </button>
                  
                  <div className="flex w-full justify-center space-x-8">
                    {availableDates.slice(activeTab, activeTab + 3).map((date, index) => (
                      <div 
                        key={date.value}
                        className={`text-center cursor-pointer transition-all ${selectedDate === date.value ? 'border-t-4 border-green-500 pt-1' : 'pt-[5px]'}`}
                        onClick={() => {
                          setSelectedDate(date.value);
                          handleDateChange(activeTab + index);
                        }}
                      >
                        <p className="text-lg font-medium">
                          {getDateLabel(date, activeTab + index)}
                        </p>
                        <div className="text-sm text-green-600">{date.slots} Slots Available</div>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => handleNavigation('next')}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 ${activeTab >= availableDates.length - 3 ? 'text-gray-300' : 'text-blue-500'}`}
                    disabled={activeTab >= availableDates.length - 3}
                  >
                    <span className="text-2xl">&rsaquo;</span>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <p className="font-medium text-gray-700 mb-3">Morning</p>
                    <div className="flex flex-wrap gap-2">
                      {morningSlots.map(time => (
                        <button
                          key={time}
                          onClick={() => handleTimeChange(time)}
                          className={`px-4 py-2 border rounded-md transition-colors
                            ${selectedTime === time 
                              ? 'border-blue-500 bg-blue-50 text-blue-500' 
                              : 'border-gray-300 hover:border-blue-300'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-700 mb-3">Afternoon</p>
                    <div className="flex flex-wrap gap-2">
                      {afternoonSlots.map(time => (
                        <button
                          key={time}
                          onClick={() => handleTimeChange(time)}
                          className={`px-4 py-2 border rounded-md transition-colors
                            ${selectedTime === time 
                              ? 'border-blue-500 bg-blue-50 text-blue-500' 
                              : 'border-gray-300 hover:border-blue-300'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-700 mb-3">Evening</p>
                    <div className="flex flex-wrap gap-2">
                      {eveningSlots.map(time => (
                        <button
                          key={time}
                          onClick={() => handleTimeChange(time)}
                          className={`px-4 py-2 border rounded-md transition-colors
                            ${selectedTime === time 
                              ? 'border-blue-500 bg-blue-50 text-blue-500' 
                              : 'border-gray-300 hover:border-blue-300'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
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
                    <span className="text-gray-800 ml-2">{selectedTime || 'Not selected'}</span>
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
                  disabled={!selectedDate || !selectedTime}
                  className={`px-6 py-2 rounded transition-colors ${
                    !selectedDate || !selectedTime 
                    ? 'bg-blue-300 text-white cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  data-testid="book-appointment-btn"
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
