'use client';

import { useEffect, useState } from 'react';
import { TbEdit } from "react-icons/tb";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { TbTrash } from 'react-icons/tb';

export default function SettingsPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const [updateFormData, setUpdateFormData] = useState({
    name: '',
    email: '',
    role: '',
    access: [],
  });

  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: '',
    access: [],
  });
async function handleDeleteUser(email) {
  const confirmed = confirm(`Are you sure you want to delete the user ${email}?`);
  if (!confirmed) return;

  try {
    const res = await fetch(`/api/users/${encodeURIComponent(email)}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    alert('User deleted successfully');
    fetchUsers(); // Refresh list
  } catch (err) {
    console.error('Error deleting user:', err);
    alert('Failed to delete user');
  }
}
  const ACCESS_OPTIONS = ["dashboard", "donations", "settings", "cms", "donors"];
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(users.length / rowsPerPage);
  const paginatedUsers = users?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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
      email: user.email || '',
      role: user.role || '',
      access: user.access || [],
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();

    const res = await fetch(`/api/users/${encodeURIComponent(updateFormData.email)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateFormData),
    });

    if (res.ok) {
      await fetchUsers();
      setEditingUser(null);
    } else {
      alert('Failed to update user');
    }
  }

  function handleAccessChange(option, isNewForm = false) {
    const form = isNewForm ? newUserData : updateFormData;
    const currentAccess = new Set(form.access);
    if (currentAccess.has(option)) {
      currentAccess.delete(option);
    } else {
      currentAccess.add(option);
    }

    const updatedAccess = Array.from(currentAccess);
    if (isNewForm) {
      setNewUserData((prev) => ({ ...prev, access: updatedAccess }));
    } else {
      setUpdateFormData((prev) => ({ ...prev, access: updatedAccess }));
    }
  }

  async function handleAddSubmit() {
  const payload = {
    email: newUserData.email,
    role: newUserData.role,
    access: newUserData.access,
  };

  console.log("📤 Sending invite payload:", payload); // 👈 Log here

  try {
    const res = await fetch('/api/send-invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    setNewUserData({
      name: '',
      email: '',
      role: '',
      access: [],
    });
    alert("Invite sent successfully!");
  } catch (err) {
    console.error('❌ Error in adding user:', err);
    alert("Failed to invite user");
  }
}
  if (loading) return <div className="p-10 text-center">Loading users...</div>;

  return (
    <div className="bg-white p-4 sm:p-6 sm:rounded-2xl min-h-full">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Settings - User Management</h1>

      <div className="overflow-x-auto w-full pb-4">
        <div className="bg-white w-full border border-gray-300 shadow rounded-xl overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead className="bg-gray-200 text-gray-700 border-b border-gray-300 text-sm font-semibold">
              <tr>
                {["Avatar", "Email", "Name", "Role", "Access", "Actions"].map((title, idx) => (
                  <th
                    key={idx}
                    className={`py-3 px-4 text-nowrap font-medium ${idx === 0 ? "rounded-tl-xl" : idx === 5 ? "rounded-tr-xl" : ""}`}
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 &&
                paginatedUsers.map((user) => {
                  const color = user.colorCode || "#6B7280";
                  const initials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || "US";

                  return (
                    <tr key={user.email} className="border-b border-gray-300 last:border-none">
                      <td className="py-3 px-4 text-sm">
                        <div
                          style={{ backgroundColor: `${color}20`, color }}
                          className="min-w-8 w-8 min-h-8 rounded-full font-bold flex items-center justify-center text-sm"
                        >
                          {initials}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{user.email}</td>
                      <td className="py-3 px-4 text-sm text-nowrap">{user.name || "—"}</td>
                      <td className="py-3 px-4 text-sm">{user.role || "—"}</td>
                      <td className="py-3 px-4 text-sm text-nowrap">{user.access?.join(', ') || "—"}</td>
                      <td className="py-3 px-2 text-sm text-gray-900 bg-white">
                        <button
                          onClick={() => openEditModal(user)}
                          className="ml-4 cursor-pointer text-violet-600 p-2 rounded-full hover:bg-violet-100"
                          title="Edit user"
                        >
                          <TbEdit size={20} />
                        </button>
                        <button
    onClick={() => handleDeleteUser(user.email)}
    className="ml-2 cursor-pointer text-red-600 p-2 rounded-full hover:bg-red-100"
    title="Delete user"
  >
    <TbTrash size={20} />
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
              className="p-3 border cursor-pointer hover:bg-gray-200 rounded-xl disabled:opacity-50"
            >
              <FaAnglesLeft />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-3 border cursor-pointer hover:bg-gray-200 rounded-xl disabled:opacity-50"
            >
              <FaAnglesRight />
            </button>
          </div>
        </div>
      </div>

      {/* Edit/Add Form Section */}
      <div className="mt-4 border border-gray-300 rounded-xl p-5 sm:p-6">
        {editingUser ? (
          <>
            <h2 className="font-semibold text-lg mb-4">Edit User</h2>
            <div className="flex flex-col gap-y-4">
              <div className="grid sm:grid-cols-2 gap-2 sm:gap-4 w-full">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="text"
                    value={updateFormData.email}
                    disabled
                    className="p-2.5 text-sm w-full border border-gray-300 rounded-xl bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={updateFormData.name}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, name: e.target.value })}
                    className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    type="text"
                    value={updateFormData.role}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, role: e.target.value })}
                    className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Access Permissions</p>
                <div className="flex flex-wrap gap-4">
                  {ACCESS_OPTIONS.map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={updateFormData.access.includes(option)}
                        onChange={() => handleAccessChange(option)}
                        className="custom-checkbox"
                      />
                      <span className="text-sm capitalize">{option}</span>
                    </label>
                  ))}
                </div>
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
                  onClick={handleUpdate}
                  className="px-6 py-2 font-medium cursor-pointer bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-xl"
                >
                  Save
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 className="font-semibold text-lg mb-4">Add New User</h2>
            <div className="flex flex-col gap-y-4">
              <div className="grid sm:grid-cols-2  gap-2 sm:gap-4 w-full">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                    className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    type="text"
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                    className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Access Permissions</p>
                <div className="flex flex-wrap gap-4">
                  {ACCESS_OPTIONS.map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newUserData.access.includes(option)}
                        onChange={() => handleAccessChange(option, true)}
                        className="custom-checkbox"
                      />
                      <span className="text-sm capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  onClick={handleAddSubmit}
                  className="px-10 py-2 font-medium cursor-pointer bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-xl"
                >
                  Add
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
