import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [visibility, setVisibility] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:4000/api/products', {
        name,
        price: Number(price),
        visibility,
      });
      alert('Produit ajouté avec succès !');
      navigate('/admin/products');
    } catch (err) {
      alert('Erreur lors de l’ajout du produit : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Ajouter un produit</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Nom :
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </label>

        <label>
          Prix (€) :
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
            className="border p-2 w-full"
          />
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={visibility}
            onChange={e => setVisibility(e.target.checked)}
          />
          Visible
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-800"
        >
          {loading ? 'Ajout en cours...' : 'Ajouter'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
