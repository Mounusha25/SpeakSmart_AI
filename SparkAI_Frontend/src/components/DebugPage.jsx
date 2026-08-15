import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const DebugPage = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const handleLogout = () => {
    signOut();
  };
  const userData = useQuery(api.users.getUserByClerkId, 
    user ? { clerkUserId: user.id } : 'skip'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Debug Information</h1>
          {user && (
            <button
              onClick={handleLogout}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Clerk User Data</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify({
                isLoaded,
                userId: user?.id,
                email: user?.primaryEmailAddress?.emailAddress,
                userExists: !!user
              }, null, 2)}
            </pre>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Convex User Data</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(userData || 'Loading...', null, 2)}
            </pre>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Environment</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify({
                convexUrl: import.meta.env.VITE_CONVEX_URL,
                clerkKeyExists: !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
                clerkKeyPrefix: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.substring(0, 10)
              }, null, 2)}
            </pre>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => window.location.href = '/character-selection'}
            className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600"
          >
            Go to Character Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;