'use client';

import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', access: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  }

  function openEditModal(user) {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      role: user.role || '',
      access: user.access?.join(', ') || '',
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    const res = await fetch(`/api/users/${encodeURIComponent(editingUser.email)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        role: formData.role,
        access: formData.access.split(',').map((item) => item.trim()),
      }),
    });

    if (res.ok) {
      await fetchUsers();
      setEditingUser(null);
    } else {
      alert('Failed to update user');
    }
  }

  if (loading) return <div className="p-10 text-center">Loading users...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings - User Management</h1>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Access</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email}>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.role}</td>
              <td className="p-2 border">{user.access?.join(', ')}</td>
              <td className="p-2 border">
                <button
                  onClick={() => openEditModal(user)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  className="w-full border rounded p-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Role</label>
                <input
                  className="w-full border rounded p-2"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Access (comma separated)</label>
                <input
                  className="w-full border rounded p-2"
                  value={formData.access}
                  onChange={(e) => setFormData({ ...formData, access: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
