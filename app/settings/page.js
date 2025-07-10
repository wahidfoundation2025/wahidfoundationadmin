'use client';

import { useEffect, useState } from 'react';
import { TbEdit } from "react-icons/tb";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

export default function SettingsPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({ name: '', role: '', access: '' });
  const [addNewFormData, setAddNewFormData] = useState({ name: '', role: '', access: '' });
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(users.length / rowsPerPage);
  const paginatedUsers = users.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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
    setUpdateFormData({
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
        name: updateFormData.name,
        role: updateFormData.role,
        access: updateFormData.access.split(',').map((item) => item.trim()),
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
              {paginatedUsers.map((user, idx) => {
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
                    <td className="py-3 px-4 text-sm text-nowrap">{user.name || "—"}</td>
                    <td className="py-3 px-4 text-sm">{user.role || "—"}</td>
                    <td className="py-3 px-4 text-sm text-nowrap">{user.access?.join(', ') || "—"}</td>
                    <td className="py-3 px-2 text-sm text-gray-900  bg-white">
                      <button
                        onClick={() => openEditModal(user)}
                        className="ml-4 cursor-pointer text-xl text-gray-700 hover:text-blue-600"
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

        <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-700">
          <div>
            Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(currentPage * rowsPerPage, users.length)} of {users.length} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-3 border cursor-pointer hover:bg-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-default disabled:bg-white"
            >
              <FaAnglesLeft />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-3 border cursor-pointer hover:bg-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-default disabled:bg-white"
            >
              <FaAnglesRight />
            </button>
          </div>
        </div>
      </div>

      {/* Edit and Add New Modal */}
      <div className="mt-2 border-[1px] border-gray-300 rounded-xl p-6">
        {editingUser ? (
          <>
            <h2 className="font-semibold text-lg mb-4">Edit User</h2>

            <form onSubmit={handleUpdate} className="flex flex-col gap-y-4">
              <div className="flex flex-row gap-x-4 w-full">
                <div className="flex-1">
                  <p className="font-medium text-base mb-1">Name</p>
                  <input
                    type="text"
                    className="p-2.5 text-sm w-full border-[1px] border-gray-300 rounded-xl"
                    value={updateFormData.name}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, name: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-base mb-1">Role</p>
                  <input
                    type="text"
                    className="p-2.5 text-sm w-full border-[1px] border-gray-300 rounded-xl"
                    value={updateFormData.role}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, role: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <p className="font-medium text-base mb-1">Access (comma separated)</p>
                <input
                  type="text"
                  className="p-2.5 text-sm w-full border-[1px] border-gray-300 rounded-xl"
                  value={updateFormData.access}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, access: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-6 py-2 font-medium cursor-pointer border border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white transition-colors text-sm rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 font-medium cursor-pointer bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-xl"
                >
                  Save
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="font-semibold text-lg mb-4">Add New User</h2>

            <form className="flex flex-col gap-y-4">
              <div className="flex flex-row gap-x-4 w-full">
                <div className="flex-1">
                  <p className="font-medium text-base mb-1">Name</p>
                  <input
                    type="text"
                    className="p-2.5 text-sm w-full border-[1px] border-gray-300 rounded-xl"
                    value={addNewFormData.name}
                    placeholder="User Name"
                    onChange={(e) => setUpdateFormData({ ...addNewFormData, name: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-base mb-1">Role</p>
                  <input
                    type="text"
                    className="p-2.5 text-sm w-full border-[1px] border-gray-300 rounded-xl"
                    value={addNewFormData.role}
                    placeholder="User Role"
                    onChange={(e) => setUpdateFormData({ ...addNewFormData, role: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <p className="font-medium text-base mb-1">Access (comma separated)</p>
                <input
                  type="text"
                  className="p-2.5 text-sm w-full border-[1px] border-gray-300 rounded-xl"
                  value={addNewFormData.access}
                  placeholder="eg., dashboard, donations, "
                  onChange={(e) => setUpdateFormData({ ...addNewFormData, access: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="px-10 py-2 font-medium cursor-pointer bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-xl"
                >
                  Add
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
