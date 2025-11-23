"use client";

import React, { useState, useEffect } from 'react';
import { Globe, Moon, Sun } from 'lucide-react';
import Image from 'next/image';

// Translations
const translations = {
  tr: {
    title: "Maltepe Üniversitesi",
    subtitle: "Otomatik Yoklama Sistemi",
    logIn: "Giriş Yap",
    enterCredentials: "Sisteme erişmek için bilgilerinizi girin",
    username: "Kullanıcı Adı / Öğrenci Numarası",
    password: "Şifre",
    usernamePlaceholder: "Örn: emreolca, 2024001",
    passwordPlaceholder: "••••••••",
    demoAccounts: "Demo Hesaplar:",
    instructor: "Öğretmen: emreolca / emreolca",
    student: "Öğrenci: 2024001 / herhangi",
    lightMode: "Açık Tema",
    darkMode: "Koyu Tema"
  },
  en: {
    title: "Maltepe University",
    subtitle: "Automatic Attendance System",
    logIn: "Log In",
    enterCredentials: "Enter your credentials to access the system",
    username: "Username / Student ID",
    password: "Password",
    usernamePlaceholder: "Ex: instructor, 2024001",
    passwordPlaceholder: "••••••••",
    demoAccounts: "Demo Accounts:",
    instructor: "Instructor: emreolca / emreolca",
    student: "Student: 2024001 / any",
    lightMode: "Light Mode",
    darkMode: "Dark Mode"
  }
};

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'tr' | 'en'>('en');
  const [mounted, setMounted] = useState(false);

  const t = translations[language];

  // Sistem tercihini kontrol et
  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('darkMode');
    const savedLang = localStorage.getItem('language');
    if (savedMode !== null) {
      setIsDarkMode(JSON.parse(savedMode));
    } else {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    if (savedLang) {
      setLanguage(savedLang as 'tr' | 'en');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'tr' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo hesaplar için kontrol
    if (username === 'emreolca' && password === 'emreolca') {
      // Instructor için teacher-live-attendance sayfasına yönlendir
      window.location.href = '/?page=teacher-live-attendance';
      return;
    }
    
    if (username === '2024001') {
      // Student için student-reports sayfasına yönlendir
      window.location.href = '/?page=student-reports';
      return;
    }
    
    // Diğer durumlar için varsayılan olarak teacher-live-attendance
    window.location.href = '/?page=teacher-live-attendance';
  };

  const handleQuickLogin = (userType: 'instructor' | 'student') => {
    if (userType === 'instructor') {
      setUsername('emreolca');
      setPassword('emreolca');
      setTimeout(() => {
        window.location.href = '/?page=teacher-live-attendance';
      }, 100);
    } else if (userType === 'student') {
      setUsername('2024001');
      setPassword('any');
      setTimeout(() => {
        window.location.href = '/?page=student-reports';
      }, 100);
    }
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center relative font-sans transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      
      {/* Top Right Icons */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-2 sm:gap-3">
        <button 
          onClick={toggleLanguage}
          className={`flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm transition ${
            isDarkMode
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-black/10 hover:bg-black/20 text-gray-800'
          }`}
        >
          <Globe size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">{language.toUpperCase()}</span>
        </button>
        <button 
          onClick={toggleDarkMode}
          className={`p-1.5 sm:p-2 rounded-full transition ${
            isDarkMode
              ? 'bg-white/10 hover:bg-white/20 text-yellow-300'
              : 'bg-black/10 hover:bg-black/20 text-gray-800'
          }`}
          title={isDarkMode ? t.lightMode : t.darkMode}
        >
          {isDarkMode ? <Sun size={14} className="sm:w-4 sm:h-4" /> : <Moon size={14} className="sm:w-4 sm:h-4" />}
        </button>
      </div>

      {/* Logo and Title Area */}
      <div className="text-center mb-4 sm:mb-8 px-4">
        {/* Logo Image */}
        <div className="mx-auto mb-2 sm:mb-4 flex items-center justify-center">
          <Image 
            src="/maltepe-uni-logo.svg" 
            alt="Maltepe University Logo" 
            width={120}
            height={105}
            priority
            className={`transition-all ${isDarkMode ? 'filter drop-shadow-lg' : ''} w-24 h-20 sm:w-40 sm:h-35`}
          />
        </div>
        
        <h1 className={`text-2xl sm:text-3xl font-bold mb-1 tracking-wide transition-colors ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {t.title}
        </h1>
        <p className={`text-xs sm:text-sm font-light opacity-80 transition-colors ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {t.subtitle}
        </p>
      </div>

      {/* Login Card */}
      <div className={`w-full max-w-[450px] p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-2xl mx-4 transition-colors ${
        isDarkMode
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-100'
      }`}>
        <div className="mb-4 sm:mb-6">
          <h2 className={`text-lg sm:text-xl font-bold transition-colors ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>{t.logIn}</h2>
          <p className={`text-xs sm:text-sm mt-1 transition-colors ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {t.enterCredentials}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          {/* Username Input */}
          <div>
            <label className={`block text-sm font-semibold mb-2 transition-colors ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t.username}
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
              placeholder={t.usernamePlaceholder}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className={`block text-sm font-semibold mb-2 transition-colors ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t.password}
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
              placeholder={t.passwordPlaceholder}
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
            {t.logIn}
          </button>
        </form>

        {/* Demo Accounts Box */}
        <div className={`mt-4 sm:mt-8 rounded-lg sm:rounded-xl p-3 sm:p-4 border transition-colors ${
          isDarkMode
            ? 'bg-gray-700/50 border-purple-600/30'
            : 'bg-purple-50 border border-purple-100'
        }`}>
          <h3 className={`font-semibold text-xs sm:text-sm mb-2 sm:mb-3 transition-colors ${
            isDarkMode ? 'text-purple-300' : 'text-purple-800'
          }`}>{t.demoAccounts}</h3>
          <div className="space-y-1.5 sm:space-y-2">
            <button
              onClick={() => handleQuickLogin('instructor')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all text-xs font-mono ${
                isDarkMode 
                  ? 'bg-gray-600/50 hover:bg-gray-600 text-gray-200 hover:text-white' 
                  : 'bg-white hover:bg-purple-100 text-gray-700 hover:text-purple-800'
              } border ${isDarkMode ? 'border-gray-600' : 'border-purple-200'}`}
            >
              • {t.instructor}
            </button>
            <button
              onClick={() => handleQuickLogin('student')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all text-xs font-mono ${
                isDarkMode 
                  ? 'bg-gray-600/50 hover:bg-gray-600 text-gray-200 hover:text-white' 
                  : 'bg-white hover:bg-purple-100 text-gray-700 hover:text-purple-800'
              } border ${isDarkMode ? 'border-gray-600' : 'border-purple-200'}`}
            >
              • {t.student}
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}