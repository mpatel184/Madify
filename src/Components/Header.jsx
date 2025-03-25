import React from 'react';
import logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleFindDoctorsSearch = (event) => {
    event.preventDefault();
    navigate("/results");
  };

  const goToMyBookings = () => {
    navigate("/my-bookings");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="bg-blue-500 text-white text-center py-2 text-sm">
        The health and well-being of our patients and their health care team will always be our priority, so we follow the best practices for cleanliness.
      </div>
      <nav className="bg-white shadow-md flex justify-between items-center p-4">
        <div className="flex items-center">
          <img src={logo} alt="Medify Logo" className="h-8 mr-2" />
        </div>
        <div className='flex items-center space-x-6'>
          <div className="hidden md:flex space-x-6">
            <a href="#" onClick={handleFindDoctorsSearch} className="text-gray-700 hover:text-blue-500">
              Find Doctors
            </a>
            {['Hospitals', 'Medicines', 'Surgeries', 'Software for Provider', 'Facilities'].map((item) => (
              <a key={item} href="#" className="text-gray-700 hover:text-blue-500">{item}</a>
            ))}
          </div>
          <h1 className='text-3xl.md:text-4xl.font-bold.mb-4'>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={goToMyBookings}
          >
            My Bookings
          </button>
          </h1>

        </div>
      </nav>
    </header>
  );
}