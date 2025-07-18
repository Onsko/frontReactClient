// src/pages/Cart.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="pt-28 pb-10 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">🛒 Mon Panier</h2>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="text-lg">Votre panier est vide.</p>
          <Link
            to="/"
            className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition"
          >
            Retour à l'accueil
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-6 bg-white shadow-md rounded-xl p-4"
              >
                <img
                  src={`http://localhost:4000/uploads/${item.imageUrl}`}
                  alt={item.name}
                  className="w-24 h-24 rounded object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-lg font-semibold">{item.name}</h4>
                  <p className="text-gray-600">{item.price} DT</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item._id, parseInt(e.target.value) || 1)
                      }
                      min="1"
                      className="w-12 text-center border rounded"
                    />
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="ml-4 text-red-600 hover:text-red-800 font-medium"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
                <div>
                  <strong className="text-lg">{item.price * item.quantity} DT</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Résumé & Actions */}
          <div className="mt-10 border-t pt-6 flex justify-between items-center flex-col sm:flex-row gap-6">
            <h3 className="text-xl font-bold">Total : {totalPrice} DT</h3>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-full"
              >
                Continuer mes achats
              </button>

              <button
                onClick={() => navigate('/checkout')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
              >
                Finaliser ma commande
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
