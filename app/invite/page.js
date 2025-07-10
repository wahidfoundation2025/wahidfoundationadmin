'use client';

import { useState } from 'react';

const ACCESS_OPTIONS = ['dashboard', 'cms', 'donations', 'donors', 'settings'];

export default function InvitePage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [access, setAccess] = useState([]);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleAccessChange = (option) => {
    setAccess((prev) =>
      prev.includes(option)
        ? prev.filter((a) => a !== option)
        : [...prev, option]
    );
  };

  const sendInvite = async () => {
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/send-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role, access }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to send invite');

      setStatus('success');
      setMessage('Invitation sent and user added successfully!');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold text-center">Send Invitation</h1>

        <input
          type="email"
          placeholder="Enter email"
          className="w-full px-4 py-2 border rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Role (e.g. admin, editor)"
          className="w-full px-4 py-2 border rounded-md"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <div>
          <label className="block font-semibold mb-2">Access</label>
          <div className="grid grid-cols-2 gap-2">
            {ACCESS_OPTIONS.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={access.includes(option)}
                  onChange={() => handleAccessChange(option)}
                />
                <span className="capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={sendInvite}
          disabled={status === 'loading' || !email}
          className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending...' : 'Send Invite'}
        </button>

        {message && (
          <p
            className={`text-center ${
              status === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
