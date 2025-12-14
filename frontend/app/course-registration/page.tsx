"use client";

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
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
  Users,
  Plus, // YENİ: Artı ikonu eklendi
  X     // YENİ: Kapatma ikonu
} from 'lucide-react';
import Image from 'next/image';

// Translations
const translations = {
  TR: {
    title: "Kurs Kayıt",
    subtitle: "Yeni kurs oluşturun ve yönetin",
    courseCode: "Kurs Kodu",
    courseName: "Kurs Adı",
    courseDescription: "Kurs Açıklaması",
    semester: "Dönem",
    academicYear: "Akademik Yıl",
    credits: "Kredi",
    instructor: "Öğretmen",
    classroom: "Sınıf / Derslik", // GÜNCELLENDİ
    selectSemester: "Dönem seçin",
    selectAcademicYear: "Akademik yıl seçin",
    registerCourse: "Kursu Kaydet",
    registering: "Kaydediliyor...",
    clearForm: "Formu Temizle",
    success: "Kurs başarıyla kaydedildi!",
    welcome: "Hoş geldiniz,",
    teacherAccount: "Öğretmen Hesabı",
    logOut: "Çıkış Yap",
    required: "Zorunlu",
    courseCodePlaceholder: "örn: SE342",
    courseNamePlaceholder: "Yazılım Mühendisliği",
    courseDescriptionPlaceholder: "Kurs açıklaması...",
    courseCodeError: "Kurs kodu sadece harf ve rakam içermelidir",
    creditsError: "Kredi pozitif bir sayı olmalıdır",
    quickAccess: "Hızlı Erişim",
    studentRegistration: "Öğrenci Kayıt",
    courseRegistration: "Kurs Kayıt",
    courseEnrollment: "Kursa Öğrenci Ekle",
    attendanceReports: "Yoklama Raporları",
    liveAttendance: "Canlı Yoklama",
    universityName: "Maltepe Üniversitesi",
    systemName: "Otomatik Yoklama Sistemi",
    // YENİ SINIF EKLEME ÇEVİRİLERİ
    addClassroom: "Yeni Sınıf Ekle",
    classroomCode: "Sınıf Kodu",
    capacity: "Kapasite",
    saveClassroom: "Sınıfı Kaydet",
    classroomSuccess: "Sınıf eklendi!",
    classroomCodePlaceholder: "örn: B-204",
  },
  EN: {
    title: "Course Registration",
    subtitle: "Create and manage new courses",
    courseCode: "Course Code",
    courseName: "Course Name",
    courseDescription: "Course Description",
    semester: "Semester",
    academicYear: "Academic Year",
    credits: "Credits",
    instructor: "Instructor",
    classroom: "Classroom", // GÜNCELLENDİ
    selectSemester: "Select semester",
    selectAcademicYear: "Select academic year",
    registerCourse: "Register Course",
    registering: "Registering...",
    clearForm: "Clear Form",
    success: "Course registered successfully!",
    welcome: "Welcome,",
    teacherAccount: "Teacher Account",
    logOut: "Log Out",
    required: "Required",
    courseCodePlaceholder: "e.g., SE342",
    courseNamePlaceholder: "Software Engineering",
    courseDescriptionPlaceholder: "Course description...",
    courseCodeError: "Course code must contain only letters and numbers",
    creditsError: "Credits must be a positive number",
    quickAccess: "Quick Access",
    studentRegistration: "Student Registration",
    courseRegistration: "Course Registration",
    courseEnrollment: "Enroll Students",
    attendanceReports: "Attendance Reports",
    liveAttendance: "Live Attendance",
    universityName: "Maltepe University",
    systemName: "Automatic Attendance System",
    // NEW CLASSROOM TRANSLATIONS
    addClassroom: "Add New Classroom",
    classroomCode: "Classroom Code",
    capacity: "Capacity",
    saveClassroom: "Save Classroom",
    classroomSuccess: "Classroom added!",
    classroomCodePlaceholder: "e.g., B-204",
  }
};

