import React, { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';

const AdminDashboard = () => {
  const { backendUrl, setUserData, setIsLoggedIn } = useContext(AppContent);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/logout`, {
        withCredentials: true
      });

      if (res.data.success) {
        setUserData(null);
        setIsLoggedIn(false);
        navigate('/');
      }
    } catch (error) {
      console.log("Erreur lors de la déconnexion :", error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-200">
      <h1 className="text-3xl font-bold mb-4">Hello Admin!</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
