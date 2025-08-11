'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
//import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     router.replace('/login');
  //   } else if (
  //     status === 'authenticated' &&
  //     session &&
  //     (!(session.user as any)?.company || !(session.user as any)?.websiteURL || !(session.user as any)?.role)
  //     && (session.user as any)?.provider !== 'credentials'
  //   ) {
  //     router.replace('/complete-profile');
  //   }
  // }, [status, router, session]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard!</h1>
      <p className="text-xl">Logged in as: <span className="font-semibold">{session.user?.name || session.user?.email}</span></p>
      <button
        className="mt-8 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        onClick={() => signOut({ callbackUrl: '/login' })}
      >
        Sign Out
      </button>
      <button
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        onClick={() => router.push('/change-password')}
      >
        Change Password
      </button>
      <h4 className='text-2xl'>Naresh ne sara kaam kr diya he.....mohit and prat G** marwa rhe </h4>
    </div>
  );
}

