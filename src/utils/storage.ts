import { StudentQuizResult } from '../types/quiz';

const STORAGE_KEY = 'tangkap_kecoak_puisi_results_v1';
const SETTINGS_KEY = 'tangkap_kecoak_settings_v1';

export const INITIAL_SAMPLE_RESULTS: StudentQuizResult[] = [
  {
    id: 'res-1',
    studentName: 'Ahmad Fauzi',
    studentClass: '8A',
    score: 100,
    correctCount: 10,
    wrongCount: 0,
    unansweredCount: 0,
    totalQuestions: 10,
    totalTimeSeconds: 68,
    timestamp: '2026-11-06 08:15',
    passed: true,
    answers: Array.from({ length: 10 }).map((_, i) => ({
      questionId: i + 1,
      chosenAnswer: ['B', 'C', 'A', 'D', 'B', 'C', 'A', 'B', 'C', 'D'][i] as any,
      isCorrect: true,
      timeSpentSeconds: 6 + Math.floor(Math.random() * 3),
    })),
  },
  {
    id: 'res-2',
    studentName: 'Nadhira Putri Kirana',
    studentClass: '8B',
    score: 90,
    correctCount: 9,
    wrongCount: 1,
    unansweredCount: 0,
    totalQuestions: 10,
    totalTimeSeconds: 74,
    timestamp: '2026-11-06 08:22',
    passed: true,
    answers: Array.from({ length: 10 }).map((_, i) => ({
      questionId: i + 1,
      chosenAnswer: i === 5 ? 'A' : (['B', 'C', 'A', 'D', 'B', 'C', 'A', 'B', 'C', 'D'][i] as any),
      isCorrect: i !== 5,
      timeSpentSeconds: 7,
    })),
  },
  {
    id: 'res-3',
    studentName: 'Bagas Aditya Rahman',
    studentClass: '8A',
    score: 80,
    correctCount: 8,
    wrongCount: 2,
    unansweredCount: 0,
    totalQuestions: 10,
    totalTimeSeconds: 85,
    timestamp: '2026-11-06 08:30',
    passed: true,
    answers: Array.from({ length: 10 }).map((_, i) => ({
      questionId: i + 1,
      chosenAnswer: i === 3 || i === 7 ? 'A' : (['B', 'C', 'A', 'D', 'B', 'C', 'A', 'B', 'C', 'D'][i] as any),
      isCorrect: i !== 3 && i !== 7,
      timeSpentSeconds: 8,
    })),
  },
  {
    id: 'res-4',
    studentName: 'Dewi Lestari',
    studentClass: '8C',
    score: 90,
    correctCount: 9,
    wrongCount: 1,
    unansweredCount: 0,
    totalQuestions: 10,
    totalTimeSeconds: 65,
    timestamp: '2026-11-06 08:35',
    passed: true,
    answers: Array.from({ length: 10 }).map((_, i) => ({
      questionId: i + 1,
      chosenAnswer: i === 8 ? 'B' : (['B', 'C', 'A', 'D', 'B', 'C', 'A', 'B', 'C', 'D'][i] as any),
      isCorrect: i !== 8,
      timeSpentSeconds: 6,
    })),
  },
  {
    id: 'res-5',
    studentName: 'Rian Syahputra',
    studentClass: '8B',
    score: 70,
    correctCount: 7,
    wrongCount: 3,
    unansweredCount: 0,
    totalQuestions: 10,
    totalTimeSeconds: 98,
    timestamp: '2026-11-06 08:42',
    passed: false,
    answers: Array.from({ length: 10 }).map((_, i) => ({
      questionId: i + 1,
      chosenAnswer: (i === 1 || i === 4 || i === 9) ? 'A' : (['B', 'C', 'A', 'D', 'B', 'C', 'A', 'B', 'C', 'D'][i] as any),
      isCorrect: !(i === 1 || i === 4 || i === 9),
      timeSpentSeconds: 9,
    })),
  },
];

export const loadStoredResults = (): StudentQuizResult[] => {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_RESULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_RESULTS));
      return INITIAL_SAMPLE_RESULTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading stored results', e);
    return INITIAL_SAMPLE_RESULTS;
  }
};

export const saveResult = (result: StudentQuizResult): StudentQuizResult[] => {
  try {
    const current = loadStoredResults();
    const updated = [result, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving result', e);
    return [];
  }
};

export const clearStoredResults = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing results', e);
  }
};

export const appendSampleData = (): StudentQuizResult[] => {
  try {
    const current = loadStoredResults();
    const combined = [...current, ...INITIAL_SAMPLE_RESULTS.map(r => ({ ...r, id: `sample-${Date.now()}-${Math.random()}` }))];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
    return combined;
  } catch (e) {
    return loadStoredResults();
  }
};
