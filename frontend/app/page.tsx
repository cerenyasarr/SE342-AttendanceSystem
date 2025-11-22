"use client";

import dynamic from 'next/dynamic';

// ============= DEĞİŞTİRİN: Hangi sayfayı görmek istediğinizi buraya yazın =============
// Seçenek: "log-in"
const ACTIVE_PAGE = "teacher-live-attendance";
// ====================================================================================

// Sayfaları dinamik olarak import et
const pages: { [key: string]: any } = {
  'log-in': dynamic(() => import('./log-in/page')),
  'teacher-live-attendance': dynamic(() => import('./teacher-live-attendance/page')),
};

export default function Home() {
  const ActiveComponent = pages[ACTIVE_PAGE];
  
  if (!ActiveComponent) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-red-50 font-sans">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Hata: Sayfa bulunamadı</h1>
          <p className="text-lg text-red-500 mb-4">ACTIVE_PAGE değeri "{ACTIVE_PAGE}" geçersiz</p>
          <p className="text-gray-600">Geçerli seçenekler: log-in, teacher-live-attendance</p>
        </div>
      </div>
    );
  }

  return <ActiveComponent />;
}
