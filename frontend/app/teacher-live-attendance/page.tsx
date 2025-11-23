"use client";

import React, { useState, useEffect } from 'react';
import { Menu, LogOut, Sun, Moon, Video, Mic, Settings, Globe, Check, X, Clock, Users, BarChart3, AlertCircle, UserPlus, FileText } from 'lucide-react';
import Image from 'next/image';

export default function TeacherLiveAttendance() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<'TR' | 'EN'>('EN');
  const [isLive, setIsLive] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('CSE102');
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showManualAttendanceModal, setShowManualAttendanceModal] = useState(false);
  const [manualStudentId, setManualStudentId] = useState('');

  const courses = [
    { id: 'CEN101', nameKey: 'algorithms' },
    { id: 'CSE102', nameKey: 'dataStructures' },
    { id: 'CSE201', nameKey: 'oop' },
    { id: 'CSE301', nameKey: 'database' },
  ];

  const students = [
    { id: '213332', name: 'Ayşe Demir', id2: '2024005', confidence: 90, status: 'present' },
    { id: 'Can Öztürk', name: 'Can Öztürk', id2: '2024005', confidence: 88, status: 'present' },
  ];

  const translations = {
    TR: {
      liveAttendance: 'Canlı Yoklama',
      courseInfo: 'Ders Bilgileri',
      selectCourse: 'Ders Seçin',
      attendanceMethod: 'Yoklama Yöntemi',
      startAttendance: 'Yoklamayı Başlat',
      stopAttendance: 'Yoklamayı Durdur',
      studentRegistration: 'Öğrenci Kayıt',
      attendanceReports: 'Yoklama Raporları',
      logout: 'Çıkış Yap',
      welcome: 'Hoş geldiniz,',
      teacher: 'Öğretmen',
      instantList: 'Anlık Yoklama Listesi',
      students_enrolled: 'Tanınan öğrenciler',
      present: 'Tanındı',
      absent: 'Tanınmadı',
      attendanceTime: 'Anlık Saat',
      cameraView: 'Kamera Görüntüsü',
      cameraOff: 'Kamera devre dışı',
      startSession: 'Yoklamayı başlatın',
      methodSelect: 'Yöntem seçiniz',
      autoAttendance: 'Otomatik Yoklama',
      manualAttendance: 'Manuel Yoklama',
      courseSubtitle: 'Yüz tanıma sistemi ile otomatik yoklama alın',
      courseLabel: 'Ders',
      manualAttendanceTitle: 'Manuel Yoklama Ekle',
      addManualAttendance: 'Yoklama Ekle',
      cancel: 'İptal',
      studentNumber: 'Öğrenci Numarası',
      manualAttendanceNote: 'Bu yoklama "Manuel" olarak işaretlenecektir',
      manualAttendanceDescription: 'Tanınamayan öğrenci için manuel olarak yoklama alınız',
      liveIndicator: 'Canlı',
      faceRecognitionActive: 'Yüz tanıma aktif - Öğrenciler kamera karşısına gelebilir',
      confidenceRate: 'Doğruluk Oranı',
      universityName: 'Maltepe Üniversitesi',
      systemName: 'Otomatik Yoklama Sistemi',
      // Course names for TR
      algorithms: 'Algoritma ve Programlama I',
      dataStructures: 'Veri Yapıları',
      oop: 'Nesne Yönelimli Programlama',
      database: 'Veritabanı Yönetim Sistemleri',
    },
    EN: {
      liveAttendance: 'Live Attendance',
      courseInfo: 'Course Information',
      selectCourse: 'Select Course',
      attendanceMethod: 'Attendance Method',
      startAttendance: 'Start Attendance',
      stopAttendance: 'Stop Attendance',
      studentRegistration: 'Student Registration',
      attendanceReports: 'Attendance Reports',
      logout: 'Log Out',
      welcome: 'Welcome,',
      teacher: 'Teacher',
      instantList: 'Instant Attendance List',
      students_enrolled: 'Recognized students',
      present: 'Present',
      absent: 'Absent',
      attendanceTime: 'Current Time',
      cameraView: 'Camera View',
      cameraOff: 'Camera is off',
      startSession: 'Start attendance',
      methodSelect: 'Select method',
      autoAttendance: 'Automatic Attendance',
      manualAttendance: 'Manual Attendance',
      courseSubtitle: 'Automatic attendance with face recognition system',
      courseLabel: 'Course',
      manualAttendanceTitle: 'Add Manual Attendance',
      addManualAttendance: 'Add Attendance',
      cancel: 'Cancel',
      studentNumber: 'Student Number',
      manualAttendanceNote: 'This attendance will be marked as "Manual"',
      manualAttendanceDescription: 'Manually take attendance for unrecognized students',
      liveIndicator: 'Live',
      faceRecognitionActive: 'Face recognition active - Students can stand in front of the camera',
      confidenceRate: 'Accuracy Rate',
      universityName: 'Maltepe University',
      systemName: 'Automatic Attendance System',
      // Course names for EN
      algorithms: 'Algorithms and Programming I',
      dataStructures: 'Data Structures',
      oop: 'Object Oriented Programming',
      database: 'Database Management Systems',
    }
  };

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

  const navigateToPage = (page: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/?page=${page}`;
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/?page=log-in';
    }
  };

  if (!mounted) return null;

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
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} hidden lg:flex fixed lg:static max-h-screen lg:max-h-none overflow-y-auto lg:overflow-y-visible transition-all duration-300 ${
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
          <div className={`text-sm transition-opacity duration-300 overflow-hidden ${sidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0'}`}>
            <p className="font-bold whitespace-nowrap">{t.universityName}</p>
            <p className="text-xs opacity-80 whitespace-nowrap">{t.systemName}</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 space-y-2">
          <button
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 h-10 ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-700'
          }`}>
  <Video size={20} className="flex-shrink-0" />
  <span className={`transition-opacity duration-300 leading-none font-bold ${
    sidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden'
  }`}>
    {t.liveAttendance}
          </span>
          </button>

          <button
            onClick={() => navigateToPage('student-registration')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 h-10 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
            }`}
          >
            <UserPlus size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none font-bold ${sidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden'}`}>{t.studentRegistration}</span>
          </button>
          <button
            onClick={() => navigateToPage('teacher-reports')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 h-10 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
            }`}
          >
            <BarChart3 size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none font-bold ${sidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden'}`}>{t.attendanceReports}</span>
          </button>
        </div>

        {/* Bottom Section */}
        <div className="space-y-2 border-t border-gray-500 pt-3 mt-auto">
          <div className={`text-xs opacity-75 px-4 mb-2 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 w-full' : 'opacity-0 h-0 overflow-hidden'}`}>
            <p>{t.welcome}</p>
            <p className="font-semibold">Dr. Emre Olca</p>
            <p className="text-xs opacity-60">{t.teacher}</p>
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 h-10 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
            }`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none ${sidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden'}`}>{t.logout}</span>
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
            <p className="font-bold">{t.universityName}</p>
            <p className="text-xs opacity-80">{t.systemName}</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 h-10 ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-700'
          }`}>
            <Video size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none opacity-100 w-full font-bold truncate`}>{t.liveAttendance}</span>
          </div>
          <button
            onClick={() => navigateToPage('student-registration')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 h-10 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
            }`}
          >
            <UserPlus size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none opacity-100 w-full font-bold truncate`}>{t.studentRegistration}</span>
          </button>
          <button
            onClick={() => navigateToPage('teacher-reports')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 h-10 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
            }`}
          >
            <BarChart3 size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none opacity-100 w-full font-bold truncate`}>{t.attendanceReports}</span>
          </button>
        </nav>

        {/* Bottom Section */}
        <div className="space-y-2 border-t border-gray-500 pt-3 mt-auto">
          <div className="text-xs opacity-75 px-4 mb-2">
            <p>{t.welcome}</p>
            <p className="font-semibold">Dr. Emre Olca</p>
            <p className="text-xs opacity-60">{t.teacher}</p>
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 h-10 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
            }`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none opacity-100 w-full`}>{t.logout}</span>
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
            }`}>{t.liveAttendance}</h1>
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
            {/* Course Info - Üstte */}
            <div className={`${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6`}>
              <h2 className={`text-base sm:text-lg font-bold mb-1 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>{t.courseInfo}</h2>
              <p className={`text-xs sm:text-sm mb-4 sm:mb-6 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>{t.courseSubtitle}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {/* Course Selection */}
                <div>
                  <label className={`block text-sm font-bold mb-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>{t.courseLabel}</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                      className={`w-full px-4 py-2.5 rounded-lg border text-left flex items-center justify-between transition-all font-medium ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white hover:border-gray-500'
                          : 'bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400'
                      } focus:ring-2 focus:outline-none`}
                    >
                      <span className="text-sm">{courses.find(c => c.id === selectedCourse)?.id} - {t[courses.find(c => c.id === selectedCourse)?.nameKey as keyof typeof t] || 'Ders seçiniz'}</span>
                      <svg className={`w-4 h-4 transition-transform flex-shrink-0 ${showCourseDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </button>

                    {showCourseDropdown && (
                      <div className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg z-10 ${
                        isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-300'
                      }`}>
                        {courses.map(course => (
                          <button
                            key={course.id}
                            onClick={() => {
                              setSelectedCourse(course.id);
                              setShowCourseDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 transition flex items-center justify-between font-medium text-sm ${
                              selectedCourse === course.id
                                ? 'bg-green-500 text-white'
                                : isDarkMode ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-900'
                            }`}
                          >
                            <span>{course.id} - {t[course.nameKey as keyof typeof t]}</span>
                            {selectedCourse === course.id && <Check size={18} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Automatic Attendance Button */}
                <div className="flex flex-col justify-end">
                  <button 
                    onClick={() => setIsLive(!isLive)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold transition whitespace-nowrap ${
                      isLive
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    <Video size={18} />
                    {isLive ? t.stopAttendance : t.startAttendance}
                  </button>
                </div>

                {/* Manual Attendance Button */}
                <div className="flex flex-col justify-end">
                  <button 
                    onClick={() => setShowManualAttendanceModal(true)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold transition whitespace-nowrap ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                    title="Manual Attendance"
                  >
                    <Users size={18} />
                    {t.manualAttendance}
                  </button>
                </div>

                {/* Status Indicator */}
                <div className="flex flex-col justify-end">
                  {isLive && (
                    <div className={`p-3 rounded-lg text-sm flex items-center gap-2 text-center justify-center ${
                      isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
                    }`}>
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                      {t.liveIndicator}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Kamera Görüntüsü - Altta */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Video Section */}
              <div className="lg:col-span-2">
                <div className={`${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } rounded-lg shadow-lg overflow-hidden`}>
                  <h3 className={`px-4 sm:px-6 pt-4 sm:pt-6 font-bold text-sm sm:text-base ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>{t.cameraView}</h3>

                  {/* Camera View */}
                  <div className="relative p-3 sm:p-6">
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                      {isLive ? (
                        <div className="w-full h-full relative">
                          <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-white font-semibold text-sm">Canlı</span>
                          </div>
                          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Video Feed
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Video size={64} className="text-gray-500 mx-auto mb-4" />
                          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {t.cameraOff}
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {t.startSession}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="px-6 pb-6">
                    {/* Status Message */}
                    {isLive && (
                      <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                        isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
                      }`}>
                        <Check size={18} />
                        {t.faceRecognitionActive}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Attendance List */}
              <div className={`${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-lg shadow-lg p-4 sm:p-6 h-fit lg:sticky lg:top-6`}>
                <h2 className={`text-base sm:text-lg font-bold mb-1 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>{t.instantList}</h2>
                <p className={`text-xs mb-3 sm:mb-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{t.students_enrolled}</p>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {students.map((student, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-lg border-l-4 ${
                        student.status === 'present'
                          ? isDarkMode ? 'bg-green-900/20 border-green-500' : 'bg-green-50 border-green-500'
                          : isDarkMode ? 'bg-red-900/20 border-red-500' : 'bg-red-50 border-red-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            {student.name}
                          </p>
                          {student.id2 && (
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {student.id2}
                            </p>
                          )}
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            %{student.confidence} {t.confidenceRate}
                          </p>
                        </div>
                        {student.status === 'present' ? (
                          <Check size={20} className="text-green-500" />
                        ) : (
                          <X size={20} className="text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className={`mt-6 grid grid-cols-3 gap-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} pt-4`}>
                  <div className="text-center">
                    <p className={`text-2xl font-bold text-green-500`}>2</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.present}</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold text-orange-500`}>0</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.absent}</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold text-blue-500`}>21:33</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.attendanceTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Attendance Modal */}
      {showManualAttendanceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-lg shadow-xl p-6 max-w-md w-full mx-4`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>{t.manualAttendanceTitle}</h2>
              <button
                onClick={() => {
                  setShowManualAttendanceModal(false);
                  setManualStudentId('');
                }}
                className={`p-1 rounded transition ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                <X size={20} className={isDarkMode ? 'text-white' : 'text-gray-800'} />
              </button>
            </div>

            <p className={`text-sm mb-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>{t.manualAttendanceDescription}</p>

            <div className="mb-4">
              <label className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>{t.studentNumber}</label>
              <input
                type="text"
                value={manualStudentId}
                onChange={(e) => setManualStudentId(e.target.value)}
                placeholder="Örn: 2024001"
                className={`w-full px-4 py-2 rounded-lg border transition-all ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-400 focus:border-purple-400'
                } focus:outline-none`}
              />
            </div>

            <div className={`p-3 rounded-lg mb-6 flex items-start gap-2 ${
              isDarkMode ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
            }`}>
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm">{t.manualAttendanceNote}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowManualAttendanceModal(false);
                  setManualStudentId('');
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  console.log("Student added manually:", manualStudentId);
                  setShowManualAttendanceModal(false);
                  setManualStudentId('');
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition text-white ${
                  manualStudentId.trim()
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!manualStudentId.trim()}
              >
                {t.addManualAttendance}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
