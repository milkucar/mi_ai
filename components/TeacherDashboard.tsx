
import React, { useState, useEffect } from 'react';
import { User, Course, AttendanceSession, AttendanceRecord } from '../types';
import { Plus, Play, StopCircle, RefreshCw, CheckCircle, Users } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const MOCK_COURSES: Course[] = [
  { id: '1', name: 'Mobil Uygulama Geliştirme', code: 'CS402' },
  { id: '2', name: 'Web Programlama', code: 'CS301' },
  { id: '3', name: 'Yapay Zeka Giriş', code: 'CS450' },
];

const TeacherDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [courses] = useState<Course[]>(MOCK_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeSession, setActiveSession] = useState<AttendanceSession | null>(null);
  const [attendees, setAttendees] = useState<AttendanceRecord[]>([]);

  // Simulate "Backend" polling for new attendees
  useEffect(() => {
    let interval: any;
    if (activeSession) {
      interval = setInterval(() => {
        const stored = localStorage.getItem(`attendance_${activeSession.id}`);
        if (stored) {
          const records: AttendanceRecord[] = JSON.parse(stored);
          setAttendees(records);
        }
      }, 2000);
    } else {
      setAttendees([]);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  const startSession = (course: Course) => {
    const newSession: AttendanceSession = {
      id: Math.random().toString(36).substr(2, 9),
      courseId: course.id,
      startTime: Date.now(),
      qrToken: `TOKEN_${Math.random().toString(36).substr(2, 9)}`,
      isActive: true
    };
    setActiveSession(newSession);
    setSelectedCourse(course);
    // Clear previous records for this session ID
    localStorage.setItem(`attendance_${newSession.id}`, JSON.stringify([]));
  };

  const stopSession = () => {
    setActiveSession(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Derslerim</h2>
        <button className="flex items-center space-x-2 text-blue-600 font-medium hover:underline">
          <Plus size={20} />
          <span>Ders Ekle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => (
          <div key={course.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded">
                  {course.code}
                </span>
                <h3 className="text-lg font-semibold mt-2">{course.name}</h3>
              </div>
              <BookOpenIcon className="text-gray-300" />
            </div>
            
            {!activeSession && (
              <button
                onClick={() => startSession(course)}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
              >
                <Play size={18} />
                <span>Yoklamayı Başlat</span>
              </button>
            )}
            {activeSession && activeSession.courseId === course.id && (
              <div className="text-blue-600 font-medium flex items-center justify-center py-2 bg-blue-50 rounded-xl">
                <RefreshCw size={18} className="animate-spin mr-2" />
                Yoklama Alınıyor...
              </div>
            )}
          </div>
        ))}
      </div>

      {activeSession && selectedCourse && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              {selectedCourse.name} - QR Kod
            </h3>
            <div className="p-4 bg-gray-50 rounded-2xl mb-6">
              <QRCodeSVG 
                value={JSON.stringify({
                  sessionId: activeSession.id,
                  token: activeSession.qrToken,
                  courseName: selectedCourse.name
                })} 
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-center text-gray-500 text-sm mb-6">
              Öğrencilere bu kodu taratmasını söyleyin. Kod otomatik olarak her derste değişir.
            </p>
            <button
              onClick={stopSession}
              className="w-full flex items-center justify-center space-x-2 bg-red-100 text-red-600 py-3 rounded-xl hover:bg-red-200 transition font-bold"
            >
              <StopCircle size={20} />
              <span>Dersi Bitir</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center">
                <Users size={20} className="mr-2 text-blue-600" />
                Katılanlar ({attendees.length})
              </h3>
              <div className="text-xs text-gray-400">Canlı Güncelleniyor</div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3 pr-2">
              {attendees.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <Users size={32} />
                  </div>
                  <p>Henüz kimse katılmadı</p>
                </div>
              ) : (
                attendees.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-right-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {record.studentName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{record.studentName}</div>
                        <div className="text-[10px] text-gray-500">{record.studentNumber}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-green-600 text-xs font-bold">
                      <CheckCircle size={14} className="mr-1" />
                      {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);

export default TeacherDashboard;
