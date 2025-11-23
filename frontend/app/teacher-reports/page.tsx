"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileText,
  Globe, 
  Moon, 
  Sun,
  LogOut, 
  Menu, 
  X,
  Download,
  Calendar,
  Search,
  Edit,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  Video,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import Image from 'next/image';

// Translations
const translations = {
  TR: {
    title: "Yoklama Raporları",
    subtitle: "Yoklama kayıtlarını görüntüleyin, filtreleyin ve dışa aktarın",
    totalRecords: "Toplam Kayıt",
    present: "Var",
    absent: "Yok",
    late: "Geç",
    search: "Ara",
    searchPlaceholder: "Öğrenci numarası, ad ile ara...",
    date: "Tarih",
    department: "Bölüm",
    allDepartments: "Tüm Bölümler",
    class: "Sınıf",
    allClasses: "Tüm Sınıflar",
    status: "Durum",
    allStatus: "Tüm Durumlar",
    clearFilters: "Tüm Filtreleri Temizle",
    exportPDF: "PDF Dışa Aktar",
    exportCSV: "CSV Dışa Aktar",
    studentNumber: "Öğrenci Numarası",
    name: "Ad Soyad",
    departmentLabel: "Bölüm",
    classLabel: "Sınıf",
    dateLabel: "Tarih",
    time: "Saat",
    statusLabel: "Durum",
    actions: "İşlemler",
    noRecords: "Yoklama kaydı bulunamadı",
    showing: "Gösteriliyor",
    of: "/",
    records: "kayıt",
    welcome: "Hoş geldiniz,",
    instructor: "Öğretmen",
    teacherAccount: "Öğretmen Hesabı",
    logOut: "Çıkış Yap",
    editRecord: "Kaydı düzenle",
    quickAccess: "Hızlı Erişim",
    studentRegistration: "Öğrenci Kayıt",
    attendanceReports: "Yoklama Raporları",
    liveAttendance: "Canlı Yoklama"
  },
  EN: {
    title: "Attendance Reports",
    subtitle: "View, filter, and export attendance records",
    totalRecords: "Total Records",
    present: "Present",
    absent: "Absent",
    late: "Late",
    search: "Search",
    searchPlaceholder: "Search by student number, name...",
    date: "Date",
    department: "Department",
    allDepartments: "All Departments",
    class: "Class",
    allClasses: "All Classes",
    status: "Status",
    allStatus: "All Status",
    clearFilters: "Clear All Filters",
    exportPDF: "Export PDF",
    exportCSV: "Export CSV",
    studentNumber: "Student Number",
    name: "Name",
    departmentLabel: "Department",
    classLabel: "Class",
    dateLabel: "Date",
    time: "Time",
    statusLabel: "Status",
    actions: "Actions",
    noRecords: "No attendance records found",
    showing: "Showing",
    of: "of",
    records: "records",
    welcome: "Welcome,",
    instructor: "Instructor",
    teacherAccount: "Teacher Account",
    logOut: "Log Out",
    editRecord: "Edit record",
    quickAccess: "Quick Access",
    studentRegistration: "Student Registration",
    attendanceReports: "Attendance Reports",
    liveAttendance: "Live Attendance"
  }
};

// Mock attendance data
const mockAttendanceData = [
  { id: 1, studentNumber: '2024001', name: 'Ahmet', surname: 'Yılmaz', department: 'CSE', class: '1', date: '2024-11-20', status: 'Present', time: '09:15' },
  { id: 2, studentNumber: '2024002', name: 'Ayşe', surname: 'Demir', department: 'CSE', class: '1', date: '2024-11-20', status: 'Present', time: '09:18' },
  { id: 3, studentNumber: '2024003', name: 'Mehmet', surname: 'Kaya', department: 'CSE', class: '1', date: '2024-11-20', status: 'Absent', time: '-' },
  { id: 4, studentNumber: '2024004', name: 'Zeynep', surname: 'Şahin', department: 'CSE', class: '1', date: '2024-11-20', status: 'Present', time: '09:22' },
  { id: 5, studentNumber: '2024005', name: 'Ali', surname: 'Çelik', department: 'CSE', class: '1', date: '2024-11-20', status: 'Late', time: '09:35' },
  { id: 6, studentNumber: '2024001', name: 'Ahmet', surname: 'Yılmaz', department: 'CSE', class: '1', date: '2024-11-19', status: 'Present', time: '09:10' },
  { id: 7, studentNumber: '2024002', name: 'Ayşe', surname: 'Demir', department: 'CSE', class: '1', date: '2024-11-19', status: 'Present', time: '09:12' },
  { id: 8, studentNumber: '2024003', name: 'Mehmet', surname: 'Kaya', department: 'CSE', class: '1', date: '2024-11-19', status: 'Present', time: '09:20' },
  { id: 9, studentNumber: '2024004', name: 'Zeynep', surname: 'Şahin', department: 'CSE', class: '1', date: '2024-11-19', status: 'Absent', time: '-' },
  { id: 10, studentNumber: '2024005', name: 'Ali', surname: 'Çelik', department: 'CSE', class: '1', date: '2024-11-19', status: 'Present', time: '09:15' },
];

