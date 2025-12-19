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
  X,
  Video,
  UserPlus,
  BarChart3
} from 'lucide-react';
import Image from 'next/image';

// Translations
const translations = {
  TR: {
    title: "Yoklama Panom",
    subtitle: "Kişisel yoklama kayıtlarınızı görüntüleyin.",
    totalSessions: "Toplam Oturum",
    present: "Var",
    absent: "Yok",
    attendanceRate: "Yoklama Oranı",
    courseAttendance: "Ders Yoklama Durumu",
    sessions: "oturum",
    welcome: "Hoş geldiniz,",
    student: "Öğrenci",
    studentAccount: "Öğrenci Hesabı",
    logOut: "Çıkış Yap",
    liveAttendance: "Canlı Yoklama",
    studentRegistration: "Öğrenci Kayıt",
    attendanceReports: "Yoklama Raporları",
    universityName: "Maltepe Üniversitesi",
    systemName: "Otomatik Yoklama Sistemi",
    instructor: "Öğretmen",
    // Course names for TR
    algorithms: "Algoritma ve Programlama I",
    dataStructures: "Veri Yapıları",
    oop: "Nesne Yönelimli Programlama",
    database: "Veritabanı Yönetim Sistemleri",
  },
  EN: {
    title: "My Attendance Dashboard",
    subtitle: "View your personal attendance records",
    totalSessions: "Total Sessions",
    present: "Present",
    absent: "Absent",
    attendanceRate: "Attendance Rate",
    courseAttendance: "Course Attendance Status",
    sessions: "sessions",
    welcome: "Welcome,",
    student: "Student",
    studentAccount: "Student Account",
    logOut: "Log Out",
    liveAttendance: "Live Attendance",
    studentRegistration: "Student Registration",
    attendanceReports: "Attendance Reports",
    universityName: "Maltepe University",
    systemName: "Automatic Attendance System",
    instructor: "Teacher",
    // Course names for EN
    algorithms: "Algorithms and Programming I",
    dataStructures: "Data Structures",
    oop: "Object Oriented Programming",
    database: "Database Management Systems",
  }
};

// --- MOCK DATA ---
// --- REPLACED WITH DYNAMIC DATA ---
interface CourseReport {
  course_code: string;
  course_name: string;
  total_sessions: number;
  attended_sessions: number;
  attendance_percentage: number;
}

interface ReportSummary {
  total_sessions: number;
  total_present: number;
  total_absent: number;
  overall_percentage: number;
}

interface StudentReportResponse {
  student_id: string;
  summary: ReportSummary;
  courses: CourseReport[];
}

