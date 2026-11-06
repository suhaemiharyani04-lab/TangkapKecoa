import React from 'react';
import { X, Check, Sparkles, Volume2 } from 'lucide-react';
import { Weapon, WeaponType } from '../types/quiz';
import { WEAPONS_LIST } from '../data/questions';
import { sound } from '../utils/audio';

interface WeaponModalProps {
  currentWeapon: Weapon;
  isOpen: boolean;
  onClose: () => void;
  onSelectWeapon: (weapon: Weapon) => void;
}

export const WeaponModal: React.FC<WeaponModalProps> = ({
  currentWeapon,
  isOpen,
  onClose,
  onSelectWeapon,
}) => {
  if (!isOpen) return null;

  const handleTestSound = (e: React.MouseEvent, type: Weapon['soundType']) => {
    e.stopPropagation();
    sound.playWeaponSound(type);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xl">
              🩴
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg font-['Fredoka']">
                Gudang Senjata Pembasmi Kecoak
              </h3>
              <p className="text-xs text-stone-400">
                Pilih alat penepuk favoritmu untuk menghadapi kuis puisi!
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

        {/* Weapons List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          {WEAPONS_LIST.map((weapon) => {
            const isSelected = currentWeapon.id === weapon.id;

            return (
              <div
                key={weapon.id}
                onClick={() => {
                  sound.playWeaponSound(weapon.soundType);
                  onSelectWeapon(weapon);
                }}
                className={`relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-950/40 ring-1 ring-amber-400/50'
                    : 'bg-stone-800/70 hover:bg-stone-800 border-stone-700/80 hover:border-stone-600'
                }`}
              >
                <div className="flex items-center gap-3.5 sm:gap-4">
                  {/* Weapon Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-inner transition-transform group-hover:scale-110 flex-shrink-0 ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 shadow-amber-900/50'
                        : 'bg-stone-900 border border-stone-700'
                    }`}
                  >
                    {weapon.icon}
                  </div>

                  {/* Weapon Details */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">
                        {weapon.name}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-900 border border-stone-700 text-amber-300 font-semibold">
                        {weapon.hitEffect}
                      </span>
                    </div>
                    <span className="text-xs text-amber-400/90 font-medium">
                      {weapon.alias}
                    </span>
                    <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">
                      {weapon.description}
                    </p>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleTestSound(e, weapon.soundType)}
                    className="p-2 rounded-lg bg-stone-900 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                    title="Cek Bunyi Senjata"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-stone-950 font-black'
                        : 'border-2 border-stone-600 group-hover:border-stone-400'
                    }`}
                  >
                    {isSelected && <Check className="w-5 h-5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Senjata aktif: <strong className="text-white">{currentWeapon.name}</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-md transition-all active:scale-95"
          >
            Siap Beraksi
          </button>
        </div>
      </div>
    </div>
  );
};
