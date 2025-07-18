import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-5xl mx-auto pt-24">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">🛒 Mon Panier</h2>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Votre panier est vide.</p>
          <Link to="/" className="text-blue-600 underline hover:text-blue-800">
            Retour à la boutique
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cartItems.map(item => (
            <div key={item._id} className="flex flex-col sm:flex-row items-center gap-4 border-b pb-6">
              <img
                src={`http://localhost:4000/uploads/${item.imageUrl}`}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                <p className="text-gray-600">{item.price} DT</p>
                <div className="flex justify-center sm:justify-start items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item._id, parseInt(e.target.value) || 1)
                    }
                    className="w-14 text-center border rounded"
                    min="1"
                  />
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              <div className="text-lg font-bold text-gray-700">
                {item.price * item.quantity} DT
              </div>
            </div>
          ))}

          {/* Total & Actions */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-bold text-gray-800">
              Total : {totalPrice} DT
            </div>
            <div className="flex gap-4">
              <Link
                to="/"
                className="px-5 py-2 border border-gray-500 rounded-full hover:bg-gray-100 text-gray-700"
              >
                🛍️ Continuer mes achats
              </Link>
              <button
                onClick={() => navigate('/checkout')}
                className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
              >
                ✅ Finaliser la commande
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
