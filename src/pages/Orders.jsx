// frontend/src/pages/Orders.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.get('http://localhost:4000/api/orders/my-orders')
      .then(res => setOrders(res.data.orders))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Mes Commandes</h2>
      {orders.length === 0 ? (
        <p>Aucune commande passée.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="border p-4 mb-4 rounded shadow">
            <p><strong>Commande ID:</strong> {order._id}</p>
            <p><strong>Statut:</strong> <span className="text-blue-600">{order.status}</span></p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <div className="mt-2">
              {order.products.map((p, i) => (
                <div key={i} className="flex justify-between">
                  <span>{p.name} × {p.quantity}</span>
                  <span>{p.price * p.quantity} DT</span>
                </div>
              ))}
            </div>
            <div className="text-right mt-2 font-bold">
              Total : {order.totalAmount} DT
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
