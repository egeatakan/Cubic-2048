'use client';
if (typeof window !== 'undefined' && typeof (window as any).exports === 'undefined') {
  (window as any).exports = {};
}
//
import dynamic from 'next/dynamic';

const Game = dynamic(() => import('../components/Game'), { 
  ssr: false,
  loading: () => <div style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>Loading 3D Engine...</div>
});

export default function Page() {
  return <Game />;
}