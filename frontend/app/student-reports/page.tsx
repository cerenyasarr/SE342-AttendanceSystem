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
  Menu, // Hamburger iconu
  X     // Kapatma (X) iconu
} from 'lucide-react';

// --- MOCK DATA ---
const summaryCards = [
  { title: 'Total Sessions', value: '8', icon: BookOpen, color: 'bg-purple-100 text-purple-600' },
  { title: 'Present', value: '6', icon: CheckCircle2, color: 'bg-green-100 text-green-600' },
  { title: 'Absent', value: '2', icon: XCircle, color: 'bg-red-100 text-red-600' },
  { title: 'Attendance Rate', value: '75%', icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
];

const courseAttendanceData = [
  { code: 'CSE101', name: 'Algorithms and Programming I', attended: 3, total: 3, percentage: 100 },
  { code: 'CSE102', name: 'Data Structures', attended: 1, total: 2, percentage: 50 },
  { code: 'CSE201', name: 'Object Oriented Programming', attended: 1, total: 2, percentage: 50 },
  { code: 'CSE301', name: 'Database Management Systems', attended: 1, total: 1, percentage: 100 },
];

export default function StudentReportsPage() {
  // Mobilde menünün açık/kapalı durumunu tutan state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans relative">
      
      {/* --- MOBILE OVERLAY (Menü açılınca arkadaki karartı) --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#8e3c9e] text-white flex flex-col shrink-0 
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
             <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-sm shrink-0">
              <span className="text-xl font-bold text-[#8e3c9e]">M</span> 
             </div>
             <div>
              <h1 className="text-lg font-bold leading-tight">Maltepe Uni</h1>
              <p className="text-xs text-purple-200 opacity-80">Attendance Sys</p>
             </div>
           </div>

           {/* Mobile Close Button (Sadece mobilde görünür) */}
           <button 
             onClick={() => setIsSidebarOpen(false)}
             className="lg:hidden text-white/80 hover:text-white"
           >
             <X size={24} />
           </button>
        </div>

        {/* Menu */}
        <nav className="px-4 flex-1">
          <button className="w-full flex items-center gap-3 bg-white text-[#8e3c9e] px-4 py-3 rounded-xl font-semibold shadow-sm transition-transform hover:scale-[1.02]">
            <LayoutDashboard size={20} />
            <span>My Attendance</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 mt-auto">
           <div className="flex items-center gap-3 mb-6">
            <button className="flex items-center gap-1 bg-purple-800/40 hover:bg-purple-800/60 text-white px-3 py-1.5 rounded-md text-xs transition">
              <Globe size={14} />
              <span>EN</span>
            </button>
            <button className="p-1.5 bg-purple-800/40 hover:bg-purple-800/60 text-white rounded-full transition">
              <Moon size={14} />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm opacity-80">Welcome,</p>
            <h4 className="font-bold text-lg">Student 2024001</h4>
            <p className="text-xs text-purple-200">Undergraduate Student</p>
          </div>

          <button className="w-full flex items-center justify-center gap-2 border border-purple-300/30 hover:bg-purple-800/30 text-white px-4 py-2.5 rounded-lg text-sm transition">
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>


      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-h-screen w-full">
        
        {/* MOBILE HEADER (Sadece mobilde görünen üst bar) */}
        <div className="lg:hidden bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-2">
             <span className="text-xl font-bold text-[#8e3c9e]">M</span>
             <span className="font-bold text-gray-700">Maltepe Uni</span>
          </div>
          {/* Hamburger Button */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 lg:p-12 flex-1 overflow-y-auto">
          
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#8e3c9e] mb-2">My Attendance Dashboard</h2>
            <p className="text-sm lg:text-base text-gray-500">View your personal attendance records (FR-11)</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-10">
            {summaryCards.map((card, index) => (
              <div key={index} className="bg-white p-5 lg:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                <div className={`p-3 lg:p-4 rounded-xl ${card.color}`}>
                  <card.icon size={24} className="lg:w-7 lg:h-7" />
                </div>
                <div>
                  <h3 className="text-xs lg:text-sm font-medium text-gray-500 mb-1">{card.title}</h3>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-800">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Course List */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <BookOpen size={20} className="text-[#8e3c9e]"/>
              <h3 className="text-lg lg:text-xl font-bold text-gray-800">Course Attendance Status</h3>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {courseAttendanceData.map((course, index) => (
                <div key={index} className={`p-5 lg:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${index !== courseAttendanceData.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-base lg:text-lg mb-1">
                      <span className="text-[#8e3c9e]">{course.code}</span> - {course.name}
                    </h4>
                    <p className="text-sm text-gray-500 font-medium">
                      {course.attended} / {course.total} sessions
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-1/2 xl:w-1/3">
                    <div className="w-full h-2.5 lg:h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${course.percentage >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${course.percentage}%` }}
                      ></div>
                    </div>
                    <span className={`font-bold text-base lg:text-lg w-12 text-right ${course.percentage >= 70 ? 'text-green-600' : 'text-red-600'}`}>
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