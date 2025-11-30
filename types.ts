export enum SubjectType {
  BIOLOGY = 'Biology',
  CHEMISTRY = 'Chemistry',
  MATHEMATICS = 'Mathematics',
  PHYSICS = 'Physics',
  ASTRONOMY = 'Astronomy'
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  xp: number;
  streak: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation: string;
}

export interface LessonContent {
  title: string;
  content: string; // Markdown
  visualPrompt: string; // Description for the 3D/Image generator
}

export interface ProgressData {
  completedLessons: string[]; // IDs like "BIO-CELL-01"
  quizScores: Record<string, number>; // ID -> Score %
  timeSpentMinutes: number;
  mastery: Record<string, number>; // Branch -> %
}

export interface Branch {
  id: string;
  name: string;
  description: string;
  totalLessons: number;
}

export interface Subject {
  id: SubjectType;
  name: string;
  icon: string;
  color: string;
  description: string;
  branches: Branch[];
}