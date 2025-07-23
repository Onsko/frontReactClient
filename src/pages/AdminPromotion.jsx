import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPromotion() {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    discountType: 'percentage',
    discountValue: 0,
    targetProduct: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  // ✅ Récupère les promotions
  const fetchPromotions = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/promotions');
      setPromotions(res.data.promotions || res.data); // selon backend
    } catch (error) {
      console.error('Erreur fetch promotions :', error);
    }
  };

  // ✅ Récupère les produits
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/products');
      setProducts(res.data.products || res.data);
    } catch (error) {
      console.error('Erreur fetch produits :', error);
    }
  };

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
  }, []);

  // ✅ Soumission formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/promotions', formData);
      setFormData({
        name: '',
        discountType: 'percentage',
        discountValue: 0,
        targetProduct: '',
        startDate: '',
        endDate: '',
        isActive: true,
      });
      fetchPromotions();
    } catch (err) {
      console.error('Erreur lors de la création de la promotion:', err.response?.data || err);
    }
  };

  // ✅ Toggle promotion
  const toggleStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:4000/api/promotions/${id}/toggle`);
      fetchPromotions();
    } catch (err) {
      console.error('Erreur toggle:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4 font-bold">Créer une promotion</h2>

      <form onSubmit={handleSubmit} className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-6">
        <input
          type="text"
          placeholder="Nom de la promotion"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="p-2 border rounded"
          required
        />

        <select
          value={formData.discountType}
          onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="percentage">Pourcentage (%)</option>
          <option value="fixed">Montant fixe (DT)</option>
        </select>

        <input
          type="number"
          placeholder="Valeur"
          value={formData.discountValue}
          onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
          className="p-2 border rounded"
          required
          min={0}
        />

        <select
          value={formData.targetProduct}
          onChange={(e) => setFormData({ ...formData, targetProduct: e.target.value })}
          className="p-2 border rounded"
          required
        >
          <option value="">Sélectionner un produit</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="p-2 border rounded"
          required
        />

        <input
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          className="p-2 border rounded"
          required
        />

        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          />
          Activer la promotion
        </label>

        <button
          type="submit"
          className="bg-[#0c1b4d] text-white py-2 rounded hover:bg-[#1d2e6e] transition"
        >
          Créer
        </button>
      </form>

      <h2 className="text-xl font-bold mb-2">Liste des promotions</h2>

      {promotions.length === 0 ? (
        <p>Aucune promotion trouvée.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Nom</th>
              <th className="p-2">Type</th>
              <th className="p-2">Valeur</th>
              <th className="p-2">Produit</th>
              <th className="p-2">Dates</th>
              <th className="p-2">Active</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <tr key={promo._id} className="border-t">
                <td className="p-2">{promo.name}</td>
                <td className="p-2">{promo.discountType}</td>
                <td className="p-2">
                  {promo.discountType === 'percentage'
                    ? `${promo.discountValue}%`
                    : `${promo.discountValue} DT`}
                </td>
                <td className="p-2">{promo.targetProduct?.name || '—'}</td>
                <td className="p-2">
                  {promo.startDate?.slice(0, 10)} → {promo.endDate?.slice(0, 10)}
                </td>
                <td className="p-2">{promo.isActive ? 'Oui' : 'Non'}</td>
                <td className="p-2">
                  <button
                    onClick={() => toggleStatus(promo._id)}
                    className="text-blue-600 hover:underline"
                  >
                    Activer/Désactiver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
