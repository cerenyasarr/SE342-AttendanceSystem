"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Globe, 
  Moon, 
  LogOut, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  TrendingUp 
} from 'lucide-react';

// --- MOCK DATA (Placeholder data until backend is ready) ---

// Top 4 Summary Cards
const summaryCards = [
  { title: 'Total Sessions', value: '8', icon: BookOpen, color: 'bg-purple-100 text-purple-600' },
  { title: 'Present', value: '6', icon: CheckCircle2, color: 'bg-green-100 text-green-600' },
  { title: 'Absent', value: '2', icon: XCircle, color: 'bg-red-100 text-red-600' },
  { title: 'Attendance Rate', value: '75%', icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
];

// Bottom Course List Data
const courseAttendanceData = [
  { code: 'CSE101', name: 'Algorithms and Programming I', attended: 3, total: 3, percentage: 100 },
  { code: 'CSE102', name: 'Data Structures', attended: 1, total: 2, percentage: 50 },
  { code: 'CSE201', name: 'Object Oriented Programming', attended: 1, total: 2, percentage: 50 },
  { code: 'CSE301', name: 'Database Management Systems', attended: 1, total: 1, percentage: 100 },
];


export default function StudentReportsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
      {/* --- LEFT SIDEBAR --- */}
      {/* Purple Theme Color: bg-[#8e3c9e] */}
      <aside className="w-72 bg-[#8e3c9e] text-white flex flex-col shrink-0">
        
        {/* Sidebar Logo Area */}
        <div className="p-6 flex items-center gap-3 mb-6">
           {/* Logo placeholder */}
           <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-sm shrink-0">
            <span className="text-xl font-bold text-[#8e3c9e]">M</span> 
           </div>
           <div>
            <h1 className="text-lg font-bold leading-tight">Maltepe University</h1>
            <p className="text-xs text-purple-200 opacity-80">Automatic Attendance System</p>
           </div>
        </div>

        {/* Menu */}
        <nav className="px-4 flex-1">
          <button className="w-full flex items-center gap-3 bg-white text-[#8e3c9e] px-4 py-3 rounded-xl font-semibold shadow-sm transition-transform hover:scale-[1.02]">
            <LayoutDashboard size={20} />
            <span>My Attendance</span>
          </button>
          {/* Add more menu items here if needed */}
        </nav>

        {/* Sidebar Footer (Lang, Profile, Logout) */}
        <div className="p-6 mt-auto">
           {/* Lang/Theme Toggle */}
           <div className="flex items-center gap-3 mb-6">
            <button className="flex items-center gap-1 bg-purple-800/40 hover:bg-purple-800/60 text-white px-3 py-1.5 rounded-md text-xs transition">
              <Globe size={14} />
              <span>EN</span>
            </button>
            <button className="p-1.5 bg-purple-800/40 hover:bg-purple-800/60 text-white rounded-full transition">
              <Moon size={14} />
            </button>
          </div>

          {/* Profile Info */}
          <div className="mb-6">
            <p className="text-sm opacity-80">Welcome,</p>
            <h4 className="font-bold text-lg">Student 2024001</h4>
            <p className="text-xs text-purple-200">Undergraduate Student</p>
          </div>

          {/* Logout Button */}
          <button className="w-full flex items-center justify-center gap-2 border border-purple-300/30 hover:bg-purple-800/30 text-white px-4 py-2.5 rounded-lg text-sm transition">
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>


      {/* --- MAIN CONTENT (RIGHT SIDE) --- */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        
        {/* Page Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#8e3c9e] mb-2">My Attendance Dashboard</h2>
          <p className="text-gray-500">View your personal attendance records (FR-11)</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {summaryCards.map((card, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className={`p-4 rounded-xl ${card.color}`}>
                <card.icon size={28} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{card.title}</h3>
                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Course Attendance List */}
        <div>
          <div className="flex items-center gap-2 mb-6">
             <BookOpen size={20} className="text-[#8e3c9e]"/>
             <h3 className="text-xl font-bold text-gray-800">Course Attendance Status</h3>
          </div>
          <p className="text-gray-500 mb-4">Your attendance rate per course</p>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {courseAttendanceData.map((course, index) => (
              <div key={index} className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${index !== courseAttendanceData.length - 1 ? 'border-b border-gray-100' : ''}`}>
                
                {/* Left Side: Course Info */}
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-lg mb-1">
                    <span className="text-[#8e3c9e]">{course.code}</span> - {course.name}
                  </h4>
                  <p className="text-sm text-gray-500 font-medium">
                    {course.attended} / {course.total} sessions
                  </p>
                </div>

                {/* Right Side: Progress Bar */}
                <div className="flex items-center gap-6 w-full md:w-1/2 xl:w-1/3">
                  {/* Bar Background */}
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    {/* Dynamic Fill Color based on percentage */}
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${course.percentage >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${course.percentage}%` }}
                    ></div>
                  </div>
                  {/* Percentage Text */}
                  <span className={`font-bold text-lg w-16 text-right ${course.percentage >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                    %{course.percentage}
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}