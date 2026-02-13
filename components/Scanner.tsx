
import React, { useEffect, useRef, useState } from 'react';
import { Camera, AlertCircle } from 'lucide-react';

interface ScannerProps {
  onScan: (data: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationId: number;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          scan();
        }
      } catch (err) {
        setError('Kamera erişimi reddedildi veya bulunamadı.');
        console.error(err);
      }
    };

    const scan = () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { willReadFrequently: true });

      if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // This is where a real QR library like jsQR would go
        // For simulation in this environment, we provide a mock "Success" button 
        // to mimic a successful scan if the browser environment is restricted
      }
      animationId = requestAnimationFrame(scan);
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleManualSimulate = () => {
    // In a real app, this logic is triggered automatically by jsQR when it finds a code in the video frame
    // For this prototype, we simulate finding a valid QR code
    const stored = localStorage.getItem('app_active_session');
    const mockData = {
        sessionId: '123',
        token: 'TOKEN_abc',
        courseName: 'Demo Course'
    };
    onScan(JSON.stringify(mockData));
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black aspect-square max-w-[300px] mx-auto group">
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-gray-900">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <p className="font-medium">{error}</p>
        </div>
      ) : (
        <>
          <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 border-2 border-blue-500 border-dashed opacity-50 m-12 pointer-events-none rounded-2xl"></div>
          
          <div className="absolute inset-x-0 bottom-4 flex justify-center">
            <button 
              onClick={handleManualSimulate}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full border border-white/50"
            >
              Demo: Tara (Simüle Et)
            </button>
          </div>

          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-medium uppercase tracking-wider">Canlı Tarama</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Scanner;
