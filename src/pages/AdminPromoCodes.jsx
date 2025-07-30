import React, { useState, useEffect } from 'react';
import { createPromo, getAllPromos, togglePromo, deletePromo } from "../services/promoCodeAPI";
import { toast } from 'react-toastify';

const AdminPromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [form, setForm] = useState({
    code: '',
    discountAmount: '',
    isPercentage: false,
    validFrom: '',
    validUntil: '',
    description: ''
  });

  const fetchPromos = async () => {
    try {
      const data = await getAllPromos();
      setPromoCodes(data);
    } catch {
      toast.error("Erreur de chargement");
    }
  };

  useEffect(() => { fetchPromos(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const promoToSend = {
        ...form,
        discountAmount: Number(form.discountAmount),
        isPercentage: Boolean(form.isPercentage)
      };

      const res = await createPromo(promoToSend);
      if (res.error) return toast.error(res.error);

      toast.success('Code promo créé');
      setForm({
        code: '', discountAmount: '', isPercentage: false,
        validFrom: '', validUntil: '', description: ''
      });
      fetchPromos();
    } catch (error) {
      toast.error('Erreur serveur');
    }
  };

  const handleToggle = async (id) => {
    await togglePromo(id);
    toast.success("Statut modifié");
    fetchPromos();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      await deletePromo(id);
      toast.success("Code supprimé");
      fetchPromos();
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      {/* Formulaire création */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold">Créer un code promo</h2>

        <input name="code" placeholder="Code promo" value={form.code}
               onChange={handleChange} className="w-full p-2 border rounded" required />

        <input type="number" name="discountAmount" placeholder="Montant réduction"
               value={form.discountAmount} onChange={handleChange}
               className="w-full p-2 border rounded" required />

        <label className="flex items-center space-x-2">
          <input type="checkbox" name="isPercentage"
                 checked={form.isPercentage} onChange={handleChange} />
          <span>Réduction en %</span>
        </label>

        <div className="flex gap-4">
          <input type="date" name="validFrom" value={form.validFrom}
                 onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="date" name="validUntil" value={form.validUntil}
                 onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>

        <textarea name="description" placeholder="Description (facultatif)"
                  value={form.description} onChange={handleChange}
                  className="w-full p-2 border rounded" />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Enregistrer
        </button>
      </form>

      {/* Liste des codes promo */}
      <div>
        <h2 className="text-xl font-bold mb-4">Liste des codes promo</h2>
        <table className="w-full table-auto border text-sm">
         <thead className="bg-gray-100">
  <tr>
    <th className="p-2">Code</th>
    <th>Montant</th>
    <th>% ?</th>
    <th>Validité</th>
    <th>Statut</th>
    <th>Utilisé par</th> {/* ✅ nouvelle colonne */}
    <th>Actions</th>
  </tr>
</thead>
<tbody>
  {promoCodes.map((promo) => (
    <tr key={promo._id} className="text-center border-t">
      <td className="p-2 font-mono">{promo.code}</td>
      <td>{promo.discountAmount}</td>
      <td>{promo.isPercentage ? '✅' : '❌'}</td>
      <td>
        {new Date(promo.validFrom).toLocaleDateString()} →<br />
        {new Date(promo.validUntil).toLocaleDateString()}
      </td>
      <td>{promo.isActive ? "🟢 Actif" : "🔴 Inactif"}</td>

      {/* ✅ Liste des utilisateurs */}
      <td className="text-left text-xs max-w-xs overflow-auto">
        {promo.usedBy && promo.usedBy.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {promo.usedBy.map((user, idx) => (
              <li key={idx}>
                {user.name || user.email}
              </li>
            ))}
          </ul>
        ) : (
          <span className="italic text-gray-400">Aucun</span>
        )}
      </td>

      <td className="space-x-2">
        <button onClick={() => handleToggle(promo._id)} className="text-blue-600 hover:underline">
          Activer/Désactiver
        </button>
        <button onClick={() => handleDelete(promo._id)} className="text-red-600 hover:underline">
          Supprimer
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default AdminPromoCodes;
