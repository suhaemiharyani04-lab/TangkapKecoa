import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Question,
  Weapon,
  AnswerRecord,
  SplatMark
} from '../types/quiz';
import { Cockroach } from './Cockroach';
import { sound } from '../utils/audio';
import { Clock, Award, Sparkles, AlertCircle } from 'lucide-react';

interface RoachData {
  id: string;
  optionKey: 'A' | 'B' | 'C' | 'D';
  optionText: string;
  x: number; // percentage 10% to 90%
  y: number; // percentage 15% to 85%
  vx: number;
  vy: number;
  angle: number;
  legPhase: number;
  isSquashed: boolean;
}

interface FloatingFeedback {
  id: string;
  x: number;
  y: number;
  text: string;
  isCorrect: boolean;
  weaponEffect?: string;
}

interface GameArenaProps {
  questions: Question[];
  currentQuestionIndex: number;
  timeLimitPerQuestion: number; // default 20 seconds
  currentWeapon: Weapon;
  studentName: string;
  studentClass: string;
  onAnswerSubmitted: (record: AnswerRecord) => void;
  onOpenWeapons: () => void;
}

export const GameArena: React.FC<GameArenaProps> = ({
  questions,
  currentQuestionIndex,
  timeLimitPerQuestion,
  currentWeapon,
  studentName,
  studentClass,
  onAnswerSubmitted,
  onOpenWeapons,
}) => {
  const currentQ = questions[currentQuestionIndex];
  const [timeLeft, setTimeLeft] = useState(timeLimitPerQuestion);
  const [roaches, setRoaches] = useState<RoachData[]>([]);
  const [splats, setSplats] = useState<SplatMark[]>([]);
  const [feedbacks, setFeedbacks] = useState<FloatingFeedback[]>([]);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [revealedCorrect, setRevealedCorrect] = useState(false);
  const [whackAnimation, setWhackAnimation] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const arenaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<number | null>(null);

  // Initialize Roaches for the current question
  const initRoachesForQuestion = useCallback(() => {
    if (!currentQ) return;

    // Spawn 4 cockroaches in distinct quadrants with initial velocities
    const initialPositions = [
      { x: 22, y: 35, vx: 0.28, vy: 0.22, angle: 45 },
      { x: 75, y: 30, vx: -0.24, vy: 0.26, angle: 135 },
      { x: 28, y: 75, vx: 0.26, vy: -0.25, angle: 315 },
      { x: 78, y: 72, vx: -0.28, vy: -0.22, angle: 225 },
    ];

    const newRoaches: RoachData[] = currentQ.options.map((opt, idx) => {
      const pos = initialPositions[idx % initialPositions.length];
      return {
        id: `roach-${currentQ.id}-${opt.id}`,
        optionKey: opt.id,
        optionText: opt.text,
        x: pos.x + (Math.random() * 8 - 4),
        y: pos.y + (Math.random() * 8 - 4),
        vx: (Math.random() * 0.4 - 0.2) + (pos.vx > 0 ? 0.2 : -0.2),
        vy: (Math.random() * 0.4 - 0.2) + (pos.vy > 0 ? 0.2 : -0.2),
        angle: pos.angle,
        legPhase: Math.random() * Math.PI * 2,
        isSquashed: false,
      };
    });

    setRoaches(newRoaches);
    setTimeLeft(timeLimitPerQuestion);
    setIsAnswerLocked(false);
    setRevealedCorrect(false);
    questionStartTimeRef.current = Date.now();
  }, [currentQ, timeLimitPerQuestion]);

  useEffect(() => {
    initRoachesForQuestion();
  }, [initRoachesForQuestion]);

  // Cockroach physics & movement animation loop
  useEffect(() => {
    let lastTime = performance.now();

    const updatePhysics = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      setRoaches((prevRoaches) => {
        return prevRoaches.map((roach) => {
          if (roach.isSquashed) {
            return roach;
          }

          let newX = roach.x + roach.vx * dt * 40;
          let newY = roach.y + roach.vy * dt * 35;
          let newVx = roach.vx;
          let newVy = roach.vy;

          // Boundary bouncing (keep inside 10% - 88% width, 18% - 84% height)
          const minX = 12;
          const maxX = 88;
          const minY = 20;
          const maxY = 84;

          if (newX <= minX) {
            newX = minX;
            newVx = Math.abs(newVx);
          } else if (newX >= maxX) {
            newX = maxX;
            newVx = -Math.abs(newVx);
          }

          if (newY <= minY) {
            newY = minY;
            newVy = Math.abs(newVy);
          } else if (newY >= maxY) {
            newY = maxY;
            newVy = -Math.abs(newVy);
          }

          // Random slight scurry direction jitter
          if (Math.random() < 0.03) {
            const angleChange = (Math.random() - 0.5) * 0.8;
            const currentSpeed = Math.hypot(newVx, newVy);
            const currentHeading = Math.atan2(newVy, newVx) + angleChange;
            newVx = Math.cos(currentHeading) * currentSpeed;
            newVy = Math.sin(currentHeading) * currentSpeed;
          }

          // Calculate visual facing angle (roach SVG head points UP, so 0deg is up)
          const targetHeadingDeg = (Math.atan2(newVy, newVx) * 180) / Math.PI + 90;
          
          // Smooth rotation interpolation
          let diff = targetHeadingDeg - roach.angle;
          while (diff < -180) diff += 360;
          while (diff > 180) diff -= 360;
          const newAngle = roach.angle + diff * 0.15;

          return {
            ...roach,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            angle: newAngle,
            legPhase: roach.legPhase + 0.35,
          };
        });
      });

      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Timer countdown loop
  useEffect(() => {
    if (isAnswerLocked) return;

    timerIntervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timeout!
          handleTimeout();
          return 0;
        }
        if (prev <= 4) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isAnswerLocked, currentQ]);

  // Handle timeout when student takes too long
  const handleTimeout = () => {
    if (isAnswerLocked || !currentQ) return;
    setIsAnswerLocked(true);
    setRevealedCorrect(true);
    sound.playWrong();

    const timeSpent = Math.min(
      timeLimitPerQuestion,
      Math.round((Date.now() - questionStartTimeRef.current) / 1000)
    );

    const record: AnswerRecord = {
      questionId: currentQ.id,
      chosenAnswer: 'TIMEOUT',
      isCorrect: false,
      timeSpentSeconds: timeSpent,
    };

    // Add feedback badge
    const feedbackId = `fb-${Date.now()}`;
    setFeedbacks((prev) => [
      ...prev,
      {
        id: feedbackId,
        x: 50,
        y: 40,
        text: 'WAKTU HABIS! ⏱️',
        isCorrect: false,
      },
    ]);

    setTimeout(() => {
      onAnswerSubmitted(record);
    }, 2200);
  };

  // Handle whacking/clicking a cockroach
  const handleWhackCockroach = (roach: RoachData, e: React.MouseEvent) => {
    if (isAnswerLocked || !currentQ) return;
    setIsAnswerLocked(true);

    const isCorrect = roach.optionKey === currentQ.correctAnswer;
    const timeSpent = Math.max(
      1,
      Math.round((Date.now() - questionStartTimeRef.current) / 1000)
    );

    // Trigger weapon sound and sound feedback
    sound.playWeaponSound(currentWeapon.soundType);
    if (isCorrect) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }

    // Mark roach as squashed
    setRoaches((prev) =>
      prev.map((r) => (r.id === roach.id ? { ...r, isSquashed: true } : r))
    );

    // Create splat mark
    const splatId = `splat-${Date.now()}`;
    setSplats((prev) => [
      ...prev.slice(-8), // keep last 8 splats to avoid clutter
      {
        id: splatId,
        x: roach.x,
        y: roach.y,
        weapon: currentWeapon.id,
        color: isCorrect ? '#22c55e' : '#ef4444',
        size: 70 + Math.random() * 30,
        rotation: Math.random() * 360,
      },
    ]);

    // Show floating feedback badge & weapon effect text
    const fbId = `fb-${Date.now()}`;
    setFeedbacks((prev) => [
      ...prev,
      {
        id: fbId,
        x: roach.x,
        y: Math.max(15, roach.y - 12),
        text: isCorrect
          ? `+10 BENAR! (${currentWeapon.hitEffect})`
          : `SALAH! Kunci: [${currentQ.correctAnswer}]`,
        isCorrect,
        weaponEffect: currentWeapon.hitEffect,
      },
    ]);

    // Whack visual animation trigger
    if (arenaRef.current) {
      const rect = arenaRef.current.getBoundingClientRect();
      setWhackAnimation({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      });
      setTimeout(() => {
        setWhackAnimation((prev) => ({ ...prev, active: false }));
      }, 350);
    }

    // If wrong, reveal the correct one with high visibility
    if (!isCorrect) {
      setRevealedCorrect(true);
    }

    const record: AnswerRecord = {
      questionId: currentQ.id,
      chosenAnswer: roach.optionKey,
      isCorrect,
      timeSpentSeconds: timeSpent,
    };

    // Transition to next question after delay
    setTimeout(() => {
      onAnswerSubmitted(record);
    }, isCorrect ? 1400 : 2200);
  };

  // Click on floor misses
  const handleFloorClick = (e: React.MouseEvent) => {
    if (isAnswerLocked) return;
    if (arenaRef.current) {
      const rect = arenaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      sound.playWeaponSound(currentWeapon.soundType);
      setWhackAnimation({
        x,
        y,
        active: true,
      });
      setTimeout(() => {
        setWhackAnimation((prev) => ({ ...prev, active: false }));
      }, 300);
    }
  };

  const progressPercentage = (timeLeft / timeLimitPerQuestion) * 100;
  const isTimeCritical = timeLeft <= 5;

  return (
    <div className="relative w-full max-w-7xl mx-auto flex flex-col flex-1 select-none overflow-hidden pb-4">
      {/* Top Question Prompt Bar (Matches reference screenshot design!) */}
      <div className="bg-stone-950/95 border-b border-amber-900/40 px-4 py-3 md:px-6 md:py-3.5 shadow-xl relative z-40">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          {/* Question Counter & Badge */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] md:text-xs font-black uppercase tracking-wider text-amber-400">
              TEPUK KECOAK YANG MEMBAWA JAWABAN INI:
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-800 text-stone-200 border border-stone-700">
              Soal {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="hidden sm:inline text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Ujian Puisi Kelas VIII
            </span>
          </div>

          {/* Timer Display */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-sm md:text-base font-black transition-all ${
                isTimeCritical
                  ? 'bg-rose-600/30 text-rose-300 border border-rose-500 animate-pulse'
                  : 'bg-stone-800/90 text-amber-400 border border-amber-500/30'
              }`}
            >
              <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-400 animate-spin' : 'text-amber-400'}`} />
              <span>{timeLeft} detik</span>
            </div>
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-1">
          {currentQ.context && (
            <p className="text-xs md:text-sm text-amber-200/90 font-medium italic bg-amber-950/40 px-3 py-1.5 rounded-lg border-l-4 border-amber-400 inline-block">
              {currentQ.context}
            </p>
          )}
          <h2 className="text-base md:text-xl font-extrabold text-white tracking-tight leading-snug drop-shadow">
            {currentQ.question}
          </h2>
        </div>

        {/* Timer Progress Bar */}
        <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden mt-3 shadow-inner">
          <div
            className={`h-full transition-all duration-1000 ease-linear rounded-full ${
              timeLeft <= 4
                ? 'bg-rose-500 shadow-rose-500/50 shadow-md'
                : timeLeft <= 8
                ? 'bg-amber-400'
                : 'bg-emerald-400'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Game Arena / Tile Laboratory Floor */}
      <div
        ref={arenaRef}
        onClick={handleFloorClick}
        className="relative flex-1 min-h-[460px] md:min-h-[520px] bg-stone-900 overflow-hidden cursor-crosshair border-x border-b border-stone-800"
        style={{
          // Grid tile pattern matching "Laboratorium Ubin SMP"
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          backgroundColor: '#1c1917',
        }}
      >
        {/* Floor watermark label matching the reference image */}
        <div className="absolute top-4 left-6 text-stone-600/70 text-xs font-mono font-medium tracking-wider pointer-events-none z-0">
          Laboratorium Ubin SMP • Sentuh / Klik Kecoak Untuk Menepuk!
        </div>

        {/* Splat Marks on the Floor */}
        {splats.map((splat) => (
          <div
            key={splat.id}
            style={{
              left: `${splat.x}%`,
              top: `${splat.y}%`,
              width: `${splat.size}px`,
              height: `${splat.size}px`,
              transform: `translate(-50%, -50%) rotate(${splat.rotation}deg)`,
              backgroundColor: splat.color,
            }}
            className="absolute rounded-full opacity-35 filter blur-[2px] pointer-events-none transition-all duration-700"
          >
            <div className="w-full h-full rounded-full border-4 border-black/20" />
          </div>
        ))}

        {/* Cockroaches */}
        {roaches.map((roach) => (
          <Cockroach
            key={roach.id}
            id={roach.id}
            optionKey={roach.optionKey}
            optionText={roach.optionText}
            x={roach.x}
            y={roach.y}
            rotation={roach.angle}
            isSquashed={roach.isSquashed}
            isCorrect={roach.optionKey === currentQ.correctAnswer}
            isRevealing={revealedCorrect}
            legWigglePhase={roach.legPhase}
            onClick={(e) => handleWhackCockroach(roach, e)}
          />
        ))}

        {/* Whack Weapon Hit Visual Overlay */}
        {whackAnimation.active && (
          <div
            style={{
              left: `${whackAnimation.x}px`,
              top: `${whackAnimation.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute pointer-events-none z-50 flex items-center justify-center animate-ping duration-200"
          >
            <span className="text-5xl sm:text-6xl filter drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]">
              {currentWeapon.icon}
            </span>
          </div>
        )}

        {/* Floating Feedback Badges (+10 BENAR or SALAH) */}
        {feedbacks.map((fb) => (
          <div
            key={fb.id}
            style={{
              left: `${fb.x}%`,
              top: `${fb.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`absolute z-50 pointer-events-none px-4 py-2 rounded-2xl font-black text-sm md:text-base shadow-2xl flex items-center gap-2 animate-bounce ${
              fb.isCorrect
                ? 'bg-emerald-500 text-stone-950 border-2 border-emerald-300 shadow-emerald-500/50'
                : 'bg-rose-600 text-white border-2 border-rose-400 shadow-rose-600/50'
            }`}
          >
            {fb.isCorrect ? (
              <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
            ) : (
              <AlertCircle className="w-5 h-5 text-white" />
            )}
            <span>{fb.text}</span>
          </div>
        ))}

        {/* Explanation banner if revealed upon wrong answer or timeout */}
        {revealedCorrect && (
          <div className="absolute bottom-4 left-4 right-4 z-40 bg-stone-950/95 border-2 border-amber-500 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold flex-shrink-0">
                💡
              </div>
              <div className="flex-1">
                <span className="text-xs font-extrabold uppercase text-amber-400 tracking-wider">
                  Pembahasan Singkat:
                </span>
                <p className="text-sm text-stone-200 font-medium mt-0.5">
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Bar matching reference screenshot */}
      <div className="bg-stone-950 border-t border-stone-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-300">
        {/* Siswa Identifier */}
        <div className="flex items-center gap-2 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
          <span className="text-stone-400">Siswa:</span>
          <strong className="text-white font-bold">{studentName}</strong>
          <span className="text-stone-400 font-mono">({studentClass})</span>
        </div>

        {/* Question step indicator bullets */}
        <div className="hidden lg:flex items-center gap-1.5">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-[10px] font-bold ${
                idx === currentQuestionIndex
                  ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-400/50'
                  : idx < currentQuestionIndex
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-800 text-stone-500 border border-stone-700'
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>

        {/* Active Weapon Indicator with Quick Select Button */}
        <button
          onClick={onOpenWeapons}
          className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700/80 transition-all hover:border-amber-400/50 group"
          title="Klik untuk mengganti senjata"
        >
          <span className="text-lg transition-transform group-hover:scale-125">
            {currentWeapon.icon}
          </span>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
              SENJATA AKTIF
            </span>
            <span className="font-bold text-amber-300 text-xs">
              {currentWeapon.name}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
