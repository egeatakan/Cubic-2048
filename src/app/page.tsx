'use client';

if (typeof window !== 'undefined') {
  if (!(window as any).exports) {
    (window as any).exports = {};
  }
}
// --- IGNORE ---

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