export default function TeacherReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<'TR' | 'EN'>('EN');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

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

  // Filter data
  const filteredData = mockAttendanceData.filter(record => {
    const matchesSearch = !searchTerm || 
      record.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.surname.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !filterDate || record.date === filterDate;
    const matchesDepartment = !filterDepartment || record.department === filterDepartment;
    const matchesClass = !filterClass || record.class === filterClass;
    const matchesStatus = !filterStatus || record.status === filterStatus;

    return matchesSearch && matchesDate && matchesDepartment && matchesClass && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: filteredData.length,
    present: filteredData.filter(r => r.status === 'Present').length,
    absent: filteredData.filter(r => r.status === 'Absent').length,
    late: filteredData.filter(r => r.status === 'Late').length,
  };

  const handleExportPDF = () => {
    console.log('Exporting to PDF...');
  };

  const handleExportCSV = () => {
    console.log('Exporting to CSV...');
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

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case 'Present':
        return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`;
      case 'Absent':
        return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`;
      case 'Late':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
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
      <aside className={`${sidebarOpen ? 'w-48 lg:w-48' : 'w-0 lg:w-20'} fixed lg:static h-full lg:h-auto transition-all duration-300 ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-600'
      } text-white flex flex-col p-4 z-50 overflow-hidden`}>
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
          <button
            onClick={() => navigateToPage('student-registration')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
            }`}
          >
            <UserPlus size={20} />
            {sidebarOpen && <span>{t.studentRegistration}</span>}
          </button>
          <button
            onClick={() => navigateToPage('teacher-live-attendance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
            }`}
          >
            <Video size={20} />
            {sidebarOpen && <span>{t.liveAttendance}</span>}
          </button>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-700'
          }`}>
            <BarChart3 size={20} />
            {sidebarOpen && <span className="font-semibold">{t.attendanceReports}</span>}
          </div>
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
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'
            }`}
          >
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
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-1`}>{t.title}</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.subtitle}</p>
            </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <div className={`${colors.bgCard} border ${colors.border} p-5 rounded-2xl shadow-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${colors.textSecondary} mb-1`}>{t.totalRecords}</p>
                  <p className={`text-2xl font-bold ${colors.textPrimary}`}>{stats.total}</p>
                </div>
                <div className={`p-3 ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'} rounded-xl`}>
                  <FileText className="text-purple-400" size={24} />
                </div>
              </div>
            </div>
            <div className={`${colors.bgCard} border ${colors.border} p-5 rounded-2xl shadow-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${colors.textSecondary} mb-1`}>{t.present}</p>
                  <p className="text-2xl font-bold text-green-400">{stats.present}</p>
                </div>
                <div className={`p-3 ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'} rounded-xl`}>
                  <CheckCircle2 className="text-green-400" size={24} />
                </div>
              </div>
            </div>
            <div className={`${colors.bgCard} border ${colors.border} p-5 rounded-2xl shadow-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${colors.textSecondary} mb-1`}>{t.absent}</p>
                  <p className="text-2xl font-bold text-red-400">{stats.absent}</p>
                </div>
                <div className={`p-3 ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'} rounded-xl`}>
                  <XCircle className="text-red-400" size={24} />
                </div>
              </div>
            </div>
            <div className={`${colors.bgCard} border ${colors.border} p-5 rounded-2xl shadow-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${colors.textSecondary} mb-1`}>{t.late}</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.late}</p>
                </div>
                <div className={`p-3 ${isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'} rounded-xl`}>
                  <Clock className="text-yellow-400" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className={`${colors.bgCard} border ${colors.border} rounded-2xl shadow-lg p-6 mb-6`}>
            <div className="flex flex-col lg:flex-row gap-4">
              
              {/* Search */}
              <div className="flex-1">
                <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                  {t.search}
                </label>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${colors.textSecondary}`} size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${colors.bgMain} border ${colors.border} ${colors.textPrimary} placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500`}
                    placeholder={t.searchPlaceholder}
                  />
                </div>
              </div>

              {/* Date Filter */}
              <div className="lg:w-48">
                <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                  {t.date}
                </label>
                <div className="relative">
                  <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${colors.textSecondary}`} size={18} />
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className={`w-full pl-10 rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${colors.bgMain} border ${colors.border} ${colors.textPrimary} focus:ring-purple-500 focus:border-purple-500`}
                  />
                </div>
              </div>

              {/* Department Filter */}
              <div className="lg:w-48">
                <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                  {t.department}
                </label>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${colors.bgMain} border ${colors.border} ${colors.textPrimary} focus:ring-purple-500 focus:border-purple-500`}
                >
                  <option value="">{t.allDepartments}</option>
                  <option value="CSE">CSE</option>
                  <option value="EE">EE</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
                  <option value="IE">IE</option>
                </select>
              </div>

              {/* Class Filter */}
              <div className="lg:w-40">
                <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                  {t.class}
                </label>
                <select
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${colors.bgMain} border ${colors.border} ${colors.textPrimary} focus:ring-purple-500 focus:border-purple-500`}
                >
                  <option value="">{t.allClasses}</option>
                  <option value="1">Class 1</option>
                  <option value="2">Class 2</option>
                  <option value="3">Class 3</option>
                  <option value="4">Class 4</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="lg:w-40">
                <label className={`block text-sm font-semibold mb-2 ${colors.textPrimary}`}>
                  {t.status}
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`w-full rounded-lg focus:ring-2 focus:outline-none block p-3 transition-all ${colors.bgMain} border ${colors.border} ${colors.textPrimary} focus:ring-purple-500 focus:border-purple-500`}
                >
                  <option value="">{t.allStatus}</option>
                  <option value="Present">{t.present}</option>
                  <option value="Absent">{t.absent}</option>
                  <option value="Late">{t.late}</option>
                </select>
              </div>

            </div>

            {/* Clear Filters Button */}
            {(filterDate || filterDepartment || filterClass || filterStatus || searchTerm) && (
              <button
                onClick={() => {
                  setFilterDate('');
                  setFilterDepartment('');
                  setFilterClass('');
                  setFilterStatus('');
                  setSearchTerm('');
                }}
                className={`mt-4 px-4 py-2 border ${colors.border} ${colors.textSecondary} text-sm font-medium rounded-lg transition-all hover:${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
              >
                {t.clearFilters}
              </button>
            )}
          </div>

          {/* Export Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleExportPDF}
              className={`flex items-center gap-2 px-4 py-2 ${colors.bgCard} border ${colors.border} ${colors.textPrimary} rounded-lg transition-all hover:${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              <Download size={16} />
              <span>{t.exportPDF}</span>
            </button>
            <button
              onClick={handleExportCSV}
              className={`flex items-center gap-2 px-4 py-2 ${colors.bgCard} border ${colors.border} ${colors.textPrimary} rounded-lg transition-all hover:${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              <Download size={16} />
              <span>{t.exportCSV}</span>
            </button>
          </div>

          {/* Attendance Table */}
          <div className={`${colors.bgCard} border ${colors.border} rounded-2xl shadow-lg overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${colors.bgMain} border-b ${colors.border}`}>
                  <tr>
                    <th className={`text-left p-4 ${colors.textPrimary} font-semibold text-sm`}>{t.studentNumber}</th>
                    <th className={`text-left p-4 ${colors.textPrimary} font-semibold text-sm`}>{t.name}</th>
                    <th className={`text-left p-4 ${colors.textPrimary} font-semibold text-sm`}>{t.departmentLabel}</th>
                    <th className={`text-left p-4 ${colors.textPrimary} font-semibold text-sm`}>{t.classLabel}</th>
                    <th className={`text-left p-4 ${colors.textPrimary} font-semibold text-sm`}>{t.dateLabel}</th>
                    <th className={`text-left p-4 ${colors.textPrimary} font-semibold text-sm`}>{t.time}</th>
                    <th className={`text-left p-4 ${colors.textPrimary} font-semibold text-sm`}>{t.statusLabel}</th>
                    <th className={`text-left p-4 ${colors.textPrimary} font-semibold text-sm`}>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className={`p-8 text-center ${colors.textSecondary}`}>
                        {t.noRecords}
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((record, index) => (
                      <tr 
                        key={record.id} 
                        className={`border-b ${colors.border} hover:${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'} transition-colors ${
                          index === filteredData.length - 1 ? 'border-b-0' : ''
                        }`}
                      >
                        <td className={`p-4 ${colors.textPrimary} font-mono text-sm`}>{record.studentNumber}</td>
                        <td className={`p-4 ${colors.textPrimary}`}>{record.name} {record.surname}</td>
                        <td className={`p-4 ${colors.textSecondary}`}>{record.department}</td>
                        <td className={`p-4 ${colors.textSecondary}`}>Class {record.class}</td>
                        <td className={`p-4 ${colors.textSecondary}`}>{record.date}</td>
                        <td className={`p-4 ${colors.textSecondary} font-mono`}>{record.time}</td>
                        <td className="p-4">
                          <span className={getStatusBadge(record.status)}>
                            {record.status === 'Present' ? t.present : record.status === 'Absent' ? t.absent : t.late}
                          </span>
                        </td>
                        <td className="p-4">
                          <button 
                            className={`p-2 ${colors.bgMain} border ${colors.border} rounded-lg hover:${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} transition-colors`}
                            title={t.editRecord}
                          >
                            <Edit className={colors.textSecondary} size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Results Count */}
          <div className={`mt-4 text-sm ${colors.textSecondary}`}>
            {t.showing} {filteredData.length} {t.of} {mockAttendanceData.length} {t.records}
          </div>

          </div>
        </div>
      </div>
    </div>
  );
}

