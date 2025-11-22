"use client";

import React, { useState } from 'react';
import { Globe, Moon } from 'lucide-react'; // İkonlar

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in:", username, password);
  };

  return (
    // Main Background (Purple Gradient)
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#8e3c9e] relative font-sans">
      
      {/* Top Right Icons */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <button className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-md text-sm transition">
          <Globe size={16} />
          <span>EN</span>
        </button>
        <button className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition">
          <Moon size={16} />
        </button>
      </div>

      {/* Logo and Title Area */}
      <div className="text-center mb-8">
        {/* Logo Placeholder */}
        <div className="bg-white w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            {/* If you have a logo image: <Image src="/logo.png" ... /> */}
            <span className="text-3xl font-bold text-[#8e3c9e]">M</span> 
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-1 tracking-wide">
          Maltepe University
        </h1>
        <p className="text-purple-200 text-sm font-light opacity-90">
          Automatic Attendance System
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white w-full max-w-[450px] p-8 rounded-2xl shadow-2xl mx-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Log In</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your credentials to access the system
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username / Student ID
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#8e3c9e] focus:border-[#8e3c9e] block p-3 outline-none transition-all"
              placeholder="Ex: admin, instructor, 2024001"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#8e3c9e] focus:border-[#8e3c9e] block p-3 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full text-white bg-[#9b4cb3] hover:bg-[#8e3c9e] focus:ring-4 focus:outline-none focus:ring-purple-300 font-semibold rounded-lg text-sm px-5 py-3.5 text-center transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Log In
          </button>
        </form>

        {/* Demo Accounts Box */}
        <div className="mt-8 bg-pink-50 rounded-xl p-4 border border-pink-100">
          <h3 className="text-pink-800 font-semibold text-sm mb-2">Demo Accounts:</h3>
          <ul className="text-xs text-gray-600 space-y-1 font-mono">
            <li>• Admin: admin / admin</li>
            <li>• Instructor: emreolca / emreolca</li>
            <li>• Student: 2024001 / any</li>
          </ul>
        </div>
      </div>
      
    </div>
  );
}