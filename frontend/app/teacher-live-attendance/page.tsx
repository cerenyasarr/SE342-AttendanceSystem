"use client";

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Globe, 
  Moon, 
  LogOut, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  Menu, 
  X 
} from 'lucide-react';

// --- MOCK DATA (Sahte Veriler) ---
const summaryCards = [
  // Dark mode için renkleri opaklık (opacity) ayarlı hale getirdik
  { title: 'Total Sessions', value: '8', icon: BookOpen, color: 'bg-purple-500/20 text-purple-400' },
  { title: 'Present', value: '6', icon: CheckCircle2, color: 'bg-green-500/20 text-green-400' },
  { title: 'Absent', value: '2', icon: XCircle, color: 'bg-red-500/20 text-red-400' },
  { title: 'Attendance Rate', value: '75%', icon: TrendingUp, color: 'bg-blue-500/20 text-blue-400' },
];

const courseAttendanceData = [
  { code: 'CSE101', name: 'Algorithms and Programming I', attended: 3, total: 3, percentage: 100 },
  { code: 'CSE102', name: 'Data Structures', attended: 1, total: 2, percentage: 50 },
  { code: 'CSE201', name: 'Object Oriented Programming', attended: 1, total: 2, percentage: 50 },
  { code: 'CSE301', name: 'Database Management Systems', attended: 1, total: 1, percentage: 100 },
];

export default function StudentReportsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- RENK PALETİ (Canlı Yoklama görselinden alındı) ---
  const colors = {
    bgMain: "bg-[#0f172a]",      // En koyu arka plan (Slate 900)
    bgCard: "bg-[#1e293b]",      // Kart ve Sidebar arka planı (Slate 800)
    textPrimary: "text-white",   // Ana metin
    textSecondary: "text-gray-400", // İkincil metin (soluk)
    accentPurple: "bg-[#8e3c9e]", // Mor vurgu rengi
    textPurple: "text-[#bd5adf]", // Mor yazı rengi
    border: "border-gray-800"    // Kenarlık çizgileri
  };

  return (
    <div className={`flex min-h-screen ${colors.bgMain} font-sans relative text-gray-100`}>
      
      {/* --- MOBILE OVERLAY --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 ${colors.bgCard} border-r ${colors.border} flex flex-col shrink-0 
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
             <div className={`${colors.accentPurple} w-10 h-10 rounded-lg flex items-center justify-center shadow-sm shrink-0`}>
              <span className="text-xl font-bold text-white">M</span> 
             </div>
             <div>
              <h1 className="text-lg font-bold leading-tight text-white">Maltepe Uni</h1>
              <p className={`text-xs ${colors.textSecondary} opacity-80`}>Attendance Sys</p>
             </div>
           </div>
           <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
             <X size={24} />
           </button>
        </div>

        {/* Menu */}
        <nav className="px-4 flex-1">
          {/* Aktif Menü Elemanı */}
          <button className={`w-full flex items-center gap-3 ${colors.accentPurple} text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-purple-900/20 transition-transform hover:scale-[1.02]`}>
            <LayoutDashboard size={20} />
            <span>My Attendance</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className={`p-6 mt-auto border-t ${colors.border}`}>
           <div className="flex items-center gap-3 mb-6">
            <button className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-md text-xs transition">
              <Globe size={14} />
              <span>EN</span>
            </button>
            <button className="p-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition">
              <Moon size={14} />
            </button>
          </div>

          <div className="mb-6">
            <p className={`text-sm ${colors.textSecondary}`}>Welcome,</p>
            <h4 className="font-bold text-lg text-white">Student 2024001</h4>
            <p className={`text-xs ${colors.textSecondary}`}>Undergraduate Student</p>
          </div>

          <button className={`w-full flex items-center justify-center gap-2 border border-gray-700 hover:bg-gray-800 text-gray-300 px-4 py-2.5 rounded-lg text-sm transition`}>
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>


      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-h-screen w-full">
        
        {/* MOBILE HEADER */}
        <div className={`lg:hidden ${colors.bgCard} border-b ${colors.border} p-4 flex items-center justify-between sticky top-0 z-30`}>
          <div className="flex items-center gap-2">
             <span className={`text-xl font-bold ${colors.textPurple}`}>M</span>
             <span className="font-bold text-white">Maltepe Uni</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-300 hover:bg-gray-800 rounded-lg">
            <Menu size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 lg:p-12 flex-1 overflow-y-auto">
          
          {/* Başlık Alanı */}
          <div className="mb-10">
            <h2 className={`text-3xl font-bold ${colors.textPrimary} mb-2`}>My Attendance Dashboard</h2>
            <p className={colors.textSecondary}>View your personal attendance records (FR-11)</p>
          </div>

          {/* Özet Kartları (Summary Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            {summaryCards.map((card, index) => (
              <div key={index} className={`${colors.bgCard} border ${colors.border} p-6 rounded-2xl shadow-lg flex items-center gap-5 hover:border-gray-700 transition-colors`}>
                <div className={`p-4 rounded-xl ${card.color}`}>
                  <card.icon size={28} />
                </div>
                <div>
                  <h3 className={`text-sm font-medium ${colors.textSecondary} mb-1`}>{card.title}</h3>
                  <p className="text-3xl font-bold text-white">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ders Listesi (Course Attendance List) */}
          <div>
            <div className="flex items-center gap-3 mb-6">
               <div className={`p-2 rounded-lg ${colors.bgCard} border ${colors.border}`}>
                 <BookOpen size={20} className={colors.textPurple}/>
               </div>
               <h3 className="text-xl font-bold text-white">Course Attendance Status</h3>
            </div>

            <div className={`${colors.bgCard} border ${colors.border} rounded-2xl shadow-lg overflow-hidden`}>
              {courseAttendanceData.map((course, index) => (
                <div key={index} className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 ${index !== courseAttendanceData.length - 1 ? `border-b ${colors.border}` : ''}`}>
                  
                  {/* Sol Kısım: Ders Bilgisi */}
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-lg mb-1">
                      <span className={colors.textPurple}>{course.code}</span> - {course.name}
                    </h4>
                    <p className={`text-sm ${colors.textSecondary} font-medium`}>
                      {course.attended} / {course.total} sessions
                    </p>
                  </div>

                  {/* Sağ Kısım: Progress Bar */}
                  <div className="flex items-center gap-6 w-full md:w-1/2 xl:w-1/3">
                    {/* Bar Arka Planı (Koyu) */}
                    <div className="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${course.percentage >= 70 ? 'bg-green-500' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}
                        style={{ width: `${course.percentage}%` }}
                      ></div>
                    </div>
                    {/* Yüzde Yazısı */}
                    <span className={`font-bold text-lg w-16 text-right ${course.percentage >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                      %{course.percentage}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}