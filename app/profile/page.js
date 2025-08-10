"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/users/${encodeURIComponent(session.user.email)}`);
          if (!res.ok) throw new Error("Failed to fetch user data");
          const data = await res.json();
          setUserData(data);
        } catch (err) {
          console.error("Error fetching user data:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [session?.user?.email]);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center text-lg text-gray-500">You are not signed in</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      {loading ? (
        <p className="text-gray-500 text-lg">Loading profile...</p>
      ) : userData ? (
        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg p-8 border border-gray-200">
          {/* Profile Header */}
          <div className="flex items-center gap-6">
            <img
              src={session.user.image || "/default-avatar.png"} // Google photo if available
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-violet-200"
            />
            <div>
              <h2 className="text-3xl font-semibold">{session.user.name}</h2>
              <p className="text-gray-500">{userData.role || "User"}</p>
            </div>
          </div>

          {/* Details */}
          <div className="mt-8 space-y-6">
            <div>
              <p className="text-xs text-gray-500 uppercase">Email</p>
              <p className="text-lg font-medium">{userData.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Role</p>
              <p className="text-lg font-medium">{userData.role}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Access</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {userData.access?.map((a, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm bg-violet-100 text-violet-700 rounded-full"
                  >
                    {a}
                  </span>
                )) || "No access"}
              </div>
            </div>
          </div>

          {/* Sign out button */}
          <div className="mt-10">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              Sign out
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No profile data found.</p>
      )}
    </div>
  );
}
