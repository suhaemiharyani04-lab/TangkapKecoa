import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  StudentQuizResult,
  Question
} from '../types/quiz';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Printer,
  Award,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { sound } from '../utils/audio';

interface StudentResultModalProps {
  result: StudentQuizResult;
  questions: Question[];
  onRetry: () => void;
  onViewLeaderboard: () => void;
  onGoHome: () => void;
}

export const StudentResultModal: React.FC<StudentResultModalProps> = ({
  result,
  questions,
  onRetry,
  onViewLeaderboard,
  onGoHome,
}) => {
  useEffect(() => {
    // Play celebratory sound and confetti if passed or scored well
    if (result.score >= 70) {
      sound.playVictory();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
      });
    }
  }, [result.score]);

  const handlePrint = () => {
    window.print();
  };

  const minutes = Math.floor(result.totalTimeSeconds / 60);
  const seconds = result.totalTimeSeconds % 60;
  const timeFormatted = `${minutes > 0 ? `${minutes}m ` : ''}${seconds} detik`;
  const avgTimePerQuestion = (result.totalTimeSeconds / questions.length).toFixed(1);

  const isPassed = result.score >= 75;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Printable Area Container */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Decorative background glow */}
        <div
          className={`absolute -top-24 -right-24 w-72 h-72 rounded-full filter blur-3xl opacity-20 pointer-events-none ${
            isPassed ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
        />

        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-stone-800 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-stone-700">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Lembar Penilaian Hasil Belajar Siswa</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white font-['Fredoka'] print:text-black">
            Hasil Penilaian Puisi Kelas VIII
          </h1>
          <p className="text-stone-400 text-xs md:text-sm print:text-stone-700">
            Materi: Mengenal dan Memahami Puisi • Bahasa Indonesia SMP
          </p>
        </div>

        {/* Student Info Card */}
        <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-4 md:p-5 mb-6 flex flex-wrap items-center justify-between gap-4 print:bg-gray-50 print:border-gray-300">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 print:text-stone-600">
              Nama Siswa
            </span>
            <h3 className="text-lg md:text-xl font-black text-white print:text-black">
              {result.studentName}
            </h3>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 print:text-stone-600">
                Kelas
              </span>
              <p className="text-base font-bold text-amber-300 print:text-blue-700">
                {result.studentClass}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 print:text-stone-600">
                Tanggal Pengerjaan
              </span>
              <p className="text-xs font-medium text-stone-300 print:text-stone-800">
                {result.timestamp}
              </p>
            </div>
          </div>
        </div>

        {/* Main Score & Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {/* Card Nilai Akhir */}
          <div className="bg-stone-950/90 border border-stone-800 rounded-2xl p-4 text-center flex flex-col justify-center items-center shadow-md print:border-gray-300">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Nilai Akhir
            </span>
            <div className="text-4xl md:text-5xl font-black text-amber-400 font-['Fredoka'] my-1 drop-shadow">
              {result.score}
            </div>
            <span
              className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                isPassed
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isPassed ? 'TUNTAS (≥75)' : 'REMEDIAL (<75)'}
            </span>
          </div>

          {/* Card Jawaban Benar */}
          <div className="bg-stone-950/90 border border-stone-800 rounded-2xl p-4 text-center flex flex-col justify-center items-center shadow-md print:border-gray-300">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Benar
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {result.correctCount} / {result.totalQuestions}
            </div>
            <span className="text-[11px] text-stone-500">Soal Terjawab Tepat</span>
          </div>

          {/* Card Jawaban Salah */}
          <div className="bg-stone-950/90 border border-stone-800 rounded-2xl p-4 text-center flex flex-col justify-center items-center shadow-md print:border-gray-300">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-1">
              <XCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Salah / Lewat
            </span>
            <div className="text-2xl font-black text-rose-400 font-mono">
              {result.wrongCount + result.unansweredCount}
            </div>
            <span className="text-[11px] text-stone-500">Kecoak Lolos/Salah</span>
          </div>

          {/* Card Waktu */}
          <div className="bg-stone-950/90 border border-stone-800 rounded-2xl p-4 text-center flex flex-col justify-center items-center shadow-md print:border-gray-300">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Total Waktu
            </span>
            <div className="text-xl font-black text-blue-400 font-mono">
              {timeFormatted}
            </div>
            <span className="text-[11px] text-stone-500">~{avgTimePerQuestion}s / soal</span>
          </div>
        </div>

        {/* Detailed Breakdown per Question & Explanations */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm md:text-base font-extrabold text-white flex items-center gap-2 print:text-black">
              <span>📋</span>
              <span>Rincian Jawaban & Pembahasan Kunci</span>
            </h3>
            <span className="text-xs text-stone-400">
              Setiap soal benar bernilai 10 poin
            </span>
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => {
              const answerRec = result.answers.find((a) => a.questionId === q.id);
              const isCorrect = answerRec?.isCorrect || false;
              const chosen = answerRec?.chosenAnswer || 'TIMEOUT';

              return (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-2xl border transition-all text-xs md:text-sm ${
                    isCorrect
                      ? 'bg-emerald-950/20 border-emerald-800/40'
                      : 'bg-rose-950/20 border-rose-800/40'
                  } print:border-gray-200 print:bg-white`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
                          isCorrect
                            ? 'bg-emerald-500 text-stone-950'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div>
                        {q.context && (
                          <p className="text-xs text-stone-400 italic mb-0.5">
                            {q.context}
                          </p>
                        )}
                        <p className="font-bold text-stone-200 print:text-black">
                          {q.question}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 font-mono font-bold">
                      <span className="text-stone-400 text-xs">Pilihan:</span>
                      <span
                        className={`px-2 py-0.5 rounded ${
                          isCorrect
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {chosen === 'TIMEOUT' ? 'Habis ⏱️' : chosen}
                      </span>
                      {!isCorrect && (
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                          Kunci: {q.correctAnswer}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pembahasan Singkat from PDF */}
                  <div className="mt-2.5 pt-2 border-t border-stone-800/60 pl-8 flex items-start gap-2 text-xs text-stone-400 print:text-stone-600">
                    <span className="font-bold text-amber-400 flex-shrink-0">
                      💡 Pembahasan:
                    </span>
                    <span>{q.explanation}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons (Hidden when printing) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-800 print:hidden">
          <button
            onClick={onGoHome}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white font-bold text-xs md:text-sm transition-all"
          >
            Kembali ke Beranda
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs md:text-sm border border-stone-700 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Hasil</span>
            </button>

            <button
              onClick={onViewLeaderboard}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs md:text-sm border border-amber-500/30 transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Papan Peringkat</span>
            </button>

            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs md:text-sm shadow-md transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tepuk Kecoak Lagi!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
