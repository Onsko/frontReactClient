// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Vérification de base
    if (!form.name || !form.address || !form.city || !form.postalCode || !form.phone) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
// call the api to add the order on the db

    // ✅ Traitement fictif de commande ici
    toast.success("Commande passée avec succès !");
    clearCart();
    navigate('/');
  };

  return (
    <div className="pt-28 pb-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">🧾 Finaliser ma commande</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulaire de livraison */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">📝 Informations de livraison</h3>

          <input
            type="text"
            name="name"
            placeholder="Nom complet"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="address"
            placeholder="Adresse"
            value={form.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="city"
            placeholder="Ville"
            value={form.city}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Code postal"
            value={form.postalCode}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="phone"
            placeholder="Téléphone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Passer la commande
          </button>
        </form>

        {/* Résumé du panier */}
        <div className="bg-white shadow p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">🛍️ Résumé de commande</h3>

          {cartItems.length === 0 ? (
            <p>Votre panier est vide.</p>
          ) : (
            <>
              <ul className="space-y-2">
                {cartItems.map((item) => (
                  <li key={item._id} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{item.price * item.quantity} DT</span>
                  </li>
                ))}
              </ul>

              <hr className="my-4" />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{totalPrice} DT</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
