import React from 'react';
import {
  Trophy,
  Volume2,
  VolumeX,
  LogOut,
  Shield,
  Home,
  UserCheck
} from 'lucide-react';
import { Weapon } from '../types/quiz';

interface HeaderProps {
  currentWeapon: Weapon;
  studentName?: string;
  studentClass?: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenLeaderboard: () => void;
  onOpenWeapons: () => void;
  onOpenTeacherMenu: () => void;
  onGoHome: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentWeapon,
  studentName,
  studentClass,
  isMuted,
  onToggleMute,
  onOpenLeaderboard,
  onOpenWeapons,
  onOpenTeacherMenu,
  onGoHome,
  onLogout,
}) => {
  return (
    <header className="bg-stone-950/95 border-b border-amber-900/30 text-white px-3 py-2.5 md:px-6 md:py-3 sticky top-0 z-50 backdrop-blur-md shadow-lg flex flex-wrap items-center justify-between gap-2">
      {/* Left: Logo & Title */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-amber-600 via-amber-800 to-amber-950 border border-amber-500/50 flex items-center justify-center shadow-lg shadow-amber-950/50 flex-shrink-0">
          <span className="text-xl md:text-2xl filter drop-shadow">🪳</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base md:text-lg font-black tracking-tight text-white flex items-center gap-1 font-['Fredoka']">
              Tangkap Kecoak Kuis
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] md:text-[11px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 tracking-wider">
              SMP EDISI INTERAKTIF
            </span>
            <span className="text-[10px] text-stone-400 hidden sm:inline">
              • Bahasa Indonesia Kelas VIII
            </span>
          </div>
        </div>
      </div>

      {/* Right: Navigation Actions matching screenshot */}
      <div className="flex items-center flex-wrap gap-1 md:gap-2">
        {/* Beranda */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Kembali ke Beranda"
        >
          <Home className="w-4 h-4 text-stone-400" />
          <span className="hidden sm:inline">Beranda</span>
        </button>

        {/* Papan Peringkat */}
        <button
          onClick={onOpenLeaderboard}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-colors"
          title="Lihat Papan Peringkat Nilai Siswa"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Papan Peringkat</span>
        </button>

        {/* Senjata */}
        <button
          onClick={onOpenWeapons}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10 border border-emerald-500/20 transition-all hover:scale-105"
          title="Pilih Senjata Penepuk Kecoak"
        >
          <span className="text-base">{currentWeapon.icon}</span>
          <span className="hidden md:inline font-bold">Senjata</span>
        </button>

        {/* Menu Guru (PIN protected) */}
        <button
          onClick={onOpenTeacherMenu}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 border border-amber-400/50 shadow-md shadow-amber-950/40 transition-transform active:scale-95"
          title="Masuk ke Portal Rekap Nilai & Analisis Guru"
        >
          <Shield className="w-3.5 h-3.5 text-stone-950 fill-stone-950" />
          <span>Menu Guru</span>
        </button>

        {/* Siswa Identifier Pill */}
        {studentName ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-800/80 border border-stone-700 text-xs text-stone-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-amber-300 max-w-[80px] md:max-w-[110px] truncate">
              {studentName}
            </span>
            <span className="text-stone-400 text-[11px]">({studentClass || '8'})</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-stone-800 border border-stone-700 text-[11px] text-stone-400">
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">PENGENAL</span>
          </div>
        )}

        {/* Mute Sound Button */}
        <button
          onClick={onToggleMute}
          className={`p-2 rounded-lg text-xs transition-colors ${
            isMuted
              ? 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
          title={isMuted ? 'Nyalakan Suara Game' : 'Matikan Suara Game'}
          aria-label={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* Keluar */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold bg-rose-600/90 hover:bg-rose-500 text-white transition-colors"
          title="Ganti Siswa / Keluar"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
};
