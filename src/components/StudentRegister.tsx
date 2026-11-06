import React, { useState } from 'react';
import { Student } from '../types/quiz';
import { Sparkles, User, School, Play, Shield, BookOpen, Award } from 'lucide-react';

interface StudentRegisterProps {
  onStartQuiz: (student: Student) => void;
  onOpenTeacherMenu: () => void;
}

const CLASS_OPTIONS = ['8A', '8B', '8C', '8D', '8E', '8F', '8G', '8H', '8I', 'Lainnya'];

export const StudentRegister: React.FC<StudentRegisterProps> = ({
  onStartQuiz,
  onOpenTeacherMenu,
}) => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState('8A');
  const [customClass, setCustomClass] = useState('');
  const [school, setSchool] = useState('SMP');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Silakan ketik nama lengkap kamu terlebih dahulu!');
      return;
    }

    const finalClass = selectedClass === 'Lainnya' ? (customClass.trim() || 'Kelas 8') : selectedClass;

    onStartQuiz({
      name: name.trim(),
      classGrade: finalClass,
      school: school.trim() || 'SMP',
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-10 flex flex-col items-center justify-center animate-in fade-in duration-300">
      {/* Hero Badge */}
      <div className="relative mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Aplikasi Penilaian Interaktif SMP</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-white font-['Fredoka'] tracking-tight drop-shadow-lg">
          Kuis Tangkap Kecoak! 🪳
        </h1>
        <p className="text-stone-300 text-sm md:text-base mt-2 max-w-xl mx-auto">
          Materi Bahasa Indonesia Kelas VIII: <strong className="text-amber-400">Mengenal dan Memahami Puisi</strong>.
          Tepuk kecoak yang membawa jawaban benar secepat mungkin!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full items-stretch">
        {/* Left Side: Student Input Form */}
        <div className="md:col-span-7 bg-stone-900/90 border border-stone-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-stone-800">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Identitas Siswa</h2>
                <p className="text-xs text-stone-400">Masukkan data diri untuk rekap nilai otomatis oleh guru</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Nama Lengkap Siswa <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Contoh: Rian Pratama"
                    className="w-full bg-stone-950 border border-stone-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl px-4 py-3 text-white text-sm placeholder:text-stone-600 outline-none transition-all font-medium"
                    autoFocus
                  />
                </div>
              </div>

              {/* Kelas */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Pilih Kelas VIII <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {CLASS_OPTIONS.map((cls) => (
                    <button
                      type="button"
                      key={cls}
                      onClick={() => setSelectedClass(cls)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                        selectedClass === cls
                          ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/30 scale-105'
                          : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>

                {selectedClass === 'Lainnya' && (
                  <input
                    type="text"
                    value={customClass}
                    onChange={(e) => setCustomClass(e.target.value)}
                    placeholder="Tulis kelas, misal: 8-Unggulan"
                    className="mt-2 w-full bg-stone-950 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                  />
                )}
              </div>

              {/* Nama Sekolah (Opsional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                  Nama Sekolah (Opsional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Contoh: SMP Negeri 1"
                    className="w-full bg-stone-950 border border-stone-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-white text-xs outline-none"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-stone-950 font-black text-base shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 group font-['Fredoka']"
              >
                <Play className="w-5 h-5 fill-stone-950" />
                <span>MULAI TANGKAP KECOAK!</span>
              </button>
            </form>
          </div>

          {/* Quick Teacher Portal Link */}
          <div className="pt-4 mt-6 border-t border-stone-800 flex items-center justify-between">
            <span className="text-xs text-stone-400">Khusus Bapak/Ibu Guru:</span>
            <button
              onClick={onOpenTeacherMenu}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Buka Menu Guru (PIN)</span>
            </button>
          </div>
        </div>

        {/* Right Side: Game Rules & Preview */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          {/* Card 1: Cara Bermain */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-5 shadow-lg">
            <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Petunjuk Penilaian</span>
            </h3>

            <ul className="space-y-2.5 text-xs text-stone-300">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Terdapat <strong>10 butir soal</strong> pilihan ganda materi puisi kelas VIII.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Kecoak membawa opsi jawaban <strong>(A, B, C, D)</strong> dan berkeliaran di ubin laboratorium.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong>Tepuk kecoak</strong> yang membawa jawaban yang benar dengan senjatamu sebelum waktu habis!
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  4
                </span>
                <span>
                  Tiap jawaban benar bernilai <strong>10 poin</strong>. Skor maksimal <strong>100</strong>.
                </span>
              </li>
            </ul>
          </div>

          {/* Card 2: Interactive Weapon Teaser */}
          <div className="bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-950 border border-amber-900/40 rounded-3xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                Pilihan Senjata Khas
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                5 Koleksi
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 text-center">
              <div className="bg-stone-950 p-2 rounded-xl border border-stone-800 flex-1">
                <div className="text-2xl mb-1">🩴</div>
                <div className="text-[10px] font-bold text-stone-300">Sandal</div>
              </div>
              <div className="bg-stone-950 p-2 rounded-xl border border-stone-800 flex-1">
                <div className="text-2xl mb-1">🗞️</div>
                <div className="text-[10px] font-bold text-stone-300">Koran</div>
              </div>
              <div className="bg-stone-950 p-2 rounded-xl border border-stone-800 flex-1">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-[10px] font-bold text-stone-300">Raket</div>
              </div>
              <div className="bg-stone-950 p-2 rounded-xl border border-stone-800 flex-1">
                <div className="text-2xl mb-1">🧴</div>
                <div className="text-[10px] font-bold text-stone-300">Spray</div>
              </div>
              <div className="bg-stone-950 p-2 rounded-xl border border-stone-800 flex-1">
                <div className="text-2xl mb-1">🧹</div>
                <div className="text-[10px] font-bold text-stone-300">Sapu</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
