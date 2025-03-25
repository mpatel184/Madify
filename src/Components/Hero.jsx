import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import doctorImage from "../assets/doctor.png";
import Hospital from "../assets/Hospital.png";
import Ambulance from "../assets/Ambulance.png";
import ae from "../assets/ae.png";
import Cap from "../assets/Capsule.png";
import doc from "../assets/doc.png";

const Hero = () => {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("https://meddata-backend.onrender.com/states");
        setStates(res.data);
      } catch (error) {
        console.error("Error fetching states:", error);
        setError("Failed to load states.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStates();
  }, []);

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedCity("");
    setCities([]);
    setShowStateDropdown(false);

    if (state) {
      fetchCities(state);
    }
  };

  const fetchCities = async (state) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`https://meddata-backend.onrender.com/cities/${state}`);
      setCities(res.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setError("Failed to load cities.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setShowCityDropdown(false);
  };

  const handleSearch = () => {
    if (!selectedState || !selectedCity) {
      alert("Please select both a state and a city.");
      return;
    }

    sessionStorage.setItem("searchState", selectedState);
    sessionStorage.setItem("searchCity", selectedCity);
    navigate("/results");
  };

  return (
    <div className="bg-blue-50 w-full overflow-hidden mt-[50px]">
      <div className="absolute top-0 left-0 right-0 h-screen bg-blue-50 -z-10"></div>

      <div className="pt-[120px] px-4 md:px-8">
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col md:flex-row items-center mb-12">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-gray-900">Find & Book</span>{" "}
                <span className="text-blue-500">Medical Centers</span>
              </h1>
              <p className="text-gray-600 mb-6">
                Connect instantly with a 24x7 specialist or choose to visit a
                particular medical center.
              </p>
              <button
                className="bg-blue-500 text-white rounded-md px-6 py-3 font-medium hover:bg-blue-600 transition-colors"
                onClick={() =>
                  document
                    .querySelector("#search-section")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                Find Centers
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <img
                src={doctorImage}
                alt="Doctor"
                className="h-[300px] object-contain"
              />
            </div>
          </div>

          <div
            id="search-section"
            className="bg-white rounded-lg shadow-md p-6 mb-12"
          >
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex flex-col md:flex-row gap-3 mb-4">
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
                <div className="relative">
                  <input
                    type="text"
                    value={selectedState}
                    onClick={() => setShowStateDropdown(!showStateDropdown)}
                    placeholder="Select State"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                  {showStateDropdown && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {states.map((state, index) => (
                        <li
                          key={index}
                          onClick={() => handleStateChange(state)}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                        >
                          {state}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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
                <div className="relative">
                  <input
                    type="text"
                    value={selectedCity}
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    placeholder="Select City"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                    disabled={!selectedState}
                  />
                  {showCityDropdown && selectedState && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {cities.map((city, index) => (
                        <li
                          key={index}
                          onClick={() => handleCityChange(city)}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                        >
                          {city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-md px-6 py-3 hover:bg-blue-600 transition-colors flex items-center justify-center"
                onClick={handleSearch}
                disabled={isLoading || !selectedState || !selectedCity}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mr-1" viewBox="0 0 24 24">
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

            <div className="mt-8">
              <p className="text-gray-700 mb-4 font-medium">
                You may be looking for
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {[
                  { name: "Doctors", image: doc },
                  { name: "Labs", image: ae },
                  { name: "Hospitals", image: Hospital },
                  { name: "Medical Store", image: Cap },
                  { name: "Ambulance", image: Ambulance },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col items-center p-4 rounded-md hover:bg-blue-50 transition-colors cursor-pointer border border-gray-100"
                  >
                    <img src={item.image} alt={item.name} className="w-12 h-12 bg-blue-100 rounded-full mb-2" />
                    <span className="text-blue-500 text-sm font-medium">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
