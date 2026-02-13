
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import Header from './components/Header';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Persistence simulation
  useEffect(() => {
    const savedUser = localStorage.getItem('app_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('app_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('app_user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        {user.role === 'teacher' ? (
          <TeacherDashboard user={user} />
        ) : (
          <StudentDashboard user={user} />
        )}
      </main>
      <footer className="py-4 text-center text-gray-500 text-sm border-t border-gray-200">
        &copy; 2024 QR Attendance System • Mobil Uyumlu
      </footer>
    </div>
  );
};

export default App;
