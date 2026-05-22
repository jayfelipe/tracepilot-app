import React, { useEffect, useState } from 'react';
import LandingPage from './page';
import DashboardPage from './dashboard/page';

export default function App() {
  const [currentHash, setCurrentHash] = useState(() => typeof window !== 'undefined' ? window.location.hash : '');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Fallback interval to guarantee real-time reactivity in frames/sandboxes
    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && window.location.hash !== currentHash) {
        setCurrentHash(window.location.hash);
      }
    }, 100);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      clearInterval(interval);
    };
  }, [currentHash]);

  // Support both #/dashboard and #dashboard for maximum reliability
  if (currentHash && currentHash.toLowerCase().includes('dashboard')) {
    return <DashboardPage />;
  }

  return <LandingPage />;
}