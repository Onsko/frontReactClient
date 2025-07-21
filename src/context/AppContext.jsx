import { useEffect, useState, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

const getUserData = async () => {
  try {
    const { data } = await axios.get(`${backendUrl}/api/user/data`, {
      withCredentials: true, // ✅ INDISPENSABLE pour que le JWT soit envoyé
    });

    if (data.success) {
      setUserData(data.user); // ✅ Doit correspondre au backend (res.json({ success: true, user }))
    } else {
      setUserData(null);
      toast.error(data.message || "Erreur lors de la récupération des données utilisateur");
    }
  } catch (error) {
    setUserData(null);
    toast.error(error.message || "Erreur inconnue lors de la récupération des données utilisateur");
  }
};


  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
      if (data.success) {
        setIsLoggedIn(true);
        await getUserData();
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};
