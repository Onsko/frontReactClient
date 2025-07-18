import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AppContextProvider } from './context/AppContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'; // ou './App.css' selon ton projet


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppContextProvider>
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProvider>
    </AppContextProvider>
  </React.StrictMode>
);
