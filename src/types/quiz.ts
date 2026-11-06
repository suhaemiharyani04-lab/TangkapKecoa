export interface Option {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: number;
  question: string;
  context?: string;
  options: Option[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  topic?: string;
}

export interface Student {
  name: string;
  classGrade: string;
  school?: string;
}

export interface AnswerRecord {
  questionId: number;
  chosenAnswer: 'A' | 'B' | 'C' | 'D' | 'TIMEOUT';
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface StudentQuizResult {
  id: string;
  studentName: string;
  studentClass: string;
  score: number; // 0 - 100
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  totalQuestions: number;
  totalTimeSeconds: number;
  timestamp: string;
  answers: AnswerRecord[];
  passed: boolean;
}

export type WeaponType = 'sandal' | 'koran' | 'raket' | 'semprotan' | 'sapu';

export interface Weapon {
  id: WeaponType;
  name: string;
  alias: string;
  icon: string;
  description: string;
  soundType: 'slap' | 'thud' | 'zap' | 'spray' | 'sweep';
  splatColor: string;
  hitEffect: string;
}

export interface SplatMark {
  id: string;
  x: number;
  y: number;
  weapon: WeaponType;
  color: string;
  size: number;
  rotation: number;
}
