import React, { useEffect, useContext, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import { AppContent } from './context/AppContext';
import axios from 'axios';

// Composant pour protéger une route selon rôle
const PrivateRoute = ({ children, allowedRoles }) => {
  const { userData, isLoggedIn } = useContext(AppContent);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userData?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const { backendUrl, setIsLoggedIn, setUserData } = useContext(AppContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
        if (res.data.success) {
          setUserData(res.data.userData);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      } catch (err) {
        console.error("Erreur récupération des données utilisateur :", err.message);
        setIsLoggedIn(false);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [backendUrl, setIsLoggedIn, setUserData]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route
          path='/admin'
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
