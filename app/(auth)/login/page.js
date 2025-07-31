'use client';

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Logo from '../../../public/logo.png';
import Image from "next/image";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/');
    }
  }, [status, session, router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm text-center animate-fade-in">
        <Image src={Logo} className=" w-16 mb-4 mx-auto" />

        <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome to <br /> Wahid Admin Panel</h2>
        <p className="text-sm text-gray-500 mb-2">Please sign in to continue</p>

        <button
          onClick={() => signIn("google")}
          className="flex w-full cursor-pointer hover:bg-gray-100 items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:shadow transition"
        >
          <FcGoogle className="text-xl" />
          Sign in with Google
        </button>

        <div className="mt-6 text-xs text-gray-400">
          By signing in, you agree to our terms and conditions.
        </div>
      </div>
    </div>
  );
}
