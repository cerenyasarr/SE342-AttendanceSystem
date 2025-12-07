"use client";

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Sayfaları dinamik olarak import et
const pages: { [key: string]: any } = {
  'log-in': dynamic(() => import('./log-in/page')),
  'teacher-live-attendance': dynamic(() => import('./teacher-live-attendance/page')),
  'student-reports': dynamic(() => import('./student-reports/page')),
  'student-registration': dynamic(() => import('./student-registration/page')),
  'teacher-reports': dynamic(() => import('./teacher-reports/page')),
  'course-registration': dynamic(() => import('./course-registration/page')),
  'course-enrollment': dynamic(() => import('./course-enrollment/page')),
};

function PageContent() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || 'log-in';
  const ActiveComponent = pages[page] || pages['log-in'];
  
  if (!ActiveComponent) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-red-50 font-sans">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Hata: Sayfa bulunamadı</h1>
          <p className="text-lg text-red-500 mb-4">Sayfa "{page}" geçersiz</p>
          <p className="text-gray-600">Geçerli seçenekler: log-in, teacher-live-attendance, student-reports, student-registration, teacher-reports, course-registration, course-enrollment</p>
        </div>
      </div>
    );
  }

  return <ActiveComponent />;
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a]">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <PageContent />
    </Suspense>
  );
}
