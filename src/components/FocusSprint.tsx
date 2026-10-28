import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Check, CheckCircle2, Music } from 'lucide-react';
import { Task } from '../types';
import { sounds } from '../utils/soundEffects';
import { triggerGrandCelebration } from '../utils/storage';

interface FocusSprintProps {
  tasks: Task[];
  activeTask?: Task | null;
  onTaskCompleted: (id: string) => void;
  onLogFocusMinutes: (minutes: number) => void;
}

type SprintMode = 'focus25' | 'deep50' | 'break5' | 'break15';

export const FocusSprint: React.FC<FocusSprintProps> = ({
  tasks,
  activeTask: initialActiveTask,
  onTaskCompleted,
  onLogFocusMinutes,
}) => {
  const [mode, setMode] = useState<SprintMode>('focus25');
  const [selectedTask, setSelectedTask] = useState<Task | null>(initialActiveTask || null);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState<'none' | 'whitenoise' | 'rain' | 'ticking'>('none');
  const [ambientVolume, setAmbientVolume] = useState<number>(0.2);
  const [completedCyclesToday, setCompletedCyclesToday] = useState(3);

  // Set initial time depending on mode
  const getDurationForMode = (m: SprintMode): number => {
    switch (m) {
      case 'focus25':
        return 25 * 60;
      case 'deep50':
        return 50 * 60;
      case 'break5':
        return 5 * 60;
      case 'break15':
        return 15 * 60;
    }
  };

  const [timeLeft, setTimeLeft] = useState<number>(getDurationForMode(mode));
  const timerRef = useRef<number | null>(null);

  // Sync selected task when prop changes
  useEffect(() => {
    if (initialActiveTask) {
      setSelectedTask(initialActiveTask);
    }
  }, [initialActiveTask]);

  const totalDuration = getDurationForMode(mode);
  const isBreak = mode === 'break5' || mode === 'break15';

  const switchMode = (newMode: SprintMode) => {
    sounds.playClick();
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setMode(newMode);
    setTimeLeft(getDurationForMode(newMode));
  };

  // Timer interval loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer complete!
            clearInterval(timerRef.current!);
            setIsRunning(false);
            sounds.playTimerComplete();
            triggerGrandCelebration();

            const minutesEarned = Math.round(totalDuration / 60);
            if (!isBreak) {
              onLogFocusMinutes(minutesEarned);
              setCompletedCyclesToday((c) => c + 1);
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, totalDuration, isBreak, onLogFocusMinutes]);

  // Ambient sound handler
  const handleToggleAmbient = (sound: 'none' | 'whitenoise' | 'rain' | 'ticking') => {
    sounds.playClick();
    setAmbientSound(sound);
    sounds.setAmbient(sound, ambientVolume);
  };

  const handleVolumeChange = (vol: number) => {
    setAmbientVolume(vol);
    if (ambientSound !== 'none') {
      sounds.setAmbient(ambientSound, vol);
    }
  };

  const togglePlay = () => {
    sounds.playClick();
    if (!isRunning) {
      // Start ambient if chosen
      if (ambientSound !== 'none') {
        sounds.setAmbient(ambientSound, ambientVolume);
      }
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    sounds.playClick();
    setIsRunning(false);
    setTimeLeft(getDurationForMode(mode));
    sounds.stopAmbient();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Circular calculations
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;
  const size = 260;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const ringColor = isBreak ? '#10B981' : '#FF5D38';

  const pendingTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Main Focus Dial Card */}
      <div className="relative rounded-[32px] bg-[#FFFFFF] border border-[#E8DFD5] p-6 sm:p-8 tactile-shadow-2 text-center">
        {/* Mode Selector Tabs (Full Pill) */}
        <div className="inline-flex items-center p-1.5 rounded-full bg-[#F4EFEA] border border-[#E8DFD5] mb-6 max-w-full overflow-x-auto">
          <button
            type="button"
            onClick={() => switchMode('focus25')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              mode === 'focus25' ? 'bg-[#FF5D38] text-white shadow-sm' : 'text-[#716E69] hover:text-[#27272A]'
            }`}
          >
            25m Focus
          </button>
          <button
            type="button"
            onClick={() => switchMode('deep50')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              mode === 'deep50' ? 'bg-[#FF5D38] text-white shadow-sm' : 'text-[#716E69] hover:text-[#27272A]'
            }`}
          >
            50m Deep Sprint
          </button>
          <button
            type="button"
            onClick={() => switchMode('break5')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              mode === 'break5' ? 'bg-[#10B981] text-white shadow-sm' : 'text-[#716E69] hover:text-[#27272A]'
            }`}
          >
            5m Recharge
          </button>
          <button
            type="button"
            onClick={() => switchMode('break15')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              mode === 'break15' ? 'bg-[#10B981] text-white shadow-sm' : 'text-[#716E69] hover:text-[#27272A]'
            }`}
          >
            15m Reset
          </button>
        </div>

        {/* Circular SVG Timer Ring */}
        <div className="relative inline-flex items-center justify-center my-3">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {/* Background track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E8DFD5"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Animated progress track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={ringColor}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.8s linear, stroke 0.3s ease',
              }}
            />
          </svg>

          {/* Center Clock Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
            <span
              className="text-5xl sm:text-6xl font-extrabold text-[#27272A] tracking-tighter tabular-nums"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formattedTime}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#716E69] mt-2 flex items-center gap-1.5">
              <Sparkles
                className="w-3.5 h-3.5"
                style={{ color: isBreak ? '#10B981' : '#FF5D38' }}
              />
              {isBreak ? 'RECHARGE INTERVAL' : isRunning ? 'DEEP MOMENTUM ZONE' : 'READY TO SPRINT'}
            </span>
          </div>
        </div>

        {/* Tactile Control Buttons */}
        <div className="flex items-center justify-center gap-4 mt-6">
          {/* Reset button */}
          <button
            type="button"
            onClick={resetTimer}
            title="Reset timer"
            className="w-12 h-12 rounded-full bg-[#F4EFEA] border border-[#E8DFD5] text-[#716E69] hover:text-[#27272A] hover:bg-[#E8DFD5] flex items-center justify-center transition-all cursor-pointer tactile-btn"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Primary CTA Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            className={`tactile-btn flex items-center justify-center h-16 px-8 rounded-full text-white font-extrabold text-base tracking-wide transition-all cursor-pointer ${
              isBreak ? 'bg-[#10B981] mint-glow' : 'bg-[#FF5D38] coral-glow'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 mr-2 fill-white" /> Pause Focus
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2 fill-white" /> Start Sprint
              </>
            )}
          </button>

          {/* Mark active task completed immediately button */}
          {selectedTask && !selectedTask.completed && (
            <button
              type="button"
              onClick={() => {
                sounds.playTaskPop();
                triggerGrandCelebration();
                onTaskCompleted(selectedTask.id);
              }}
              title="Complete this anchored task"
              className="w-12 h-12 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#006c49] hover:bg-[#10B981]/25 flex items-center justify-center transition-all cursor-pointer tactile-btn"
            >
              <Check className="w-5 h-5 stroke-[3]" />
            </button>
          )}
        </div>

        {/* Active Task Lock-In Banner */}
        <div className="mt-8 pt-6 border-t border-[#F4EFEA] text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#716E69] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5D38]" /> Anchored Task for this sprint
            </span>
            {selectedTask && (
              <span className="text-xs font-bold text-[#8B5CF6]">
                {selectedTask.category}
              </span>
            )}
          </div>

          <select
            value={selectedTask?.id || ''}
            onChange={(e) => {
              const found = tasks.find((t) => t.id === e.target.value);
              setSelectedTask(found || null);
              sounds.playClick();
            }}
            className="w-full h-12 rounded-2xl bg-[#F4EFEA] px-4 text-sm font-semibold text-[#27272A] outline-none border-none focus:ring-2 focus:ring-[#FF5D38] cursor-pointer"
          >
            <option value="">-- Choose a task to lock in focus (or free sprint) --</option>
            {pendingTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.category} • {t.estimatedMinutes || 25}m)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ambient Sound & Audio Atmosphere Card */}
      <div className="rounded-[24px] bg-[#FFFFFF] border border-[#E8DFD5] p-5 tactile-shadow-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#8B5CF6]/15 flex items-center justify-center text-[#7C3AED]">
              <Music className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#27272A]">
                Focus Audio Atmosphere
              </h4>
              <p className="text-[11px] text-[#716E69]">
                Synthesized live white noise and tactile clock ticks
              </p>
            </div>
          </div>

          {/* Volume slider */}
          {ambientSound !== 'none' && (
            <div className="flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-[#716E69]" />
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={ambientVolume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-20 accent-[#8B5CF6] cursor-pointer"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {(
            [
              { key: 'none', label: 'Muted', icon: VolumeX },
              { key: 'whitenoise', label: 'Air Flow', icon: Volume2 },
              { key: 'rain', label: 'Gentle Rain', icon: Volume2 },
              { key: 'ticking', label: 'Tactile Tick', icon: Volume2 },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleToggleAmbient(item.key)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                ambientSound === item.key
                  ? 'bg-[#8B5CF6] text-white shadow-sm'
                  : 'bg-[#F4EFEA] text-[#716E69] hover:bg-[#E8DFD5]'
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Focus Daily Milestones Badge */}
      <div className="rounded-[24px] bg-[#FAF7F2] border border-[#E8DFD5] p-4 flex items-center justify-between text-xs font-bold text-[#716E69]">
        <div className="flex items-center gap-2">
          <span className="text-base">🎯</span>
          <span>Today&apos;s Focus Sprints Completed:</span>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E8DFD5] text-[#27272A] font-extrabold text-sm tabular-nums">
          {completedCyclesToday} Sprints
        </span>
      </div>
    </div>
  );
};
