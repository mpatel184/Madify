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
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("https://meddata-backend.onrender.com/states");
        const statesWithAlabama = [...new Set([...res.data, "Alabama"])];
        setStates(statesWithAlabama);
      } catch (error) {
        console.error("Error fetching states:", error);
        setError("Failed to load states.");
        setStates(["Alabama"]); // Ensure Alabama is always available
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
    setStateDropdownOpen(false);

    if (state) {
      fetchCities(state);
    }
  };

  const fetchCities = async (state) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`https://meddata-backend.onrender.com/cities/${state}`);
      const citiesWithDothan = [...new Set([...res.data, "DOTHAN"])];
      setCities(citiesWithDothan);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setError("Failed to load cities.");
      setCities(["DOTHAN"]); // Ensure DOTHAN is always available
    } finally {
      setIsLoading(false);
    }
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setCityDropdownOpen(false);
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
      {/* Rest of the component remains the same */}
      <div className="pt-[120px] px-4 md:px-8">
        <div className="max-w-6xl mx-auto relative">
          {/* Search section */}
          <div
            id="search-section"
            className="bg-white rounded-lg shadow-md p-6 mb-12"
          >
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div className="flex-1 relative" id="state">
                {/* state dropdown code remains the same */}
                <div 
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                >
                  {selectedState || "Select State"}
                </div>
                {stateDropdownOpen && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto">
                    {states.map((state, index) => (
                      <li 
                        key={index} 
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleStateChange(state)}
                      >
                        {state}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex-1 relative" id="city">
                {/* city dropdown code remains the same */}
                <div 
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  onClick={() => selectedState && setCityDropdownOpen(!cityDropdownOpen)}
                  style={{opacity: !selectedState ? 0.5 : 1}}
                >
                  {selectedCity || "Select City"}
                </div>
                {cityDropdownOpen && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto">
                    {cities.map((city, index) => (
                      <li 
                        key={index} 
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleCityChange(city)}
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;