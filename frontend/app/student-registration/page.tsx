"use client";

import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Globe,
  Moon,
  Sun,
  LogOut,
  Menu,
  Upload,
  Camera,
  CheckCircle2,
  XCircle,
  FileText,
  Video,
  BarChart3,
  BookOpen,
  Users
} from 'lucide-react';
import Image from 'next/image';

// Translations
const translations = {
  TR: {
    title: "Öğrenci Kayıt",
    subtitle: "Yoklama sistemine yeni öğrenci kaydedin",
    editTitle: "Öğrenci Düzenle", 
    editSubtitle: "Mevcut öğrenci bilgilerini güncelleyin",
    studentPhoto: "Öğrenci Fotoğrafı",
    studentNumber: "Öğrenci Numarası",
    name: "Ad",
    surname: "Soyad",
    department: "Bölüm",
    class: "Sınıf",
    email: "E-posta",
    phone: "Telefon",
    selectDepartment: "Bölüm seçin",
    selectClass: "Sınıf seçin",
    clickToUpload: "Fotoğraf yüklemek için tıklayın",
    noPhoto: "Fotoğraf yok",
    registerStudent: "Öğrenciyi Kaydet",
    registering: "Kaydediliyor...",
    updateStudent: "Öğrenciyi Güncelle",
    updating: "Güncelleniyor...",
    clearForm: "Formu Temizle / İptal",
    success: "İşlem başarıyla tamamlandı!",
    welcome: "Hoş geldiniz,",
    instructor: "Öğretmen",
    teacherAccount: "Öğretmen Hesabı",
    logOut: "Çıkış Yap",
    required: "Zorunlu",
    studentNumberPlaceholder: "örn: 2024001",
    namePlaceholder: "Ad",
    surnamePlaceholder: "Soyad",
    emailPlaceholder: "ogrenci@ornek.com",
    phonePlaceholder: "05xxxxxxxxx",
    imageSizeError: "Resim boyutu 5MB'dan küçük olmalıdır",
    imageTypeError: "Lütfen bir resim dosyası seçin",
    studentNumberError: "Öğrenci numarası sadece rakam içermelidir",
    emailError: "Lütfen geçerli bir e-posta adresi girin",
    phoneError: "Telefon numarası '05xxxxxxxxx' formatında ve 11 haneli olmalıdır.",
    quickAccess: "Hızlı Erişim",
    studentRegistration: "Öğrenci Kayıt",
    courseRegistration: "Kurs Kayıt",
    courseEnrollment: "Kursa Öğrenci Ekle",
    attendanceReports: "Yoklama Raporları",
    liveAttendance: "Canlı Yoklama",
    universityName: "Maltepe Üniversitesi",
    systemName: "Otomatik Yoklama Sistemi",
  },
  EN: {
    title: "Student Registration",
    subtitle: "Register a new student to the attendance system",
    editTitle: "Edit Student",
    editSubtitle: "Update existing student details",
    studentPhoto: "Student Photo",
    studentNumber: "Student Number",
    name: "Name",
    surname: "Surname",
    department: "Department",
    class: "Class",
    email: "Email",
    phone: "Phone",
    selectDepartment: "Select department",
    selectClass: "Select class",
    clickToUpload: "Click to upload photo",
    noPhoto: "No photo",
    registerStudent: "Register Student",
    registering: "Registering...",
    updateStudent: "Update Student",
    updating: "Updating...",
    clearForm: "Clear Form / Cancel",
    success: "Operation completed successfully!",
    welcome: "Welcome,",
    instructor: "Instructor",
    teacherAccount: "Teacher Account",
    logOut: "Log Out",
    required: "Required",
    studentNumberPlaceholder: "e.g., 2024001",
    namePlaceholder: "First name",
    surnamePlaceholder: "Last name",
    emailPlaceholder: "student@example.com",
    phonePlaceholder: "05xxxxxxxxx",
    imageSizeError: "Image size must be less than 5MB",
    imageTypeError: "Please select an image file",
    studentNumberError: "Student number must contain only digits",
    emailError: "Please enter a valid email address",
    phoneError: "Phone number must be in '05xxxxxxxxx' format and 11 digits.",
    quickAccess: "Quick Access",
    studentRegistration: "Student Registration",
    courseRegistration: "Course Registration",
    courseEnrollment: "Enroll Students",
    attendanceReports: "Attendance Reports",
    liveAttendance: "Live Attendance",
    universityName: "Maltepe University",
    systemName: "Automatic Attendance System",
  }
};

