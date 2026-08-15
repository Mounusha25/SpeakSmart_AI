import React from 'react';
import { ExclamationTriangleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const SetupRequired = () => {
  const steps = [
    {
      step: 1,
      title: 'Get Clerk Publishable Key',
      description: 'Go to dashboard.clerk.com and copy your publishable key (starts with pk_test_...)'
    },
    {
      step: 2, 
      title: 'Update Environment File',
      description: 'Add your key to .env.local as VITE_CLERK_PUBLISHABLE_KEY'
    },
    {
      step: 3,
      title: 'Restart Development Server',
      description: 'Stop and restart npm run dev to load the new environment variables'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="w-10 h-10 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Required</h1>
          <p className="text-gray-600">
            Please configure your Clerk authentication to continue
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-8">
          {steps.map((item) => (
            <div key={item.step} className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {item.step}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Code Example */}
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          <div className="flex items-center mb-2">
            <Cog6ToothIcon className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-400 text-sm">.env.local</span>
          </div>
          <code className="text-green-400 text-sm">
            VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
          </code>
        </div>

        {/* Help Links */}
        <div className="text-center space-y-2">
          <a 
            href="https://dashboard.clerk.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-rose-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors"
          >
            Get Clerk Key →
          </a>
          <p className="text-sm text-gray-500">
            Need help? Check <code className="bg-gray-100 px-1 rounded">QUICK_SETUP.md</code> for detailed instructions
          </p>
        </div>

      </div>
    </div>
  );
};

export default SetupRequired;