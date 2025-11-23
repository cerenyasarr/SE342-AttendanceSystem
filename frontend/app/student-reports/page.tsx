"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Globe, 
  Moon, 
  Sun,
  LogOut, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  Menu, 
  X 
} from 'lucide-react';
import Image from 'next/image';

// Translations
const translations = {
  TR: {
    title: "Yoklama Panom",
    subtitle: "Kişisel yoklama kayıtlarınızı görüntüleyin (FR-11)",
    totalSessions: "Toplam Oturum",
    present: "Var",
    absent: "Yok",
    attendanceRate: "Yoklama Oranı",
    courseAttendance: "Ders Yoklama Durumu",
    sessions: "oturum",
    welcome: "Hoş geldiniz,",
    student: "Öğrenci",
    studentAccount: "Öğrenci Hesabı",
    logOut: "Çıkış Yap"
  },
  EN: {
    title: "My Attendance Dashboard",
    subtitle: "View your personal attendance records (FR-11)",
    totalSessions: "Total Sessions",
    present: "Present",
    absent: "Absent",
    attendanceRate: "Attendance Rate",
    courseAttendance: "Course Attendance Status",
    sessions: "sessions",
    welcome: "Welcome,",
    student: "Student",
    studentAccount: "Student Account",
    logOut: "Log Out"
  }
};

// --- MOCK DATA ---
const summaryCards = [
  { titleKey: 'totalSessions', value: '8', icon: BookOpen, color: 'bg-purple-900/30 text-purple-300' },
  { titleKey: 'present', value: '6', icon: CheckCircle2, color: 'bg-green-900/30 text-green-300' },
  { titleKey: 'absent', value: '2', icon: XCircle, color: 'bg-red-900/30 text-red-300' },
  { titleKey: 'attendanceRate', value: '75%', icon: TrendingUp, color: 'bg-blue-900/30 text-blue-300' },
];

const courseAttendanceData = [
  { code: 'CEN101', name: 'Algorithms and Programming I', attended: 3, total: 3, percentage: 100 },
  { code: 'CSE102', name: 'Data Structures', attended: 1, total: 2, percentage: 50 },
  { code: 'CSE201', name: 'Object Oriented Programming', attended: 1, total: 2, percentage: 50 },
  { code: 'CSE301', name: 'Database Management Systems', attended: 1, total: 1, percentage: 100 },
];

