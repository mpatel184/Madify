import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Results = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const state = sessionStorage.getItem("searchState");
    const city = sessionStorage.getItem("searchCity");

    if (!state) {
      navigate("/");
      return;
    }

    setSelectedState(state);
    setSelectedCity(city || "");
    fetchResults(state, city);
  }, [navigate]);

  const fetchResults = async (state, city) => {
    setIsLoading(true);
    try {
      const url = `https://meddata-backend.onrender.com/data?state=${encodeURIComponent(
        state
      )}${city ? `&city=${encodeURIComponent(city)}` : ""}`;

      const response = await axios.get(url);
      const data = response.data;

      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
      setError("Failed to load medical centers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = (center) => {
    sessionStorage.setItem("selectedCenter", JSON.stringify(center));
    navigate(`/book/${center["Provider ID"] || Date.now()}`);
  };

  const MedicalCenterCard = ({ result }) => {
    const hospitalRating = result["Hospital overall rating"] || 3;
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`h-4 w-4 ${
            i < hospitalRating ? "text-yellow-400" : "text-gray-300"
          }`}
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
            <h3 className="text-blue-600 font-semibold text-lg">
              {result["Hospital Name"]}
            </h3>
            {result["Emergency Services"] === "Yes" && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Emergency Services
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-y-1">
            <p className="text-gray-600 text-sm mr-4">
              <span className="font-medium">Location:</span> {result["City"]},{" "}
              {result["State"]}
            </p>
            {result["Address"] && (
              <p className="text-gray-600 text-sm mr-4">
                <span className="font-medium">Address:</span>{" "}
                {result["Address"]}
              </p>
            )}
            {result["Phone Number"] && (
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Phone:</span>{" "}
                {result["Phone Number"]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            {result["Hospital Type"] && (
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-blue-500 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-sm text-gray-700">
                  {result["Hospital Type"]}
                </span>
              </div>
            )}

            {result["Hospital Ownership"] && (
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-blue-500 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>
                <span className="text-sm text-gray-700">
                  {result["Hospital Ownership"]}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-2 md:mb-0">
              <div className="flex mr-2">{stars}</div>
              <span className="text-sm text-gray-600">
                {hospitalRating}/5 Rating
              </span>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto">
              <div className="text-green-600 font-medium mr-4 text-sm">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Available Today
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded transition-colors"
                onClick={() => handleBooking(result)}
              >
                Book FREE Center Visit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 pt-[120px]">
        <h1 className="text-xl font-semibold mb-4">
          {isLoading
            ? "Searching..."
            : error
            ? "Search Error"
            : `${searchResults.length} medical centers available in ${
                selectedCity
                  ? `${selectedState}, ${selectedCity.toLowerCase()}`
                  : selectedState
              }`}
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
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
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Try Another Search
            </button>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="bg-white rounded-md shadow-md p-8 text-center">
            <p className="text-lg text-gray-700">
              No medical centers found in this location.
            </p>
            <p className="text-gray-500 mt-2">
              Try selecting a different city or state.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              New Search
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              Book appointments with minimum wait-time & verified doctor details Today
            </p>

            {searchResults.map((result, index) => (
              <MedicalCenterCard key={index} result={result} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
