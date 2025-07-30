'use client';

import { signOut, useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="p-6">
      {session ? (
        <>
          <p>Welcome, {session.user.name}</p>
          <button
            onClick={() => signOut()}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign out
          </button>
        </>
      ) : (
        <p>You are not signed in</p>
      )}
    </div>
  );
}
