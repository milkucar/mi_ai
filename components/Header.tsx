
import React from 'react';
import { User } from '../types';
import { LogOut, User as UserIcon, BookOpen } from 'lucide-react';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-4xl">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <BookOpen size={20} />
          </div>
          <span className="font-bold text-lg hidden sm:inline-block">EduQR</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <UserIcon size={16} />
            <span className="font-medium truncate max-w-[100px] sm:max-w-none">{user.name}</span>
            <span className="px-2 py-0.5 bg-gray-100 rounded-full text-[10px] uppercase font-bold text-gray-500">
              {user.role === 'teacher' ? 'Hoca' : 'Öğrenci'}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-gray-400 hover:text-red-500 transition rounded-full hover:bg-red-50"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
