"use client"

// lib/withAccessControl.js
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function withAccessControl(WrappedComponent, requiredKey) {
    return function AccessControlWrapper(props) {
        const { data: session, status } = useSession();
        const [access, setAccess] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchAccess = async () => {
                if (!session?.user?.email) return;

                try {
                    const res = await fetch(`/api/users/${encodeURIComponent(session.user.email)}`);
                    const data = await res.json();
                    setAccess(data.access || []);
                } catch (error) {
                    console.error('Access fetch failed:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchAccess();
        }, [session]);

        const isAllowed = access.includes(requiredKey);

        if (status === 'loading' || loading) {
            return <div className="p-8 text-center text-gray-500">Loading...</div>;
        }

        if (!isAllowed) {
            return (
                <div className="p-8 min-h-full flex flex-col items-center sm:justify-center text-center font-semibold bg-white sm:rounded-2xl">
                    <img
                        src="https://img.freepik.com/premium-vector/grunge-red-access-denied-isolated-stamp-sticker-with-stop-icon-vector-illustration_723710-1101.jpg"
                        className='sm:w-1/3 w-1/2'
                    />
                    <h1 className='sm:text-xl sm:mt-10 mt-5'>You do not have access to view this page.</h1>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
}
