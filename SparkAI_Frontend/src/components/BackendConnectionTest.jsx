import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BackendConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [testResponse, setTestResponse] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    try {
      setConnectionStatus('testing');
      setError(null);

      // Test voices endpoint
      const voicesResponse = await fetch(`${API_BASE_URL}/voices`);
      if (!voicesResponse.ok) {
        throw new Error(`Voices endpoint failed: ${voicesResponse.status}`);
      }
      const voices = await voicesResponse.json();

      // Test chat endpoint
      const chatResponse = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Hello, this is a test message.' }),
      });

      if (!chatResponse.ok) {
        throw new Error(`Chat endpoint failed: ${chatResponse.status}`);
      }

      const chatData = await chatResponse.json();

      setTestResponse({
        voices,
        chat: chatData,
      });
      setConnectionStatus('success');
    } catch (err) {
      setError(err.message);
      setConnectionStatus('error');
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'testing': return 'from-yellow-500 to-orange-500';
      case 'success': return 'from-green-500 to-emerald-500';
      case 'error': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing': return '🔄';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${getStatusColor()} p-6 text-white`}>
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{getStatusIcon()}</div>
            <div>
              <h1 className="text-2xl font-bold">Backend Connection Test</h1>
              <p className="opacity-90">Testing API endpoints at {API_BASE_URL}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {connectionStatus === 'testing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Testing backend connection...</p>
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">😔</div>
              <h2 className="text-xl font-semibold text-red-600 mb-2">Connection Failed</h2>
              <p className="text-gray-600 mb-4">Unable to connect to backend server</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                <p className="text-red-800 font-mono text-sm">{error}</p>
              </div>
              <div className="mt-6 text-left">
                <h3 className="font-semibold mb-2">Troubleshooting Steps:</h3>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Make sure your backend server is running on {API_BASE_URL}</li>
                  <li>Check that CORS is enabled in your backend</li>
                  <li>Verify the /chat and /voices endpoints are implemented</li>
                  <li>Check browser console for more detailed error messages</li>
                </ul>
              </div>
              <button
                onClick={testBackendConnection}
                className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Retry Connection
              </button>
            </div>
          )}

          {connectionStatus === 'success' && testResponse && (
            <div className="py-4">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-xl font-semibold text-green-600 mb-2">Connection Successful!</h2>
                <p className="text-gray-600">Your backend is ready for AI avatar integration</p>
              </div>

              {/* API Response Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Available Voices ({testResponse.voices?.length || 0})</h3>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm font-mono max-h-32 overflow-y-auto">
                    {JSON.stringify(testResponse.voices, null, 2)}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Chat Response Format</h3>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm font-mono max-h-48 overflow-y-auto">
                    {JSON.stringify(testResponse.chat, null, 2)}
                  </div>
                </div>

                {/* Response Analysis */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Response Analysis:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>✅ Messages array: {testResponse.chat?.messages?.length > 0 ? 'Found' : 'Missing'}</li>
                    <li>✅ Audio data: {testResponse.chat?.messages?.[0]?.audio ? 'Present' : 'Missing'}</li>
                    <li>✅ Lip-sync data: {testResponse.chat?.messages?.[0]?.lipsync ? 'Present' : 'Missing'}</li>
                    <li>✅ Facial expression: {testResponse.chat?.messages?.[0]?.facialExpression ? 'Present' : 'Missing'}</li>
                    <li>✅ Animation: {testResponse.chat?.messages?.[0]?.animation ? 'Present' : 'Missing'}</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => window.location.href = '/mode-selection'}
                  className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  Continue to AI Avatar Mode
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BackendConnectionTest;