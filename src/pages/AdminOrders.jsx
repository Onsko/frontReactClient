import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statuses = ['En attente', 'Confirmée', 'Expédiée', 'Annulée'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get('http://localhost:4000/api/orders/all', {
        withCredentials: true,
      });

      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
        setError('Aucune commande trouvée.');
      }
    } catch (err) {
      setError('Erreur lors du chargement des commandes.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`Changer le statut à "${newStatus}" ?`)) return;

    try {
      setUpdatingId(orderId);
      setError(null);

      const res = await axios.put(
        'http://localhost:4000/api/orders/update-status',
        { orderId, status: newStatus },
        { withCredentials: true }
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.data.order : o))
        );
      } else {
        setError('Échec de la mise à jour.');
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p>Chargement des commandes...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#0c1b4d]">📦 Gestion des Commandes</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      {!orders.length && !error && <p>Aucune commande trouvée.</p>}

      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border-l-4 border-[#0c1b4d] shadow p-6 rounded-md"
          >
            <div className="mb-3">
              <h2 className="text-lg font-semibold">🆔 Commande : {order._id}</h2>
              <p className="text-sm text-gray-600">Date : {new Date(order.createdAt).toLocaleString()}</p>
              <p className="text-sm">Client : {order.userId?.email || 'Non défini'}</p>
<p className="text-md text-gray-700 mb-1">
  <span className="font-semibold">Total :</span> {order.totalAmount} DT
</p>
            </div>

            <div className="mb-3">
              <label className="font-medium">Statut :</label>
              <select
                disabled={updatingId === order._id}
                value={order.status || 'En attente'}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="ml-2 border px-2 py-1 rounded bg-gray-100"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              {updatingId === order._id && <span className="ml-2 text-gray-500">⏳</span>}
            </div>

            <div>
              <strong className="block mb-1">🛒 Produits :</strong>
              <ul className="list-disc ml-6 text-sm">
                {order.products?.length ? (
                  order.products.map((p, i) => (
                    <li key={i}>
                      {p.name} — Qté: {p.quantity} — Prix: {p.price} DT
                    </li>
                  ))
                ) : (
                  <li>Aucun produit</li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
