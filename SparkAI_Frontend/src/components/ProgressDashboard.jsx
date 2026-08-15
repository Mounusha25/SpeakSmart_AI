import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrophyIcon, 
  ChatBubbleLeftRightIcon, 
  SparklesIcon, 
  ArrowPathIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { useUser, useClerk } from '@clerk/clerk-react';

const ProgressDashboard = ({ completedConversation, onStartNew }) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [showDetails, setShowDetails] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [userSessions, setUserSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch session data from MongoDB
  useEffect(() => {
    const fetchSessionData = async () => {
      if (!user || !completedConversation?.sessionId) {
        setLoading(false);
        return;
      }

      try {
        // Use demo user data for realistic progression
        const testUserId = "demo-user";
        
        // Fetch current session details
        const sessionResponse = await fetch(
          `http://localhost:3001/api/scores/session/${completedConversation.sessionId}?clerkUserId=${testUserId}`
        );
        
        if (sessionResponse.ok) {
          const sessionResult = await sessionResponse.json();
          console.log('Fetched session data:', sessionResult.data);
          setSessionData(sessionResult.data);
        }

        // Fetch user's historical sessions
        const userSessionsResponse = await fetch(
          `http://localhost:3001/api/scores/user-sessions/${testUserId}?limit=10`
        );

        if (userSessionsResponse.ok) {
          const userSessionsResult = await userSessionsResponse.json();
          console.log('Fetched user sessions:', userSessionsResult.data.sessions);
          setUserSessions(userSessionsResult.data.sessions);
        }

      } catch (error) {
        console.error('Error fetching session data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [user, completedConversation]);

  // Use session data if available, otherwise fall back to mock data
  const scores = sessionData?.session?.sessionAverages || {
    tone: 75,
    clarity: 80,
    empathy: 65,
    engagement: 70,
    overall: 72
  };

  // Prepare historical data for chart (reverse order for proper progression)
  const historicalData = userSessions
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Sort by creation time
    .map((session, index) => ({
      session: `Session ${index + 1}`,
      tone: session.sessionAverages?.tone || 0,
      clarity: session.sessionAverages?.clarity || 0,
      empathy: session.sessionAverages?.empathy || 0,
      engagement: session.sessionAverages?.engagement || 0,
      overall: session.sessionAverages?.overall || 0
    }));

  console.log('Historical data for chart:', historicalData);

  const handleLogout = () => {
    signOut();
  };

  // Prepare question-by-question data for detailed analysis
  const questionData = sessionData?.questionScores?.map((score, index) => ({
    question: `Q${score.questionNumber}`,
    tone: score.scores.tone,
    clarity: score.scores.clarity,
    empathy: score.scores.empathy,
    engagement: score.scores.engagement,
    average: score.averageScore,
    responseTime: score.responseTime
  })) || [];

  // Prepare radial chart data
  const radialData = [
    {
      name: 'Tone',
      value: scores.tone,
      fill: '#ef4444'
    },
    {
      name: 'Clarity', 
      value: scores.clarity,
      fill: '#f97316'
    },
    {
      name: 'Empathy',
      value: scores.empathy,
      fill: '#eab308'
    },
    {
      name: 'Engagement',
      value: scores.engagement,
      fill: '#10b981'
    }
  ];

  // Performance insights based on scores
  const getInsights = () => {
    const insights = [];
    
    if (scores.tone >= 80) {
      insights.push({
        type: 'strength',
        title: 'Excellent Tone',
        description: 'Your speaking tone is confident and engaging.'
      });
    } else if (scores.tone < 60) {
      insights.push({
        type: 'improvement',
        title: 'Improve Tone',
        description: 'Work on speaking with more confidence and warmth.'
      });
    }
    
    if (scores.clarity >= 80) {
      insights.push({
        type: 'strength', 
        title: 'Crystal Clear',
        description: 'Your communication is clear and easy to understand.'
      });
    } else if (scores.clarity < 60) {
      insights.push({
        type: 'improvement',
        title: 'Enhance Clarity',
        description: 'Focus on speaking more clearly and articulating your points.'
      });
    }
    
    if (scores.empathy >= 80) {
      insights.push({
        type: 'strength',
        title: 'Great Empathy',
        description: 'You show excellent understanding and emotional connection.'
      });
    } else if (scores.empathy < 60) {
      insights.push({
        type: 'improvement',
        title: 'Build Empathy',
        description: 'Try to show more understanding and emotional awareness.'
      });
    }

    if (scores.engagement >= 80) {
      insights.push({
        type: 'strength',
        title: 'Highly Engaging',
        description: 'Your responses are captivating and keep the conversation flowing.'
      });
    } else if (scores.engagement < 60) {
      insights.push({
        type: 'improvement',
        title: 'Boost Engagement',
        description: 'Make your responses more interactive and engaging.'
      });
    }

    return insights;
  };

  const insights = getInsights();

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'from-emerald-400 via-teal-500 to-cyan-500';
    if (score >= 70) return 'from-blue-400 via-purple-500 to-indigo-500';
    if (score >= 60) return 'from-amber-400 via-orange-500 to-yellow-500';
    return 'from-rose-400 via-pink-500 to-red-500';
  };

  const getScoreGlow = (score) => {
    if (score >= 80) return 'shadow-emerald-200';
    if (score >= 70) return 'shadow-blue-200';
    if (score >= 60) return 'shadow-amber-200';
    return 'shadow-rose-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <div className="w-8 h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Conversation{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
              Complete!
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Great job! Here's how you performed in this training session.
          </p>
        </motion.div>

        {/* Quiz Performance Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 mb-8"
        >
          <div className="text-center mb-8">
            <div className={`inline-block text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r ${getScoreBg(scores.overall)}`}>
              {scores.overall}%
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              🎯 Quiz Performance Score
            </h2>
            <p className="text-xl text-gray-600">
              {scores.overall >= 80 ? '🌟 Outstanding! You\'re excelling at communication!' : 
               scores.overall >= 70 ? '🚀 Great job! You\'re performing well!' :
               scores.overall >= 60 ? '👍 Good progress! Keep practicing!' : 
               '💪 Keep working, you\'re improving!'}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl p-6 text-center border border-rose-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-3">🎵</div>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 mb-2">
                {scores.tone}%
              </div>
              <div className="text-sm text-rose-700 font-semibold">Tone</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 text-center border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-3">🔍</div>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                {scores.clarity}%
              </div>
              <div className="text-sm text-blue-700 font-semibold">Clarity</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 text-center border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-3">❤️</div>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600 mb-2">
                {scores.empathy}%
              </div>
              <div className="text-sm text-purple-700 font-semibold">Empathy</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl p-6 text-center border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-2">
                {scores.engagement}%
              </div>
              <div className="text-sm text-emerald-700 font-semibold">Engagement</div>
            </motion.div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-gray-900">Overall Progress</span>
              <span className={`text-lg font-bold ${getScoreColor(scores.overall)}`}>
                {scores.overall}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden shadow-inner border border-gray-200">
              <motion.div
                className={`h-8 rounded-full bg-gradient-to-r ${getScoreBg(scores.overall)} flex items-center justify-end pr-4 shadow-lg ${getScoreGlow(scores.overall)} relative`}
                initial={{ width: 0 }}
                animate={{ width: `${scores.overall}%` }}
                transition={{ duration: 3, delay: 0.5, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-full"></div>
                <span className="text-white text-base font-bold drop-shadow-lg relative z-10">
                  {scores.overall >= 15 ? `${scores.overall}%` : ''}
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          
          {/* Score Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <ChartBarIcon className="w-8 h-8 text-rose-500 mr-3" />
              Score Breakdown
            </h3>
            
            <div className="space-y-6">
              {[
                { name: 'Tone', value: scores.tone, icon: '🎵' },
                { name: 'Clarity', value: scores.clarity, icon: '🔍' },
                { name: 'Empathy', value: scores.empathy, icon: '❤️' },
                { name: 'Engagement', value: scores.engagement, icon: '🎯' }
              ].map((metric, index) => (
                <div key={metric.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700 flex items-center">
                      <span className="text-2xl mr-2">{metric.icon}</span>
                      {metric.name}
                    </span>
                    <span className={`font-bold text-lg ${getScoreColor(metric.value)}`}>
                      {metric.value}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden shadow-inner border border-gray-200">
                    <motion.div
                      className={`h-6 rounded-full bg-gradient-to-r ${getScoreBg(metric.value)} flex items-center justify-end pr-3 shadow-lg ${getScoreGlow(metric.value)} relative`}
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ duration: 2, delay: 0.8 + index * 0.2, ease: "easeOut" }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
                      {metric.value > 15 && (
                        <span className="text-white text-sm font-bold drop-shadow-lg relative z-10">
                          {metric.value}%
                        </span>
                      )}
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Radial Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TrophyIcon className="w-8 h-8 text-rose-500 mr-3" />
              Performance Overview
            </h3>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={radialData}>
                  <RadialBar
                    minAngle={15}
                    label={{ position: 'insideStart', fill: '#fff' }}
                    background
                    clockwise
                    dataKey="value"
                  />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Question-by-Question Analysis */}
        {questionData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <ChartBarIcon className="w-8 h-8 text-rose-500 mr-3" />
              Question-by-Question Performance
            </h3>
            
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={questionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="question" tick={{ fill: '#64748b' }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' 
                    }} 
                  />
                  <Bar dataKey="tone" fill="url(#toneGradient)" name="Tone" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="clarity" fill="url(#clarityGradient)" name="Clarity" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="empathy" fill="url(#empathyGradient)" name="Empathy" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="engagement" fill="url(#engagementGradient)" name="Engagement" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="toneGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                    <linearGradient id="clarityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                    <linearGradient id="empathyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Question Details Table */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Scores</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clarity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empathy</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {questionData.map((question, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {question.question}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`font-semibold ${getScoreColor(question.tone)}`}>
                            {question.tone}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`font-semibold ${getScoreColor(question.clarity)}`}>
                            {question.clarity}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`font-semibold ${getScoreColor(question.empathy)}`}>
                            {question.empathy}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`font-semibold ${getScoreColor(question.engagement)}`}>
                            {question.engagement}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`font-bold ${getScoreColor(question.average)}`}>
                            {question.average}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {question.responseTime}s
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress History */}
        {historicalData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-rose-500 mr-3" />
              Progress Over Time
            </h3>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="session" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="overall" 
                    stroke="#ec4899" 
                    strokeWidth={4} 
                    dot={{ fill: '#ec4899', strokeWidth: 3, r: 6 }}
                    activeDot={{ r: 8, fill: '#ec4899', stroke: '#ffffff', strokeWidth: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tone" 
                    stroke="#f43f5e" 
                    strokeWidth={3} 
                    dot={{ fill: '#f43f5e', strokeWidth: 2, r: 4 }}
                    strokeDasharray="5 5"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clarity" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    strokeDasharray="5 5"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="empathy" 
                    stroke="#8b5cf6" 
                    strokeWidth={3} 
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    strokeDasharray="5 5"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Insights & Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <SparklesIcon className="w-8 h-8 text-rose-500 mr-3" />
            Insights & Recommendations
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border-l-4 ${
                  insight.type === 'strength' 
                    ? 'bg-green-50 border-green-500' 
                    : 'bg-yellow-50 border-yellow-500'
                }`}
              >
                <h4 className={`font-semibold mb-2 ${
                  insight.type === 'strength' ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {insight.title}
                </h4>
                <p className={`text-sm ${
                  insight.type === 'strength' ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {insight.description}
                </p>
              </div>
            ))}
          </div>

          {/* Session Stats */}
          {userSessions.length > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl">
              <h4 className="font-semibold text-gray-900 mb-4">Your Journey</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose-600">{userSessions.length}</div>
                  <div className="text-sm text-gray-600">Total Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose-600">
                    {Math.round(userSessions.reduce((acc, s) => acc + (s.sessionAverages?.overall || 0), 0) / userSessions.length) || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose-600">
                    {sessionData?.session?.questionsCompleted || questionData.length}
                  </div>
                  <div className="text-sm text-gray-600">Questions Answered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose-600">
                    {sessionData?.session?.character?.replace('-', ' ') || 'AI Coach'}
                  </div>
                  <div className="text-sm text-gray-600">Current Coach</div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center space-y-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onStartNew}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center space-x-2 hover:scale-105 transform"
            >
              <ArrowPathIcon className="w-6 h-6" />
              <span>Start New Conversation</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center space-x-2 hover:scale-105 transform"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
          
          <p className="text-gray-600">
            Ready for another training session? Keep building your confidence!
          </p>

          {/* User Info */}
          {user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 max-w-md mx-auto border border-white/30"
            >
              <div className="flex items-center justify-center space-x-3">
                {user.imageUrl && (
                  <img 
                    src={user.imageUrl} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full border-2 border-rose-200"
                  />
                )}
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700">
                    Signed in as {user.firstName || user.emailAddresses[0]?.emailAddress}
                  </p>
                  <p className="text-xs text-gray-500">
                    Keep up the great work! 🌟
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default ProgressDashboard;