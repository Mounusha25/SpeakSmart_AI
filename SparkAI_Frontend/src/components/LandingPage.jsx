import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import { ArrowRightIcon, SparklesIcon, UserGroupIcon, TrophyIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[id^="section-"]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <ChatBubbleLeftRightIcon className="w-8 h-8 text-rose-600" />,
      title: "Safe Practice Environment",
      description: "Practice conversations without judgment in a supportive space where you can learn at your own pace and build confidence gradually.",
      highlight: "Judgment-Free Zone"
    },
    {
      icon: <SparklesIcon className="w-8 h-8 text-rose-600" />,
      title: "Visual Learning Support",
      description: "Engage with 3D characters that provide visual cues and feedback, perfect for different learning and processing styles.",
      highlight: "Multi-Sensory Learning"
    },
    {
      icon: <TrophyIcon className="w-8 h-8 text-rose-600" />,
      title: "Adaptive Progress Tracking",
      description: "Personalized quizzes that adapt to your learning style with clear feedback and celebration of every achievement.",
      highlight: "Personalized Path"
    },
    {
      icon: <UserGroupIcon className="w-8 h-8 text-rose-600" />,
      title: "Diverse Coaching Styles",
      description: "Choose coaches with different approaches - from structured guidance to creative exploration, matching your communication preferences.",
      highlight: "4 Unique Approaches"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      title: "Authentic Voice Development",
      description: "Build communication skills that work for you, not against you, with respect for your natural communication patterns.",
      highlight: "Authenticity Focused"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Strengths-Based Feedback",
      description: "Receive encouragement and constructive feedback that builds on your existing strengths and celebrates progress.",
      highlight: "Positive Reinforcement"
    }
  ];

  const characters = [
    {
      name: "Ben 10",
      image: "/Ben10.jpeg",
      personality: "Adventurous & Brave",
      specialty: "Builds courage through challenges and quick thinking",
      quote: "It's hero time!"
    },
    {
      name: "Black Panther",
      image: "/BlackPanther.jpeg", 
      personality: "Wise & Diplomatic",
      specialty: "Leadership communication and thoughtful decision making",
      quote: "Wakanda forever!"
    },
    {
      name: "Wanda Vision",
      image: "/WandaVision.jpeg",
      personality: "Empathetic & Powerful", 
      specialty: "Emotional intelligence and transforming challenges to strength",
      quote: "I can handle the truth."
    },
    {
      name: "Dora",
      image: "/dora.jpeg",
      personality: "Curious & Educational",
      specialty: "Interactive learning and problem-solving through exploration", 
      quote: "¡Vamos! Let's go!"
    }
  ];

  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Recent Computer Science Graduate",
      content: "Finally, a platform that gets it! I could practice job interviews without masking, and the visual cues really helped me understand social dynamics better.",
      avatar: "A",
      color: "from-blue-500 to-cyan-500",
      initials: "AR"
    },
    {
      name: "Jamie Park", 
      role: "New Marketing Analyst",
      content: "The safe space to practice presentations was exactly what I needed. I could pause, think, and respond authentically without judgment.",
      avatar: "J",
      color: "from-purple-500 to-pink-500",
      initials: "JP"
    },
    {
      name: "Sam Thompson",
      role: "Junior UX Designer",
      content: "Wanda's approach helped me communicate my ideas clearly in team meetings. The feedback was constructive and celebrated my unique perspective!",
      avatar: "S",
      color: "from-green-500 to-teal-500",
      initials: "ST"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <img 
                src="/logo.png" 
                alt="EmotiSphere Logo" 
                className="w-13 h-14 object-contain"
              />
              <span className="text-xl font-bold text-gray-900">EmotiSphere</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <SignInButton mode="modal">
                <button className="text-gray-700 hover:text-rose-600 font-medium transition-colors">
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Get Started Free
                </button>
              </SignUpButton>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="section-hero" className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Build{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
                  Confidence
                </span>
                <br />
                in Your Unique Voice
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
                Practice communication skills in a safe, judgment-free environment with AI coaches who understand your journey. 
                Perfect for new graduates ready to navigate professional conversations with confidence and authenticity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <SignUpButton mode="modal">
                <button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center space-x-2">
                  <span>Start Training Now</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </SignUpButton>
              <button className="text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-300 hover:border-rose-300 hover:text-rose-600 transition-all duration-200">
                Watch Demo
              </button>
            </motion.div>

            {/* Floating Character Avatars */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              <div className="bg-white/20 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/30 relative overflow-hidden">
                {/* Background glow effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-pink-500/10 animate-pulse"></div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-800 mb-8">Meet Your AI Coaches</h3>
                  
                  {/* Floating Character Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    {characters.map((character, index) => (
                      <motion.div
                        key={character.name}
                        initial={{ opacity: 0, y: 50, rotateY: -15 }}
                        animate={{ 
                          opacity: 1, 
                          y: [0, -10, 0],
                          rotateY: 0 
                        }}
                        transition={{ 
                          duration: 3,
                          delay: index * 0.2,
                          y: { 
                            repeat: Infinity, 
                            duration: 3,
                            ease: "easeInOut",
                            delay: index * 0.5
                          }
                        }}
                        whileHover={{ 
                          scale: 1.1, 
                          rotateY: 10,
                          transition: { duration: 0.3 }
                        }}
                        className="text-center group cursor-pointer"
                      >
                        <div className="relative">
                          {/* Glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                          
                          {/* Character image */}
                          <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300">
                            <img 
                              src={character.image} 
                              alt={character.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          
                          {/* Character info */}
                          <h4 className="font-bold text-gray-800 text-sm md:text-base mb-1">{character.name}</h4>
                          <p className="text-xs text-gray-600 mb-2">{character.personality}</p>
                          
                          {/* Quote bubble - appears on hover */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ opacity: 1, scale: 1 }}
                            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200 text-xs font-medium text-gray-700 whitespace-nowrap"
                          >
                            {character.quote}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/90"></div>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Tech badges */}
                  <div className="flex flex-wrap justify-center gap-3">
                    <span className="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-white/50">
                      🎤 ElevenLabs Voice AI
                    </span>
                    <span className="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-white/50">
                      🎮 3D Avatar Technology
                    </span>
                    <span className="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-white/50">
                      🧠 Real-time Analytics
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="section-features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible['section-features'] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Features Built for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
                Your Success
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Practice at your own pace with supportive AI coaching designed for different communication styles and learning preferences
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible['section-features'] ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.03, 
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  {/* Icon with glow effect */}
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-r from-rose-100 to-pink-100 p-4 rounded-2xl w-fit">
                      {feature.icon}
                    </div>
                  </div>
                  
                  {/* Highlight badge */}
                  <div className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold mb-4">
                    {feature.highlight}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-rose-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Hover arrow */}
                  <motion.div 
                    className="mt-4 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRightIcon className="w-5 h-5" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="section-howit" className="py-20 px-4 bg-white/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible['section-howit'] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Begin your communication journey with a clear, supportive process designed for your success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { 
                step: "1", 
                title: "Choose Your Coaching Style", 
                desc: "Pick a coach that matches your communication preference - structured, creative, empathetic, or exploratory approach",
                icon: "🎭"
              },
              { 
                step: "2", 
                title: "Practice in Safe Space", 
                desc: "Engage in judgment-free conversations where you can pause, think, and respond authentically at your own pace",
                icon: "🛡️"
              },
              { 
                step: "3", 
                title: "Learn Through Reflection", 
                desc: "Complete thoughtful quizzes designed to reinforce learning and celebrate your unique insights and progress",
                icon: "💡"
              },
              { 
                step: "4", 
                title: "Build Authentic Confidence", 
                desc: "Develop communication skills that feel natural to you and prepare for real-world professional interactions",
                icon: "�"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible['section-howit'] ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center relative"
              >
                {/* Connecting line (except for last item) */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-rose-300 to-pink-300 transform translate-x-4"></div>
                )}
                
                <div className="relative">
                  {/* Icon background */}
                  <div className="text-4xl mb-4">{item.icon}</div>
                  
                  {/* Step number */}
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-6 shadow-lg">
                    {item.step}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="section-testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible['section-testimonials'] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join recent graduates who are building confidence in their authentic communication style
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible['section-testimonials'] ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  {/* Beautiful Avatar */}
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${testimonial.color} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{testimonial.name}</p>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  {/* Quote with enhanced styling */}
                  <div className="relative">
                    <div className="text-6xl text-rose-200 absolute -top-4 -left-2 font-serif">"</div>
                    <p className="text-gray-700 text-lg leading-relaxed italic pl-8 mb-4">{testimonial.content}</p>
                    <div className="text-6xl text-rose-200 absolute -bottom-8 -right-2 font-serif rotate-180">"</div>
                  </div>
                  
                  {/* Rating stars */}
                  <div className="flex items-center mt-6 pt-4 border-t border-gray-200">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm ml-2">5.0</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-rose-500 to-pink-500">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Build Your Professional Communication Skills?
            </h2>
            <p className="text-xl text-rose-100 mb-8 max-w-3xl mx-auto">
              Start your journey to authentic workplace confidence. Practice in a supportive environment designed 
              for neurodivergent graduates entering the professional world with their unique strengths.
            </p>
            <SignUpButton mode="modal">
              <button className="bg-white text-rose-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center space-x-2 mx-auto">
                <span>Begin Your Journey</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </SignUpButton>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-50 via-rose-50 to-pink-50 border-t border-rose-100 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/logo.png" 
                  alt="EmotiSphere Logo" 
                  className="w-14 h-14 object-contain"
                />
                <span className="text-2xl font-bold text-gray-900">EmotiSphere</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                Empowering neurodivergent graduates to build authentic communication skills 
                and confidence for professional success.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <span className="text-sm">📧</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <span className="text-sm">🐦</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <span className="text-sm">💼</span>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-rose-600 transition-colors">AI Coaches</a></li>
                <li><a href="#" className="hover:text-rose-600 transition-colors">Practice Sessions</a></li>
                <li><a href="#" className="hover:text-rose-600 transition-colors">Progress Tracking</a></li>
                <li><a href="#" className="hover:text-rose-600 transition-colors">Resources</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-rose-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-rose-600 transition-colors">Accessibility</a></li>
                <li><a href="#" className="hover:text-rose-600 transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-rose-600 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom section */}
          <div className="border-t border-rose-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 EmotiSphere. Built with ♿ accessibility and 🧠 neurodiversity in mind.
            </div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-rose-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-rose-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-rose-600 transition-colors">Accessibility Statement</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;