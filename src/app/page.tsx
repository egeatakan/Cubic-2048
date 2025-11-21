'use client';

// --- YAMA (POLYFILL) BAŞLANGICI ---
// Bu kısım, tarayıcıda 'exports is not defined' hatasını çözmek için gereklidir.
// Bazı three.js eklentileri (troika vb.) global exports objesini arar.
if (typeof window !== 'undefined') {
  // Eğer exports tanımlı değilse, boş bir obje olarak tanımla.
  if (!(window as any).exports) {
    (window as any).exports = {};
  }
}
// --- YAMA BİTİŞİ ---

import dynamic from 'next/dynamic';

// Game bileşenini dinamik olarak yüklüyoruz.
// ssr: false -> Bu bileşen sunucuda ASLA çalıştırılmayacak.
const Game = dynamic(() => import('../components/Game'), { 
  ssr: false,
  loading: () => (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#111', 
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      Loading 3D Engine...
    </div>
  )
});

export default function Page() {
  return <Game />;
}