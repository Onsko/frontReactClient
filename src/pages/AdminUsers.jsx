import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/api/admin/users', { withCredentials: true });
      if (data.success) setUsers(data.users);
    } catch (error) {
      console.error("Erreur de récupération :", error.message);
    }
  };

  const toggleBlock = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/admin/users/block/${id}`, {}, { withCredentials: true });
      fetchUsers(); // Refresh
    } catch (error) {
      console.error("Erreur blocage :", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold text-[#0c1b4d] mb-6">Liste des utilisateurs</h2>
      <table className="w-full bg-white text-black rounded-md overflow-hidden">
        <thead className="bg-[#0c1b4d] text-white">
          <tr>
            <th className="p-3 text-left">Nom</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Statut</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="border-b hover:bg-gray-100">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.isBlocked ? 'Bloqué' : 'Actif'}</td>
              <td className="p-3">
                <button
                  onClick={() => toggleBlock(user._id)}
                  className={`px-4 py-1 rounded ${
                    user.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  } text-white transition`}
                >
                  {user.isBlocked ? 'Débloquer' : 'Bloquer'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
