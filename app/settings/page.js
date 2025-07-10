'use client';

import { useEffect, useState } from 'react';
import { TbEdit } from "react-icons/tb";

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
    <div className="bg-white p-6 rounded-2xl min-h-full">
      <h1 className="text-2xl font-bold mb-6">Settings - User Management</h1>

      <div className="overflow-x-auto w-full pb-4">
        <div className="bg-white w-full border border-gray-300 shadow rounded-xl overflow-auto">
          <table className="w-full table-auto text-left">
            <thead className="bg-gray-200 text-gray-700 border-b border-gray-300 text-sm font-semibold">
              <tr>
                {["Avatar", "Email", "Name", "Role", "Access", "Actions"].map((title, idx) => (
                  <th
                    key={idx}
                    className={`py-3 px-4 text-nowrap font-medium ${idx === 0 ? "rounded-tl-xl" : idx === 5 ? "rounded-tr-xl" : ""
                      }`}
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => {
                const color = user.colorCode || "#6B7280"; // fallback gray
                const initials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || "US";

                return (
                  <tr key={user.email} className="border-b border-gray-300 last:border-none">
                    <td className="py-3 px-4 text-sm">
                      <div
                        style={{
                          backgroundColor: `${color}20`,
                          color: color,
                        }}
                        className="min-w-8 w-8 min-h-8 rounded-full font-bold flex items-center justify-center text-sm"
                      >
                        {initials}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{user.email}</td>
                    <td className="py-3 px-4 text-sm">{user.name || "—"}</td>
                    <td className="py-3 px-4 text-sm">{user.role || "—"}</td>
                    <td className="py-3 px-4 text-sm">{user.access?.join(', ') || "—"}</td>
                    <td className="py-3 px-2 text-sm text-gray-900  bg-white">
                      <button
                        onClick={() => openEditModal(user)}
                        className="cursor-pointer text-xl text-gray-700 hover:text-blue-600"
                        title="Edit user"
                      >
                        <TbEdit />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Role</label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Access (comma separated)</label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={formData.access}
                  onChange={(e) => setFormData({ ...formData, access: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-gray-300 text-sm rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
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