export default function StudentReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<'TR' | 'EN'>('EN');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Dynamic Data State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [reportData, setReportData] = useState<StudentReportResponse | null>(null);
  const [loading, setLoading] = useState(true);

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

    // Load User
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }

    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const currentUserStr = localStorage.getItem('currentUser');
      if (!currentUserStr) return;

      const currentUser = JSON.parse(currentUserStr);
      if (currentUser.role !== 'student') return; // Sadece öğrenciler görebilir

      const res = await fetch(`http://127.0.0.1:5000/api/students/${currentUser.id}/attendance-report`);
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      } else {
        console.error("Failed to fetch report");
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const navigateToPage = (page: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/?page=${page}`;
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
    <div className={`min-h-screen flex transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} hidden lg:flex fixed lg:static max-h-screen lg:max-h-none overflow-y-auto lg:overflow-y-visible transition-all duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'
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
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 h-10 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-700'
              }`}
          >
            <BarChart3 size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none font-bold ${sidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden'
              }`}>
              {t.attendanceReports}
            </span>
          </button>
        </div>

        {/* Bottom Section */}
        <div className="space-y-2 border-t border-gray-500 pt-3 mt-auto">
          <div className={`text-xs opacity-75 px-4 mb-2 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 w-full' : 'opacity-0 h-0 overflow-hidden'}`}>
            <p>{t.welcome}</p>
            <p className="font-semibold">{currentUser ? `${currentUser.name} ${currentUser.surname}` : '...'}</p>
            <p className="text-xs opacity-60">{t.student}</p>
          </div>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 h-10 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
              }`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none ${sidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden'}`}>{t.logOut}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden fixed h-full w-48 transition-transform duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'
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
          {/* Student only sees reports */}
          <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 h-10 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-700'
            }`}>
            <BarChart3 size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none opacity-100 w-full font-bold truncate`}>{t.attendanceReports}</span>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="space-y-2 border-t border-gray-500 pt-3 mt-auto">
          <div className="text-xs opacity-75 px-4 mb-2">
            <p>{t.welcome}</p>
            <p className="font-semibold">{currentUser ? `${currentUser.name} ${currentUser.surname}` : '...'}</p>
            <p className="text-xs opacity-60">{t.student}</p>
          </div>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 h-10 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
              }`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none opacity-100 w-full`}>{t.logOut}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border-b px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg transition ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
            >
              <Menu size={20} className={`sm:w-6 sm:h-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
            </button>
            <h1 className={`text-lg sm:text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>{t.title}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleLanguage}
              className={`p-1.5 sm:p-2 rounded-lg transition flex items-center gap-1 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              title="Change Language"
            >
              <Globe size={16} className={`sm:w-5 sm:h-5 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
              <span className={`text-xs sm:text-sm font-medium hidden sm:inline ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{language}</span>
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-1.5 sm:p-2 rounded-lg transition ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
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
              {loading ? (
                <p>Loading...</p>
              ) : reportData ? (
                <>
                  <div className={`${darkCardBg} p-5 lg:p-6 rounded-2xl shadow-lg border ${borderColor} flex items-center gap-5 transition-transform hover:scale-[1.01]`}>
                    <div className={`p-3 lg:p-4 rounded-xl bg-purple-900/30 text-purple-300`}>
                      <BookOpen size={24} className="lg:w-7 lg:h-7" />
                    </div>
                    <div>
                      <h3 className={`text-xs lg:text-sm font-medium ${textSecondary} mb-1`}>{t.totalSessions}</h3>
                      <p className={`text-2xl lg:text-3xl font-bold ${textPrimary}`}>{reportData.summary.total_sessions}</p>
                    </div>
                  </div>

                  <div className={`${darkCardBg} p-5 lg:p-6 rounded-2xl shadow-lg border ${borderColor} flex items-center gap-5 transition-transform hover:scale-[1.01]`}>
                    <div className={`p-3 lg:p-4 rounded-xl bg-green-900/30 text-green-300`}>
                      <CheckCircle2 size={24} className="lg:w-7 lg:h-7" />
                    </div>
                    <div>
                      <h3 className={`text-xs lg:text-sm font-medium ${textSecondary} mb-1`}>{t.present}</h3>
                      <p className={`text-2xl lg:text-3xl font-bold ${textPrimary}`}>{reportData.summary.total_present}</p>
                    </div>
                  </div>

                  <div className={`${darkCardBg} p-5 lg:p-6 rounded-2xl shadow-lg border ${borderColor} flex items-center gap-5 transition-transform hover:scale-[1.01]`}>
                    <div className={`p-3 lg:p-4 rounded-xl bg-red-900/30 text-red-300`}>
                      <XCircle size={24} className="lg:w-7 lg:h-7" />
                    </div>
                    <div>
                      <h3 className={`text-xs lg:text-sm font-medium ${textSecondary} mb-1`}>{t.absent}</h3>
                      <p className={`text-2xl lg:text-3xl font-bold ${textPrimary}`}>{reportData.summary.total_absent}</p>
                    </div>
                  </div>

                  <div className={`${darkCardBg} p-5 lg:p-6 rounded-2xl shadow-lg border ${borderColor} flex items-center gap-5 transition-transform hover:scale-[1.01]`}>
                    <div className={`p-3 lg:p-4 rounded-xl bg-blue-900/30 text-blue-300`}>
                      <TrendingUp size={24} className="lg:w-7 lg:h-7" />
                    </div>
                    <div>
                      <h3 className={`text-xs lg:text-sm font-medium ${textSecondary} mb-1`}>{t.attendanceRate}</h3>
                      <p className={`text-2xl lg:text-3xl font-bold ${textPrimary}`}>%{reportData.summary.overall_percentage}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p>No data available</p>
              )}
            </div>

            {/* Course List */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <BookOpen size={20} className={accentColor} />
                <h3 className={`text-lg lg:text-xl font-bold ${textPrimary}`}>{t.courseAttendance}</h3>
              </div>

              <div className={`${darkCardBg} rounded-2xl shadow-lg border ${borderColor} overflow-hidden`}>
                {reportData?.courses.map((course, index) => (
                  <div key={index} className={`p-5 lg:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${index !== reportData.courses.length - 1 ? `border-b ${borderColor}` : ''}`}>

                    <div className="flex-1">
                      <h4 className={`font-bold ${textPrimary} text-base lg:text-lg mb-1`}>
                        <span className={accentColor}>{course.course_code}</span> - {course.course_name}
                      </h4>
                      <p className={`text-sm ${textSecondary} font-medium`}>
                        {course.attended_sessions} / {course.total_sessions} {t.sessions}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-1/2 xl:w-1/3">
                      <div className={`w-full h-2.5 lg:h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full overflow-hidden`}>
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${course.attendance_percentage >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${course.attendance_percentage}%` }}
                        ></div>
                      </div>
                      <span className={`font-bold text-base lg:text-lg w-12 text-right ${course.attendance_percentage >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                        %{course.attendance_percentage}
                      </span>
                    </div>

                  </div>
                ))}
                {(!reportData || reportData.courses.length === 0) && !loading && (
                  <div className="p-6 text-center text-gray-500">
                    No course records found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
