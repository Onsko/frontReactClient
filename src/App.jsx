import React, { useEffect, useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import { AppContent } from './context/AppContext';
import axios from 'axios';

const App = () => {
  const { backendUrl, setIsLoggedIn, setUserData } = useContext(AppContent);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });

        if (res.data.success) {
          setUserData(res.data.user);
          setIsLoggedIn(true);

          if (res.data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }
      } catch (err) {
        console.log("Erreur récupération des données utilisateur :", err.message);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/admin' element={<AdminDashboard />} />
      </Routes>
    </div>
  );
};

export default App;
