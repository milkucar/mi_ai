
import React, { useState, useEffect } from 'react';
import { User, AttendanceRecord } from '../types';
import { QrCode, Camera, CheckCircle, AlertCircle, Clock, History } from 'lucide-react';
import Scanner from './Scanner';

const StudentDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastRecord, setLastRecord] = useState<AttendanceRecord | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleScan = (data: string) => {
    try {
      const parsedData = JSON.parse(data);
      if (!parsedData.sessionId || !parsedData.token) {
        throw new Error('Geçersiz QR Kod');
      }

      // Simulate API call to register attendance
      const record: AttendanceRecord = {
        id: Math.random().toString(36).substr(2, 9),
        sessionId: parsedData.sessionId,
        studentId: user.id,
        timestamp: Date.now(),
        studentName: user.name,
        studentNumber: user.studentNumber || 'Bilinmiyor'
      };

      // Save to mock database
      const existing = localStorage.getItem(`attendance_${parsedData.sessionId}`);
      const records = existing ? JSON.parse(existing) : [];
      
      // Check if already registered
      if (records.some((r: any) => r.studentId === user.id)) {
        setStatus('error');
        setErrorMsg('Bu ders için zaten yoklamanız alındı.');
        setIsScanning(false);
        return;
      }

      records.push(record);
      localStorage.setItem(`attendance_${parsedData.sessionId}`, JSON.stringify(records));

      setLastRecord(record);
      setStatus('success');
      setIsScanning(false);

      // Reset success status after a while
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setErrorMsg('QR kod okunamadı veya geçersiz.');
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xl text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-full mb-6">
          <QrCode size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Yoklama Ver</h2>
        <p className="text-gray-500 mb-8">Dersliğinizdeki QR kodu okutarak hızlıca yoklamaya katılın.</p>

        {status === 'success' && lastRecord && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center space-x-3 text-left animate-in zoom-in-95">
            <div className="bg-green-500 text-white p-2 rounded-full">
              <CheckCircle size={20} />
            </div>
            <div>
              <div className="font-bold text-green-800">Başarılı!</div>
              <div className="text-sm text-green-700">Ders katılımınız kaydedildi.</div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-3 text-left animate-in zoom-in-95">
            <div className="bg-red-500 text-white p-2 rounded-full">
              <AlertCircle size={20} />
            </div>
            <div>
              <div className="font-bold text-red-800">Hata</div>
              <div className="text-sm text-red-700">{errorMsg}</div>
            </div>
          </div>
        )}

        {isScanning ? (
          <div className="space-y-4">
            <Scanner onScan={handleScan} />
            <button
              onClick={() => setIsScanning(false)}
              className="w-full py-3 px-4 border border-gray-300 rounded-2xl font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Vazgeç
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
                setStatus('idle');
                setIsScanning(true);
            }}
            className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition transform active:scale-95"
          >
            <Camera size={24} />
            <span>Kamerayı Aç</span>
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <History size={20} className="mr-2 text-gray-400" />
          Son Katılımlarım
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition cursor-default">
            <div className="flex items-center space-x-3">
               <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                 <Clock size={20} />
               </div>
               <div>
                 <div className="font-semibold text-sm">Mobil Uygulama Geliştirme</div>
                 <div className="text-xs text-gray-500">Bugün, 14:30</div>
               </div>
            </div>
            <div className="text-green-500 font-bold text-xs">DERSTE</div>
          </div>
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition cursor-default">
            <div className="flex items-center space-x-3 opacity-60">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                 <Clock size={20} />
               </div>
               <div>
                 <div className="font-semibold text-sm">Web Programlama</div>
                 <div className="text-xs text-gray-500">Dün, 09:15</div>
               </div>
            </div>
            <div className="text-green-500 font-bold text-xs">KATILDI</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
