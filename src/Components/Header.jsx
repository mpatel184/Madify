import logo from '../assets/logo.png'
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleFindDoctorsSearch = (event) => {
    event.preventDefault();
    navigate("/results");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="bg-blue-500 text-white text-center py-2">
        The health and well-being of our patients and their health care team will always be our priority, so we follow the best practices for cleanliness.
      </div>
      <nav className="bg-gray-100 shadow-md flex justify-between items-center p-4">
        <div className="flex items-center">
          <img src={logo} alt="Medify Logo" className="h-8 mr-2" />
        </div>
        <div className='flex items-center space-x-6'>
          <div className="flex space-x-6">
            <a href="#" onClick={handleFindDoctorsSearch} className="!text-black hover:text-blue-500">
              Find Doctors
            </a>
            {['Hospitals', 'Medicines', 'Surgeries', 'Software for Provider', 'Facilities'].map((item) => (
              <a key={item} href="#" className="!text-black hover:text-blue-500">{item}</a>
            ))}
          </div>
          <button className="!bg-blue-500 text-white px-4 py-2 rounded">
            My Bookings
          </button>
        </div>
      </nav>
    </header>
  );
}
