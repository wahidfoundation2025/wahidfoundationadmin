'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

function AuthGate({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if not on login and unauthenticated
    if (status === 'unauthenticated' && pathname !== '/login') {
      router.replace('/login');
    }
  }, [status, pathname, router]);

  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (status === 'loading') {
    return <div className="p-6">Loading...</div>;
  }

  if (status === 'authenticated') {
    return <>{children}</>;
  }

  // While redirecting (or during unauthenticated render)
  return null;
}

export default function AuthProvider({ children }) {
  return (
    <SessionProvider>
      <AuthGate>{children}</AuthGate>
    </SessionProvider>
  );
}
