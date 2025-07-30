import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', address: '', city: '', postalCode: '', phone: ''
  });

  const [promoCode, setPromoCode] = useState('');
  const [promo, setPromo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const applyPromoCode = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/promocodes/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ pour envoyer le cookie token
        body: JSON.stringify({ code: promoCode }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erreur code promo');

      setPromo(data);
      setError('');
      toast.success("Code promo appliqué !");
    } catch (err) {
      setPromo(null);
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.address || !form.city || !form.postalCode || !form.phone) {
      toast.error("Tous les champs sont requis");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    for (const p of cartItems) {
      if (!p._id || !p.name || !p.quantity || !p.price) {
        toast.error("Un produit du panier est invalide");
        return;
      }
    }

    setLoading(true);

    const discount = promo
      ? promo.isPercentage
        ? (totalPrice * promo.discountAmount) / 100
        : promo.discountAmount
      : 0;

    const totalAfterDiscount = Math.max(0, totalPrice - discount);

    const orderData = {
      customerInfo: form,
      products: cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: totalAfterDiscount,
      promoCode: promo?.code || null,
    };

    try {
      const res = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ cookie token
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erreur lors de la création de la commande');
      }

      toast.success("Commande validée !");
      clearCart();
      navigate('/');
    } catch (err) {
      toast.error(err.message);
      console.error('Erreur création commande:', err);
    } finally {
      setLoading(false);
    }
  };

  const discount = promo
    ? promo.isPercentage
      ? (totalPrice * promo.discountAmount) / 100
      : promo.discountAmount
    : 0;

  const totalAfterDiscount = Math.max(0, totalPrice - discount);

  return (
    <div className="pt-28 pb-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">🎁 Commande avec code promo</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">📝 Livraison</h3>
          {["name", "address", "city", "postalCode", "phone"].map((field) => (
            <input key={field}
              type="text"
              name={field}
              placeholder={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          ))}

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Code promo"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button type="button" onClick={applyPromoCode} className="bg-blue-600 text-white px-4 py-2 rounded">
              Appliquer
            </button>
          </div>

          {promo && <p className="text-green-600">✅ Code valide : -{discount.toFixed(2)} DT</p>}
          {error && <p className="text-red-600">❌ {error}</p>}

          <button
            type="submit"
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'En cours...' : 'Valider la commande'}
          </button>
        </form>

        <div className="bg-white shadow p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">🛒 Résumé</h3>
          <ul className="space-y-2">
            {cartItems.map((item) => (
              <li key={item._id} className="flex justify-between">
                <span>{item.name} x{item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)} DT</span>
              </li>
            ))}
          </ul>
          <hr className="my-4" />
          <div className="flex justify-between">
            <span>Sous-total</span>
            <span>{totalPrice.toFixed(2)} DT</span>
          </div>
          {promo && (
            <div className="flex justify-between text-green-600">
              <span>Remise</span>
              <span>-{discount.toFixed(2)} DT</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{totalAfterDiscount.toFixed(2)} DT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