export default function CourseRegistrationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<'TR' | 'EN'>('EN');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Data for dropdowns
  const [instructors, setInstructors] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);

  // States for Course Form
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    courseDescription: '',
    semester: '',
    academicYear: '',
    credits: '',
    instructor_id: '',
    classroom_id: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // States for New Classroom Modal (YENİ)
  const [showClassroomModal, setShowClassroomModal] = useState(false);
  const [newClassroom, setNewClassroom] = useState({ code: '', capacity: '' });
  const [classroomStatus, setClassroomStatus] = useState<string | null>(null);

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

    fetchInstructors();
    fetchClassrooms();
  }, []);

  const fetchInstructors = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/instructors');
      if (res.ok) {
        const data = await res.json();
        setInstructors(data);
      }
    } catch (error) {
      console.error("Failed to fetch instructors", error);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/classrooms');
      if (res.ok) {
        const data = await res.json();
        setClassrooms(data);
      }
    } catch (error) {
      console.error("Failed to fetch classrooms", error);
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

  const colors = {
    bgMain: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    bgCard: isDarkMode ? 'bg-gray-800' : 'bg-white',
    textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    textPurple: isDarkMode ? 'text-purple-400' : 'text-purple-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    accentPurple: 'bg-purple-600'
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // --- YENİ SINIF EKLEME FONKSİYONU ---
  const handleCreateClassroom = async () => {
    if (!newClassroom.code || !newClassroom.capacity) {
      setClassroomStatus("error"); 
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/classrooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classroom_code: newClassroom.code,
          capacity: parseInt(newClassroom.capacity)
        })
      });

      if (response.ok) {
        const createdClassroom = await response.json();
        // Listeyi yenile
        fetchClassrooms();
        // Yeni ekleneni formda seçili yap
        setFormData(prev => ({ ...prev, classroom_id: createdClassroom.id }));
        // Modalı kapat ve temizle
        setClassroomStatus("success");
        setTimeout(() => {
          setShowClassroomModal(false);
          setNewClassroom({ code: '', capacity: '' });
          setClassroomStatus(null);
        }, 1000);
      } else {
        alert("Failed to add classroom");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.courseCode.trim()) {
      newErrors.courseCode = `${t.courseCode} ${t.required.toLowerCase()}`;
    } else if (!/^[A-Za-z0-9]+$/.test(formData.courseCode)) {
      newErrors.courseCode = t.courseCodeError;
    }

    if (!formData.courseName.trim()) {
      newErrors.courseName = `${t.courseName} ${t.required.toLowerCase()}`;
    }

    if (!formData.credits) {
      newErrors.credits = `${t.credits} ${t.required.toLowerCase()}`;
    } else if (parseInt(formData.credits) < 1) {
      newErrors.credits = t.creditsError;
    }

    if (!formData.instructor_id) {
      newErrors.instructor_id = `${t.instructor} ${t.required.toLowerCase()}`;
    }

    if (!formData.semester) {
      newErrors.semester = `${t.semester} ${t.required.toLowerCase()}`;
    }

    if (!formData.academicYear) {
      newErrors.academicYear = `${t.academicYear} ${t.required.toLowerCase()}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const response = await fetch('http://localhost:5001/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_code: formData.courseCode,
          course_name: formData.courseName,
          credits: parseInt(formData.credits),
          classroom_id: formData.classroom_id || null, 
          instructor_id: formData.instructor_id, 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = data.error || 'Failed to register course';
        
        if (errorMessage.includes("Course code already exists")) {
            errorMessage = language === 'TR' 
                ? "Bu kurs kodu zaten kayıtlı!" 
                : "Course code already exists!";
        } else if (errorMessage.includes("Course name already exists")) {
            errorMessage = language === 'TR' 
                ? "Bu kurs adı zaten kullanılıyor!" 
                : "Course name already exists!";
        } else if (errorMessage.includes("Missing required fields")) {
            errorMessage = language === 'TR'
                ? "Lütfen zorunlu alanları doldurun."
                : "Please fill in all required fields.";
        } else if (errorMessage.includes("positive integer")) {
            errorMessage = language === 'TR'
                ? "Kredi pozitif bir sayı olmalıdır."
                : "Credits must be a positive number.";
        } else {
            errorMessage = language === 'TR' 
                ? "Bir hata oluştu: " + errorMessage 
                : "An error occurred: " + errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      console.log('Course registered:', formData);
      setSubmitSuccess(true);

      setTimeout(() => {
        setFormData({
          courseCode: '',
          courseName: '',
          courseDescription: '',
          semester: '',
          academicYear: '',
          credits: '',
          instructor_id: '',
          classroom_id: ''
        });
        setSubmitSuccess(false);
      }, 2000);

    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
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

  // Generate academic years
  const currentYear = new Date().getFullYear();
  const academicYears = [];
  for (let i = -2; i <= 2; i++) {
    academicYears.push(`${currentYear + i}-${currentYear + i + 1}`);
  }

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
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} hidden lg:flex fixed lg:static h-full lg:h-auto transition-all duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'
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
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 h-10 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
              }`}
          >
            <Video size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none font-bold ${sidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden'
              }`}>
              {t.liveAttendance}
            </span>
          </button>

          <button
            onClick={() => navigateToPage('student-registration')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 h-10 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
              }`}
          >
            <UserPlus size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none font-bold ${sidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden'
              }`}>
              {t.studentRegistration}
            </span>
          </button>

          <button
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 h-10 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-700'
              }`}
          >
            <BookOpen size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none font-bold ${sidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden'
              }`}>
              {t.courseRegistration}
            </span>
          </button>

          <button
            onClick={() => navigateToPage('course-enrollment')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 h-10 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
              }`}
          >
            <Users size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none font-bold ${sidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden'
              }`}>
              {t.courseEnrollment}
            </span>
          </button>

          <button
            onClick={() => navigateToPage('teacher-reports')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 h-10 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
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
            <p className="text-xs opacity-60">{t.teacherAccount}</p>
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
          <button
            onClick={() => navigateToPage('teacher-live-attendance')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 h-10 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
              }`}
          >
            <Video size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none opacity-100 w-full font-bold truncate`}>{t.liveAttendance}</span>
          </button>
          <button
            onClick={() => navigateToPage('student-registration')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 h-10 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
              }`}
          >
            <UserPlus size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none opacity-100 w-full font-bold truncate`}>{t.studentRegistration}</span>
          </button>
          <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 h-10 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-700'
            }`}>
            <BookOpen size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none opacity-100 w-full font-bold truncate`}>{t.courseRegistration}</span>
          </div>
          <button
            onClick={() => navigateToPage('course-enrollment')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 h-10 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
              }`}
          >
            <Users size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none opacity-100 w-full font-bold truncate`}>{t.courseEnrollment}</span>
          </button>
          <button
            onClick={() => navigateToPage('teacher-reports')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 h-10 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
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
            <p className="text-xs opacity-60">{t.teacherAccount}</p>
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
            {/* Header */}
            <div className="mb-6">
              <h2 className={`text-2xl font-bold ${colors.textPrimary} mb-1`}>{t.title}</h2>
              <p className={`text-sm ${colors.textSecondary}`}>{t.subtitle}</p>
            </div>

            {/* Error Message */}
            {apiError && (
              <div className={`mb-6 ${colors.bgCard} border ${isDarkMode ? 'border-red-500/50' : 'border-red-500'} rounded-lg p-4 flex items-center gap-3`}>
                <XCircle className="text-red-400" size={20} />
                <p className="text-red-400 font-medium">{apiError}</p>
              </div>
            )}

            {/* Success Message */}
            {submitSuccess && (
              <div className={`mb-6 ${colors.bgCard} border ${isDarkMode ? 'border-green-500/50' : 'border-green-500'} rounded-lg p-4 flex items-center gap-3`}>
                <CheckCircle2 className="text-green-400" size={20} />
                <p className="text-green-400 font-medium">{t.success}</p>
              </div>
            )}

            {/* Registration Form */}
            <div className={`${colors.bgCard} border ${colors.border} rounded-lg shadow-lg p-6`}>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Course Code */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                      {t.courseCode} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="courseCode"
                      value={formData.courseCode}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${errors.courseCode
                        ? `${isDarkMode ? 'bg-gray-700' : 'bg-red-50'} border-2 border-red-500 ${colors.textPrimary}`
                        : `${colors.bgMain} border ${colors.border} ${colors.textPrimary} placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500`
                        }`}
                      placeholder={t.courseCodePlaceholder}
                      required
                    />
                    {errors.courseCode && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <XCircle size={12} />
                        {errors.courseCode}
                      </p>
                    )}
                  </div>

                  {/* Course Name */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                      {t.courseName} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="courseName"
                      value={formData.courseName}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${errors.courseName
                        ? `${isDarkMode ? 'bg-gray-700' : 'bg-red-50'} border-2 border-red-500 ${colors.textPrimary}`
                        : `${colors.bgMain} border ${colors.border} ${colors.textPrimary} placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500`
                        }`}
                      placeholder={t.courseNamePlaceholder}
                      required
                    />
                    {errors.courseName && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <XCircle size={12} />
                        {errors.courseName}
                      </p>
                    )}
                  </div>

                  {/* Credits */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                      {t.credits} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      name="credits"
                      min="1" // ENGELLENDİ: HTML5 seviyesinde negatif giriş
                      value={formData.credits}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${errors.credits
                        ? `${isDarkMode ? 'bg-gray-700' : 'bg-red-50'} border-2 border-red-500 ${colors.textPrimary}`
                        : `${colors.bgMain} border ${colors.border} ${colors.textPrimary} placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500`
                        }`}
                      placeholder="3"
                      required
                    />
                    {errors.credits && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <XCircle size={12} />
                        {errors.credits}
                      </p>
                    )}
                  </div>

                  {/* Instructor */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                      {t.instructor} <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="instructor_id"
                      value={formData.instructor_id}
                      onChange={handleInputChange}
                      required
                      className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${errors.instructor_id 
                        ? `${isDarkMode ? 'bg-gray-700' : 'bg-red-50'} border-2 border-red-500 ${colors.textPrimary}`
                        : `${colors.bgMain} border ${colors.border} ${colors.textPrimary} focus:ring-purple-500 focus:border-purple-500`
                      }`}
                    >
                      <option value="">Select Instructor</option>
                      {instructors.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                          {inst.name} ({inst.title})
                        </option>
                      ))}
                    </select>
                    {errors.instructor_id && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <XCircle size={12} />
                        {errors.instructor_id}
                      </p>
                    )}
                  </div>

                  {/* Classroom with Quick Add Button */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                      {t.classroom}
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="classroom_id"
                        value={formData.classroom_id}
                        onChange={handleInputChange}
                        className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${`${colors.bgMain} border ${colors.border} ${colors.textPrimary} focus:ring-purple-500 focus:border-purple-500`
                          }`}
                      >
                        <option value="">Select Classroom</option>
                        {classrooms.map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.code} (Cap: {room.capacity})
                          </option>
                        ))}
                      </select>
                      {/* YENİ SINIF EKLE BUTONU */}
                      <button 
                        type="button" 
                        onClick={() => setShowClassroomModal(true)}
                        className={`p-3 rounded-lg border ${colors.border} hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-center min-w-[3rem]`}
                        title={t.addClassroom}
                      >
                        <Plus size={20} className={colors.textPrimary} />
                      </button>
                    </div>
                  </div>

                  {/* Semester */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                      {t.semester} <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${errors.semester
                        ? `${isDarkMode ? 'bg-gray-700' : 'bg-red-50'} border-2 border-red-500 ${colors.textPrimary}`
                        : `${colors.bgMain} border ${colors.border} ${colors.textPrimary} focus:ring-purple-500 focus:border-purple-500`
                        }`}
                      required
                    >
                      <option value="">{t.selectSemester}</option>
                      <option value="Fall">Fall</option>
                      <option value="Spring">Spring</option>
                      <option value="Summer">Summer</option>
                    </select>
                    {errors.semester && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <XCircle size={12} />
                        {errors.semester}
                      </p>
                    )}
                  </div>

                  {/* Academic Year */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                      {t.academicYear} <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="academicYear"
                      value={formData.academicYear}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${errors.academicYear
                        ? `${isDarkMode ? 'bg-gray-700' : 'bg-red-50'} border-2 border-red-500 ${colors.textPrimary}`
                        : `${colors.bgMain} border ${colors.border} ${colors.textPrimary} focus:ring-purple-500 focus:border-purple-500`
                        }`}
                      required
                    >
                      <option value="">{t.selectAcademicYear}</option>
                      {academicYears.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    {errors.academicYear && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <XCircle size={12} />
                        {errors.academicYear}
                      </p>
                    )}
                  </div>

                </div>

                {/* Course Description */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                    {t.courseDescription}
                  </label>
                  <textarea
                    name="courseDescription"
                    value={formData.courseDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${colors.bgMain} border ${colors.border} ${colors.textPrimary} placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500`}
                    placeholder={t.courseDescriptionPlaceholder}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 md:flex-none md:px-8 py-3 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${colors.accentPurple
                      } hover:opacity-90`}
                  >
                    {isSubmitting ? t.registering : t.registerCourse}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        courseCode: '',
                        courseName: '',
                        courseDescription: '',
                        semester: '',
                        academicYear: '',
                        credits: '',
                        instructor_id: '',
                        classroom_id: ''
                      });
                      setErrors({});
                    }}
                    className={`px-6 py-3 border ${colors.border} ${colors.textSecondary} font-semibold rounded-lg transition-all hover:${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
                  >
                    {t.clearForm}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>

      {/* --- ADD CLASSROOM MODAL --- */}
      {showClassroomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${colors.bgCard} rounded-xl shadow-2xl max-w-md w-full p-6 relative border ${colors.border}`}>
            <button 
              onClick={() => setShowClassroomModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
            >
              <X size={24} />
            </button>
            
            <h3 className={`text-xl font-bold mb-4 ${colors.textPrimary}`}>{t.addClassroom}</h3>
            
            {classroomStatus === 'success' ? (
              <div className="text-green-500 flex flex-col items-center justify-center py-6 animate-fade-in">
                <CheckCircle2 size={48} className="mb-2" />
                <p className="font-semibold">{t.classroomSuccess}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${colors.textPrimary}`}>{t.classroomCode}</label>
                  <input 
                    type="text" 
                    value={newClassroom.code}
                    onChange={(e) => setNewClassroom({...newClassroom, code: e.target.value})}
                    className={`w-full p-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${colors.border} ${colors.bgMain} ${colors.textPrimary} focus:ring-purple-500 focus:border-purple-500`}
                    placeholder={t.classroomCodePlaceholder}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${colors.textPrimary}`}>{t.capacity}</label>
                  <input 
                    type="number" 
                    value={newClassroom.capacity}
                    onChange={(e) => setNewClassroom({...newClassroom, capacity: e.target.value})}
                    className={`w-full p-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${colors.border} ${colors.bgMain} ${colors.textPrimary} focus:ring-purple-500 focus:border-purple-500`}
                    placeholder="50"
                  />
                </div>
                {classroomStatus === 'error' && (
                  <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm flex items-center gap-2">
                    <XCircle size={16} />
                    <span>Please fill in all fields correctly.</span>
                  </div>
                )}
                
                <button 
                  onClick={handleCreateClassroom}
                  className={`w-full py-3 rounded-lg font-bold text-white shadow-md hover:shadow-lg transition-all ${colors.accentPurple} hover:opacity-90`}
                >
                  {t.saveClassroom}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}