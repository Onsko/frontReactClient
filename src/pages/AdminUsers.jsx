import React, { useEffect, useState } from 'react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Récupérer tous les utilisateurs depuis le backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/admin/users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Pour envoyer les cookies (JWT si stocké en cookie)
      });

      if (!res.ok) {
        // Si status HTTP différent de 2xx, essayer de lire message d'erreur
        const errorData = await res.json().catch(() => null);
        setError(errorData?.message || `Erreur ${res.status}`);
        setUsers([]);
      } else {
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
          setError('');
        } else {
          setError(data.message || 'Erreur lors du chargement des utilisateurs');
          setUsers([]);
        }
      }
    } catch (err) {
      setError(err.message || 'Erreur réseau');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Bloquer / débloquer un utilisateur
  const toggleBlockUser = async (id) => {
    try {
      const res = await fetch(`/api/admin/users/block/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok && data.success) {
        fetchUsers(); // Rafraîchir la liste après modification
      } else {
        alert(data.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      alert(err.message || 'Erreur réseau');
    }
  };

  // Chargement initial des utilisateurs
  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="p-4 text-blue-600 font-semibold">Chargement...</div>;
  if (error) return <div className="p-4 text-red-600 font-bold">Erreur : {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">👥 Gestion des Utilisateurs</h1>

      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3 border">Nom</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Rôle</th>
            <th className="p-3 border">Bloqué</th>
            <th className="p-3 border text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4">
                Aucun utilisateur trouvé.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="p-3 border">{user.name}</td>
                <td className="p-3 border">{user.email}</td>
                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-3 border text-center">
                  <span
                    className={`text-sm font-bold ${
                      user.isBlocked ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {user.isBlocked ? 'Oui' : 'Non'}
                  </span>
                </td>
                <td className="p-3 border text-center">
                  <button
                    onClick={() => toggleBlockUser(user._id)}
                    className={`px-4 py-1 rounded text-white text-sm font-medium shadow ${
                      user.isBlocked
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {user.isBlocked ? 'Débloquer' : 'Bloquer'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
