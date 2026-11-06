import React, { useState, useEffect } from 'react';
import {
  Student,
  Weapon,
  AnswerRecord,
  StudentQuizResult
} from './types/quiz';
import { OFFICIAL_PUISI_QUESTIONS, WEAPONS_LIST } from './data/questions';
import { Header } from './components/Header';
import { StudentRegister } from './components/StudentRegister';
import { GameArena } from './components/GameArena';
import { StudentResultModal } from './components/StudentResultModal';
import { WeaponModal } from './components/WeaponModal';
import { TeacherRecapModal } from './components/TeacherRecapModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import {
  loadStoredResults,
  saveResult,
  clearStoredResults,
  appendSampleData
} from './utils/storage';
import { sound } from './utils/audio';

export default function App() {
  // App views: 'register' | 'playing' | 'result'
  const [view, setView] = useState<'register' | 'playing' | 'result'>('register');

  // Student Info
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswers, setCurrentAnswers] = useState<AnswerRecord[]>([]);
  const [lastResult, setLastResult] = useState<StudentQuizResult | null>(null);

  // Settings
  const [timeLimit, setTimeLimit] = useState(20); // 20s per question
  const [passingScore, setPassingScore] = useState(75); // KKM 75
  const [currentWeapon, setCurrentWeapon] = useState<Weapon>(WEAPONS_LIST[0]);
  const [isMuted, setIsMuted] = useState(false);

  // Modals
  const [isWeaponsOpen, setIsWeaponsOpen] = useState(false);
  const [isTeacherMenuOpen, setIsTeacherMenuOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Stored Results for teacher recap
  const [results, setResults] = useState<StudentQuizResult[]>([]);

  // Load results on mount
  useEffect(() => {
    setResults(loadStoredResults());
  }, []);

  // Handle Mute toggle
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  // Start Quiz with Student
  const handleStartQuiz = (student: Student) => {
    setCurrentStudent(student);
    setCurrentQuestionIndex(0);
    setCurrentAnswers([]);
    setLastResult(null);
    setView('playing');
  };

  // Answer Submission from GameArena
  const handleAnswerSubmitted = (record: AnswerRecord) => {
    const updatedAnswers = [...currentAnswers, record];
    setCurrentAnswers(updatedAnswers);

    if (currentQuestionIndex + 1 < OFFICIAL_PUISI_QUESTIONS.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Quiz Finished! Calculate score and persist
      const correctCount = updatedAnswers.filter((a) => a.isCorrect).length;
      const wrongCount = updatedAnswers.filter((a) => !a.isCorrect && a.chosenAnswer !== 'TIMEOUT').length;
      const unansweredCount = updatedAnswers.filter((a) => a.chosenAnswer === 'TIMEOUT').length;
      const totalScore = correctCount * 10; // 10 points per question = max 100
      const totalTimeSeconds = updatedAnswers.reduce((acc, curr) => acc + curr.timeSpentSeconds, 0);

      const now = new Date();
      const dateFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
        now.getDate()
      ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const finalResult: StudentQuizResult = {
        id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        studentName: currentStudent?.name || 'Siswa Kelas 8',
        studentClass: currentStudent?.classGrade || '8A',
        score: totalScore,
        correctCount,
        wrongCount,
        unansweredCount,
        totalQuestions: OFFICIAL_PUISI_QUESTIONS.length,
        totalTimeSeconds,
        timestamp: dateFormatted,
        answers: updatedAnswers,
        passed: totalScore >= passingScore,
      };

      const updatedStored = saveResult(finalResult);
      setResults(updatedStored);
      setLastResult(finalResult);
      setView('result');
    }
  };

  // Retry quiz
  const handleRetryQuiz = () => {
    if (currentStudent) {
      setCurrentQuestionIndex(0);
      setCurrentAnswers([]);
      setLastResult(null);
      setView('playing');
    } else {
      setView('register');
    }
  };

  // Logout / Switch Student
  const handleLogout = () => {
    setCurrentStudent(null);
    setCurrentQuestionIndex(0);
    setCurrentAnswers([]);
    setLastResult(null);
    setView('register');
  };

  // Clear Results
  const handleClearResults = () => {
    clearStoredResults();
    setResults([]);
  };

  // Add Sample Data for Teacher testing
  const handleAddSampleData = () => {
    const updated = appendSampleData();
    setResults(updated);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-400 selection:text-stone-950 font-sans">
      {/* Universal Header */}
      <Header
        currentWeapon={currentWeapon}
        studentName={currentStudent?.name}
        studentClass={currentStudent?.classGrade}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenWeapons={() => setIsWeaponsOpen(true)}
        onOpenTeacherMenu={() => setIsTeacherMenuOpen(true)}
        onGoHome={() => setView('register')}
        onLogout={handleLogout}
      />

      {/* Main Body View */}
      <main className="flex-1 flex flex-col justify-center items-center relative overflow-hidden">
        {view === 'register' && (
          <StudentRegister
            onStartQuiz={handleStartQuiz}
            onOpenTeacherMenu={() => setIsTeacherMenuOpen(true)}
          />
        )}

        {view === 'playing' && currentStudent && (
          <GameArena
            questions={OFFICIAL_PUISI_QUESTIONS}
            currentQuestionIndex={currentQuestionIndex}
            timeLimitPerQuestion={timeLimit}
            currentWeapon={currentWeapon}
            studentName={currentStudent.name}
            studentClass={currentStudent.classGrade}
            onAnswerSubmitted={handleAnswerSubmitted}
            onOpenWeapons={() => setIsWeaponsOpen(true)}
          />
        )}

        {view === 'result' && lastResult && (
          <StudentResultModal
            result={lastResult}
            questions={OFFICIAL_PUISI_QUESTIONS}
            onRetry={handleRetryQuiz}
            onViewLeaderboard={() => setIsLeaderboardOpen(true)}
            onGoHome={() => setView('register')}
          />
        )}
      </main>

      {/* Weapon Modal */}
      <WeaponModal
        currentWeapon={currentWeapon}
        isOpen={isWeaponsOpen}
        onClose={() => setIsWeaponsOpen(false)}
        onSelectWeapon={(weapon) => {
          setCurrentWeapon(weapon);
          setIsWeaponsOpen(false);
        }}
      />

      {/* Teacher Recap Modal (Protected with PIN default: 1234) */}
      <TeacherRecapModal
        isOpen={isTeacherMenuOpen}
        onClose={() => setIsTeacherMenuOpen(false)}
        results={results}
        questions={OFFICIAL_PUISI_QUESTIONS}
        onClearResults={handleClearResults}
        onAddSampleData={handleAddSampleData}
        timeLimit={timeLimit}
        onUpdateTimeLimit={setTimeLimit}
        passingScore={passingScore}
        onUpdatePassingScore={setPassingScore}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        results={results}
        onStartQuiz={() => {
          setIsLeaderboardOpen(false);
          if (!currentStudent) {
            setView('register');
          } else {
            handleRetryQuiz();
          }
        }}
      />
    </div>
  );
}
