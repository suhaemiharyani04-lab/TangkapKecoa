import React from 'react';

interface CockroachProps {
  id: string;
  optionKey: 'A' | 'B' | 'C' | 'D';
  optionText: string;
  x: number; // percentage or px
  y: number; // percentage or px
  rotation: number; // degrees
  isSquashed: boolean;
  isCorrect?: boolean;
  isRevealing?: boolean;
  legWigglePhase: number;
  onClick: (e: React.MouseEvent) => void;
}

export const Cockroach: React.FC<CockroachProps> = ({
  optionKey,
  optionText,
  x,
  y,
  rotation,
  isSquashed,
  isCorrect,
  isRevealing,
  legWigglePhase,
  onClick,
}) => {
  // Leg wiggle offsets based on phase
  const legOffset1 = Math.sin(legWigglePhase) * 6;
  const legOffset2 = Math.cos(legWigglePhase) * 6;
  const legOffset3 = Math.sin(legWigglePhase + Math.PI) * 6;

  return (
    <div
      onClick={onClick}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${isSquashed ? 1.15 : 1})`,
        transition: isSquashed ? 'transform 0.15s ease-out' : 'none',
        zIndex: isSquashed ? 10 : 30,
      }}
      className={`absolute cursor-pointer select-none group touch-none active:scale-95 transition-filter ${
        isSquashed ? 'pointer-events-none' : ''
      }`}
    >
      {/* Container holding the cockroach SVG & Option Badge */}
      <div className="relative flex items-center justify-center">
        {/* Cockroach Body SVG */}
        <div
          className={`w-28 h-40 md:w-32 md:h-44 transition-opacity duration-300 ${
            isSquashed ? 'opacity-85 filter brightness-75' : 'drop-shadow-xl hover:scale-105'
          }`}
        >
          <svg viewBox="0 0 120 180" className="w-full h-full overflow-visible">
            <defs>
              {/* Cockroach Carapace Gradient */}
              <linearGradient id="roachShell" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2c140a" />
                <stop offset="30%" stopColor="#692911" />
                <stop offset="50%" stopColor="#963c18" />
                <stop offset="70%" stopColor="#692911" />
                <stop offset="100%" stopColor="#2c140a" />
              </linearGradient>

              {/* Head Gradient */}
              <linearGradient id="roachHead" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a0c06" />
                <stop offset="50%" stopColor="#3d180a" />
                <stop offset="100%" stopColor="#150a05" />
              </linearGradient>

              {/* Pronotum / Shield Gradient */}
              <linearGradient id="roachPronotum" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#803314" />
                <stop offset="70%" stopColor="#3f1608" />
                <stop offset="100%" stopColor="#1e0a04" />
              </linearGradient>

              {/* Wing Center line glow */}
              <linearGradient id="elytraGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d97706" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#b45309" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#451a03" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* If Squashed: Splat residue background */}
            {isSquashed && (
              <g className="animate-pulse opacity-90">
                <circle cx="60" cy="90" r="38" fill={isCorrect ? '#22c55e' : '#ef4444'} opacity="0.3" />
                <path
                  d="M30,70 Q10,85 25,110 Q45,135 60,120 Q80,140 100,115 Q95,75 80,65 Q60,45 40,60 Z"
                  fill={isCorrect ? '#16a34a' : '#dc2626'}
                  opacity="0.5"
                />
              </g>
            )}

            {/* Antennae */}
            <g stroke="#260f06" strokeWidth="2" strokeLinecap="round" fill="none">
              <path
                d={`M55,30 Q${40 + Math.sin(legWigglePhase * 1.5) * 8},10 ${25 + Math.sin(legWigglePhase * 2) * 12},-15`}
                className="transition-all duration-75"
              />
              <path
                d={`M65,30 Q${80 - Math.sin(legWigglePhase * 1.5) * 8},10 ${95 - Math.sin(legWigglePhase * 2) * 12},-15`}
                className="transition-all duration-75"
              />
            </g>

            {/* Six Jointed Legs */}
            <g stroke="#2b1107" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              {/* Front Left Leg */}
              <path
                d={`M45,45 L${26 + legOffset1},${32 - legOffset1} L${12 + legOffset1 * 1.5},${20 - legOffset1 * 1.5}`}
              />
              {/* Front Right Leg */}
              <path
                d={`M75,45 L${94 - legOffset1},${32 - legOffset1} L${108 - legOffset1 * 1.5},${20 - legOffset1 * 1.5}`}
              />

              {/* Middle Left Leg */}
              <path
                d={`M42,75 L${18 + legOffset2},${72 + legOffset2} L${2 + legOffset2 * 1.4},${82 + legOffset2 * 1.8}`}
              />
              {/* Middle Right Leg */}
              <path
                d={`M78,75 L${102 - legOffset2},${72 + legOffset2} L${118 - legOffset2 * 1.4},${82 + legOffset2 * 1.8}`}
              />

              {/* Back Left Leg (Long) */}
              <path
                d={`M44,110 L${15 + legOffset3},${125 - legOffset3} L${-2 + legOffset3 * 1.6},${155 - legOffset3 * 2}`}
              />
              {/* Back Right Leg (Long) */}
              <path
                d={`M76,110 L${105 - legOffset3},${125 - legOffset3} L${122 - legOffset3 * 1.6},${155 - legOffset3 * 2}`}
              />
            </g>

            {/* Cerci (tail appendages) */}
            <path d="M52,145 L48,162" stroke="#220b04" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M68,145 L72,162" stroke="#220b04" strokeWidth="2.5" strokeLinecap="round" />

            {/* Abdomen / Elytra Wings */}
            <g>
              {/* Main abdomen shape */}
              <ellipse cx="60" cy="98" rx="22" ry="46" fill="url(#roachShell)" />
              
              {/* Abdomen segmentation ribs underneath */}
              <path d="M42,80 Q60,88 78,80" stroke="#1f0a04" strokeWidth="1.5" fill="none" opacity="0.6" />
              <path d="M41,95 Q60,103 79,95" stroke="#1f0a04" strokeWidth="1.5" fill="none" opacity="0.6" />
              <path d="M42,110 Q60,118 78,110" stroke="#1f0a04" strokeWidth="1.5" fill="none" opacity="0.6" />
              <path d="M46,125 Q60,132 74,125" stroke="#1f0a04" strokeWidth="1.5" fill="none" opacity="0.6" />

              {/* Wing Center line */}
              <line x1="60" y1="56" x2="60" y2="142" stroke="#180703" strokeWidth="2" />
              
              {/* Wing Highlights */}
              <ellipse cx="53" cy="85" rx="4" ry="26" fill="url(#elytraGlow)" transform="rotate(-6 53 85)" />
              <ellipse cx="67" cy="85" rx="4" ry="26" fill="url(#elytraGlow)" transform="rotate(6 67 85)" />
            </g>

            {/* Pronotum (Shield behind head) */}
            <path
              d="M38,42 C38,30 50,26 60,26 C70,26 82,30 82,42 C82,56 70,58 60,58 C50,58 38,56 38,42 Z"
              fill="url(#roachPronotum)"
              stroke="#1b0802"
              strokeWidth="1.5"
            />
            {/* Pronotum decorative spots */}
            <circle cx="53" cy="40" r="3.5" fill="#0d0401" opacity="0.8" />
            <circle cx="67" cy="40" r="3.5" fill="#0d0401" opacity="0.8" />

            {/* Head */}
            <path
              d="M48,27 C48,18 54,16 60,16 C66,18 72,18 72,27 C72,32 66,34 60,34 C54,34 48,32 48,27 Z"
              fill="url(#roachHead)"
            />

            {/* Eyes */}
            {!isSquashed ? (
              <>
                <ellipse cx="51" cy="24" rx="2.2" ry="3.5" fill="#050201" transform="rotate(-20 51 24)" />
                <ellipse cx="69" cy="24" rx="2.2" ry="3.5" fill="#050201" transform="rotate(20 69 24)" />
                <circle cx="51" cy="23" r="0.8" fill="#ffffff" opacity="0.6" />
                <circle cx="69" cy="23" r="0.8" fill="#ffffff" opacity="0.6" />
              </>
            ) : (
              /* Squashed Dead 'X' Eyes */
              <>
                <g stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="48" y1="21" x2="54" y2="27" />
                  <line x1="54" y1="21" x2="48" y2="27" />
                  <line x1="66" y1="21" x2="72" y2="27" />
                  <line x1="72" y1="21" x2="66" y2="27" />
                </g>
              </>
            )}
          </svg>
        </div>

        {/* Answer Tag / Badge (Matches the reference screenshot with speech pointer to roach) */}
        <div
          style={{
            transform: `rotate(${-rotation}deg)`, // Keep answer badge upright regardless of roach rotation!
          }}
          className={`absolute pointer-events-auto transition-transform duration-200 ${
            isSquashed ? 'opacity-90 scale-95' : 'hover:scale-105'
          } ${
            // Position badge offset so it floats near head or side
            'bottom-full mb-1 left-1/2 -translate-x-1/2'
          }`}
        >
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 shadow-2xl transition-all duration-300 backdrop-blur-md max-w-[220px] md:max-w-[260px] ${
              isSquashed
                ? isCorrect
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-500/50 scale-105'
                  : 'bg-rose-700 border-rose-500 text-white shadow-rose-500/50'
                : isRevealing && isCorrect
                ? 'bg-amber-400 border-amber-300 text-slate-950 ring-4 ring-emerald-400 animate-bounce'
                : 'bg-amber-400 hover:bg-amber-300 border-amber-500/80 text-slate-950 font-bold shadow-amber-950/40'
            }`}
          >
            {/* Letter Badge (A, B, C, D) */}
            <span
              className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm tracking-wider shadow-inner ${
                isSquashed
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-950 text-amber-300'
              }`}
            >
              {optionKey}
            </span>

            {/* Answer Text */}
            <span
              className={`text-xs md:text-sm font-bold leading-snug line-clamp-2 ${
                isSquashed ? 'text-white' : 'text-slate-950'
              }`}
            >
              {optionText}
            </span>
          </div>

          {/* Pointer tail down to cockroach */}
          <div className="w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-amber-400 mx-auto -mt-0.5 filter drop-shadow"></div>
        </div>
      </div>
    </div>
  );
};
