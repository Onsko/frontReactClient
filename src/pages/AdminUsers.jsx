import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchUsers = async (currentPage = 1, search = '') => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/admin/users?page=${currentPage}&limit=5&search=${search}`, {
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

  const toggleBlockUser = async (id, isBlocked) => {
    const result = await MySwal.fire({
      title: isBlocked ? 'Débloquer cet utilisateur ?' : 'Bloquer cet utilisateur ?',
      text: isBlocked
        ? "L'utilisateur pourra se reconnecter après cette action."
        : "L'utilisateur ne pourra plus se connecter.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: isBlocked ? 'Débloquer' : 'Bloquer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: isBlocked ? '#16a34a' : '#dc2626',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:4000/api/admin/users/block/${id}`, {
        method: 'PUT',
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok && data.success) {
        await fetchUsers(page, search);
        MySwal.fire({
          title: 'Succès',
          text: data.message,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.message || 'Échec de la mise à jour');
      }
    } catch (err) {
      MySwal.fire({
        title: 'Erreur',
        text: err.message,
        icon: 'error',
      });
    }
  };

  useEffect(() => {
    fetchUsers(page, search);
  }, [page, search]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">👥 Gestion des Utilisateurs</h1>

      <input
        type="text"
        placeholder="Rechercher par nom, email ou rôle..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-4 py-2 rounded-md w-1/2 mb-4"
      />

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
                      onClick={() => toggleBlockUser(u._id, u.isBlocked)}
                      className={`px-4 py-1 text-white rounded ${
                        u.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
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
            <span className="self-center">
              Page {page} / {totalPages}
            </span>
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
