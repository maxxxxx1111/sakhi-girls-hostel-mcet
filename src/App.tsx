import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingHero } from './components/LandingHero';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StudentDashboard } from './components/student/StudentDashboard';
import { WardenDashboard } from './components/warden/WardenDashboard';
import { AuthModal } from './components/AuthModal';
import { SOSModal } from './components/SOSModal';
import { DbmsProjectModal } from './components/common/DbmsProjectModal';

const MainLayout: React.FC = () => {
  const { role, isDbmsModalOpen, setIsDbmsModalOpen } = useApp();

  return (
    <>
      {role === 'student' ? (
        <>
          <StudentDashboard />
          <AuthModal />
          <SOSModal />
        </>
      ) : (
        <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-violet-600 selection:text-white font-body relative overflow-x-hidden transition-colors duration-200">
          {/* Ambient Depth Background Blobs (Low opacity, blurred off-canvas edges) */}
          <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 -z-10" />
          <div className="fixed bottom-10 right-10 w-[450px] h-[450px] bg-indigo-600/8 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="fixed top-1/2 left-0 w-[300px] h-[300px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />

          {/* Global Navbar */}
          <Navbar />

          {/* Dynamic Main Body Content */}
          <main className="flex-1 w-full flex flex-col relative z-10">
            {!role && <LandingHero />}
            {role === 'warden' && <WardenDashboard />}
          </main>

          {/* College Institutional Footer */}
          <Footer />

          {/* Global Modals */}
          <AuthModal />
          <SOSModal />
        </div>
      )}

      {/* Academic DBMS Project Architecture & Live SQL Sandbox Modal */}
      <DbmsProjectModal
        isOpen={isDbmsModalOpen}
        onClose={() => setIsDbmsModalOpen(false)}
      />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
