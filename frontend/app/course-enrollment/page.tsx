"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users,
  Globe, 
  Moon, 
  Sun,
  LogOut, 
  Menu, 
  CheckCircle2,
  XCircle,
  UserPlus,
  Video,
  BarChart3,
  BookOpen,
  Search,
  Check,
  X
} from 'lucide-react';
import Image from 'next/image';

// Translations
const translations = {
  TR: {
    title: "Kursa Öğrenci Ekle",
    subtitle: "Kayıtlı öğrencileri kurslara ekleyin",
    selectCourse: "Kurs Seçin",
    searchStudents: "Öğrenci Ara",
    searchPlaceholder: "Öğrenci numarası, ad veya soyad ile ara...",
    studentNumber: "Öğrenci Numarası",
    name: "Ad Soyad",
    department: "Bölüm",
    class: "Sınıf",
    enrolled: "Kayıtlı",
    notEnrolled: "Kayıtlı Değil",
    enrollSelected: "Seçili Öğrencileri Kaydet",
    enrolling: "Kaydediliyor...",
    success: "Öğrenciler başarıyla kursa kaydedildi!",
    noCourseSelected: "Lütfen bir kurs seçin",
    noStudentsFound: "Öğrenci bulunamadı",
    selectAll: "Tümünü Seç",
    deselectAll: "Seçimi Kaldır",
    welcome: "Hoş geldiniz,",
    instructor: "Öğretmen",
    teacherAccount: "Öğretmen Hesabı",
    logOut: "Çıkış Yap",
    quickAccess: "Hızlı Erişim",
    studentRegistration: "Öğrenci Kayıt",
    courseRegistration: "Kurs Kayıt",
    courseEnrollment: "Kursa Öğrenci Ekle",
    attendanceReports: "Yoklama Raporları",
    liveAttendance: "Canlı Yoklama",
    universityName: "Maltepe Üniversitesi",
    systemName: "Otomatik Yoklama Sistemi",
    selectedCount: "Seçili",
    students: "öğrenci",
  },
  EN: {
    title: "Enroll Students to Course",
    subtitle: "Add registered students to courses",
    selectCourse: "Select Course",
    searchStudents: "Search Students",
    searchPlaceholder: "Search by student number, name or surname...",
    studentNumber: "Student Number",
    name: "Name",
    department: "Department",
    class: "Class",
    enrolled: "Enrolled",
    notEnrolled: "Not Enrolled",
    enrollSelected: "Enroll Selected Students",
    enrolling: "Enrolling...",
    success: "Students enrolled successfully!",
    noCourseSelected: "Please select a course",
    noStudentsFound: "No students found",
    selectAll: "Select All",
    deselectAll: "Deselect All",
    welcome: "Welcome,",
    instructor: "Instructor",
    teacherAccount: "Teacher Account",
    logOut: "Log Out",
    quickAccess: "Quick Access",
    studentRegistration: "Student Registration",
    courseRegistration: "Course Registration",
    courseEnrollment: "Enroll Students",
    attendanceReports: "Attendance Reports",
    liveAttendance: "Live Attendance",
    universityName: "Maltepe University",
    systemName: "Automatic Attendance System",
    selectedCount: "Selected",
    students: "students",
  }
};

// Mock data - In real app, this would come from API
const mockCourses = [
  { id: '1', code: 'SE342', name: 'Software Engineering', semester: 'Fall', academicYear: '2024-2025' },
  { id: '2', code: 'CS101', name: 'Introduction to Computer Science', semester: 'Fall', academicYear: '2024-2025' },
  { id: '3', code: 'MATH201', name: 'Calculus II', semester: 'Spring', academicYear: '2024-2025' },
];

