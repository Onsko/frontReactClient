import React, { useEffect, useState } from 'react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/admin/users?page=${currentPage}&limit=5`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setError('');
      } else {
        setError(data.message || 'Erreur lors du chargement');
        setUsers([]);
      }
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockUser = async (id) => {
    const confirmAction = window.confirm('Confirmer cette action ?');
    if (!confirmAction) return;

    try {
      const res = await fetch(`http://localhost:4000/api/admin/users/block/${id}`, {
        method: 'PUT',
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok && data.success) {
        fetchUsers(page); // reload current page
      } else {
        alert(data.message || 'Erreur');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">👥 Gestion des Utilisateurs</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          <table className="w-full border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Nom</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Rôle</th>
                <th className="p-3 border">Bloqué</th>
                <th className="p-3 border">Date d’inscription</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{u.name}</td>
                  <td className="p-3 border">{u.email}</td>
                  <td className="p-3 border">{u.role}</td>
                  <td className="p-3 border text-center">
                    <span className={u.isBlocked ? 'text-red-600' : 'text-green-600'}>
                      {u.isBlocked ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="p-3 border">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => toggleBlockUser(u._id)}
                      className={`px-4 py-1 text-white rounded ${
                        u.isBlocked ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    >
                      {u.isBlocked ? 'Débloquer' : 'Bloquer'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded hover:bg-gray-200"
            >
              Précédent
            </button>
            <span className="self-center">Page {page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-200"
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUsers;
