import React, { useContext } from 'react';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const { userData, setIsLoggedIn, setUserData } = useContext(AppContent);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Ici tu peux appeler ton endpoint logout backend si besoin
    setIsLoggedIn(false);
    setUserData(null);
    navigate('/login'); // redirection vers login après logout
  };

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">
        Welcome, {userData ? userData.name : 'Admin'}
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition"
      >
        Logout
      </button>
    </header>
  );
};

export default AdminHeader;
