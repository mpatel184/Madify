import React from "react";
import doctor from "../assets/doctor.png";
import fi from "../assets/fi.png";
import se from "../assets/se.png";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MedicalCentersHero = () => {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultsCount, setResultsCount] = useState(0);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get("https://meddata-backend.onrender.com/states");
        setStates(res.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity("");
    setCities([]);
    
    if (state) {
      fetchCities(state);
    }
  };

  const fetchCities = async (state) => {
    try {
      const res = await axios.get(`https://meddata-backend.onrender.com/cities/${state}`);
      setCities(res.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleSearch = async () => {
    if (!selectedState) {
      alert("Please select a state");
      return;
    }

    setIsSearching(true);
    setShowResults(false);
    
    try {
      const url = `https://meddata-backend.onrender.com/data?state=${encodeURIComponent(selectedState)}${selectedCity ? `&city=${encodeURIComponent(selectedCity)}` : ''}`;
      
      const response = await axios.get(url);
      const data = response.data;
      
      const processedResults = data.map((item, index) => ({
        id: index + 1,
        name: item.HospitalName || "Medical Center",
        location: `${item.city || ""}, ${item.state || ""}`,
        description: item.facility_type || "Healthcare Facility",
        address: item.address || "",
        City: item.city || "",
        State: item.state || "",
        phone: item.phone || "",
        available: true, 
        rating: (Math.random() * 1.5 + 3.5).toFixed(1), 
        consultationFee: Math.floor(Math.random() * 5) * 100
      }));
      
      setSearchResults(processedResults);
      setResultsCount(processedResults.length);
      setShowResults(true);
    } catch (error) {
      console.error("Error during search:", error);
      alert("Error fetching medical centers. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleBooking = (center) => {
    const timeOfDay = ["Morning", "Afternoon", "Evening"][Math.floor(Math.random() * 3)];
    const booking = {
      id: Date.now(),
      center,
      date: new Date().toISOString().slice(0, 10),
      timeOfDay,
      status: "Confirmed"
    };
    
    const existingBookings = JSON.parse(localStorage.getItem('bookings')) || [];
    localStorage.setItem('bookings', JSON.stringify([...existingBookings, booking]));
    
    alert(`Booking confirmed at ${center.name} for ${booking.timeOfDay}`);
    navigate("/my-bookings");
  };

  const goToMyBookings = () => {
    navigate("/my-bookings");
  };

  const MedicalCenterCard = ({ result }) => {
    // Calculate star display based on hospital rating (if available)
    const hospitalRating = result["Hospital overall rating"] || parseInt(result.rating) || 3;
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg 
          key={i}
          className={`h-3 w-3 ${i < hospitalRating ? "text-yellow-400" : "text-gray-300"}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      );
    }
  
    return (
      <div className="bg-white rounded-md shadow-md p-6 mb-4 flex flex-col md:flex-row items-start">
        <div className="mr-4 mb-4 md:mb-0">
          <div className="bg-blue-100 rounded-full p-5 w-20 h-20 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 text-blue-500" 
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
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-blue-600 font-semibold text-lg">{result.HospitalName || result.name}</h3>
            {result["Emergency Services"] === "Yes" && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Emergency Services</span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-y-1">
            <p className="text-gray-600 text-sm mr-4">
              <span className="font-medium">Location:</span> {result.City || result.city}, {result.State || result.state}
            </p>
            {result.Address && (
              <p className="text-gray-600 text-sm mr-4">
                <span className="font-medium">Address:</span> {result.Address || result.address}
              </p>
            )}
            {(result["Phone Number"] || result.phone) && (
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Phone:</span> {result["Phone Number"] || result.phone}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            {result["Hospital Type"] && (
              <div className="flex items-center">
                <svg className="w-4 h-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-sm text-gray-700">{result["Hospital Type"]}</span>
              </div>
            )}
            
            {result["Hospital Ownership"] && (
              <div className="flex items-center">
                <svg className="w-4 h-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span className="text-sm text-gray-700">{result["Hospital Ownership"]}</span>
              </div>
            )}
            
            {result["Meets criteria for meaningful use of EHRs"] && (
              <div className="flex items-center">
                <svg className="w-4 h-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-sm text-gray-700">
                  {result["Meets criteria for meaningful use of EHRs"] === "Y" ? "Uses Electronic Health Records" : "No Electronic Health Records"}
                </span>
              </div>
            )}
            
            {result["Hospital overall rating"] && (
              <div className="flex items-center">
                <svg className="w-4 h-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <span className="text-sm text-gray-700">Overall Rating: {result["Hospital overall rating"]}/5</span>
              </div>
            )}
          </div>
          
          {/* National Comparison Section */}
          {(result["Mortality national comparison"] || 
            result["Safety of care national comparison"] || 
            result["Patient experience national comparison"]) && (
            <div className="mt-3 py-2 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-1">National Comparisons:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                {result["Mortality national comparison"] && (
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      result["Mortality national comparison"].includes("Better") ? "bg-green-500" : 
                      result["Mortality national comparison"].includes("Same") ? "bg-yellow-500" : "bg-red-500"
                    }`}></span>
                    <span className="text-xs text-gray-600">Mortality: {result["Mortality national comparison"]}</span>
                  </div>
                )}
                
                {result["Safety of care national comparison"] && (
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      result["Safety of care national comparison"].includes("Better") ? "bg-green-500" : 
                      result["Safety of care national comparison"].includes("Same") ? "bg-yellow-500" : "bg-red-500"
                    }`}></span>
                    <span className="text-xs text-gray-600">Safety: {result["Safety of care national comparison"]}</span>
                  </div>
                )}
                
                {result["Patient experience national comparison"] && (
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      result["Patient experience national comparison"].includes("Better") ? "bg-green-500" : 
                      result["Patient experience national comparison"].includes("Same") ? "bg-yellow-500" : "bg-red-500"
                    }`}></span>
                    <span className="text-xs text-gray-600">Patient Experience: {result["Patient experience national comparison"]}</span>
                  </div>
                )}
                
                {result["Readmission national comparison"] && (
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      result["Readmission national comparison"].includes("Better") ? "bg-green-500" : 
                      result["Readmission national comparison"].includes("Same") ? "bg-yellow-500" : "bg-red-500"
                    }`}></span>
                    <span className="text-xs text-gray-600">Readmission: {result["Readmission national comparison"]}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-2 md:mb-0">
              <div className="flex mr-2">
                {stars}
              </div>
              <span className="text-sm text-gray-600">
                {result["Hospital overall rating"] ? `${result["Hospital overall rating"]}/5 Rating` : `${result.rating} Rating`}
              </span>
            </div>
            
            <div className="flex items-center justify-between w-full md:w-auto">
              <div className="text-green-600 font-medium mr-4 text-sm">
                {result.available ? "Available Today" : "Call for Availability"}
              </div>
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded transition-colors"
                onClick={() => handleBooking(result)}
              >
                Book Free Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-blue-50 w-full overflow-hidden mt-[80px]">
      <div className="absolute top-0 left-0 right-0 h-screen bg-blue-50 -z-10"></div>

      <div className="pt-[150px] px-4 md:px-8">
        <div className="max-w-6xl mx-auto relative">
          <div className="absolute -top-[100px] right-0 hidden md:block">
            <img
              src={doctor}
              alt="Doctor"
              className="h-[300px] object-contain"
            />
          </div>

          <div className="mb-6 md:w-2/3">
            <p className="text-gray-700 font-medium">
              Skip the travel! Find Online
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="text-gray-900">Medical</span>{" "}
              <span className="text-blue-500">Centers</span>
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Connect instantly with a 24x7 specialist or choose to video visit
              a particular doctor.
            </p>
            <button className="bg-blue-500 text-white rounded-md px-4 py-2 mt-4 text-sm hover:bg-blue-600 transition-colors">
              Find Centers
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8 relative">
            <div className="flex flex-col md:flex-row gap-3 mb-8">
              <div className="flex-1 relative" id="state">
                <span className="absolute inset-y-0 left-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                <select
                  value={selectedState}
                  onChange={handleStateChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Select State</option>
                  {states.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 relative" id="city">
                <span className="absolute inset-y-0 left-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
                <select
                  value={selectedCity}
                  onChange={handleCityChange}
                  disabled={!selectedState || cities.length === 0}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Select City</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <button 
                type="submit"
                className="bg-blue-500 text-white rounded-md px-6 py-2 hover:bg-blue-600 transition-colors flex items-center justify-center"
                onClick={handleSearch}
                disabled={isSearching || !selectedState}
              >
                {isSearching ? (
                  <svg className="animate-spin h-5 w-5 mr-1" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
                Search
              </button>
            </div>

            <div>
              <p className="text-gray-700 mb-4">You may be looking for</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex flex-col items-center p-4 rounded-md hover:bg-blue-50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-blue-500 text-sm font-medium">
                    Doctors
                  </span>
                </div>

                <div className="flex flex-col items-center p-4 rounded-md hover:bg-blue-50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <span className="text-blue-500 text-sm font-medium">
                    Labs
                  </span>
                </div>

                <div className="flex flex-col items-center p-4 rounded-md bg-blue-50 border border-blue-200 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <span className="text-blue-500 text-sm font-medium">
                    Hospitals
                  </span>
                </div>

                <div className="flex flex-col items-center p-4 rounded-md hover:bg-blue-50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-blue-500 text-sm font-medium">
                    Medical Store
                  </span>
                </div>

                <div className="flex flex-col items-center p-4 rounded-md hover:bg-blue-50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-blue-500 text-sm font-medium">
                    Ambulance
                  </span>
                </div>
              </div>
            </div>
          </div>

          {isSearching ? (
            <div className="flex justify-center items-center py-16">
              <svg className="animate-spin h-12 w-12 text-blue-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : showResults ? (
            <div className="search-results">
              <h2 className="text-xl font-semibold mb-4">
                {resultsCount} medical centers available in {selectedState}
                {selectedCity ? `, ${selectedCity}` : ''}
              </h2>
              <p className="text-gray-600 mb-4">
                Book appointments with minimum wait-time & verified doctor details
              </p>
              
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <MedicalCenterCard key={result.id} result={result} />
                ))
              ) : (
                <div className="bg-white rounded-md shadow-md p-8 text-center">
                  <p className="text-lg text-gray-700">No medical centers found in this location.</p>
                  <p className="text-gray-500 mt-2">Try selecting a different city or state.</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white shadow-md overflow-hidden">
                  <div className="flex">
                    <img
                      src={fi}
                      alt="Doctor Consultation"
                      className="h-[150px] w-[400px]"
                    />
                  </div>
                </div>

                <div className="bg-white shadow-md overflow-hidden">
                  <div className="flex">
                    <img
                      src={se}
                      alt="Doctor Consultation"
                      className="h-[150px] w-[400px]"
                    />
                  </div>
                </div>

                <div className="bg-white shadow-md overflow-hidden">
                  <div className="flex">
                    <img
                      src={fi}
                      alt="Doctor Consultation"
                      className="h-[150px] w-[400px]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6 space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
            </>
          )}
          
          <div className="mt-8 text-center">
            <button
              onClick={goToMyBookings}
              className="bg-blue-500 text-white rounded-md px-6 py-2 hover:bg-blue-600 transition-colors"
            >
              My Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalCentersHero;