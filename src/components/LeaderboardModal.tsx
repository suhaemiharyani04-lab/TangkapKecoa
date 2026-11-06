import React, { useState, useMemo } from 'react';
import { StudentQuizResult } from '../types/quiz';
import { X, Trophy, Medal, Clock, Award, Filter, Flame } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: StudentQuizResult[];
  onStartQuiz: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  results,
  onStartQuiz,
}) => {
  const [classFilter, setClassFilter] = useState('ALL');

  if (!isOpen) return null;

  const classes = Array.from(new Set(results.map((r) => r.studentClass))).sort();

  const sortedLeaderboard = useMemo(() => {
    return results
      .filter((r) => classFilter === 'ALL' || r.studentClass === classFilter)
      .sort((a, b) => {
        // Sort primarily by highest score, secondarily by fastest time
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.totalTimeSeconds - b.totalTimeSeconds;
      });
  }, [results, classFilter]);

  const top3 = sortedLeaderboard.slice(0, 3);
  const remaining = sortedLeaderboard.slice(3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-700 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl shadow-lg shadow-amber-950/40">
              🏆
            </div>
            <div>
              <h3 className="font-black text-white text-lg font-['Fredoka'] flex items-center gap-2">
                Papan Peringkat Pembasmi Kecoak
              </h3>
              <p className="text-xs text-stone-400">
                Skor tertinggi & tercepat kuis puisi Bahasa Indonesia Kelas VIII
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter */}
        <div className="px-5 py-2.5 bg-stone-950/50 border-b border-stone-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-stone-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Kelas:</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1 text-amber-300 font-bold outline-none"
            >
              <option value="ALL">Semua Kelas 8</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  Kelas {c}
                </option>
              ))}
            </select>
          </div>

          <span className="text-stone-500 text-[11px]">
            {sortedLeaderboard.length} Penilaian Terekam
          </span>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {sortedLeaderboard.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl block mb-2">🏅</span>
              <p className="text-stone-300 font-bold text-sm">Belum Ada Rekor Nilai</p>
              <p className="text-stone-500 text-xs mt-1">
                Jadilah yang pertama menepuk kecoak dan meraih skor 100!
              </p>
            </div>
          ) : (
            <>
              {/* Podium Top 3 */}
              {top3.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 pb-1">
                  {top3.map((student, idx) => {
                    const medals = [
                      { rank: 1, label: 'Juara 1', color: 'from-amber-400 to-amber-600', ring: 'ring-amber-400', badge: '🥇' },
                      { rank: 2, label: 'Juara 2', color: 'from-slate-300 to-slate-400', ring: 'ring-slate-300', badge: '🥈' },
                      { rank: 3, label: 'Juara 3', color: 'from-amber-700 to-amber-900', ring: 'ring-amber-700', badge: '🥉' }
                    ];
                    const m = medals[idx];

                    return (
                      <div
                        key={student.id}
                        className={`bg-stone-950 border border-stone-800 rounded-2xl p-3.5 text-center relative flex flex-col justify-between shadow-lg ring-1 ${m.ring}/30`}
                      >
                        <div className="text-2xl mb-1">{m.badge}</div>
                        <h4 className="font-extrabold text-white text-sm truncate">
                          {student.studentName}
                        </h4>
                        <span className="text-xs font-bold text-amber-400">
                          Kelas {student.studentClass}
                        </span>

                        <div className="mt-2 py-1.5 px-2 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-around text-xs">
                          <div>
                            <span className="text-[10px] text-stone-500 block">Skor</span>
                            <span className="font-black text-amber-300 text-base font-mono">
                              {student.score}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-500 block">Waktu</span>
                            <span className="font-semibold text-stone-300 font-mono text-xs">
                              {student.totalTimeSeconds}s
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Ranks 4+ */}
              {remaining.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 px-1">
                    Peringkat Berikutnya
                  </h4>
                  {remaining.map((student, idx) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-stone-800 text-stone-400 font-bold flex items-center justify-center font-mono">
                          {idx + 4}
                        </span>
                        <div>
                          <strong className="text-white block font-bold text-sm">
                            {student.studentName}
                          </strong>
                          <span className="text-stone-400 text-[11px]">
                            Kelas {student.studentClass} • {student.correctCount}/10 Benar
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-amber-400 font-mono block">
                          {student.score}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          ⏱️ {student.totalTimeSeconds}s
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex justify-between items-center">
          <span className="text-xs text-stone-400">
            Penilaian Puisi SMP Edisi Interaktif
          </span>
          <button
            onClick={() => {
              onClose();
              onStartQuiz();
            }}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Ikuti Kuis Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};
