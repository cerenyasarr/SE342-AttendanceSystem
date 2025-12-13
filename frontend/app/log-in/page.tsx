"use client";

import React, { useState, useEffect } from 'react';
import { Globe, Moon, Sun, UserPlus, LogIn } from 'lucide-react';
import Image from 'next/image';

// Translations
const translations = {
  tr: {
    title: "Maltepe Üniversitesi",
    subtitle: "Otomatik Yoklama Sistemi",
    logIn: "Giriş Yap",
    signUp: "Kayıt Ol",
    toggleToSignUp: "Öğretmen hesabı oluşturunuz.",
    toggleToLogin: "Zaten hesabınız var mı? Giriş yapın",
    enterCredentials: "Sisteme erişmek için bilgilerinizi giriniz.",
    createAccount: "Yeni öğretmen hesabı oluşturun",
    name: "Ad",
    surname: "Soyad",
    email: "Kurumsal E-posta",
    username: "Kullanıcı Adı",
    password: "Şifre",
    confirmPassword: "Şifre Tekrar",
    usernamePlaceholder: "Örn: emreolca",
    passwordPlaceholder: "••••••••",
    demoAccounts: "Demo Hesaplar:",
    instructor: "Öğretmen: emreolca / emreolca",
    student: "Öğrenci: 2024001 / herhangi",
    lightMode: "Açık Tema",
    darkMode: "Koyu Tema",
    registerSuccess: "Kayıt başarılı! Lütfen giriş yapın."
  },
  en: {
    title: "Maltepe University",
    subtitle: "Automatic Attendance System",
    logIn: "Log In",
    signUp: "Sign Up",
    toggleToSignUp: "Create an instructor account",
    toggleToLogin: "Already have an account? Log in",
    enterCredentials: "Enter your credentials to access the system",
    createAccount: "Create a new instructor account",
    name: "Name",
    surname: "Surname",
    email: "Institutional Email",
    username: "Username",
    password: "Password",
    confirmPassword: "Confirm Password",
    usernamePlaceholder: "Ex: instructor",
    passwordPlaceholder: "••••••••",
    demoAccounts: "Demo Accounts:",
    instructor: "Instructor: emreolca / emreolca",
    student: "Student: 2024001 / any",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    registerSuccess: "Registration successful! Please log in."
  }
};

