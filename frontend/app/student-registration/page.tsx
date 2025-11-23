"use client";

import React, { useState, useEffect } from 'react';
import { 
  UserPlus,
  Globe, 
  Moon, 
  Sun,
  LogOut, 
  Menu, 
  X,
  Upload,
  Camera,
  CheckCircle2,
  XCircle,
  FileText,
  Video,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import Image from 'next/image';

// Translations
const translations = {
  TR: {
    title: "Öğrenci Kayıt",
    subtitle: "Yoklama sistemine yeni öğrenci kaydedin",
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
    clearForm: "Formu Temizle",
    success: "Öğrenci başarıyla kaydedildi!",
    welcome: "Hoş geldiniz,",
    instructor: "Öğretmen",
    teacherAccount: "Öğretmen Hesabı",
    logOut: "Çıkış Yap",
    required: "Zorunlu",
    studentNumberPlaceholder: "örn: 2024001",
    namePlaceholder: "Ad",
    surnamePlaceholder: "Soyad",
    emailPlaceholder: "ogrenci@ornek.com",
    phonePlaceholder: "+90 555 123 4567",
    imageSizeError: "Resim boyutu 5MB'dan küçük olmalıdır",
    imageTypeError: "Lütfen bir resim dosyası seçin",
    studentNumberError: "Öğrenci numarası sadece rakam içermelidir",
    emailError: "Lütfen geçerli bir e-posta adresi girin",
    quickAccess: "Hızlı Erişim",
    studentRegistration: "Öğrenci Kayıt",
    attendanceReports: "Yoklama Raporları",
    liveAttendance: "Canlı Yoklama"
  },
  EN: {
    title: "Student Registration",
    subtitle: "Register a new student to the attendance system",
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
    clearForm: "Clear Form",
    success: "Student registered successfully!",
    welcome: "Welcome,",
    instructor: "Instructor",
    teacherAccount: "Teacher Account",
    logOut: "Log Out",
    required: "Required",
    studentNumberPlaceholder: "e.g., 2024001",
    namePlaceholder: "First name",
    surnamePlaceholder: "Last name",
    emailPlaceholder: "student@example.com",
    phonePlaceholder: "+90 555 123 4567",
    imageSizeError: "Image size must be less than 5MB",
    imageTypeError: "Please select an image file",
    studentNumberError: "Student number must contain only digits",
    emailError: "Please enter a valid email address",
    quickAccess: "Quick Access",
    studentRegistration: "Student Registration",
    attendanceReports: "Attendance Reports",
    liveAttendance: "Live Attendance"
  }
};

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
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.emailError;
    }

    if (!photo) {
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

    setTimeout(() => {
      console.log('Form submitted:', { ...formData, photo });
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
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
      }, 2000);
    }, 1500);
  };

  const navigateToPage = (page: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/?page=${page}`;
    }
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-48' : 'w-20'} transition-all duration-300 ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-600'
      } text-white flex flex-col p-4`}>
        {/* Logo and Title */}
        <div className="flex items-center gap-3 mb-8">
          <Image 
            src="/maltepe-uni-logo.svg" 
            alt="Maltepe University Logo" 
            width={40}
            height={40}
            priority
          />
          {sidebarOpen && (
            <div className="text-sm">
              <p className="font-bold">Maltepe Üniversitesi</p>
              <p className="text-xs opacity-80">Automatic Attendance System</p>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-700'
          }`}>
            <UserPlus size={20} />
            {sidebarOpen && <span className="font-semibold">{t.studentRegistration}</span>}
          </div>
          <button
            onClick={() => navigateToPage('teacher-live-attendance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
            }`}
          >
            <Video size={20} />
            {sidebarOpen && <span>{t.liveAttendance}</span>}
          </button>
          <button
            onClick={() => navigateToPage('teacher-reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
            }`}
          >
            <BarChart3 size={20} />
            {sidebarOpen && <span>{t.attendanceReports}</span>}
          </button>
        </nav>

        {/* Bottom Section */}
        <div className="space-y-2 border-t border-gray-500 pt-3 mt-auto">
          {sidebarOpen && (
            <div className="text-xs opacity-75 px-4 mb-2">
              <p>{t.welcome}</p>
              <p className="font-semibold">Dr. Emre Olca</p>
              <p className="text-xs opacity-60">{t.instructor}</p>
            </div>
          )}
          <button className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
          }`}>
            <LogOut size={18} />
            {sidebarOpen && <span>{t.logOut}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-b px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg transition ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <Menu size={24} className={isDarkMode ? 'text-white' : 'text-gray-800'} />
            </button>
            <h1 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>{t.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleLanguage}
              className={`p-2 rounded-lg transition flex items-center gap-1 ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              title="Change Language"
            >
              <Globe size={20} className={isDarkMode ? 'text-white' : 'text-gray-800'} />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{language}</span>
            </button>
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          
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
                    className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${
                      errors.studentNumber
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
                    className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${
                      errors.name
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
                    className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${
                      errors.surname
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
                    className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${
                      errors.department
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
                    className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${
                      errors.class
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
                    className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${
                      errors.email
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
                </div>

              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 md:flex-none md:px-8 py-3 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                    colors.accentPurple
                  } hover:opacity-90`}
                >
                  {isSubmitting ? t.registering : t.registerStudent}
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
    </div>
  );
}
