"use client";

import React, { useState, useEffect } from 'react';
import { Globe, Moon, Sun } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sistem tercihini kontrol et
  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setIsDarkMode(JSON.parse(savedMode));
    } else {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in:", username, password);
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center relative font-sans transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      
      {/* Top Right Icons */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <button className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition ${
          isDarkMode
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-black/10 hover:bg-black/20 text-gray-800'
        }`}>
          <Globe size={16} />
          <span>EN</span>
        </button>
        <button 
          onClick={toggleDarkMode}
          className={`p-2 rounded-full transition ${
            isDarkMode
              ? 'bg-white/10 hover:bg-white/20 text-yellow-300'
              : 'bg-black/10 hover:bg-black/20 text-gray-800'
          }`}
          title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* Logo and Title Area */}
      <div className="text-center mb-8">
        {/* Logo Image */}
        <div className="mx-auto mb-4 flex items-center justify-center">
          <Image 
            src="/maltepe-uni-logo.svg" 
            alt="Maltepe University Logo" 
            width={160}
            height={140}
            priority
            className={`transition-all ${isDarkMode ? 'filter drop-shadow-lg' : ''}`}
          />
        </div>
        
        <h1 className={`text-3xl font-bold mb-1 tracking-wide transition-colors ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Maltepe University
        </h1>
        <p className={`text-sm font-light opacity-80 transition-colors ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Automatic Attendance System
        </p>
      </div>

      {/* Login Card */}
      <div className={`w-full max-w-[450px] p-8 rounded-2xl shadow-2xl mx-4 transition-colors ${
        isDarkMode
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-100'
      }`}>
        <div className="mb-6">
          <h2 className={`text-xl font-bold transition-colors ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Log In</h2>
          <p className={`text-sm mt-1 transition-colors ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Enter your credentials to access the system
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username Input */}
          <div>
            <label className={`block text-sm font-semibold mb-2 transition-colors ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Username / Student ID
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full text-sm rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${
                isDarkMode
                  ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                  : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-purple-400 focus:border-purple-400'
              }`}
              placeholder="Ex: admin, instructor, 2024001"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className={`block text-sm font-semibold mb-2 transition-colors ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full text-sm rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${
                isDarkMode
                  ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                  : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-purple-400 focus:border-purple-400'
              }`}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full text-white font-semibold rounded-lg text-sm px-5 py-3.5 text-center transition-all shadow-md hover:shadow-lg ${
              isDarkMode
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
            }`}
          >
            Log In
          </button>
        </form>

        {/* Demo Accounts Box */}
        <div className={`mt-8 rounded-xl p-4 border transition-colors ${
          isDarkMode
            ? 'bg-gray-700/50 border-purple-600/30'
            : 'bg-purple-50 border border-purple-100'
        }`}>
          <h3 className={`font-semibold text-sm mb-2 transition-colors ${
            isDarkMode ? 'text-purple-300' : 'text-purple-800'
          }`}>Demo Accounts:</h3>
          <ul className={`text-xs space-y-1 font-mono transition-colors ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <li>• Admin: admin / admin</li>
            <li>• Instructor: emreolca / emreolca</li>
            <li>• Student: 2024001 / any</li>
          </ul>
        </div>
      </div>
      
    </div>
  );
}