
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { LogIn, GraduationCap, Users } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock user creation
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email: email,
      role: role,
      studentNumber: role === 'student' ? '20240001' : undefined
    };
    
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
            <LogIn size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">QR Yoklama Sistemi</h1>
          <p className="text-gray-500 mt-2">Derslerinize hızlıca katılın</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Adresi</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="isim@okul.edu.tr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition ${
                role === 'student' 
                ? 'border-blue-600 bg-blue-50 text-blue-600' 
                : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <GraduationCap size={24} />
              <span className="mt-2 font-medium">Öğrenci</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition ${
                role === 'teacher' 
                ? 'border-blue-600 bg-blue-50 text-blue-600' 
                : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <Users size={24} />
              <span className="mt-2 font-medium">Öğretmen</span>
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-200 transition transform active:scale-95"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
