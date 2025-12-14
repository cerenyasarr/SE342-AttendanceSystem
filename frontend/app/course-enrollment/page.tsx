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
  AlertCircle,
  X, // Çarpı ikonu
  Trash2 // Çöp kutusu ikonu (Modal için)
} from 'lucide-react';
import Image from 'next/image';

const translations = {
  TR: {
    title: "Kursa Öğrenci Ekle",
    subtitle: "Kayıtlı öğrencileri kurslara ekleyin",
    selectCourse: "Kurs Seçin",
    searchStudents: "Öğrenci Ara (Numara, Ad, Soyad)",
    searchPlaceholder: "Ara...",
    studentNumber: "Öğrenci No",
    name: "Ad Soyad",
    department: "Bölüm",
    class: "Sınıf",
    enroll: "Kaydet",
    enrollSelected: "Seçili Öğrencileri Kaydet",
    enrolling: "Kaydediliyor...",
    enrolledStudents: "Bu Kurstaki Öğrenciler",
    noStudents: "Bu derse henüz kayıtlı öğrenci yok.",
    success: "İşlem başarılı!",
    removedSuccess: "Öğrenci dersten çıkarıldı.",
    removeError: "Öğrenci çıkarılırken hata oluştu.",
    noCourseSelected: "Lütfen bir kurs seçin",
    capacity: "Kapasite",
    full: "DOLU",
    welcome: "Hoş geldiniz,",
    instructor: "Öğretmen",
    teacherAccount: "Öğretmen Hesabı",
    logOut: "Çıkış Yap",
    liveAttendance: "Canlı Yoklama",
    studentRegistration: "Öğrenci Kayıt",
    courseRegistration: "Kurs Kayıt",
    courseEnrollment: "Kursa Öğrenci Ekle",
    attendanceReports: "Yoklama Raporları",
    universityName: "Maltepe Üniversitesi",
    systemName: "Otomatik Yoklama Sistemi",
    selectedCount: "Seçili",
    total: "Toplam",
    actions: "İşlemler",
    removeTooltip: "Dersten Çıkar",
    // MODAL ÇEVİRİLERİ
    confirmTitle: "Öğrenciyi Sil",
    confirmDesc: "Bu öğrenciyi dersten çıkarmak istediğinize emin misiniz? Bu işlem geri alınamaz.",
    confirmBtn: "Evet, Çıkar",
    cancelBtn: "İptal"
  },
  EN: {
    title: "Enroll Students to Course",
    subtitle: "Add registered students to courses",
    selectCourse: "Select Course",
    searchStudents: "Search Students (ID, Name)",
    searchPlaceholder: "Search...",
    studentNumber: "Student ID",
    name: "Name",
    department: "Department",
    class: "Class",
    enroll: "Enroll",
    enrollSelected: "Enroll Selected Students",
    enrolling: "Enrolling...",
    enrolledStudents: "Students Enrolled in This Course",
    noStudents: "No students enrolled in this course yet.",
    success: "Operation successful!",
    removedSuccess: "Student removed from course.",
    removeError: "Error removing student.",
    noCourseSelected: "Please select a course",
    capacity: "Capacity",
    full: "FULL",
    welcome: "Welcome,",
    instructor: "Instructor",
    teacherAccount: "Teacher Account",
    logOut: "Log Out",
    liveAttendance: "Live Attendance",
    studentRegistration: "Student Registration",
    courseRegistration: "Course Registration",
    courseEnrollment: "Enroll Students",
    attendanceReports: "Attendance Reports",
    universityName: "Maltepe University",
    systemName: "Automatic Attendance System",
    selectedCount: "Selected",
    total: "Total",
    actions: "Actions",
    removeTooltip: "Remove from Course",
    // MODAL TRANSLATIONS
    confirmTitle: "Remove Student",
    confirmDesc: "Are you sure you want to remove this student from the course? This action cannot be undone.",
    confirmBtn: "Yes, Remove",
    cancelBtn: "Cancel"
  }
};

