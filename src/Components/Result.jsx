import React, { useState, useEffect } from "react";
export default function Result() {
    const [centers, setCenters] = useState([]);
    const params = new URLSearchParams(window.location.search);
    const state = params.get("state");
    const city = params.get("city");
  
    useEffect(() => {
      axios.get(`${API_BASE}/data?state=${state}&city=${city}`).then((res) => setCenters(res.data));
    }, [state, city]);
  
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Available Medical Centers</h2>
        <ul>
          {centers.map((center) => (
            <li key={center.id} className="border p-4 my-2">
              <h3 className="font-bold">{center.name}</h3>
              <p>{center.address}</p>
              <button
                className="bg-green-500 text-white px-4 py-2 mt-2"
                onClick={() => navigate(`/book/${center.id}`)}
              >
                Book Now
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  