export default function StudentReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<'TR' | 'EN'>('EN');
  const [isDarkMode, setIsDarkMode] = useState(false);
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
      const lang = savedLang.toUpperCase() === 'TR' ? 'TR' : 'EN';
      setLanguage(lang);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  const toggleLanguage = () => {
    const newLang = language === 'TR' ? 'EN' : 'TR';
    setLanguage(newLang);
    localStorage.setItem('language', newLang.toLowerCase());
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/?page=log-in';
    }
  };

  if (!mounted) return null;

  const darkCardBg = isDarkMode ? "bg-gray-800" : "bg-white";
  const mainBg = isDarkMode ? "bg-gray-900" : "bg-gray-50";
  const sidebarBg = isDarkMode ? "bg-gray-700" : "bg-gray-600";
  const accentColor = "text-purple-400";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-600";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const hoverBg = isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100";

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-48' : 'w-20'} hidden lg:flex fixed lg:static h-full lg:h-auto transition-all duration-300 ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-600'
      } text-white flex-col p-4 z-50`}>
        {/* Logo and Title */}
        <div className="flex items-center gap-3 mb-8 min-w-0">
          <Image 
            src="/maltepe-uni-logo.svg" 
            alt="Maltepe University Logo" 
            width={40}
            height={40}
            priority
            className="flex-shrink-0"
          />
          <div className={`text-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
            <p className="font-bold whitespace-nowrap">Maltepe Üniversitesi</p>
            <p className="text-xs opacity-80 whitespace-nowrap">Automatic Attendance System</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-700'
          }`}>
            <LayoutDashboard size={20} className="flex-shrink-0" />
            <span className={`font-semibold transition-opacity duration-300 whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>{t.title}</span>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="space-y-2 border-t border-gray-500 pt-3 mt-auto">
          <div className={`text-xs opacity-75 px-4 mb-2 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            <p>{t.welcome}</p>
            <p className="font-semibold">Student 2024001</p>
            <p className="text-xs opacity-60">{t.studentAccount}</p>
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
            }`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>{t.logOut}</span>
          </button>
        </div>
      </aside>
      
      {/* Mobile Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden fixed h-full w-48 transition-transform duration-300 ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-600'
      } text-white flex flex-col p-4 z-50`}>
        {/* Logo and Title */}
        <div className="flex items-center gap-3 mb-8">
          <Image 
            src="/maltepe-uni-logo.svg" 
            alt="Maltepe University Logo" 
            width={40}
            height={40}
            priority
          />
          <div className="text-sm">
            <p className="font-bold">Maltepe Üniversitesi</p>
            <p className="text-xs opacity-80">Automatic Attendance System</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-700'
          }`}>
            <LayoutDashboard size={20} />
            <span className="font-semibold">{t.title}</span>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="space-y-2 border-t border-gray-500 pt-3 mt-auto">
          <div className="text-xs opacity-75 px-4 mb-2">
            <p>{t.welcome}</p>
            <p className="font-semibold">Student 2024001</p>
            <p className="text-xs opacity-60">{t.studentAccount}</p>
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
            }`}
          >
            <LogOut size={18} />
            <span>{t.logOut}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-b px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg transition ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <Menu size={20} className={`sm:w-6 sm:h-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
            </button>
            <h1 className={`text-lg sm:text-xl lg:text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>{t.title}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={toggleLanguage}
              className={`p-1.5 sm:p-2 rounded-lg transition flex items-center gap-1 ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              title="Change Language"
            >
              <Globe size={16} className={`sm:w-5 sm:h-5 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
              <span className={`text-xs sm:text-sm font-medium hidden sm:inline ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{language}</span>
            </button>
            <button 
              onClick={toggleDarkMode}
              className={`p-1.5 sm:p-2 rounded-lg transition ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? <Sun size={16} className="sm:w-5 sm:h-5" /> : <Moon size={16} className="sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-3 sm:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
          
            <div className="mb-6">
              <h2 className={`text-2xl font-bold ${textPrimary} mb-1`}>{t.title}</h2>
              <p className={`text-sm ${textSecondary}`}>{t.subtitle}</p>
            </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-10">
            {summaryCards.map((card, index) => (
              <div key={index} className={`${darkCardBg} p-5 lg:p-6 rounded-2xl shadow-lg border ${borderColor} flex items-center gap-5 transition-transform hover:scale-[1.01]`}>
                <div className={`p-3 lg:p-4 rounded-xl ${card.color}`}>
                  <card.icon size={24} className="lg:w-7 lg:h-7" />
                </div>
                <div>
                  <h3 className={`text-xs lg:text-sm font-medium ${textSecondary} mb-1`}>{t[card.titleKey as keyof typeof t]}</h3>
                  <p className={`text-2xl lg:text-3xl font-bold ${textPrimary}`}>{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Course List */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <BookOpen size={20} className={accentColor}/>
              <h3 className={`text-lg lg:text-xl font-bold ${textPrimary}`}>{t.courseAttendance}</h3>
            </div>

            <div className={`${darkCardBg} rounded-2xl shadow-lg border ${borderColor} overflow-hidden`}>
              {courseAttendanceData.map((course, index) => (
                <div key={index} className={`p-5 lg:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${index !== courseAttendanceData.length - 1 ? `border-b ${borderColor}` : ''}`}>
                  
                  <div className="flex-1">
                    <h4 className={`font-bold ${textPrimary} text-base lg:text-lg mb-1`}>
                      <span className={accentColor}>{course.code}</span> - {course.name}
                    </h4>
                    <p className={`text-sm ${textSecondary} font-medium`}>
                      {course.attended} / {course.total} {t.sessions}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-1/2 xl:w-1/3">
                    <div className={`w-full h-2.5 lg:h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full overflow-hidden`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${course.percentage >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${course.percentage}%` }}
                      ></div>
                    </div>
                    <span className={`font-bold text-base lg:text-lg w-12 text-right ${course.percentage >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                      %{course.percentage}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
