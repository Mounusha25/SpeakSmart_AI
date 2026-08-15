import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useClerk, useUser } from '@clerk/clerk-react';

const CharacterSelectionDashboard = () => {
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleLogout = () => {
    signOut();
  };
  const [characterStats, setCharacterStats] = useState(null);
  const [allSelections, setAllSelections] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:3001/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch character statistics
        const statsResponse = await fetch(`${API_BASE_URL}/character-selections/stats`);
        const statsResult = await statsResponse.json();
        
        // Fetch all selections
        const selectionsResponse = await fetch(`${API_BASE_URL}/character-selections/all-selections`);
        const selectionsResult = await selectionsResponse.json();
        
        if (statsResult.success && selectionsResult.success) {
          setCharacterStats(statsResult.data);
          setAllSelections(selectionsResult.data);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading character selections from MongoDB...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">❌ Error loading data</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const characterNames = {
    'ben-10': 'Ben 10',
    'black-panther': 'Black Panther',
    'wanda-vision': 'Wanda Vision',
    'dora': 'Dora'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Character Selection Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            View analytics and user character preferences
          </p>
          
          {/* Logout Button */}
          {user && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-0 right-0"
            >
              <button
                onClick={handleLogout}
                className="bg-white/70 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-xl shadow-lg border border-white/50 hover:bg-white hover:text-rose-600 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm">Sign Out</span>
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Selections</h3>
            <p className="text-3xl font-bold text-rose-600">{characterStats.totalSelections}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unique Users</h3>
            <p className="text-3xl font-bold text-rose-600">{characterStats.uniqueUsers}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Most Popular</h3>
            <p className="text-xl font-bold text-rose-600">
              {characterNames[Object.keys(characterStats.characterPopularity).reduce((a, b) => 
                characterStats.characterPopularity[a] > characterStats.characterPopularity[b] ? a : b
              )]}
            </p>
          </motion.div>
        </div>

        {/* Character Popularity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Character Popularity</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(characterStats.characterPopularity).map(([character, count]) => (
              <div key={character} className="text-center">
                <div className="text-2xl font-bold text-rose-600 mb-1">{count}</div>
                <div className="text-gray-700 font-medium">{characterNames[character]}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full"
                    style={{ 
                      width: `${(count / Math.max(...Object.values(characterStats.characterPopularity))) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Selections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Selections</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Character</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Selections</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Selected</th>
                </tr>
              </thead>
              <tbody>
                {allSelections.slice(0, 10).map((selection, index) => (
                  <tr key={selection._id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{selection.username}</div>
                        <div className="text-sm text-gray-500">{selection.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{selection.characterName}</span>
                        <span className="ml-2 text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
                          {selection.selectedCharacter}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-rose-600">{selection.selectionCount}x</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(selection.lastSelectedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CharacterSelectionDashboard;