export default function CourseEnrollmentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<'TR' | 'EN'>('EN');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Data States
  const [courses, setCourses] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [enrolledList, setEnrolledList] = useState<any[]>([]);

  // UI States
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // --- Modal State'leri ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  const t = translations[language];

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('darkMode');
    const savedLang = localStorage.getItem('language');
    if (savedMode !== null) setIsDarkMode(JSON.parse(savedMode));
    if (savedLang) setLanguage(savedLang === 'TR' ? 'TR' : 'EN');

    fetchCourses();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchEnrolledStudents(selectedCourseId);
      setSelectedStudents(new Set());
      setMessage(null);
    } else {
      setEnrolledList([]);
    }
  }, [selectedCourseId]);

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/courses');
      if (res.ok) setCourses(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/students');
      if (res.ok) setAllStudents(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchEnrolledStudents = async (courseId: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/courses/${courseId}/students`);
      if (res.ok) {
        const data = await res.json();
        
        // --- HATA DÜZELTME: Çift Kayıtları Temizle ---
        // Veritabanında aynı ID ile birden fazla kayıt varsa, sadece benzersiz olanları alırız.
        const uniqueData = Array.from(new Map(data.map((item: any) => [item.id, item])).values());
        
        setEnrolledList(uniqueData);
      }
    } catch (e) { console.error(e); }
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

  const selectedCourseObj = courses.find(c => c.id.toString() === selectedCourseId);

  const filteredStudents = allStudents.filter(student => {
    const isEnrolled = enrolledList.some(e => e.id === student.id);
    if (isEnrolled) return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      (student.student_number && student.student_number.toString().includes(query)) ||
      (student.name && student.name.toLowerCase().includes(query)) ||
      (student.surname && student.surname.toLowerCase().includes(query)) ||
      `${student.name} ${student.surname}`.toLowerCase().includes(query)
    );
  });

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) newSet.delete(studentId);
      else newSet.add(studentId);
      return newSet;
    });
  };

  const handleEnrollSelected = async () => {
    if (!selectedCourseId) return;
    if (selectedStudents.size === 0) return;

    setIsSubmitting(true);
    setMessage(null);

    if (selectedCourseObj && selectedCourseObj.classroom) {
        if (selectedCourseObj.enrolled_count + selectedStudents.size > selectedCourseObj.capacity) {
            setMessage({ type: 'error', text: `Capacity exceeded! Only ${selectedCourseObj.capacity - selectedCourseObj.enrolled_count} spots left.` });
            setIsSubmitting(false);
            return;
        }
    }

    try {
      const studentIds = Array.from(selectedStudents);
      const promises = studentIds.map(studentId =>
        fetch('http://localhost:5001/api/enrollments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: studentId,
            course_id: selectedCourseId,
            year: new Date().getFullYear(),
            term: "Fall"
          })
        })
      );

      await Promise.all(promises);

      setMessage({ type: 'success', text: t.success });
      
      await fetchCourses(); 
      await fetchEnrolledStudents(selectedCourseId); 
      setSelectedStudents(new Set()); 

    } catch (err: any) {
      setMessage({ type: 'error', text: "Failed to enroll some students." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 1. Silme Butonuna Basınca Modalı Açan Fonksiyon ---
  const initiateRemove = (studentId: string) => {
    setStudentToDelete(studentId);
    setShowDeleteModal(true);
  };

  // --- 2. Modaldaki "Evet" Butonuna Basınca Silen Fonksiyon ---
  const confirmRemoveStudent = async () => {
      if(!selectedCourseId || !studentToDelete) return;

      setIsSubmitting(true);
      setMessage(null);

      try {
          // Frontend Simülasyonu
          setEnrolledList(prev => prev.filter(s => s.id !== studentToDelete));
          
          if (selectedCourseObj) {
            selectedCourseObj.enrolled_count = Math.max(0, selectedCourseObj.enrolled_count - 1);
          }

          setMessage({ type: 'success', text: t.removedSuccess });
          setShowDeleteModal(false); 
          setStudentToDelete(null);

      } catch (err) {
          setMessage({ type: 'error', text: t.removeError });
      } finally {
          setIsSubmitting(false);
      }
  };

  const navigateToPage = (page: string) => {
    if (typeof window !== 'undefined') window.location.href = `/?page=${page}`;
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') window.location.href = '/?page=log-in';
  };

  if (!mounted) return null;

  const colors = {
    bgMain: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    bgCard: isDarkMode ? 'bg-gray-800' : 'bg-white',
    textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    accentPurple: 'bg-purple-600',
    hoverBg: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    headerBg: isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50',
    rowHoverBg: isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${colors.bgMain}`}>
      
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} hidden lg:flex fixed lg:static h-full lg:h-auto transition-all duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} text-white flex-col p-4 z-50`}>
        <div className="flex items-center gap-3 mb-8 min-w-0">
          <Image src="/maltepe-uni-logo.svg" alt="Logo" width={40} height={40} className="flex-shrink-0" />
          <div className={`text-sm overflow-hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
            <p className="font-bold whitespace-nowrap">{t.universityName}</p>
            <p className="text-xs opacity-80">{t.systemName}</p>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <button onClick={() => navigateToPage('teacher-live-attendance')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all h-10 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'}`}>
            <Video size={20} /> <span className={sidebarOpen ? '' : 'hidden'}>{t.liveAttendance}</span>
          </button>
          <button onClick={() => navigateToPage('student-registration')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all h-10 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'}`}>
            <UserPlus size={20} /> <span className={sidebarOpen ? '' : 'hidden'}>{t.studentRegistration}</span>
          </button>
          <button onClick={() => navigateToPage('course-registration')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all h-10 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'}`}>
            <BookOpen size={20} /> <span className={sidebarOpen ? '' : 'hidden'}>{t.courseRegistration}</span>
          </button>
          <button className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all h-10 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-700'}`}>
            <Users size={20} /> <span className={sidebarOpen ? '' : 'hidden'}>{t.courseEnrollment}</span>
          </button>
          <button onClick={() => navigateToPage('teacher-reports')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all h-10 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'}`}>
            <BarChart3 size={20} /> <span className={sidebarOpen ? '' : 'hidden'}>{t.attendanceReports}</span>
          </button>
        </div>
        <div className="border-t border-gray-500 pt-3 mt-auto">
            <div className={`text-xs opacity-75 px-4 mb-2 ${sidebarOpen ? '' : 'hidden'}`}>
                <p>{t.welcome}</p>
                <p className="font-semibold">Dr. Emre Olca</p>
            </div>
            <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all h-10 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'}`}>
                <LogOut size={18} /> <span className={sidebarOpen ? '' : 'hidden'}>{t.logOut}</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <div className={`${colors.bgCard} border-b ${colors.border} px-6 py-4 flex items-center justify-between transition-colors duration-300`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 rounded-lg ${colors.hoverBg}`}><Menu size={24} className={colors.textPrimary}/></button>
            <h1 className={`text-2xl font-bold ${colors.textPrimary}`}>{t.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleLanguage} className={`p-2 rounded-lg ${colors.textPrimary} ${colors.hoverBg}`}><Globe size={20}/></button>
            <button onClick={toggleDarkMode} className={`p-2 rounded-lg ${colors.textPrimary} ${colors.hoverBg}`}>{isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* 1. DERS SEÇİMİ VE KAPASİTE */}
            <div className={`${colors.bgCard} border ${colors.border} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="w-full md:w-1/2">
                  <label className={`block text-sm font-bold mb-2 ${colors.textPrimary}`}>{t.selectCourse}</label>
                  <select 
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${colors.border} ${colors.bgMain} ${colors.textPrimary} focus:ring-2 focus:ring-purple-500`}
                  >
                    <option value="">-- {t.selectCourse} --</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.name} ({c.classroom ? `${c.classroom}` : 'No Class'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Kapasite Göstergesi */}
                {selectedCourseObj && (
                  <div className={`w-full md:w-auto px-6 py-4 rounded-lg border ${colors.border} ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                    <div className="flex justify-between items-center mb-2 gap-4">
                        <span className={`text-xs font-bold uppercase ${colors.textSecondary}`}>{t.capacity}</span>
                        {selectedCourseObj.enrolled_count >= selectedCourseObj.capacity && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded animate-pulse">{t.full}</span>}
                    </div>
                    <div className="flex items-end gap-2">
                        <span className={`text-3xl font-bold ${selectedCourseObj.enrolled_count >= selectedCourseObj.capacity ? 'text-red-500' : 'text-green-500'}`}>
                            {selectedCourseObj.enrolled_count}
                        </span>
                        <span className={`text-xl ${colors.textSecondary}`}>/ {selectedCourseObj.capacity}</span>
                    </div>
                    <div className={`w-48 h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full mt-2 overflow-hidden`}>
                        <div 
                            className={`h-full ${selectedCourseObj.enrolled_count >= selectedCourseObj.capacity ? 'bg-red-500' : 'bg-green-500'}`} 
                            style={{ width: `${Math.min((selectedCourseObj.enrolled_count / (selectedCourseObj.capacity || 1)) * 100, 100)}%` }}
                        ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bildirimler */}
            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={20}/> : <AlertCircle size={20}/>}
                    {message.text}
                </div>
            )}

            {selectedCourseId && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 2. ÖĞRENCİ HAVUZU */}
                <div className={`${colors.bgCard} border ${colors.border} rounded-xl p-6 shadow-sm h-[600px] flex flex-col transition-colors duration-300`}>
                    <h3 className={`font-bold mb-4 ${colors.textPrimary}`}>{t.searchStudents}</h3>
                    
                    <div className="relative mb-4">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${colors.textSecondary}`} size={18} />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t.searchPlaceholder}
                            className={`w-full pl-10 p-2 rounded-lg border ${colors.border} ${colors.bgMain} ${colors.textPrimary} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {filteredStudents.length > 0 ? filteredStudents.map(s => {
                            const isSelected = selectedStudents.has(s.id);
                            return (
                                <div 
                                    key={s.id} 
                                    onClick={() => handleSelectStudent(s.id)}
                                    className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-all ${isSelected 
                                        ? 'border-purple-500 bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100' 
                                        : `${colors.border} ${colors.hoverBg}`}`}
                                >
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-purple-500 border-purple-500' : 'border-gray-400 dark:border-gray-600'}`}>
                                        {isSelected && <Check size={14} className="text-white"/>}
                                    </div>
                                    <div>
                                        <div className={`font-semibold text-sm ${isSelected ? 'text-purple-900 dark:text-purple-100' : colors.textPrimary}`}>{s.name} {s.surname}</div>
                                        <div className={`text-xs ${isSelected ? 'text-purple-700 dark:text-purple-300' : colors.textSecondary}`}>{s.student_number} • {s.department}</div>
                                    </div>
                                </div>
                            )
                        }) : (
                            <div className={`text-center ${colors.textSecondary} mt-10`}>No students found to add.</div>
                        )}
                    </div>

                    <div className={`mt-4 pt-4 border-t ${colors.border}`}>
                        <button 
                            onClick={handleEnrollSelected}
                            disabled={isSubmitting || selectedStudents.size === 0 || (selectedCourseObj && selectedCourseObj.capacity > 0 && selectedCourseObj.enrolled_count >= selectedCourseObj.capacity)}
                            className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                                (selectedStudents.size === 0 || (selectedCourseObj && selectedCourseObj.capacity > 0 && selectedCourseObj.enrolled_count >= selectedCourseObj.capacity))
                                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                                : `${colors.accentPurple} hover:opacity-90 shadow-md`
                            }`}
                        >
                            {isSubmitting ? t.enrolling : `${t.enrollSelected} (${selectedStudents.size})`}
                        </button>
                    </div>
                </div>

                {/* 3. KAYITLI ÖĞRENCİLER LİSTESİ */}
                <div className={`${colors.bgCard} border ${colors.border} rounded-xl p-0 overflow-hidden shadow-sm h-[600px] flex flex-col transition-colors duration-300`}>
                    <div className={`p-6 border-b ${colors.border} ${colors.headerBg} flex justify-between items-center`}>
                        <h3 className={`font-bold ${colors.textPrimary}`}>{t.enrolledStudents}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} ${colors.textPrimary}`}>{enrolledList.length}</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className={`${colors.headerBg} sticky top-0 z-10`}>
                                <tr>
                                    <th className={`p-4 text-xs font-bold uppercase ${colors.textSecondary}`}>#</th>
                                    <th className={`p-4 text-xs font-bold uppercase ${colors.textSecondary}`}>{t.studentNumber}</th>
                                    <th className={`p-4 text-xs font-bold uppercase ${colors.textSecondary}`}>{t.name}</th>
                                    <th className={`p-4 text-xs font-bold uppercase ${colors.textSecondary} text-right`}>{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${colors.border}`}>
                                {enrolledList.length > 0 ? enrolledList.map((s, idx) => (
                                    <tr key={`${s.id}-${idx}`} className={`${colors.rowHoverBg} transition-colors`}>
                                        <td className={`p-4 text-sm ${colors.textSecondary}`}>{idx + 1}</td>
                                        <td className={`p-4 text-sm font-mono ${colors.textPrimary}`}>{s.student_number}</td>
                                        <td className={`p-4 text-sm ${colors.textPrimary}`}>{s.name} {s.surname}</td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => initiateRemove(s.id)}
                                                disabled={isSubmitting}
                                                className="p-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                                                title={t.removeTooltip}
                                            >
                                                <X size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className={`p-10 text-center ${colors.textSecondary}`}>{t.noStudents}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

              </div>
            )}

            {!selectedCourseId && (
                <div className={`text-center py-20 ${colors.textSecondary} opacity-50`}>
                    <BookOpen size={64} className="mx-auto mb-4"/>
                    <p className="text-xl">Please select a course to manage enrollments.</p>
                </div>
            )}

          </div>
        </div>
      </div>

      {/* --- YENİ: ÖZEL ONAY MODALI (Siyah Ekran Uyarısı Yerine) --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className={`${colors.bgCard} rounded-xl shadow-2xl max-w-sm w-full p-6 border ${colors.border} animate-fade-in`}>
            
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
                <Trash2 size={24} />
              </div>
              <h3 className={`text-xl font-bold ${colors.textPrimary} mb-2`}>{t.confirmTitle}</h3>
              <p className={`text-sm ${colors.textSecondary}`}>{t.confirmDesc}</p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className={`flex-1 py-2.5 rounded-lg border ${colors.border} ${colors.textPrimary} hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} transition font-medium`}
              >
                {t.cancelBtn}
              </button>
              <button 
                onClick={confirmRemoveStudent}
                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium shadow-md"
              >
                {t.confirmBtn}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}