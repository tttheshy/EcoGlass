import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Benefits } from './components/Benefits';
import { Partners } from './components/Partners';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { RegisterModal } from './components/RegisterModal';
import { UserDashboard } from './components/UserDashboard';
import { Toaster } from './components/ui/sonner';

export interface User {
  name: string;
  email: string;
  points: number;
}

export interface Upload {
  id: string;
  imageData: string;
  date: string;
  points: number;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch {
      localStorage.removeItem('currentUser');
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowLoginModal(false);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleRegister = (user: User) => {
    setCurrentUser(user);
    setShowRegisterModal(false);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUserPoints = (newPoints: number) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, points: newPoints };
    setCurrentUser(updatedUser);
    
    try {
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.email === currentUser.email);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], points: newPoints };
        localStorage.setItem('users', JSON.stringify(users));
      }
    } catch {
      // Silently fail
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header
        currentUser={currentUser}
        onLoginClick={() => setShowLoginModal(true)}
        onRegisterClick={() => setShowRegisterModal(true)}
        onLogout={handleLogout}
      />

      {currentUser ? (
        <UserDashboard user={currentUser} onUpdatePoints={updateUserPoints} />
      ) : (
        <Hero onRegisterClick={() => setShowRegisterModal(true)} />
      )}

      <HowItWorks />
      <Benefits />
      <Partners />
      
      {!currentUser && (
        <FinalCTA onRegisterClick={() => setShowRegisterModal(true)} />
      )}
      
      <Footer />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegister}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />

      <Toaster />
    </div>
  );
}
