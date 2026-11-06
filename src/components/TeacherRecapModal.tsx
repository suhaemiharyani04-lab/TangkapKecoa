import React, { useState, useMemo } from 'react';
import { StudentQuizResult, Question } from '../types/quiz';
import {
  X,
  Download,
  Printer,
  Trash2,
  Search,
  Filter,
  BarChart3,
  Users,
  Award,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  PlusCircle,
  Settings,
  BookOpen,
  ArrowUpDown
} from 'lucide-react';

interface TeacherRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: StudentQuizResult[];
  questions: Question[];
  onClearResults: () => void;
  onAddSampleData: () => void;
  timeLimit: number;
  onUpdateTimeLimit: (limit: number) => void;
  passingScore: number;
  onUpdatePassingScore: (score: number) => void;
}

export const TeacherRecapModal: React.FC<TeacherRecapModalProps> = ({
  isOpen,
  onClose,
  results,
  questions,
  onClearResults,
  onAddSampleData,
  timeLimit,
  onUpdateTimeLimit,
  passingScore,
  onUpdatePassingScore,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Tab: 'rekap' | 'analisis' | 'pengaturan'
  const [activeTab, setActiveTab] = useState<'rekap' | 'analisis' | 'pengaturan'>('rekap');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'score' | 'time' | 'name' | 'date'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  if (!isOpen) return null;

  // PIN check
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === '1234' || enteredPin === 'guru' || enteredPin === '') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Unique classes for filter
  const classList = Array.from(new Set(results.map((r) => r.studentClass))).sort();

  // Filtered and sorted results
  const filteredResults = useMemo(() => {
    return results
      .filter((r) => {
        const matchesName = r.studentName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass = selectedClassFilter === 'ALL' || r.studentClass === selectedClassFilter;
        return matchesName && matchesClass;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortField === 'score') diff = a.score - b.score;
        else if (sortField === 'time') diff = a.totalTimeSeconds - b.totalTimeSeconds;
        else if (sortField === 'name') diff = a.studentName.localeCompare(b.studentName);
        else if (sortField === 'date') diff = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();

        return sortOrder === 'desc' ? -diff : diff;
      });
  }, [results, searchQuery, selectedClassFilter, sortField, sortOrder]);

  // Aggregate stats
  const totalStudents = results.length;
  const averageScore = totalStudents > 0
    ? (results.reduce((acc, curr) => acc + curr.score, 0) / totalStudents).toFixed(1)
    : '0';
  const highestScore = totalStudents > 0
    ? Math.max(...results.map((r) => r.score))
    : 0;
  const passedStudents = results.filter((r) => r.score >= passingScore).length;
  const passRate = totalStudents > 0
    ? ((passedStudents / totalStudents) * 100).toFixed(0)
    : '0';

  // Item analysis (soal nomor 1-10 accuracy)
  const itemAnalysis = useMemo(() => {
    return questions.map((q) => {
      let correctAnswers = 0;
      let totalAnswers = 0;

      results.forEach((res) => {
        const ans = res.answers.find((a) => a.questionId === q.id);
        if (ans) {
          totalAnswers++;
          if (ans.isCorrect) correctAnswers++;
        }
      });

      const percentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
      return {
        questionId: q.id,
        topic: q.topic || `Soal ${q.id}`,
        questionText: q.question,
        correctAnswers,
        totalAnswers,
        percentage,
        isDifficult: percentage < 60 && totalAnswers > 0,
      };
    });
  }, [questions, results]);

  // Export to CSV
  const handleExportCSV = () => {
    if (results.length === 0) {
      alert('Belum ada data nilai siswa untuk diekspor!');
      return;
    }

    const headers = [
      'Peringkat',
      'Nama Siswa',
      'Kelas',
      'Nilai Akhir (0-100)',
      'Jumlah Benar',
      'Jumlah Salah',
      'Total Waktu (detik)',
      'Status Ketuntasan',
      'Waktu Pengerjaan'
    ];

    const sortedForExport = [...results].sort((a, b) => b.score - a.score);

    const rows = sortedForExport.map((r, idx) => [
      idx + 1,
      `"${r.studentName.replace(/"/g, '""')}"`,
      `"${r.studentClass}"`,
      r.score,
      r.correctCount,
      r.wrongCount + r.unansweredCount,
      r.totalTimeSeconds,
      r.score >= passingScore ? 'TUNTAS' : 'REMEDIAL',
      `"${r.timestamp}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_Puisi_Kelas_8_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-700 w-full max-w-6xl rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-black text-white font-['Fredoka']">
                  Menu Guru & Rekap Nilai
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  BAHASA INDONESIA KELAS VIII
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Laporan penilaian materi puisi, analisis butir soal, dan ekspor nilai
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Authentication Gate */}
        {!isAuthenticated ? (
          <div className="p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-950/40">
              <Unlock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white font-['Fredoka'] mb-1">
              Autentikasi Guru
            </h3>
            <p className="text-xs text-stone-400 mb-5">
              Masukkan PIN guru untuk melihat rekap nilai siswa dan analisis ujian puisi.
            </p>

            <form onSubmit={handlePinSubmit} className="w-full space-y-3">
              <div>
                <input
                  type="password"
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="PIN Guru (Default: 1234)"
                  className="w-full bg-stone-950 border border-stone-700 focus:border-amber-400 rounded-xl px-4 py-3 text-center text-white text-lg tracking-widest outline-none font-mono"
                  autoFocus
                />
                <span className="text-[11px] text-stone-500 block mt-1">
                  Tip: Masukkan <strong>1234</strong> atau langsung tekan Masuk
                </span>
              </div>

              {pinError && (
                <p className="text-xs text-rose-400 font-semibold">
                  PIN salah. Coba gunakan PIN default: 1234
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-md transition-all active:scale-95"
              >
                Masuk ke Rekap Nilai
              </button>
            </form>
          </div>
        ) : (
          /* Main Dashboard Content */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top Navigation Bar / Tabs */}
            <div className="px-5 py-3 border-b border-stone-800 bg-stone-950/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('rekap')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'rekap'
                      ? 'bg-amber-400 text-stone-950 shadow-md'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Daftar Nilai ({results.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('analisis')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'analisis'
                      ? 'bg-amber-400 text-stone-950 shadow-md'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Analisis Butir Soal</span>
                </button>

                <button
                  onClick={() => setActiveTab('pengaturan')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'pengaturan'
                      ? 'bg-amber-400 text-stone-950 shadow-md'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Pengaturan Ujian</span>
                </button>
              </div>

              {/* Action Buttons: Export CSV & Print */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all"
                  title="Unduh file spreadsheet Excel/CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 transition-all"
                  title="Cetak format laporan resmi"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cetak</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Header */}
            <div className="px-5 py-3.5 bg-stone-950/40 border-b border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-stone-900/90 border border-stone-800 p-2.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Total Siswa</span>
                  <span className="text-lg font-black text-white font-mono">{totalStudents} Anak</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  👥
                </div>
              </div>

              <div className="bg-stone-900/90 border border-stone-800 p-2.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Rata-Rata Nilai</span>
                  <span className="text-lg font-black text-amber-400 font-mono">{averageScore}</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  ⭐
                </div>
              </div>

              <div className="bg-stone-900/90 border border-stone-800 p-2.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Ketuntasan (≥{passingScore})</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">{passRate}%</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  ✓
                </div>
              </div>

              <div className="bg-stone-900/90 border border-stone-800 p-2.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Nilai Tertinggi</span>
                  <span className="text-lg font-black text-purple-400 font-mono">{highestScore}</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  🏆
                </div>
              </div>
            </div>

            {/* TAB CONTENT */}
            <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
              {/* TAB 1: REKAP NILAI SISWA */}
              {activeTab === 'rekap' && (
                <div className="space-y-4">
                  {/* Search & Filter Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md">
                      <div className="relative w-full">
                        <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Cari nama siswa..."
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-stone-600 outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-stone-950 border border-stone-800 px-3 py-1.5 rounded-xl text-xs text-stone-300">
                        <Filter className="w-3.5 h-3.5 text-stone-400" />
                        <span>Kelas:</span>
                        <select
                          value={selectedClassFilter}
                          onChange={(e) => setSelectedClassFilter(e.target.value)}
                          className="bg-transparent text-amber-300 font-bold outline-none cursor-pointer"
                        >
                          <option value="ALL" className="bg-stone-900 text-white">Semua Kelas</option>
                          {classList.map((c) => (
                            <option key={c} value={c} className="bg-stone-900 text-white">
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => {
                          if (sortField === 'score') {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortField('score');
                            setSortOrder('desc');
                          }
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300 hover:text-white"
                        title="Urutkan Nilai"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        <span>Skor {sortField === 'score' ? (sortOrder === 'desc' ? '▼' : '▲') : ''}</span>
                      </button>
                    </div>
                  </div>

                  {/* Results Table */}
                  {filteredResults.length === 0 ? (
                    <div className="text-center py-12 bg-stone-950/40 rounded-2xl border border-dashed border-stone-800">
                      <div className="text-4xl mb-2">📋</div>
                      <h4 className="text-stone-300 font-bold text-sm">Belum Ada Rekap Nilai Siswa</h4>
                      <p className="text-stone-500 text-xs mt-1 max-w-sm mx-auto">
                        Nilai akan otomatis muncul di sini setelah siswa menyelesaikan kuis tangkap kecoak puisi.
                      </p>
                      <button
                        onClick={onAddSampleData}
                        className="mt-4 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 transition-all inline-flex items-center gap-2"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Muat 5 Data Simulasi Siswa Kelas 8</span>
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-stone-800 shadow-md">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-stone-950 text-stone-400 font-bold border-b border-stone-800">
                            <th className="py-3 px-4 w-12 text-center">No</th>
                            <th className="py-3 px-4">Nama Siswa</th>
                            <th className="py-3 px-4">Kelas</th>
                            <th className="py-3 px-4 text-center">Nilai (0-100)</th>
                            <th className="py-3 px-4 text-center">Benar / Salah</th>
                            <th className="py-3 px-4 text-center">Waktu</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4">Waktu Ujian</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-800/60 bg-stone-900/60">
                          {filteredResults.map((r, idx) => {
                            const isPass = r.score >= passingScore;
                            return (
                              <tr key={r.id} className="hover:bg-stone-800/40 transition-colors">
                                <td className="py-3 px-4 text-center font-mono font-bold text-stone-500">
                                  {idx + 1}
                                </td>
                                <td className="py-3 px-4 font-bold text-white">
                                  {r.studentName}
                                </td>
                                <td className="py-3 px-4 font-mono font-bold text-amber-300">
                                  {r.studentClass}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span
                                    className={`inline-block px-3 py-1 rounded-lg font-black font-mono text-sm ${
                                      isPass
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                    }`}
                                  >
                                    {r.score}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center font-mono font-semibold">
                                  <span className="text-emerald-400">{r.correctCount}</span> /{' '}
                                  <span className="text-rose-400">{r.wrongCount + r.unansweredCount}</span>
                                </td>
                                <td className="py-3 px-4 text-center font-mono text-stone-300">
                                  {r.totalTimeSeconds}s
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                      isPass
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'bg-rose-500/10 text-rose-400'
                                    }`}
                                  >
                                    {isPass ? 'Tuntas' : 'Remedial'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-stone-400 text-[11px]">
                                  {r.timestamp}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ANALISIS BUTIR SOAL */}
              {activeTab === 'analisis' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 text-xs text-stone-300">
                    <p className="font-bold text-amber-400 mb-1">
                      💡 Analisis Butir Soal Materi Puisi (Tingkat Ketercapaian Kompetensi):
                    </p>
                    <p className="text-stone-400">
                      Grafik di bawah menunjukkan persentase siswa yang berhasil menjawab dengan tepat tiap butir soal.
                      Soal yang berwarna merah memiliki persentase di bawah 60% dan memerlukan penguatan materi kembali di kelas.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {itemAnalysis.map((item) => (
                      <div
                        key={item.questionId}
                        className={`p-4 rounded-2xl border ${
                          item.isDifficult
                            ? 'bg-rose-950/20 border-rose-800/50'
                            : 'bg-stone-950/60 border-stone-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-stone-800 text-stone-200 font-black flex items-center justify-center text-xs">
                              {item.questionId}
                            </span>
                            <span className="font-bold text-amber-300 text-xs">
                              {item.topic}
                            </span>
                          </div>
                          <span
                            className={`font-mono font-black text-sm ${
                              item.isDifficult ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {item.percentage}% Benar
                          </span>
                        </div>

                        <p className="text-xs text-stone-300 font-medium mb-3 line-clamp-2">
                          {item.questionText}
                        </p>

                        {/* Progress Bar */}
                        <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.isDifficult ? 'bg-rose-500' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-stone-500 mt-2">
                          <span>
                            Dijawab benar: {item.correctAnswers} dari {item.totalAnswers} siswa
                          </span>
                          {item.isDifficult && (
                            <span className="text-rose-400 font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Perlu Penguatan
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PENGATURAN UJIAN */}
              {activeTab === 'pengaturan' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Durasi Waktu */}
                  <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-5">
                    <h4 className="text-sm font-bold text-white mb-1">
                      Waktu Pengerjaan per Soal
                    </h4>
                    <p className="text-xs text-stone-400 mb-3">
                      Atur hitungan mundur waktu saat kecoak berkeliaran di ubin laboratorium.
                    </p>

                    <div className="grid grid-cols-4 gap-2">
                      {[15, 20, 30, 45].map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => onUpdateTimeLimit(sec)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                            timeLimit === sec
                              ? 'bg-amber-400 text-stone-950 font-black shadow-md'
                              : 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          {sec} Detik
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Kriteria Ketuntasan Minimal (KKM) */}
                  <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-5">
                    <h4 className="text-sm font-bold text-white mb-1">
                      Batas Kriteria Ketuntasan Minimal (KKM)
                    </h4>
                    <p className="text-xs text-stone-400 mb-3">
                      Siswa dengan skor di bawah KKM akan berstatus Remedial.
                    </p>

                    <div className="flex items-center gap-3">
                      {[70, 75, 80, 85].map((kkm) => (
                        <button
                          key={kkm}
                          type="button"
                          onClick={() => onUpdatePassingScore(kkm)}
                          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                            passingScore === kkm
                              ? 'bg-emerald-500 text-stone-950 font-black shadow-md'
                              : 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          KKM {kkm}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Data Management */}
                  <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-5 flex flex-col gap-3">
                    <h4 className="text-sm font-bold text-white">
                      Kelola Data Siswa
                    </h4>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={onAddSampleData}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-bold transition-all"
                      >
                        <PlusCircle className="w-4 h-4 text-amber-400" />
                        <span>Tambah Data Sampel Kelas 8</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Yakin ingin mereset seluruh data hasil siswa? Tindakan ini tidak dapat dibatalkan.')) {
                            onClearResults();
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Hapus / Bersihkan Seluruh Rekap</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3.5 bg-stone-950 border-t border-stone-800 flex justify-between items-center text-xs text-stone-400">
          <span>Sistem Penilaian Puisi Kelas VIII SMP</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold transition-all"
          >
            Tutup Menu
          </button>
        </div>
      </div>
    </div>
  );
};