const mockStudents = [
  { id: '1', studentNumber: '2024001', name: 'Ahmet', surname: 'Yılmaz', department: 'CSE', class: '1' },
  { id: '2', studentNumber: '2024002', name: 'Ayşe', surname: 'Demir', department: 'CSE', class: '1' },
  { id: '3', studentNumber: '2024003', name: 'Mehmet', surname: 'Kaya', department: 'EE', class: '2' },
  { id: '4', studentNumber: '2024004', name: 'Fatma', surname: 'Şahin', department: 'CSE', class: '1' },
  { id: '5', studentNumber: '2024005', name: 'Ali', surname: 'Çelik', department: 'ME', class: '3' },
  { id: '6', studentNumber: '2024006', name: 'Zeynep', surname: 'Arslan', department: 'CSE', class: '2' },
];

export default function CourseEnrollmentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<'TR' | 'EN'>('EN');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const colors = {
    bgMain: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    bgCard: isDarkMode ? 'bg-gray-800' : 'bg-white',
    textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    textPurple: isDarkMode ? 'text-purple-400' : 'text-purple-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    accentPurple: 'bg-purple-600'
  };

  const filteredStudents = mockStudents.filter(student => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      student.studentNumber.toLowerCase().includes(query) ||
      student.name.toLowerCase().includes(query) ||
      student.surname.toLowerCase().includes(query) ||
      `${student.name} ${student.surname}`.toLowerCase().includes(query)
    );
  });

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map(s => s.id)));
    }
  };

  const handleEnroll = async () => {
    if (!selectedCourse) {
      alert(t.noCourseSelected);
      return;
    }

    if (selectedStudents.size === 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    setTimeout(() => {
      console.log('Enrolling students:', {
        courseId: selectedCourse,
        studentIds: Array.from(selectedStudents)
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSelectedStudents(new Set());
        setSubmitSuccess(false);
      }, 2000);
    }, 1500);
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
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} hidden lg:flex fixed lg:static h-full lg:h-auto transition-all duration-300 ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-600'
      } text-white flex-col p-4 z-50 max-h-screen lg:max-h-none overflow-y-auto lg:overflow-y-visible`}>
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
            onClick={() => navigateToPage('teacher-live-attendance')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 h-10 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
            }`}
          >
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
            <span className={`transition-opacity duration-300 leading-none font-bold ${
              sidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden'
            }`}>
              {t.studentRegistration}
            </span>
          </button>

          <button
            onClick={() => navigateToPage('course-registration')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 h-10 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
            }`}
          >
            <BookOpen size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none font-bold ${
              sidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden'
            }`}>
              {t.courseRegistration}
            </span>
          </button>

          <button
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 h-10 ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-700'
            }`}
          >
            <Users size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none font-bold ${
              sidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden'
            }`}>
              {t.courseEnrollment}
            </span>
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
            <p className="text-xs opacity-60">{t.instructor}</p>
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 h-10 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
            }`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none ${sidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden'}`}>{t.logOut}</span>
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
          <button
            onClick={() => navigateToPage('teacher-live-attendance')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 h-10 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
            }`}
          >
            <Video size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none opacity-100 w-full font-bold truncate`}>{t.liveAttendance}</span>
          </button>
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
            onClick={() => navigateToPage('course-registration')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 h-10 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
            }`}
          >
            <BookOpen size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none opacity-100 w-full font-bold truncate`}>{t.courseRegistration}</span>
          </button>
          <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 h-10 ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-700'
          }`}>
            <Users size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none opacity-100 w-full font-bold truncate`}>{t.courseEnrollment}</span>
          </div>
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
            <p className="text-xs opacity-60">{t.instructor}</p>
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 h-10 ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
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
            {/* Header */}
            <div className="mb-6">
              <h2 className={`text-2xl font-bold ${colors.textPrimary} mb-1`}>{t.title}</h2>
              <p className={`text-sm ${colors.textSecondary}`}>{t.subtitle}</p>
            </div>

            {/* Success Message */}
            {submitSuccess && (
              <div className={`mb-6 ${colors.bgCard} border ${isDarkMode ? 'border-green-500/50' : 'border-green-500'} rounded-lg p-4 flex items-center gap-3`}>
                <CheckCircle2 className="text-green-400" size={20} />
                <p className="text-green-400 font-medium">{t.success}</p>
              </div>
            )}

            {/* Course Selection */}
            <div className={`${colors.bgCard} border ${colors.border} rounded-lg shadow-lg p-6 mb-6`}>
              <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                {t.selectCourse} <span className="text-red-400">*</span>
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${colors.bgMain} border ${colors.border} ${colors.textPrimary} focus:ring-purple-500 focus:border-purple-500`}
              >
                <option value="">{t.selectCourse}</option>
                {mockCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name} ({course.semester} {course.academicYear})
                  </option>
                ))}
              </select>
            </div>

            {/* Search and Student List */}
            {selectedCourse && (
              <div className={`${colors.bgCard} border ${colors.border} rounded-lg shadow-lg p-6`}>
                {/* Search Bar */}
                <div className="mb-6">
                  <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                    {t.searchStudents}
                  </label>
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${colors.textSecondary}`} size={20} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className={`w-full pl-10 rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${colors.bgMain} border ${colors.border} ${colors.textPrimary} placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500`}
                    />
                  </div>
                </div>

                {/* Select All Button */}
                {filteredStudents.length > 0 && (
                  <div className="mb-4 flex items-center justify-between">
                    <button
                      onClick={handleSelectAll}
                      className={`text-sm px-4 py-2 rounded-lg border ${colors.border} ${colors.textSecondary} hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} transition`}
                    >
                      {selectedStudents.size === filteredStudents.length ? t.deselectAll : t.selectAll}
                    </button>
                    <span className={`text-sm ${colors.textSecondary}`}>
                      {t.selectedCount}: {selectedStudents.size} {t.students}
                    </span>
                  </div>
                )}

                {/* Student List */}
                {filteredStudents.length === 0 ? (
                  <div className={`text-center py-12 ${colors.textSecondary}`}>
                    <Users size={48} className="mx-auto mb-4 opacity-50" />
                    <p>{t.noStudentsFound}</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredStudents.map(student => {
                      const isSelected = selectedStudents.has(student.id);
                      return (
                        <div
                          key={student.id}
                          onClick={() => handleSelectStudent(student.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? `${isDarkMode ? 'border-purple-500 bg-purple-900/20' : 'border-purple-500 bg-purple-50'}`
                              : `${colors.border} ${colors.bgMain} hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isSelected
                                  ? 'border-purple-500 bg-purple-500'
                                  : `${colors.border}`
                              }`}>
                                {isSelected && <Check size={16} className="text-white" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-4">
                                  <span className={`font-semibold ${colors.textPrimary}`}>
                                    {student.studentNumber}
                                  </span>
                                  <span className={`font-medium ${colors.textPrimary}`}>
                                    {student.name} {student.surname}
                                  </span>
                                </div>
                                <div className={`text-sm mt-1 ${colors.textSecondary}`}>
                                  {student.department} - {t.class} {student.class}
                                </div>
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${
                              isSelected
                                ? 'bg-green-500/20 text-green-400'
                                : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} ${colors.textSecondary}`
                            }`}>
                              {isSelected ? t.enrolled : t.notEnrolled}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Enroll Button */}
                {selectedStudents.size > 0 && (
                  <div className="mt-6 pt-6 border-t ${colors.border}">
                    <button
                      onClick={handleEnroll}
                      disabled={isSubmitting}
                      className={`w-full py-3 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                        colors.accentPurple
                      } hover:opacity-90`}
                    >
                      {isSubmitting ? t.enrolling : `${t.enrollSelected} (${selectedStudents.size})`}
                    </button>
                  </div>
                )}
              </div>
            )}

            {!selectedCourse && (
              <div className={`${colors.bgCard} border ${colors.border} rounded-lg shadow-lg p-12 text-center`}>
                <BookOpen size={48} className={`mx-auto mb-4 ${colors.textSecondary} opacity-50`} />
                <p className={colors.textSecondary}>{t.noCourseSelected}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


