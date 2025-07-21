import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AppContent } from '../context/AppContext';

const MyOrdersPage = () => {
  const { backendUrl } = useContext(AppContent);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/orders/my`, { withCredentials: true });
        if (res.data.success) {
          setOrders(res.data.orders);
        } else {
          setNotif('Erreur lors de la récupération des commandes');
        }
      } catch (err) {
        console.error('Erreur récupération commandes:', err);
        setNotif('Erreur lors de la récupération des commandes');
      } finally {
        setLoading(false);
        setTimeout(() => setNotif(null), 3000);
      }
    };

    fetchOrders();
  }, [backendUrl]);

  const handleCancel = async (orderId) => {
    try {
      await axios.put(
        `${backendUrl}/api/orders/cancel`,
        { orderId },
        { withCredentials: true }
      );
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      setNotif('Commande annulée avec succès');
    } catch (err) {
      console.error('Erreur annulation commande:', err);
      setNotif("Impossible d'annuler la commande");
    } finally {
      setTimeout(() => setNotif(null), 3000);
    }
  };

  return (
    <div className="bg-[#f9f9f9] text-[#222] min-h-screen flex flex-col">
      <Navbar />

      {notif && (
        <div className="fixed top-16 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50">
          {notif}
        </div>
      )}

      <main className="flex-grow p-6 pt-24 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold mb-8 text-center">Mes commandes</h2>

        {loading ? (
          <p className="text-center text-gray-600">Chargement des commandes...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-400">Aucune commande trouvée.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow p-6 transition hover:shadow-lg"
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">ID :</span> {order._id}
                  </p>
                  <p
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      order.status === 'En attente'
                        ? 'bg-yellow-200 text-yellow-800'
                        : order.status === 'Annulée'
                        ? 'bg-red-200 text-red-800'
                        : 'bg-green-200 text-green-800'
                    }`}
                  >
                    {order.status}
                  </p>
                </div>

                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-semibold">Date :</span>{' '}
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <p className="text-md font-bold mb-3">{order.totalAmount} DT</p>

                <div>
                  <p className="font-semibold mb-1">Produits :</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 max-h-40 overflow-y-auto">
                    {order.products.map((p, idx) => (
                      <li key={idx}>
                        {p.name} — Qté: {p.quantity} — Prix: {p.price} DT
                      </li>
                    ))}
                  </ul>
                </div>

                {order.status === 'En attente' && (
                  <button
                    onClick={() => handleCancel(order._id)}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full transition"
                  >
                    Annuler la commande
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyOrdersPage;