// Student Interface
interface Student {
  id: number;
  student_number: string;
  name: string;
  surname: string;
  department: string;
  class: string;
  email: string;
  phone: string;
  photo_path: string | null;
}

export default function StudentRegistrationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<'TR' | 'EN'>('EN');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    studentNumber: '',
    name: '',
    surname: '',
    department: '',
    class: '',
    email: '',
    phone: ''
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const t = translations[language];

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  useEffect(() => {
    setMounted(true);

    const savedMode = localStorage.getItem('darkMode');
    
    if (savedMode !== null) {
      setIsDarkMode(JSON.parse(savedMode));
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemPrefersDark);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchStudents();
    }
  }, [mounted]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/students/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchStudents();
      } else {
        alert('Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setFormData({
      studentNumber: student.student_number,
      name: student.name,
      surname: student.surname,
      department: student.department,
      class: student.class,
      email: student.email || '',
      phone: student.phone || ''
    });
    if (student.photo_path) {
      setPhotoPreview(`http://127.0.0.1:5000/${student.photo_path}`);
    } else {
      setPhotoPreview(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: t.imageTypeError }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: t.imageSizeError }));
        return;
      }
      setPhoto(file);
      setErrors(prev => ({ ...prev, photo: '' }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.studentNumber.trim()) {
      newErrors.studentNumber = `${t.studentNumber} ${t.required.toLowerCase()}`;
    } else if (!/^\d+$/.test(formData.studentNumber)) {
      newErrors.studentNumber = t.studentNumberError;
    }

    if (!formData.name.trim()) {
      newErrors.name = `${t.name} ${t.required.toLowerCase()}`;
    }

    if (!formData.surname.trim()) {
      newErrors.surname = `${t.surname} ${t.required.toLowerCase()}`;
    }

    if (!formData.department) {
      newErrors.department = `${t.department} ${t.required.toLowerCase()}`;
    }

    if (!formData.class) {
      newErrors.class = `${t.class} ${t.required.toLowerCase()}`;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = t.emailError;
    }

    const phoneRegex = /^05\d{9}$/;
    const cleanPhone = formData.phone.replace(/\s+/g, '');
    if (formData.phone && !phoneRegex.test(cleanPhone)) {
      newErrors.phone = t.phoneError;
    }

    if (!photo && !editingId) {
      newErrors.photo = `${t.studentPhoto} ${t.required.toLowerCase()}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    const submitData = new FormData();
    submitData.append('studentNumber', formData.studentNumber);
    submitData.append('name', formData.name);
    submitData.append('surname', formData.surname);
    submitData.append('department', formData.department);
    submitData.append('class', formData.class);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    if (photo) {
      submitData.append('photo', photo);
    }

    try {
      const url = editingId
        ? `http://127.0.0.1:5000/api/students/${editingId}`
        : 'http://127.0.0.1:5000/api/students';

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Operation failed');
      }

      console.log('Success:', data);
      setSubmitSuccess(true);
      fetchStudents(); 

      setTimeout(() => {
        setFormData({
          studentNumber: '',
          name: '',
          surname: '',
          department: '',
          class: '',
          email: '',
          phone: ''
        });
        setPhoto(null);
        setPhotoPreview(null);
        setSubmitSuccess(false);
        setEditingId(null);
      }, 2000);

    } catch (err: any) {
      console.error('Submission error:', err);
      setErrors(prev => ({ ...prev, submit: err.message || 'An error occurred' }));
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
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 h-10 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-700'
              }`}
          >
            <UserPlus size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none font-bold ${sidebarOpen ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden'
              }`}>
              {t.studentRegistration}
            </span>
          </button>
          <button
            onClick={() => navigateToPage('course-registration')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 h-10 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
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
            <p className="text-xs opacity-60">{t.instructor}</p>
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
          <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 h-10 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-700'
            }`}>
            <UserPlus size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none opacity-100 w-full font-bold truncate`}>{t.studentRegistration}</span>
          </div>
          <button
            onClick={() => navigateToPage('course-registration')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 h-10 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
              }`}
          >
            <BookOpen size={20} className="flex-shrink-0" />
            <span className={`transition-opacity duration-300 leading-none opacity-100 w-full font-bold truncate`}>{t.courseRegistration}</span>
          </button>
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
            <p className="text-xs opacity-60">{t.instructor}</p>
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
            {/* Header - DYNAMIC TITLE */}
            <div className="mb-6">
              <h2 className={`text-2xl font-bold ${colors.textPrimary} mb-1`}>
                {editingId ? t.editTitle : t.title}
              </h2>
              <p className={`text-sm ${colors.textSecondary}`}>
                {editingId ? t.editSubtitle : t.subtitle}
              </p>
            </div>

            {/* Success Message */}
            {submitSuccess && (
              <div className={`mb-6 ${colors.bgCard} border ${isDarkMode ? 'border-green-500/50' : 'border-green-500'} rounded-lg p-4 flex items-center gap-3`}>
                <CheckCircle2 className="text-green-400" size={20} />
                <p className="text-green-400 font-medium">{t.success}</p>
              </div>
            )}

            {/* Error Message */}
            {errors.submit && (
              <div className={`mb-6 ${colors.bgCard} border ${isDarkMode ? 'border-red-500/50' : 'border-red-500'} rounded-lg p-4 flex items-center gap-3`}>
                <XCircle className="text-red-400" size={20} />
                <p className="text-red-400 font-medium">{errors.submit}</p>
              </div>
            )}

            {/* Registration Form */}
            <div className={`${colors.bgCard} border ${colors.border} rounded-lg shadow-lg p-6`}>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Photo Upload Section */}
                <div className="mb-8">
                  <label className={`block text-sm font-semibold mb-3 ${colors.textPrimary}`}>
                    {t.studentPhoto} <span className="text-red-400">*</span>
                  </label>
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Photo Preview/Upload Area */}
                    <div className="flex-shrink-0">
                      <div className={`w-48 h-48 ${colors.bgMain} border-2 ${colors.border} rounded-xl flex items-center justify-center overflow-hidden relative`}>
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Student preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <Camera className={`${colors.textSecondary} mx-auto mb-2`} size={32} />
                            <p className={`text-xs ${colors.textSecondary}`}>{t.noPhoto}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upload Button */}
                    <div className="flex-1 flex flex-col justify-center">
                      <label className={`${colors.bgMain} border-2 border-dashed ${colors.border} rounded-xl p-6 cursor-pointer hover:border-purple-500 transition-colors`}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                        <div className="text-center">
                          <Upload className={`${colors.textPurple} mx-auto mb-2`} size={24} />
                          <p className={`text-sm font-medium ${colors.textPrimary} mb-1`}>
                            {t.clickToUpload}
                          </p>
                          <p className={`text-xs ${colors.textSecondary}`}>
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                      </label>
                      {errors.photo && (
                        <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                          <XCircle size={12} />
                          {errors.photo}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Student Number */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                      {t.studentNumber} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="studentNumber"
                      value={formData.studentNumber}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${errors.studentNumber
                        ? `${isDarkMode ? 'bg-gray-700' : 'bg-red-50'} border-2 border-red-500 ${colors.textPrimary}`
                        : `${colors.bgMain} border ${colors.border} ${colors.textPrimary} placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500`
                        }`}
                      placeholder={t.studentNumberPlaceholder}
                      required
                    />
                    {errors.studentNumber && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <XCircle size={12} />
                        {errors.studentNumber}
                      </p>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                      {t.name} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${errors.name
                        ? `${isDarkMode ? 'bg-gray-700' : 'bg-red-50'} border-2 border-red-500 ${colors.textPrimary}`
                        : `${colors.bgMain} border ${colors.border} ${colors.textPrimary} placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500`
                        }`}
                      placeholder={t.namePlaceholder}
                      required
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <XCircle size={12} />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Surname */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                      {t.surname} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${errors.surname
                        ? `${isDarkMode ? 'bg-gray-700' : 'bg-red-50'} border-2 border-red-500 ${colors.textPrimary}`
                        : `${colors.bgMain} border ${colors.border} ${colors.textPrimary} placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500`
                        }`}
                      placeholder={t.surnamePlaceholder}
                      required
                    />
                    {errors.surname && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <XCircle size={12} />
                        {errors.surname}
                      </p>
                    )}
                  </div>

                  {/* Department */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                      {t.department} <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${errors.department
                        ? `${isDarkMode ? 'bg-gray-700' : 'bg-red-50'} border-2 border-red-500 ${colors.textPrimary}`
                        : `${colors.bgMain} border ${colors.border} ${colors.textPrimary} focus:ring-purple-500 focus:border-purple-500`
                        }`}
                      required
                    >
                      <option value="">{t.selectDepartment}</option>
                      <option value="CSE">Computer Science Engineering</option>
                      <option value="EE">Electrical Engineering</option>
                      <option value="ME">Mechanical Engineering</option>
                      <option value="CE">Civil Engineering</option>
                      <option value="IE">Industrial Engineering</option>
                    </select>
                    {errors.department && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <XCircle size={12} />
                        {errors.department}
                      </p>
                    )}
                  </div>

                  {/* Class */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                      {t.class} <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="class"
                      value={formData.class}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${errors.class
                        ? `${isDarkMode ? 'bg-gray-700' : 'bg-red-50'} border-2 border-red-500 ${colors.textPrimary}`
                        : `${colors.bgMain} border ${colors.border} ${colors.textPrimary} focus:ring-purple-500 focus:border-purple-500`
                        }`}
                      required
                    >
                      <option value="">{t.selectClass}</option>
                      <option value="1">Class 1</option>
                      <option value="2">Class 2</option>
                      <option value="3">Class 3</option>
                      <option value="4">Class 4</option>
                    </select>
                    {errors.class && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <XCircle size={12} />
                        {errors.class}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                      {t.email}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${errors.email
                        ? `${isDarkMode ? 'bg-gray-700' : 'bg-red-50'} border-2 border-red-500 ${colors.textPrimary}`
                        : `${colors.bgMain} border ${colors.border} ${colors.textPrimary} placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500`
                        }`}
                      placeholder={t.emailPlaceholder}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <XCircle size={12} />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                      {t.phone}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${colors.bgMain} border ${colors.border} ${colors.textPrimary} placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500`}
                      placeholder={t.phonePlaceholder}
                    />
                    {errors.phone && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                          <XCircle size={12} />
                          {errors.phone}
                        </p>
                    )}
                  </div>

                </div>

                {/* Submit Button - DYNAMIC TEXT */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 md:flex-none md:px-8 py-3 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${colors.accentPurple
                      } hover:opacity-90`}
                  >
                    {isSubmitting 
                      ? (editingId ? t.updating : t.registering) 
                      : (editingId ? t.updateStudent : t.registerStudent)
                    }
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        studentNumber: '',
                        name: '',
                        surname: '',
                        department: '',
                        class: '',
                        email: '',
                        phone: ''
                      });
                      setPhoto(null);
                      setPhotoPreview(null);
                      setErrors({});
                      setEditingId(null);
                    }}
                    className={`px-6 py-3 border ${colors.border} ${colors.textSecondary} font-semibold rounded-lg transition-all hover:${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
                  >
                    {t.clearForm}
                  </button>
                </div>

              </form>
            </div>

            {/* Registered Students List */}
            <div className="mt-12">
              <h3 className={`text-xl font-bold mb-4 ${colors.textPrimary}`}>Registered Students</h3>
              <div className={`${colors.bgCard} border ${colors.border} rounded-lg shadow-lg overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} border-b ${colors.border}`}>
                      <tr>
                        <th className={`p-4 font-semibold ${colors.textPrimary}`}>Photo</th>
                        <th className={`p-4 font-semibold ${colors.textPrimary}`}>Number</th>
                        <th className={`p-4 font-semibold ${colors.textPrimary}`}>Name</th>
                        <th className={`p-4 font-semibold ${colors.textPrimary}`}>Department</th>
                        <th className={`p-4 font-semibold ${colors.textPrimary}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${colors.border}`}>
                      {students.length > 0 ? (
                        students.map((student) => (
                          <tr key={student.id} className={`hover:${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'} transition-colors`}>
                            <td className="p-4">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                {student.photo_path ? (
                                  <img
                                    src={`http://127.0.0.1:5000/${student.photo_path}`}
                                    alt={student.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <UserPlus size={20} />
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className={`p-4 ${colors.textPrimary}`}>{student.student_number}</td>
                            <td className={`p-4 ${colors.textPrimary}`}>{student.name} {student.surname}</td>
                            <td className={`p-4 ${colors.textPrimary}`}>{student.department}</td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(student)}
                                  className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <FileText size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(student.id)}
                                  className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <XCircle size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className={`p-8 text-center ${colors.textSecondary}`}>
                            No students registered yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}