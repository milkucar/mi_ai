
export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentNumber?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
}

export interface AttendanceSession {
  id: string;
  courseId: string;
  startTime: number;
  qrToken: string;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  timestamp: number;
  studentName: string;
  studentNumber: string;
}