export default function LoginPage() {
  // Login States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Register States
  const [regName, setRegName] = useState('');
  const [regSurname, setRegSurname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regTitle, setRegTitle] = useState('');
  const [regDepartment, setRegDepartment] = useState('');

  // UI States
  const [isLoginMode, setIsLoginMode] = useState(true); // true = Login, false = Register
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'tr' | 'en'>('en');
  const [mounted, setMounted] = useState(false);

  const t = translations[language];

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Demo Hesabı Mantığı (Fallback olarak kalsın)
    if (username === 'emreolca' && password === 'emreolca') {
      const demoUser = { 
        id: 999,
        name: 'Emre', 
        surname: 'Olca', 
        title: 'Dr.', 
        role: 'instructor' 
      };
      localStorage.setItem('currentUser', JSON.stringify(demoUser));
      window.location.href = '/?page=teacher-live-attendance';
      return;
    }

    if (username === '2024001') {
        const demoStudent = {
            id: 888,
            name: 'Öğrenci',
            role: 'student'
        };
        localStorage.setItem('currentUser', JSON.stringify(demoStudent));
        window.location.href = '/?page=student-reports';
        return;
    }

    // 2. Gerçek Backend Girişi
    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Backend'den gelen kullanıcı bilgisini tarayıcıya kaydet
        localStorage.setItem('currentUser', JSON.stringify(data));
        
        // Role göre yönlendirme
        if (data.role === 'instructor') {
          window.location.href = '/?page=teacher-live-attendance';
        } else {
          window.location.href = '/?page=student-reports';
        }
      } else {
        const err = await response.json();
        alert(language === 'en' ? (err.error || "Invalid credentials") : (err.error || "Hatalı giriş"));
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(language === 'en' ? "Connection error" : "Bağlantı hatası");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (regPassword !== regConfirmPassword) {
      alert(language === 'en' ? "Passwords do not match!" : "Şifreler eşleşmiyor!");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5001/api/instructors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: regName,
          last_name: regSurname,
          username: regUsername,
          email: regEmail,
          password: regPassword,
          title: regTitle,
          department: regDepartment
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      alert(t.registerSuccess);
      setIsLoginMode(true);
      // Reset form
      setRegName(''); setRegSurname(''); setRegEmail(''); setRegUsername('');
      setRegPassword(''); setRegConfirmPassword(''); setRegTitle(''); setRegDepartment('');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleQuickLogin = (userType: 'instructor' | 'student') => {
    if (userType === 'instructor') {
      setUsername('emreolca');
      setPassword('emreolca');
    } else if (userType === 'student') {
      setUsername('2024001');
      setPassword('any');
    }
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center relative font-sans transition-colors duration-300 py-10 ${isDarkMode
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'
      : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>

      {/* Top Right Icons */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-2 sm:gap-3 z-10">
        <button
          onClick={toggleLanguage}
          className={`flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm transition ${isDarkMode
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-black/10 hover:bg-black/20 text-gray-800'
            }`}
        >
          <Globe size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">{language.toUpperCase()}</span>
        </button>
        <button
          onClick={toggleDarkMode}
          className={`p-1.5 sm:p-2 rounded-full transition ${isDarkMode
            ? 'bg-white/10 hover:bg-white/20 text-yellow-300'
            : 'bg-black/10 hover:bg-black/20 text-gray-800'
            }`}
          title={isDarkMode ? t.lightMode : t.darkMode}
        >
          {isDarkMode ? <Sun size={14} className="sm:w-4 sm:h-4" /> : <Moon size={14} className="sm:w-4 sm:h-4" />}
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[450px] px-4 flex flex-col items-center">

        {/* Logo and Title Area */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <Image
              src="/maltepe-uni-logo.svg"
              alt="Maltepe University Logo"
              width={120}
              height={105}
              priority
              className={`transition-all ${isDarkMode ? 'filter drop-shadow-lg' : ''} w-24 h-20 sm:w-32 sm:h-28`}
            />
          </div>

          <h1 className={`text-2xl sm:text-3xl font-bold mb-1 tracking-wide transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
            {t.title}
          </h1>
          <p className={`text-xs sm:text-sm font-light opacity-80 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
            {t.subtitle}
          </p>
        </div>

        {/* Auth Card */}
        <div className={`w-full p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-2xl transition-colors duration-300 ${isDarkMode
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-100'
          }`}>

          <div className="mb-6">
            <h2 className={`text-xl font-bold transition-colors flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
              {isLoginMode ? <LogIn size={20} /> : <UserPlus size={20} />}
              {isLoginMode ? t.logIn : t.signUp}
            </h2>
            <p className={`text-xs sm:text-sm mt-1 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
              {isLoginMode ? t.enterCredentials : t.createAccount}
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={isLoginMode ? handleLogin : handleRegister} className="space-y-4">

            {/* Register Specific Fields */}
            {!isLoginMode && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t.name}
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className={`w-full text-sm rounded-lg p-2.5 transition-all ${isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-purple-400'
                        }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t.surname}
                    </label>
                    <input
                      type="text"
                      required
                      value={regSurname}
                      onChange={(e) => setRegSurname(e.target.value)}
                      className={`w-full text-sm rounded-lg p-2.5 transition-all ${isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-purple-400'
                        }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t.email}
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className={`w-full text-sm rounded-lg p-2.5 transition-all ${isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-purple-400'
                      }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {language === 'en' ? 'Title' : 'Ünvan'}
                    </label>
                    <input
                      type="text"
                      required
                      value={regTitle}
                      onChange={(e) => setRegTitle(e.target.value)}
                      placeholder={language === 'en' ? 'Dr.' : 'Dr.'}
                      className={`w-full text-sm rounded-lg p-2.5 transition-all ${isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-purple-400'
                        }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {language === 'en' ? 'Department' : 'Bölüm'}
                    </label>
                    <select
                      required
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      className={`w-full text-sm rounded-lg p-2.5 transition-all ${isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-purple-400'
                        }`}
                    >
                      <option value="">{language === 'en' ? 'Select Department' : 'Bölüm Seçin'}</option>
                      <option value="CSE">Computer Science Engineering</option>
                      <option value="EE">Electrical Engineering</option>
                      <option value="ME">Mechanical Engineering</option>
                      <option value="CE">Civil Engineering</option>
                      <option value="IE">Industrial Engineering</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Common Fields */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.username}
              </label>
              <input
                type="text"
                required
                value={isLoginMode ? username : regUsername}
                onChange={(e) => isLoginMode ? setUsername(e.target.value) : setRegUsername(e.target.value)}
                className={`w-full text-sm rounded-lg p-3 transition-all ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-purple-400'
                  }`}
                placeholder={isLoginMode ? t.usernamePlaceholder : ''}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.password}
              </label>
              <input
                type="password"
                required
                value={isLoginMode ? password : regPassword}
                onChange={(e) => isLoginMode ? setPassword(e.target.value) : setRegPassword(e.target.value)}
                className={`w-full text-sm rounded-lg p-3 transition-all ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-purple-400'
                  }`}
                placeholder={isLoginMode ? t.passwordPlaceholder : ''}
              />
            </div>

            {!isLoginMode && (
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t.confirmPassword}
                </label>
                <input
                  type="password"
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className={`w-full text-sm rounded-lg p-3 transition-all ${isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-purple-400'
                    }`}
                />
              </div>
            )}

            <button
              type="submit"
              className={`w-full text-white font-semibold rounded-lg text-sm px-5 py-3.5 text-center transition-all shadow-md hover:shadow-lg mt-2 ${isDarkMode
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                }`}
            >
              {isLoginMode ? t.logIn : t.signUp}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setUsername(''); setPassword('');
                setRegName(''); setRegSurname(''); setRegEmail(''); setRegUsername(''); setRegPassword(''); setRegConfirmPassword('');
              }}
              className={`text-sm font-medium hover:underline transition-colors ${isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'
                }`}
            >
              {isLoginMode ? t.toggleToSignUp : t.toggleToLogin}
            </button>
          </div>

          {/* Demo Accounts */}
          {isLoginMode && (
            <div className={`mt-6 rounded-lg p-3 sm:p-4 border transition-colors ${isDarkMode
              ? 'bg-gray-700/50 border-purple-600/30'
              : 'bg-purple-50 border border-purple-100'
              }`}>
              <h3 className={`font-semibold text-xs sm:text-sm mb-2 transition-colors ${isDarkMode ? 'text-purple-300' : 'text-purple-800'
                }`}>{t.demoAccounts}</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleQuickLogin('instructor')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all text-xs font-mono ${isDarkMode
                    ? 'bg-gray-600/50 hover:bg-gray-600 text-gray-200 hover:text-white'
                    : 'bg-white hover:bg-purple-100 text-gray-700 hover:text-purple-800'
                    } border ${isDarkMode ? 'border-gray-600' : 'border-purple-200'}`}
                >
                  • {t.instructor}
                </button>
                <button
                  onClick={() => handleQuickLogin('student')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all text-xs font-mono ${isDarkMode
                    ? 'bg-gray-600/50 hover:bg-gray-600 text-gray-200 hover:text-white'
                    : 'bg-white hover:bg-purple-100 text-gray-700 hover:text-purple-800'
                    } border ${isDarkMode ? 'border-gray-600' : 'border-purple-200'}`}
                >
                  • {t.student}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}