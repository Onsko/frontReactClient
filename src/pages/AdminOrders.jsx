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
        withCredentials: true // IMPORTANT : pour envoyer les cookies (token)
      });

      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
        setError('Aucune commande trouvée.');
      }
    } catch (err) {
      console.error('Erreur chargement commandes', err);
      setError('Erreur lors du chargement des commandes.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      setError(null);

      const res = await axios.put(
        'http://localhost:4000/api/orders/update-status',
        { orderId, status: newStatus },
        { withCredentials: true } // encore ici pour l'authentification
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.data.order : o))
        );
      } else {
        setError('Impossible de mettre à jour le statut.');
      }
    } catch (err) {
      console.error('Erreur mise à jour statut', err);
      setError('Erreur lors de la mise à jour du statut.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p>Chargement des commandes...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des commandes</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      {!orders.length && !error && <p>Aucune commande trouvée.</p>}

      {orders.map((order) => (
        <div key={order._id} className="mb-6 p-4 border rounded shadow">
          <h2 className="font-semibold text-xl mb-2">Commande ID : {order._id}</h2>
          <p><strong>Utilisateur :</strong> {order.userId?.email || 'N/A'}</p>
          <p><strong>Date :</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p>
            <strong>Statut :</strong>{' '}
            <select
              disabled={updatingId === order._id}
              value={order.status || 'En attente'}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
              className="ml-2 border rounded px-2 py-1"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            {updatingId === order._id && <span className="ml-2 text-gray-500">Mise à jour...</span>}
          </p>
          <p><strong>Total :</strong> {order.totalAmount} €</p>

          <div>
            <strong>Produits :</strong>
            <ul className="list-disc ml-6">
              {(order.products && order.products.length > 0) ? (
                order.products.map((p, index) => (
                  <li key={p.productId || index}>
                    {p.name} — Quantité : {p.quantity} — Prix unitaire : {p.price} €
                  </li>
                ))
              ) : (
                <li>Aucun produit trouvé</li>
              )}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
